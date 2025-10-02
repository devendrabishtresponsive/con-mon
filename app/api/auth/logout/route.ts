import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    
    cookieStore.delete('cm_mongodb_user_id');
    cookieStore.delete('cm_googleapis_access_token');
    cookieStore.delete('cm_googleapis_refresh_token');
    
    return NextResponse.json({ success: true });
}