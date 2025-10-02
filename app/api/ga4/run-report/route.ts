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
                    metrics: [
                        { name: 'eventCount' },
                        { name: 'totalUsers' },
                        { name: 'eventCountPerUser' },
                        { name: 'totalRevenue' },
                    ],
                    // metrics: [{ name: 'eventCount' }],
                    dateRanges: [
                        {
                            startDate: '28daysAgo',  // 28daysAgo // 30daysAgo
                            endDate: 'today',
                        },
                    ],
                    orderBys: [
                        {
                            metric: {
                                metricName: "eventCount"
                            },
                            desc: true
                        }
                    ],
                    limit: 1000 // 25

                    // "orderBys": [{ "metric": { "metricName": "eventCount" }, "desc": true }],
                    // limit: 1000,
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ error: 'GA4 API error', details: errorText }, { status: 500 });
        }

        const rawData = await response.json();

        // Structure response into usable format
        const headers = rawData.metricHeaders.map((header: any) => header.name);
        const result = rawData.rows?.map((row: any) => {
            const rowData: Record<string, string> = {
                eventName: row.dimensionValues[0]?.value || ''
            };
            row.metricValues.forEach((metric: any, index: number) => {
                rowData[headers[index]] = metric.value;
            });
            return rowData;
        }) || [];

        return NextResponse.json({ rows: result });
        
        // if (!response.ok) {
        //     const error = await response.text();
        //     return NextResponse.json({ error }, { status: response.status });
        // }
        
        // const data = await response.json();
        // console.log(JSON.stringify(data, null, 2));
        
        // const events = data.rows?.map((row: any) => ({
        //     'eventName_dimensionValues': row.dimensionValues[0].value,
        //     'eventCount_metricValues': row.metricValues[0].value,
        // })) || [];

        // const events = data.rows?.map((row: any) => {
        //     const eventName = row.dimensionValues[0].value;
        //     const metrics = row.metricValues.reduce((acc: any, val: any, idx: number) => {
        //         const metricName = data.metricHeaders[idx].name;
        //         acc[metricName] = val.value;
        //         return acc;
        //     }, {});
        //     return { eventName, ...metrics };
        // });
        
        // return NextResponse.json(events);
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}