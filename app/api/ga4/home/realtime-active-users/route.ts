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
            `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runRealtimeReport`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dimensions: [{ name: 'country' }],
                    metrics: [{ name: 'activeUsers' }],
                }),
            }
        );
        
        // If response isn't OK, throw error for debugging
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`GA4 API Error: ${errorText}`);
        }
        
        const rawData = await response.json();
        console.log('Raw GA4 Realtime Data:', JSON.stringify(rawData, null, 2));
        // Example rawData structure
        
        // Convert to array of objects like: [{ country: 'India', activeUsers: '34' }, ...]
        const formattedData = rawData.rows?.map((row: any) => {
            const country = row.dimensionValues?.[0]?.value || 'Unknown';
            const activeUsers = row.metricValues?.[0]?.value || '0';
            return { country, activeUsers };
        }) || [];
        
        return NextResponse.json({ data: formattedData });
    } catch (error: any) {
        console.error('GA4 API Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}