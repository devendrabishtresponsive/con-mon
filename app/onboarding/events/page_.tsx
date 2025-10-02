'use client';

import { useEffect, useState } from 'react';

interface GA4Account {
    name: string;
    displayName: string;
    regionCode: string;
}

export default function EventsListingPage() {
    const [events, setEvents] = useState<GA4Account[]>([]);
    const [error, setError] = useState('');

    // const today = new Date();
    // const dd = String(today.getDate()).padStart(2, '0');
    // const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    // const yyyy = today.getFullYear();

    // const todays_date = `${dd}-${mm}-${yyyy}`;
    // alert(todays_date);

    const startDate = '30daysAgo';
    const endDate = 'today';
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch( `/api/ga4/events?startDate=${startDate}&endDate=${endDate}` );
                const data = await res.json();

                console.log(data);
                
                if (!res.ok) throw new Error(data.error || 'fetchEvents failed');
                
                setEvents(data);
            } catch (err: any) {
                setError(err.message);
            }
        };
        
        fetchEvents();
    }, []);
    
    return (
        <div style={{ padding: '2rem' }}>
            <h1>GA4 Full Accounts (Admin API)</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {events.map((event) => (
                    <li key={event.eventName} style={{border: '1px solid #ccc', margin: '1rem 0', padding: '1rem'}}>
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