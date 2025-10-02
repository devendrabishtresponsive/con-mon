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
        
        const response = await fetch(
            // `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
            `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runReport`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dimensions: [{ name: 'eventName' }],
                    // metrics: [{ name: 'eventCount' }],
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
                            startDate: '30daysAgo',
                            endDate: 'today',
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
        
        // console.log(response);
        const data = await response.json();
        // console.log(data);
        
        // const events = data.rows?.map((row: any) => ({
        //     eventName: row.dimensionValues[0].value,
        //     eventCount: row.metricValues[0].value,
        // })) || [];

        const events = data.rows?.map((row: any) => {
        const eventName = row.dimensionValues[0].value;
        const metrics = row.metricValues.reduce((acc: any, val: any, idx: number) => {
            const metricName = data.metricHeaders[idx].name;
            acc[metricName] = val.value;
            return acc;
        }, {});
        return { eventName, ...metrics };
        });
        
        return NextResponse.json(events);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}