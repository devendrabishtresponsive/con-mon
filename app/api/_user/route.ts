import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { refreshAccessToken } from '@/lib/googleapis/refreshAccessToken';

export async function GET() {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get('cm_googleapis_access_token')?.value;
    const refreshToken = cookieStore.get('cm_googleapis_refresh_token')?.value;
    
    let userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (userRes.status === 401 && refreshToken) {
        try {
            const refreshed = await refreshAccessToken(refreshToken);
            accessToken = refreshed.access_token;
            
            // Update access token cookie only if accessToken is defined
            if (accessToken) {
                cookieStore.set('ga_access_token', accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: refreshed.expires_in,
                });
            }
            
            // Retry request with new token
            userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
        } catch (err) {
            return NextResponse.json({ user: null, isLoggedIn: false, error: 'refresh_failed' });
        }
    }
    
    if (!userRes.ok) {
        return NextResponse.json({ user: null, isLoggedIn: false });
    }
    
    const profile = await userRes.json();
    
    return NextResponse.json({
        user: {
            name: profile.name,
            email: profile.email,
            picture: profile.picture,
        },
        isLoggedIn: true,
    });
}