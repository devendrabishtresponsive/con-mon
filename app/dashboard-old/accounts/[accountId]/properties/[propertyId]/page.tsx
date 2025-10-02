'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams } from "next/navigation";

interface GA4Account {
    name: string;
    displayName: string;
    regionCode: string;
}

export default function EventsListingPage() {

    const { accountId, propertyId } = useParams();

    const [events, setEvents] = useState<GA4Event[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // const today = new Date();
    // const dd = String(today.getDate()).padStart(2, '0');
    // const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    // const yyyy = today.getFullYear();

    // const todays_date = `${dd}-${mm}-${yyyy}`;
    // alert(todays_date);

    // const startDate = '30daysAgo';
    // const endDate = 'today';

    const startDate = '30daysAgo';
    const endDate = 'today';
    
    useEffect(() => {
        const fetchEventsForProperty = async () => {
            try {
                const res = await fetch( `/api/ga4/list-events?accountId=${accountId}&propertyId=${propertyId}&startDate=${startDate}&endDate=${endDate}` );
                const data = await res.json();

                console.log(data);
                
                if (!res.ok) throw new Error(data.error || 'fetchEvents failed');
                
                setEvents(data);
            } catch (err: any) {
                setError(err.message);
            }
        };
        
        fetchEventsForProperty();
    }, []);

    const handleCheckboxChange = (eventName: string) => {
        const updatedSelection = new Set(selectedEvents);
        if (updatedSelection.has(eventName)) {
            updatedSelection.delete(eventName);
        } else {
            updatedSelection.add(eventName);
        }
        setSelectedEvents(updatedSelection);
    };

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
                body: JSON.stringify({
                    eventNames: selectedEventNames, // Only sending eventName array
                    accountId,
                    propertyId
                }),
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
            <h1>GA4 Full Accounts (Admin API)</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button onClick={handleSaveSelected} disabled={selectedEvents.size === 0} style={{ marginBottom: '1rem' }}>
                Save Selected Button ({selectedEvents.size})
            </button>

            <ul>
                {events.map((event) => (
                    <li key={event.eventName} style={{border: '1px solid #ccc', margin: '1rem 0', padding: '1rem'}}>
                        <input
                            type="checkbox"
                            checked={selectedEvents.has(event.eventName)}
                            onChange={() => handleCheckboxChange(event.eventName)}
                            style={{ marginRight: '1rem' }}
                        />
                        <p><strong>eventName: </strong> {event.eventName}</p>
                        <p><strong>eventCount: </strong> {event.eventCount}</p>
                        <p><strong>totalUsers: </strong> {event.totalUsers}</p>
                        <p><strong>activeUsers: </strong> {event.activeUsers}</p>
                        <p><strong>engagementRate: </strong> {event.engagementRate}</p>
                        <p><strong>userEngagementDuration: </strong> {event.userEngagementDuration}</p>
                        <p><strong>screenPageViews: </strong> {event.screenPageViews}</p>
                        <p><strong>sessions: </strong> {event.sessions}</p>
                        <p><strong>bounceRate: </strong> {event.bounceRate}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}