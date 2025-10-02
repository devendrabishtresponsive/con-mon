'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

interface GA4Account {
    name: string;
    displayName: string;
    regionCode: string;
    createTime: string;
    updateTime: string;
}

export default function FullAccountListPage() {
    const [accounts, setAccounts] = useState<GA4Account[]>([]);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await fetch('/api/ga4/accounts');
                const data = await res.json();
                
                if (!res.ok) throw new Error(data.error || 'Fetch failed');
                
                setAccounts(data.accounts);
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
            {accounts.map((account) => {
                // console.log(accounts);
                // remove the "accounts/" part
                // const accountId = account.name.replace("accounts/", "");

                return(
                    <li key={account.name} style={{border: '1px solid #ccc', margin: '1rem 0', padding: '1rem'}}>
                        <Link href={`/onboarding/${account.name}`}>
                            <p><strong>name: </strong> {account.name}</p>
                            <p><strong>displayName: </strong> {account.displayName}</p>
                            <p><strong>regionCode: </strong> {account.regionCode}</p>
                            <p><strong>createTime: </strong> {account.createTime}</p>
                            <p><strong>updateTime: </strong> {account.updateTime}</p>
                        </Link>
                    </li>
                );
            })}
            </ul>
        </div>
    );
}