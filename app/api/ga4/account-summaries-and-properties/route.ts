import { NextResponse } from 'next/server';

import { googleApiFetch } from "@/lib/googleApiClient";

export async function GET(request: Request) {
    try {
        // 1. Try query param
        const { searchParams } = new URL(request.url);
        let accountId = searchParams.get("accountId") || null;
        
        // 2. If not in query, try request body
        if (!accountId) {
            try {
                const body = await request.json();
                accountId = body?.value || null;
            } catch {
                // ignore if no body / invalid JSON
            }
        }

        const result = await googleApiFetch('https://analyticsadmin.googleapis.com/v1alpha/accountSummaries');
        
        if (!result.ok) {
            const error = await result.json();
            return NextResponse.json({ error }, { status: result.status });
        }
        
        const data = await result.json();
        console.log(data);

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