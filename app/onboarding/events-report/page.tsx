'use client';

import { useState } from 'react';

interface EventReport {
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

export default function EventsReportPage() {
    const today = new Date().toISOString().split('T')[0];
    // console.log(today); // e.g., "2025-06-12"

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [events, setEvents] = useState<EventReport[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const fetchEvents = async () => {
        if (!startDate || !endDate) {
            setError('Please enter both start and end dates.');
            return;
        }
        
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`/api/ga4/events?startDate=${startDate}&endDate=${endDate}&action=pushToDB`);
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Failed to fetch events');
            
            setEvents(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div style={{ padding: '2rem' }}>
        <h1>📅 GA4 Events Report</h1>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div>
        <label>Start Date (yyyy-mm-dd): </label>
        <input
        type="text"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="yyyy-mm-dd"
        />
        </div>
        <div>
        <label>End Date (yyyy-mm-dd): </label>
        <input
        type="text"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="yyyy-mm-dd"
        />
        </div>
        <button onClick={fetchEvents} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Events'}
        </button>
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <ul>
        {events.map((event) => (
            <li key={event.eventName} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
            <p><strong>Event:</strong> {event.eventName}</p>
            <p><strong>Event Count:</strong> {event.eventCount}</p>
            <p><strong>Total Users:</strong> {event.totalUsers}</p>
            <p><strong>Active Users:</strong> {event.activeUsers}</p>
            <p><strong>Engagement Rate:</strong> {event.engagementRate}</p>
            <p><strong>User Engagement Duration:</strong> {event.userEngagementDuration}</p>
            <p><strong>Screen Page Views:</strong> {event.screenPageViews}</p>
            <p><strong>Sessions:</strong> {event.sessions}</p>
            <p><strong>Bounce Rate:</strong> {event.bounceRate}</p>
            </li>
        ))}
        </ul>
        </div>
    );
}