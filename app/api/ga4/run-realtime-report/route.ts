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
        
        // const response = await fetch(
        //     `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runRealtimeReport`,
        //     {
        //         method: 'POST',
        //         headers: {
        //             Authorization: `Bearer ${accessToken}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             dimensions: [{ name: 'eventName' }],
        //             metrics: [{ name: 'eventCount' }],
        //             // dateRanges: [
        //             //     {
        //             //         startDate: '30daysAgo',
        //             //         endDate: 'today',
        //             //     },
        //             // ],
        //             limit: 1000,
        //         }),
        //     }
        // );

        //This returns the top 25 real-time pages users are currently on, sorted by activeUsers.
        const response = await fetch(
            `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runRealtimeReport`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
  "dimensions": [
    { "name": "unifiedScreenName" },
    // { "name": "eventName" }
  ],
  "metrics": [
    { "name": "activeUsers" }
  ],
  "limit": 25
}),
            }
        );

        
        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json({ error }, { status: response.status });
        }
        
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        
        const events = data.rows?.map((row: any) => ({
            'eventName_dimensionValues': row.dimensionValues[0].value,
            'eventCount_metricValues': row.metricValues[0].value,
        })) || [];

        // const events = data.rows?.map((row: any) => {
        //     const eventName = row.dimensionValues[0].value;
        //     const metrics = row.metricValues.reduce((acc: any, val: any, idx: number) => {
        //         const metricName = data.metricHeaders[idx].name;
        //         acc[metricName] = val.value;
        //         return acc;
        //     }, {});
        //     return { eventName, ...metrics };
        // });
        
        return NextResponse.json(events);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}