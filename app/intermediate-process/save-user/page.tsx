'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SaveUser() {
    const router = useRouter();
    const params = useSearchParams();
    
    useEffect(() => {
        const name = params.get('name');
        const email = params.get('email');
        const picture = params.get('picture');
        
        if (name && email && picture) {
            const user = { name, email, picture };
            localStorage.setItem('cm_loggedInUser', JSON.stringify(user));
        }
        
        router.push('/dashboard');
    }, [params, router]);
    
    return <p>Saving user...</p>;
}