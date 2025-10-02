// import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { googleApiFetch } from "@/lib/googleApiClient";

// import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
    try {
        // Use await with cookies()
        // const cookieStore = await cookies();

        // const url = new URL(request.url);
        // const accountId = url.searchParams.get('accountId') ?? '';
        // const propertyId = url.searchParams.get('propertyId') ?? '';
        // const startDate = url.searchParams.get('startDate') ?? '30daysAgo';
        // const endDate = url.searchParams.get('endDate') ?? 'today';
        // const action = url.searchParams.get('action') ?? '';
        
        // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // fallback for dev
        // const userID = cookieStore.get('cm_mongodb_user_id')?.value;
        
        // const res = await fetch(
        //     `${baseUrl}/api/mongodb?collection=users&action=getDocumentByID&id=${userID}`,
        //     {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         }
        //     }
        // );
        // const result = await res.json();
        // // console.log(data);

        // const eventNames = result.eventNames;
        // console.log(eventNames);

        // // const selectedEvents = ['login', 'page_view', 'purchase']; // 👈 example event names
        // const selectedEvents = eventNames;


        // const accessToken = cookieStore.get('cm_googleapis_access_token')?.value;
        // const GA4_PROPERTY_ID = 'properties/414699561';propertyId
        // const GA4_PROPERTY_ID = 'properties/'+propertyId;


        const { searchParams }  =   new URL(request.url);
        
        const accountId   =   searchParams.get("accountId") || null;
        const propertyId  =   searchParams.get("propertyId") || null;
        const startDate   =   searchParams.get("startDate") || null;
        const endDate     =   searchParams.get("endDate") || null;

        // const GA4_PROPERTY_ID = `properties/${propertyId}`;

        const response = await googleApiFetch(
            // `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runReport`,
            `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dimensions: [{ name: 'eventName' }],
                    metrics: [
                        { name: 'eventCount' },
                        { name: 'totalUsers' },
                        { name: 'activeUsers' },
                        { name: 'engagementRate' },
                        { name: 'userEngagementDuration' },
                        { name: 'screenPageViews' },
                        { name: 'sessions' },
                        { name: 'bounceRate' },
                    ],
                    dateRanges: [
                        {
                            startDate, // dynamic
                            endDate,   // dynamic
                        },
                    ],
                    limit: 1000,
                }),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json({ error }, { status: response.status });
        }

        // const data = await response.json();
        // console.log(data);
        // console.log(JSON.stringify(data, null, 2));

        // const events = data.rows?.map((row: any) => {
        //     const eventName = row.dimensionValues?.[0]?.value ?? 'unknown_event';
        //     const metrics: Record<string, string | number> = {};

        //     row.metricValues?.forEach((metric: any, idx: number) => {
        //         const metricName = data.metricHeaders?.[idx]?.name ?? `metric_${idx}`;
        //         metrics[metricName] = isNaN(Number(metric.value))
        //             ? metric.value
        //             : Number(metric.value);
        //     });

        //     return {
        //         eventName,
        //         ...metrics,
        //     };
        // }) ?? [];
        // console.log(events);

        const data = await response.json();
        const events = (data.rows ?? []).map((row: any) => {
            const eventName = row.dimensionValues?.[0]?.value ?? 'unknown_event';

            // Skip event if it's not in the selectedEvents array
            // if (!selectedEvents.includes(eventName)) return null;

            const metrics: Record<string, string | number> = {};

            row.metricValues?.forEach((metric: any, idx: number) => {
                const metricName = data.metricHeaders?.[idx]?.name ?? `metric_${idx}`;
                metrics[metricName] = isNaN(Number(metric.value))
                    ? metric.value
                    : Number(metric.value);
            });

            return {
                eventName,
                ...metrics,
            };
        }).filter(Boolean); // remove nulls
        // console.log(events);
        
        // Saving events history to MongoDB
        // // const response3 = await fetch(
        // //     `${baseUrl}/api/mongodb?collection=event_history&action=pushToDB`,
        // //     {
        // //         method: 'POST',
        // //         headers: {
        // //             'Content-Type': 'application/json'
        // //         },
        // //         body: JSON.stringify( {
        // //             user_id: userID,
        // //             date_readable: endDate, // use endDate as the date for the event history
        // //             date: new Date( endDate ),
        // //             events: events,
        // //             updatedAt: new Date(),
        // //         } ),
        // //     }
        // // );
        // // const result3 = await response3.json();
        // // console.log(result3);

        // if( result3.insertedId ) {
        //     console.log("Event history inserted with ID:", result3.insertedId);
        // }

        return NextResponse.json(events);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}