// GET /api/ga4/account-summaries

import { NextResponse } from 'next/server';

import { cookies } from 'next/headers';

import { googleApiFetch } from "@/lib/googleApiClient";

export async function GET(request: Request) {
    // Use await with cookies()
    // const cookieStore = await cookies();
    // const accessToken = cookieStore.get('cm_googleapis_access_token')?.value;
    // if (!accessToken) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    try {
        // const authHeader = request.headers.get('authorization');
        // if (!authHeader) {
        //     return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
        // }
        
        // const accessToken = authHeader.replace('Bearer ', '');
        
        // const res = await fetch('https://analyticsadmin.googleapis.com/v1alpha/accountSummaries', {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`,
        //     },
        // });

        const res = await googleApiFetch('https://analyticsadmin.googleapis.com/v1alpha/accountSummaries');
        
        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json({ error }, { status: res.status });
        }
        
        const data = await res.json();
        console.log(data);

        const accountId:string = "291977950";
        if( accountId ) {
            // Find the account
            const accountSummary = data.accountSummaries?.find(
                (s: any) =>
                s.account === `accounts/${accountId}` ||
                s.name === `accountSummaries/${accountId}`
            );
            console.log(accountSummary);
            return NextResponse.json({ accountSummaries: accountSummary ? [accountSummary] : [] });
        }

        return NextResponse.json({ accountSummaries: data.accountSummaries || [] });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}