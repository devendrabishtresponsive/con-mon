'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string; picture: string } | null>(null);
  const router = useRouter();
  
  
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountSummaries, setAccountSummaries] = useState<any[]>([]);
  const [property, setProperty] = useState({});
  
  useEffect(() => {
    const stored = localStorage.getItem('googleUser');
    if (!stored) {
      router.push('/');
    }
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('googleUser');
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('googleUser');
    router.push('/');
  };
  
  const fetchAccounts = async () => {
    if (!accessToken) return
    try {
      const res = await axios.get(
'https://analyticsadmin.googleapis.com/v1beta/accounts',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      // console.log(res.data)
      setAccounts(res.data.accounts || [])
    } catch (error) {
      console.error('API error:', error)
    }
  }
  
  const fetchAccountSummaries = async () => {
    if (!accessToken) return
    try {
      const res = await axios.get(
'https://analyticsadmin.googleapis.com/v1beta/accountSummaries',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      // console.log(res.data)
      setAccountSummaries(res.data.accountSummaries || [])
    } catch (error) {
      console.error('API error:', error)
    }
  }
  
  const fetchProperty = async ( property ) => {
    if (!accessToken) return
    try {
      const res = await axios.get(
`https://analyticsadmin.googleapis.com/v1beta/${property}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      // console.log(res.data)
      setProperty(res.data || [])
    } catch (error) {
      console.error('API error:', error)
    }
  }
  
  return (
    <main style={{ padding: '2rem' }}>
    <h1>Dashboard</h1>
    {user ? (
      <>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <img src={user.picture} alt="Profile" width={100} />
      <br />
      <button
      onClick={handleLogout}
      style={{
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        background: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
      >
      Logout
      </button>
      </>
    ) : (
      <p>Loading user...</p>
    )}
    </main>
  );
}