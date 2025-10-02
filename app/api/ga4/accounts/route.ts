import { NextResponse } from 'next/server';

import { googleApiFetch } from "@/lib/googleApiClient";

export async function GET() {
    try {
        const res = await googleApiFetch('https://analyticsadmin.googleapis.com/v1beta/accounts');
        // console.log(res);
        
        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json({ error }, { status: res.status });
        }
        
        const data = await res.json();
        return NextResponse.json({ accounts: data.accounts || [] });
    } catch (error: unknown) {
        // Handle network errors or other unexpected errors
        let errorMessage = 'Server Error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}