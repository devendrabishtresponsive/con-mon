'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-100 p-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">My Google OAuth App</h1>
      <nav className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/onboarding">Onboarding</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/events">Events</Link>
        <Link href="/onboarding/accounts">Accounts</Link>
        <Link href="/dashboard/account-summaries">Account Summaries</Link>
        <Link href="/dashboard/alert-settings">Alert Settings</Link>
        <Link href="/users">Users</Link>
        {!user ? (
          <Link href="/login">Login</Link>
        ) : (
          <button onClick={logout} className="text-red-500 hover:underline">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}