import { NextRequest, NextResponse } from 'next/server';

import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';

import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    let userID: string;

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

        // Set cookie
        // Use await with cookies()
        const cookieStore = await cookies();
        cookieStore.set('cm_googleapis_access_token', tokenData.access_token, {
            httpOnly: true,
            secure: true,
            path: '/',
            // maxAge: 3600, // 1 hour
            maxAge: 60 * 60 * 24 * 30, // 30 days
            // expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
        });

        // Save refresh token (if provided)
        if (tokenData.refresh_token) {
            cookieStore.set('cm_googleapis_refresh_token', tokenData.refresh_token, {
                httpOnly: true,
                secure: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });
        }

        try {
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_DB);
            const usersCollection = db.collection('users');

            // await usersCollection.updateOne(
            //     { 
            //         email: user.email
            //     },
            //     {
            //         $set: {
            //             name: user.name,
            //             email: user.email,
            //             picture: user.picture,
            //             access_token: tokenData.access_token,
            //             refresh_token: tokenData.refresh_token,
            //             updatedAt: new Date(),
            //         },
            //         $setOnInsert: {
            //             createdAt: new Date(),
            //         },
            //     },
            //     {
            //         upsert: true
            //     }
            // );

            const result = await usersCollection.updateOne(
                { email: user.email },
                {
                    $set: {
                        name: user.name,
                        email: user.email,
                        picture: user.picture,
                        accessToken: tokenData.access_token,
                        refreshToken: tokenData.refresh_token,
                        updatedAt: new Date(),
                    },
                    $setOnInsert: {
                        createdAt: new Date(),
                    },
                },
                {
                    upsert: true,
                }
            );

            if (result.upsertedCount > 0 && result.upsertedId) {
                // New user inserted
                userID = result.upsertedId.toString();
            } else {
                // User already existed; fetch _id manually
                const existingUser = await usersCollection.findOne({ email: user.email }, { projection: { _id: 1 } });
                userID = existingUser?._id?.toString() ?? '';
            }

            // const existingUser = await usersCollection.findOne({ email: user.email });
            // if (!existingUser) {
            //     await usersCollection.insertOne({
            //         name: user.name,
            //         email: user.email,
            //         picture: user.picture,
            //         createdAt: new Date(),
            //     });
            // }
            // return NextResponse.json({ success: true });
        } catch (error) {
            console.error('MongoDB error:', error);
            return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
        }

        // Save userID in a cookie
        if (userID) {
            cookieStore.set('cm_mongodb_user_id', userID, {
                httpOnly: true,
                secure: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });
        }

        // cookieStore.set('cm_mongodb_selected_events', userID, {
        //     httpOnly: true,
        //     secure: true,
        //     path: '/',
        //     maxAge: 60 * 60 * 24 * 30, // 30 days
        // });

        // Redirect to dashboard
        // Redirect to /auth/saveuser with query params
        const saveUrl = new URL('/intermediate-process/save-user', req.nextUrl.origin);
        saveUrl.searchParams.set('name', user.name);
        saveUrl.searchParams.set('email', user.email);
        saveUrl.searchParams.set('picture', user.picture);
        return NextResponse.redirect(saveUrl.toString());
    } catch (err) {
        console.error(err);
        return NextResponse.redirect('/');
    }
}