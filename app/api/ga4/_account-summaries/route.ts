// GET /api/ga4/account-summaries

import { NextResponse } from 'next/server';

import { cookies } from 'next/headers';

export async function GET(request: Request) {
    // Use await with cookies()
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('cm_googleapis_access_token')?.value;
    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // const authHeader = request.headers.get('authorization');
        // if (!authHeader) {
        //     return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
        // }
        
        // const accessToken = authHeader.replace('Bearer ', '');
        
        const res = await fetch('https://analyticsadmin.googleapis.com/v1alpha/accountSummaries', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        
        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json({ error }, { status: res.status });
        }
        
        const data = await res.json();
        return NextResponse.json({ accountSummaries: data.accountSummaries || [] });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}