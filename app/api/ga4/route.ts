import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');
    
    if (!code) {
        return NextResponse.redirect('/');
    }
    
    try {
        // Exchange code for access token
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
                redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
                grant_type: 'authorization_code',
            }),
        });
        
        const tokenData = await tokenRes.json();
        
        // Use access token to get user info
        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });
        
        // const user = await userRes.json();
        // const dashboardUrl = new URL('/dashboard', req.nextUrl.origin);
        // dashboardUrl.searchParams.set('name', user.name);
        // dashboardUrl.searchParams.set('email', user.email);
        // dashboardUrl.searchParams.set('picture', user.picture);
        // return NextResponse.redirect(dashboardUrl.toString());
        
        const user = await userRes.json();
        // Redirect to /auth/saveuser with query params
        const saveUrl = new URL('/auth/saveuser', req.nextUrl.origin);
        saveUrl.searchParams.set('name', user.name);
        saveUrl.searchParams.set('email', user.email);
        saveUrl.searchParams.set('picture', user.picture);
        saveUrl.searchParams.set('accessToken', tokenData.access_token);
        return NextResponse.redirect(saveUrl.toString());
    } catch (err) {
        console.error(err);
        return NextResponse.redirect('/');
    }
}