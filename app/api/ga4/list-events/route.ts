// import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// import clientPromise from '@/lib/mongodb';

// import { googleApiFetch } from "@/lib/googleApiClient";

import { getEventsMetricsByPropertyId } from '../../ga4/events/handlers';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const accountId = searchParams.get("accountId") || "";
        const propertyId = searchParams.get("propertyId") || "";
        const startDate = searchParams.get("startDate") || "";
        const endDate = searchParams.get("endDate") || "";

        const eventNames: string[] = [];

        const events = await getEventsMetricsByPropertyId(propertyId, startDate, endDate, eventNames);
        // console.log('events:');
        // console.log(events);
        
        return NextResponse.json(events);
        // return NextResponse.json({ accounts: data.accounts || [] });
    } catch (error: unknown) {
        // Handle network errors or other unexpected errors
        let errorMessage = 'Server Error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}