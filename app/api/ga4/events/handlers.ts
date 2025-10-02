// import { cookies } from 'next/headers';

import { googleApiFetch, googleApiFetchForCron } from "@/lib/googleApiClient";

export async function getEventsMetricsByPropertyIdForCron(accessToken: string, refreshToken: string, propertyId: string, startDate: string, endDate: string, selectedEvents: string[]) {
    try {
        // Use await with cookies()
        // const cookieStore = await cookies();
        // const accessToken = cookieStore.get('cm_googleapis_access_token')?.value;
        // const refreshToken = cookieStore.get('cm_googleapis_refresh_token')?.value;

        // console.log("accessToken:");
        // console.log(accessToken);
        // console.log("refreshToken:");
        // console.log(refreshToken);
    
        // const GA4_PROPERTY_ID = `properties/${propertyId}`;

        const response = await googleApiFetchForCron(
            accessToken,
            refreshToken,
            `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
            {
                method: 'POST',
                headers: {
                    // Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dimensions: [{ name: 'eventName' }],
                    metrics: [
                        { name: 'totalUsers' },
                        { name: 'newUsers' },
                        { name: 'activeUsers' },
                        { name: 'eventValue' },
                        { name: 'engagementRate' },
                        { name: 'userEngagementDuration' },
                        { name: 'averageSessionDuration' },
                        { name: 'sessions' },
                        { name: 'bounceRate' },
                        { name: 'eventCount' },
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
            console.error('Error in getEventsByUserId:', error);
            throw new Error('Database query failed' + error);
            // return NextResponse.json({ error }, { status: response.status });
        }

        const data = await response.json();
        // console.log(data);
        // console.log("getEventsMetricsByPropertyIdForCron");
        // console.log(data);
        
        const events = (data.rows ?? []).map((row: any) => {
            const eventName = row.dimensionValues?.[0]?.value ?? 'unknown_event';

            // Skip event only if selectedEvents is not empty AND eventName is not in it
            if (selectedEvents.length > 0 && !selectedEvents.includes(eventName)) {
                return null;
            }

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
        
        return events;
    } catch (error) {
        console.error('Error in getEventsMetricsByPropertyId:', error);
        throw new Error('Database query failed');
    }
}

export async function getEventsMetricsByPropertyId(propertyId: string, startDate: string, endDate: string, selectedEvents: string[]) {
    try {
        console.log("Inside: getEventsMetricsByPropertyId")
        // Use await with cookies()
        // const cookieStore = await cookies();
        // const accessToken = cookieStore.get('cm_googleapis_access_token')?.value;
        // const refreshToken = cookieStore.get('cm_googleapis_refresh_token')?.value;

        // console.log("accessToken:");
        // console.log(accessToken);
        // console.log("refreshToken:");
        // console.log(refreshToken);
    
        // const GA4_PROPERTY_ID = `properties/${propertyId}`;

        const response = await googleApiFetch(
            `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
            {
                method: 'POST',
                headers: {
                    // Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dimensions: [{ name: 'eventName' }],
                    metrics: [
                        { name: 'totalUsers' },
                        { name: 'newUsers' },
                        { name: 'activeUsers' },
                        { name: 'eventValue' },
                        { name: 'engagementRate' },
                        { name: 'userEngagementDuration' },
                        { name: 'averageSessionDuration' },
                        { name: 'sessions' },
                        { name: 'bounceRate' },
                        { name: 'eventCount' },
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
            console.error('Error in getEventsByUserId:', error);
            throw new Error('Database query failed' + error);
            // return NextResponse.json({ error }, { status: response.status });
        }

        const data = await response.json();
        // console.log(data);
        
        const events = (data.rows ?? []).map((row: any) => {
            const eventName = row.dimensionValues?.[0]?.value ?? 'unknown_event';

            // Skip event only if selectedEvents is not empty AND eventName is not in it
            if (selectedEvents.length > 0 && !selectedEvents.includes(eventName)) {
                return null;
            }

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
        
        return events;
    } catch (error) {
        console.error('Error in getEventsMetricsByPropertyId:', error);
        throw new Error('Database query failed');
    }
}