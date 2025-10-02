export async function refreshAccessToken(refreshToken: string) {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
    });
    
    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    // console.log('Refresh token response:', res);
    
    if (!res.ok) throw new Error('Failed to refresh access token');
    return res.json(); // Returns: { access_token, expires_in, token_type }
}