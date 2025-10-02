'use client';

import { useEffect, useState } from 'react';

interface GA4Event {
    eventName: string;
    eventCount: string;
    totalUsers: string;
    activeUsers: string;
    engagementRate: string;
    userEngagementDuration: string;
    screenPageViews: string;
    sessions: string;
    bounceRate: string;
}

// interface SavedEvent {
//     _id: string;
//     propertyId: string;
//     userId: string;
//     accountId: string;
//     eventNames: [string];
// }    

export default function EventsListingPage() {
    
    const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());

    // const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);

    const [events, setEvents] = useState<GA4Event[]>([]);
    // const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const startDate = '30daysAgo';
    const endDate = 'today';

    useEffect(() => {

        const fetchEvents = async () => {
            try {
                const res = await fetch(`/api/ga4/events?startDate=${startDate}&endDate=${endDate}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || 'fetchEvents failed');
                setEvents(data);
            } catch (err: any) {
                setError(err.message);
            }
        };
        fetchEvents();

        const fetchSavedEvents = async () => {
            try {
                const res = await fetch(`/api/database/events`);
                const data = await res.json();
                
                if (!res.ok) throw new Error(data.error || 'fetchEvents failed');

                const eventDocuments = data;
                console.log(eventDocuments);
                const eventNames: Set<string> = new Set(eventDocuments.eventNames ?? []);
                console.log(eventNames);
                setSelectedEvents(eventNames);
            } catch (err: any) {
                setError(err.message);
            }
        };
        fetchSavedEvents();
        
    }, []);

    

    const handleCheckboxChange = (eventName: string) => {
        const updatedSelection = new Set(selectedEvents);
        if (updatedSelection.has(eventName)) {
            updatedSelection.delete(eventName);
        } else {
            updatedSelection.add(eventName);
        }
        setSelectedEvents(updatedSelection);
        // console.log(selectedEvents);
    };

//     const handleUpdate = async () => {
//     await fetch('/api/users', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ _id: editingUserId, ...editingUser }),
//     });
//     setEditingUserId(null);
//     setEditingUser({ name: '', email: '', password: '' });
//     fetchUsers();
//   };

    const handleSaveSelected = async () => {
        // const eventsToSave = events.filter(event => selectedEvents.has(event.eventName));

        // Only extract the eventName values from selected events
        const selectedEventNames = events
        .filter(event => selectedEvents.has(event.eventName))
        .map(event => event.eventName);

        try {
            const res = await fetch('/api/database', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ events: eventsToSave }),
                body: JSON.stringify({ eventNames: selectedEventNames }), // Only sending eventName array
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Save failed');
            setSuccessMessage('Events saved successfully!');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>GA4 Events</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            <button onClick={handleSaveSelected} disabled={selectedEvents.size === 0} style={{ marginBottom: '1rem' }}>
                Save Selected ({selectedEvents.size})
            </button>

            <ul>
                {events.map((event) => (
                    <li key={event.eventName} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
                        <input
                            type="checkbox"
                            checked={selectedEvents.has(event.eventName)}
                            onChange={() => handleCheckboxChange(event.eventName)}
                            style={{ marginRight: '1rem' }}
                        />
                        <p><strong>eventName:</strong> {event.eventName}</p>
                        <p><strong>eventCount:</strong> {event.eventCount}</p>
                        <p><strong>totalUsers:</strong> {event.totalUsers}</p>
                        <p><strong>activeUsers:</strong> {event.activeUsers}</p>
                        <p><strong>engagementRate:</strong> {event.engagementRate}</p>
                        <p><strong>userEngagementDuration:</strong> {event.userEngagementDuration}</p>
                        <p><strong>screenPageViews:</strong> {event.screenPageViews}</p>
                        <p><strong>sessions:</strong> {event.sessions}</p>
                        <p><strong>bounceRate:</strong> {event.bounceRate}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}