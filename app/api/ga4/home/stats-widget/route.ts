import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
// import { getAccessToken } from '@/lib/google-auth';
// import { GA4_PROPERTY_ID } from '@/lib/constants';

export async function GET() {
    try {
        // const accessToken = await getAccessToken();

        // Use await with cookies()
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('cm_googleapis_access_token')?.value;
        const refreshToken = cookieStore.get('cm_googleapis_refresh_token')?.value;

        const GA4_PROPERTY_ID = 'properties/414699561'; // Replace with your actual GA4 property ID
        

        // 7-Day Summary via runReport
        const response = await fetch(
            `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runReport`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dateRanges: [
                        {
                            startDate: '7daysAgo', // 28daysAgo // 7daysAgo
                            endDate: 'today'
                        },
                    ],
                    metrics: [
                        { name: 'activeUsers' },
                        { name: 'eventCount' },
                        { name: 'newUsers' },
                        { name: 'keyEvents' },
                        // { name: 'averageEngagementTime' },
                    ],
                    // "metricAggregations": [],
                    // "dimensionFilter": {},
                    // "metricFilter": {},
                    // "keepEmptyRows": false,
                    // "returnPropertyQuota": false,
                    // "timeZoneCode": "America/Los_Angeles" // <-- MATCH YOUR PROPERTY TIMEZONE HERE
                }),
                // body: JSON.stringify({
                //     dateRanges: [
                //         {
                //         startDate: '28daysAgo',
                //         endDate: 'today',
                //         },
                //     ],
                //     dimensions: [
                //         { name: 'eventName' },
                //     ],
                //     metrics: [
                //         { name: 'eventCount' },
                //         { name: 'totalUsers' },
                //         { name: 'eventCountPerUser' },
                //         { name: 'totalRevenue' }, // may return zero if no ecommerce
                //     ],
                //     orderBys: [
                //         {
                //         metric: { metricName: 'eventCount' },
                //         desc: true,
                //         },
                //     ],
                //     limit: 10,
                //     keepEmptyRows: false,
                //     returnPropertyQuota: false,
                //     timeZoneCode: 'America/Los_Angeles',
                // }),
            }
        );
        
        const data = await response.json();
        console.log(data);
        
        const metricsObject = data.metricHeaders.reduce((acc, header, index) => {
            acc[header.name] = data.rows[0].metricValues[index].value;
            return acc;
        }, {} as Record<string, string>);

        // console.log(metricsObject);
        // Output:
        // { activeUsers: "298", eventCount: "5252", newUsers: "219" }

        // console.log(JSON.stringify(data, null, 2));

        return NextResponse.json(metricsObject);
    } catch (error: any) {
        console.error('GA4 API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}