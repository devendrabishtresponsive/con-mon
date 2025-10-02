'use client';

import { useEffect, useState } from 'react';

interface GA4Account {
    name: string;
    displayName: string;
    regionCode: string;
}

export default function PropertyPage() {
    // const [accounts, setAccounts] = useState<any[]>([]);

    const [property, setProperty] = useState({});
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await fetch('/api/ga4/property');
                const data = await res.json();

                console.log(data);
                
                if (!res.ok) throw new Error(data.error || 'Fetch failed');
                
                // setAccounts(data.accounts);
                setProperty(data);
            } catch (err: any) {
                setError(err.message);
            }
        };
        
        fetchAccounts();
    }, []);
    
    return (
        <div style={{ padding: '2rem' }}>
        <h1>GA4 Full Accounts (Admin API)</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
            <li key={property.name} style={{border: '1px solid #ccc', margin: '1rem 0', padding: '1rem'}}>
                <p><strong>name: </strong> {property.name}</p>
                <p><strong>parent: </strong> {property.parent}</p>
                <p><strong>createTime: </strong> {property.createTime}</p>
                <p><strong>updateTime: </strong> {property.updateTime}</p>
                <p><strong>displayName: </strong> {property.displayName}</p>
                <p><strong>industryCategory: </strong> {property.industryCategory}</p>
                <p><strong>timeZone: </strong> {property.timeZone}</p>
                <p><strong>currencyCode: </strong> {property.currencyCode}</p>
                <p><strong>serviceLevel: </strong> {property.serviceLevel}</p>
                <p><strong>account: </strong> {property.account}</p>
                <p><strong>propertyType: </strong> {property.propertyType}</p>
            </li>
        {/* {accounts.map((acc) => (
            <li key={property.name} style={{border: '1px solid #ccc', margin: '1rem 0', padding: '1rem'}}>
                <p><strong>name: </strong> {acc.name}</p>
                <p><strong>createTime: </strong> {property.createTime}</p>
                <p><strong>updateTime: </strong> {property.updateTime}</p>
                <p><strong>displayName: </strong> {property.displayName}</p>
                <p><strong>regionCode: </strong> {property.regionCode}</p>
            </li>
        ))} */}
        </ul>
        </div>
    );
}