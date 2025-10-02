import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { refreshAccessToken } from '@/lib/googleapis/refreshAccessToken';

const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GA4_ACCOUNTS_ENDPOINT = 'https://analyticsadmin.googleapis.com/v1beta/accounts';

export async function GET() {
  // Use await with cookies()
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('cm_googleapis_access_token')?.value;
  const refreshToken = cookieStore.get('cm_googleapis_refresh_token')?.value;

  const property = "properties/414699561";

  // if (!accessToken) {
  //   try {
  //       // console.log(refreshToken);
  //       const refreshed = await refreshAccessToken(refreshToken);
  //       // console.log(refreshed);
  //       accessToken = refreshed.access_token;
        
  //       // Update cookie with new access token
  //       if (accessToken) {
  //         cookieStore.set('cm_googleapis_access_token', accessToken, {
  //           httpOnly: true,
  //           secure: true,
  //           sameSite: 'lax',
  //           path: '/',
  //           maxAge: refreshed.expires_in,
  //         });
  //       }
  //     } catch (err) {
  //       return NextResponse.json({ error: 'Token refresh failed' }, { status: 401 });
  //     }
  //   // return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
  // }
  
  try {
    const res = await fetch(`https://analyticsadmin.googleapis.com/v1beta/${property}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    // console.log(`https://analyticsadmin.googleapis.com/v1beta/${property}`);
    
    
    // If access token has expired, refresh and retry
    // if (res.status === 401 && refreshToken) {
    //   try {
    //     const refreshed = await refreshAccessToken(refreshToken);
    //     accessToken = refreshed.access_token;
        
    //     // Update cookie with new access token
    //     if (accessToken) {
    //       cookieStore.set('cm_googleapis_access_token', accessToken, {
    //         httpOnly: true,
    //         secure: true,
    //         sameSite: 'lax',
    //         path: '/',
    //         maxAge: refreshed.expires_in,
    //       });
    //     }
        
    //     // Retry original request with new token
    //     res = await fetch(`https://analyticsadmin.googleapis.com/v1beta/${property}`, {
    //       headers: { Authorization: `Bearer ${accessToken}` },
    //     });
    //   } catch (err) {
    //     return NextResponse.json({ error: 'Token refresh failed' }, { status: 401 });
    //   }
    // }
    
    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json({ error }, { status: res.status });
    }
    
    const propertyData = await res.json();
    // console.log(propertyData);
    // return NextResponse.json({ property: propertyData || [] });
    return NextResponse.json(propertyData || []);
  } catch (error: any) {
    // console.log(error);
    // Handle network errors or other unexpected errors
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}