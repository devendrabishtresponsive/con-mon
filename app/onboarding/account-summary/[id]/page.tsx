'use client';

import { useEffect, useState } from 'react';

interface AccountSummary {
    account: string;
    displayName: string;
    propertySummaries?: {
        property: string;
        displayName: string;
    }[];
}

export default function AccountListPage() {
    const [accounts, setAccounts] = useState<AccountSummary[]>([]);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                // const userData = localStorage.getItem('googleUser');
                // if (!userData) {
                //     setError('No Google user data found.');
                //     return;
                // }
                
                // const { accessToken } = JSON.parse(userData);
                
                // const res = await fetch('/api/ga4/account-summaries', {
                //     headers: {
                //         Authorization: `Bearer ${accessToken}`,
                //     },
                // });

                const res = await fetch('/api/ga4/account-summary');
                
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || 'Fetch failed');
                }
                
                const { accountSummaries } = await res.json();
                setAccounts(accountSummaries);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            }
        };
        
        fetchAccounts();
    }, []);
    
    return (
        <section style={{ padding: '2rem' }}>
        <h1>GA4 Accounts (via Server)</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {accounts.length === 0 && !error && <p>Loading...</p>}
        <ul>
            {accounts.map((acc) => (
                <li key={acc.account} style={{border: '1px solid #ccc', margin: '1rem 0', padding: '1rem'}}>
                    <p><strong>name: </strong> {acc.name}</p>
                    <p><strong>account: </strong> {acc.account}</p>
                    <p><strong>displayName: </strong> {acc.displayName}</p>
                    <hr/>
                    <strong>propertySummaries</strong>
                    <ul>
                        {acc.propertySummaries?.map((prop) => (
                            <li key={prop.property} style={{border: '1px solid #ccc', margin: '1rem 0', padding: '1rem'}}>
                                <p><strong>property: </strong> {prop.property}</p>
                                <p><strong>displayName: </strong> {prop.displayName}</p>
                                <p><strong>propertyType: </strong> {prop.propertyType}</p>
                                <p><strong>parent: </strong> {prop.parent}</p>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
        </section>
    );
}