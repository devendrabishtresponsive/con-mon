// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// import clientPromise from '@/lib/mongodb';

import { getAllUsers } from '../database/users/handlers';
import { getEventsByUserId } from '../database/events/handlers';
import { getEventsMetricsByPropertyIdForCron } from '../ga4/events/handlers';
import { saveEventsMetricsToDatabase } from '../database/events-history/handlers';

export async function GET(request: Request) {
    try {
        const users = await getAllUsers();
        // console.log('users:');
        // console.log(users);

        for (const user of users) {
            const userId = user._id.toString();
            const accessToken = user.accessToken;
            const refreshToken = user.refreshToken;

            const events = await getEventsByUserId(userId);
            // console.log('events:');
            // console.log(events);

            for (const event of events) {
                const userId = event.userId;
                const accountId = event.accountId;
                const propertyId = event.propertyId;
                const eventNames = event.eventNames || [];
                // console.log('eventNames:');
                // console.log(eventNames);
                // console.log(typeof eventNames);

                const startDate = 'today';
                // const startDate = '30daysAgo';
                const endDate = 'today';


                const eventsMetrics = await getEventsMetricsByPropertyIdForCron(accessToken, refreshToken, propertyId, startDate, endDate, eventNames);
                // const eventsMetrics = await getEventsMetricsByPropertyId(propertyId, startDate, endDate, eventNames);

                // console.log('eventsMetrics:');
                // console.log(eventsMetrics);

                if( eventsMetrics.length === 0 ) {
                    console.log(`No events metrics found for userId: ${userId}, accountId: ${accountId}, propertyId: ${propertyId}`);
                }
                else {
                    console.log(`Events metrics found for userId: ${userId}, accountId: ${accountId}, propertyId: ${propertyId}`);
                    // Saving the events history to MongoDB
                    const insertedId = saveEventsMetricsToDatabase(userId.toString(), accountId, propertyId, eventsMetrics);
                    console.log('insertedId:');
                    console.log(insertedId);
                }
                
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Cron job executed successfully',
        });

        // // Use await with cookies()
        // const cookieStore = await cookies();
        // const userId  = cookieStore.get('cm_mongodb_user_id')?.value;
        
        // if (!userId) {
        //     return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        // }
        
        // const events = await getEventsByUserId(userId);
        
        // if (events.length === 0) {
        //     return NextResponse.json({ error: 'Events not found' }, { status: 404 });
        // }
    } catch (error) {
        console.error('GET /api/events error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // Use await with cookies()
    // const cookieStore = await cookies();
    // const cm_mongodb_user_id = cookieStore.get('cm_mongodb_user_id')?.value;
    // if (!cm_mongodb_user_id) {
    //     return new NextResponse('User ID is required', { status: 400 });
    // }

    // try {
    //     const url = new URL(request.url);
    //     const startDate = url.searchParams.get('startDate') ?? '30daysAgo';
    //     const endDate = url.searchParams.get('endDate') ?? 'today';
    //     const action = url.searchParams.get('action') ?? '';

        
    //     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // fallback for dev
    //     const userID = cookieStore.get('cm_mongodb_user_id')?.value;
        
    //     const res = await fetch(
    //         `${baseUrl}/api/mongodb?collection=users&action=getDocumentByID&id=${userID}`,
    //         {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             }
    //         }
    //     );
    //     const result = await res.json();
    //     // console.log(data);

    //     const eventNames = result.eventNames;
    //     console.log(eventNames);

    //     // const selectedEvents = ['login', 'page_view', 'purchase']; // 👈 example event names
    //     const selectedEvents = eventNames;


    //     const accessToken = cookieStore.get('cm_googleapis_access_token')?.value;
    //     const GA4_PROPERTY_ID = 'properties/414699561';

    //     const response = await fetch(
    //         `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runReport`,
    //         {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 dimensions: [{ name: 'eventName' }],
    //                 metrics: [
    //                     { name: 'totalUsers' },
    //                     { name: 'newUsers' },
    //                     { name: 'activeUsers' },
    //                     { name: 'eventValue' },
    //                     { name: 'engagementRate' },
    //                     { name: 'userEngagementDuration' },
    //                     { name: 'averageSessionDuration' },
    //                     { name: 'sessions' },
    //                     { name: 'bounceRate' },
    //                     { name: 'eventCount' },
    //                     // { name: 'eventsPerSession' },
    //                     // { name: 'purchaseRevenue' },
    //                     // { name: 'totalPurchasers' },
    //                     // { name: 'itemRevenue' },
    //                     // { name: 'conversions' },
    //                     // { name: 'addToCarts' },
    //                 ],
    //                 // metrics: [
    //                 //     { name: 'totalUsers' },
    //                 //     { name: 'newUsers' },
    //                 //     { name: 'activeUsers' },
    //                 //     { name: 'eventValue' },
    //                 //     { name: 'engagementRate' },
    //                 //     { name: 'userEngagementDuration' },
    //                 //     { name: 'averageSessionDuration' },
    //                 //     { name: 'sessions' },
    //                 //     { name: 'bounceRate' },
    //                 //     { name: 'eventCount' },
    //                 //     { name: 'eventsPerSession' },
    //                 //     { name: 'purchaseRevenue' },
    //                 //     { name: 'totalPurchasers' },
    //                 //     { name: 'itemRevenue' },
    //                 //     { name: 'conversions' },
    //                 //     { name: 'addToCarts' },
    //                 // ],
    //                 // metrics: [
    //                 //     { name: 'eventCount' },
    //                 //     { name: 'totalUsers' },
    //                 //     { name: 'activeUsers' },
    //                 //     { name: 'engagementRate' },
    //                 //     { name: 'userEngagementDuration' },
    //                 //     { name: 'screenPageViews' },
    //                 //     { name: 'sessions' },
    //                 //     { name: 'bounceRate' },
    //                 // ],
    //                 dateRanges: [
    //                     {
    //                         startDate: 'today',
    //                         endDate: 'today'
    //                     },
    //                 ],
    //                 // dateRanges: [
    //                 //     {
    //                 //         startDate, // dynamic
    //                 //         endDate,   // dynamic
    //                 //     },
    //                 // ],
    //                 limit: 1000,
    //             }),
    //         }
    //     );

    //     if (!response.ok) {
    //         const error = await response.text();
    //         return NextResponse.json({ error }, { status: response.status });
    //     }

    //     // const data = await response.json();
    //     // console.log(data);
    //     // console.log(JSON.stringify(data, null, 2));

    //     // const events = data.rows?.map((row: any) => {
    //     //     const eventName = row.dimensionValues?.[0]?.value ?? 'unknown_event';
    //     //     const metrics: Record<string, string | number> = {};

    //     //     row.metricValues?.forEach((metric: any, idx: number) => {
    //     //         const metricName = data.metricHeaders?.[idx]?.name ?? `metric_${idx}`;
    //     //         metrics[metricName] = isNaN(Number(metric.value))
    //     //             ? metric.value
    //     //             : Number(metric.value);
    //     //     });

    //     //     return {
    //     //         eventName,
    //     //         ...metrics,
    //     //     };
    //     // }) ?? [];
    //     // console.log(events);

    //     const data = await response.json();
    //     console.log(data);
        
    //     const events = (data.rows ?? []).map((row: any) => {
    //         const eventName = row.dimensionValues?.[0]?.value ?? 'unknown_event';

    //         // Skip event if it's not in the selectedEvents array
    //         if (!selectedEvents.includes(eventName)) return null;

    //         const metrics: Record<string, string | number> = {};

    //         row.metricValues?.forEach((metric: any, idx: number) => {
    //             const metricName = data.metricHeaders?.[idx]?.name ?? `metric_${idx}`;
    //             metrics[metricName] = isNaN(Number(metric.value))
    //                 ? metric.value
    //                 : Number(metric.value);
    //         });

    //         return {
    //             eventName,
    //             ...metrics,
    //         };
    //     }).filter(Boolean); // remove nulls
    //     // console.log(events);
        
    //     // Saving events history to MongoDB
    //     const response3 = await fetch(
    //         `${baseUrl}/api/mongodb?collection=event_history&action=pushToDB`,
    //         // `${baseUrl}/api/database/event-history`,
    //         {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify( {
    //                 user_id: userID,
    //                 date_readable: endDate, // use endDate as the date for the event history
    //                 date: new Date( endDate ),
    //                 events: events,
    //                 updatedAt: new Date(),
    //             } ),
    //         }
    //     );
    //     const result3 = await response3.json();
    //     // console.log(result3);

    //     if( result3.insertedId ) {
    //         console.log("Event history inserted with ID:", result3.insertedId);
    //     }

    //     return NextResponse.json(events);
    // } catch (error) {
    //     console.error(error);
    //     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    // }
}