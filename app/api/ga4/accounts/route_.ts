// import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// import { refreshAccessToken } from '@/lib/googleapis/refreshAccessToken';

import { googleApiFetch } from "@/lib/googleApiClient";

// const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
// const GA4_ACCOUNTS_ENDPOINT = 'https://analyticsadmin.googleapis.com/v1beta/accounts';

export async function GET() {
  // Use await with cookies()
  // const cookieStore = await cookies();
  // let accessToken = cookieStore.get('cm_googleapis_access_token')?.value;
  // const refreshToken = cookieStore.get('cm_googleapis_refresh_token')?.value;

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
    
    // let res = await fetch('https://analyticsadmin.googleapis.com/v1beta/accounts', {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });
    // const response = await googleApiFetch(
    // `https://analyticsdata.googleapis.com/v1beta/${GA4_PROPERTY_ID}:runReport`,
    // {
    
    const res = await googleApiFetch('https://analyticsadmin.googleapis.com/v1beta/accounts');

    // const res = await googleApiFetch('https://analyticsadmin.googleapis.com/v1beta/accounts', {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });

    console.log(res);
    
    // // If access token has expired, refresh and retry
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
    //     res = await fetch('https://analyticsadmin.googleapis.com/v1beta/accounts', {
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
    
    const data = await res.json();
    return NextResponse.json({ accounts: data.accounts || [] });
  // } catch (error: any) {
  //   // console.log(error);
  //   // Handle network errors or other unexpected errors
  //   return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  // }
  } catch (error: unknown) {
    // console.log(error);
    // Handle network errors or other unexpected errors
    let errorMessage = 'Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}