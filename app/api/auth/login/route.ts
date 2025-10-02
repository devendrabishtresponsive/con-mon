import { NextResponse } from 'next/server';

export async function GET() {
    // Check if environment variables are configured
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || !process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI) {
        return NextResponse.json({ 
            error: 'Google OAuth not configured. Please set up environment variables.',
            demo: true 
        }, { status: 500 });
    }
    
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    
    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
        response_type: 'code',
        // scope: 'openid email profile',
        scope: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_SCOPE || 'openid email profile',
        // scope: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_SCOPE!,
        prompt: 'consent', // force refresh_token every time
        access_type: 'offline', // this is REQUIRED
    });
    
    return NextResponse.redirect(`${baseUrl}?${params.toString()}`);
}