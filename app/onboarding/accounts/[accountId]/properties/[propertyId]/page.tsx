'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams } from "next/navigation";

interface GA4Account {
    name: string;
    displayName: string;
    regionCode: string;
}

// interface EventFromDB {
//     _id: string;
//     userId: string;
//     accountId: string;
//     propertyId: string;
//     eventNames: string[];
// }

export default function EventsListingPage() {

    const { accountId, propertyId } = useParams(); // Get both accountId and propertyId from URL

    const [events, setEvents] = useState<GA4Event[]>([]);
    // const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());

    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const startDate = 'today';
    // const startDate = '30daysAgo';
    const endDate = 'today';
    
    useEffect(() => {
        const fetchEventsFromGA4Api = async () => {
            try {
                // const res = await fetch( `/api/ga4/list-events?accountId=${accountId}&propertyId=${propertyId}&startDate=${startDate}&endDate=${endDate}` );
                const res = await fetch( `/api/ga4/events?accountId=${accountId}&propertyId=${propertyId}&startDate=${startDate}&endDate=${endDate}` );
                const data = await res.json();
                // console.log(data);
                
                if (!res.ok) throw new Error(data.error || 'fetchEvents failed');
                
                setEvents(data);
            } catch (err: any) {
                setError(err.message);
            }
        };
        fetchEventsFromGA4Api();

        // const fetchSavedEventsFromDatabase = async () => {
        //     try {
        //         const responseFromDb = await fetch(`/api/database/events-by-user-account-property?accountId=${accountId}&propertyId=${propertyId}`);
        //         const eventDocument = await responseFromDb.json();
        //         // console.log("eventDocument");
        //         // console.log(eventDocument);
                
        //         // setEventDocument(eventDocument || null);

        //         setSelectedEvents(eventDocument?.eventNames || []);
        //     } catch (err: any) {
        //         setError(err.message);
        //     }
        // };
        // fetchSavedEventsFromDatabase();
    }, []);

    const handleCheckboxChange = (eventName: string) => {
        setSelectedEvents((prevSelected) => {
            if (prevSelected.includes(eventName)) {
                // remove it
                return prevSelected.filter((e) => e !== eventName);
            } else {
                // add it
                return [...prevSelected, eventName];
            }
        });
    };


    const handleSaveSelected = async () => {
        // Only extract the eventName values from selected events
        const selectedEventNames = events
            .filter(event => selectedEvents.includes(event.eventName))
            .map(event => event.eventName);

        try {
            const res = await fetch('/api/database/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventNames: selectedEventNames, // Only sending eventName array
                    accountId,
                    propertyId,
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

            <button
                onClick={handleSaveSelected}
                disabled={selectedEvents.length === 0}
                style={{ marginBottom: '1rem' }}
            >Save Selected Button ({selectedEvents.length})</button>


            <ul>
                {events.map((event) => (
                    <li key={event.eventName} style={{border: '1px solid #ccc', margin: '1rem 0', padding: '1rem'}}>
                        <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.eventName)}
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