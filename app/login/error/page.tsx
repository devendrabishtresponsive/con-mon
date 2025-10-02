'use client';

// import { useRouter } from 'next/navigation';

export default function ErrorPage() {
    //   const router = useRouter();
    
    //   console.log('DashboardPage triggered');
    
    //   async function logout() {
    //     await fetch('/api/logout', { method: 'POST' });
    //     router.push('/login');
    //   }
    
    return (
        <div className="p-4">
        <h1 className="text-2xl">Error Page</h1>
        </div>
    );
}