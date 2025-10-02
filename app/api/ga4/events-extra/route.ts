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
        
        const res = await fetch(`https://analyticsadmin.googleapis.com/v1beta/${GA4_PROPERTY_ID}/customDimensions`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // const res = await fetch(`https://analyticsadmin.googleapis.com/v1beta/${GA4_PROPERTY_ID}/customMetrics`, {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`,
        //     },
        // });
        
        if (!res.ok) {
            const error = await res.text();
            return NextResponse.json({ error }, { status: res.status });
        }
        
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}