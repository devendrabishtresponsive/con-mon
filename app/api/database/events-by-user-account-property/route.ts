import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getEventsByUserIdAccountIdPropertyId } from './handlers';

export async function GET(request: Request) {
    try {
        // Retrieve userId from cookies
        const cookieStore = await cookies(); // Use await with cookies()
        const userId  = cookieStore.get('cm_mongodb_user_id')?.value;
        // console.log("userId:");
        // console.log(userId);

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }
        
        // Extract query parameters
        const { searchParams } = new URL(request.url);
        const accountId = searchParams.get('accountId') || '';
        const propertyId = searchParams.get('propertyId') || '';
        
        // Fetch events from DB
        const events = await getEventsByUserIdAccountIdPropertyId(
            userId,
            accountId,
            propertyId
        );
        
        if (!events || events.length === 0) {
            return NextResponse.json(
                { error: 'Events not found' },
                { status: 404 }
            );
        }
        
        // Return serialized events
        return NextResponse.json(events);
    } catch (err) {
        console.error('GET /api/events error:', err);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}


// // import { NextRequest, NextResponse } from 'next/server';
// // import clientPromise from '@/lib/mongodb';
// // import { ObjectId } from 'mongodb';

// // import { NextResponse } from 'next/server';

// // import { getEventsByUserId } from './handlers';

// import { cookies } from 'next/headers';

// import { NextResponse } from 'next/server';

// import { getEventsByUserIdAccountIdPropertyId } from './handlers';

// export async function GET(request: Request) {
//     try {
//         // Use await with cookies()
//         const cookieStore = await cookies();
//         const userId  = cookieStore.get('cm_mongodb_user_id')?.value;

//         // console.log("userId:");
//         // console.log(userId);

//         const { searchParams } = new URL(request.url);
//         const accountId = searchParams.get("accountId") || "";
//         const propertyId = searchParams.get("propertyId") || "";

//         if (!userId) {
//             return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
//         }

//         const events = await getEventsByUserIdAccountIdPropertyId(userId, accountId, propertyId);

//         if (events.length === 0) {
//             return NextResponse.json({ error: 'Events not found' }, { status: 404 });
//         }

//         return NextResponse.json(events);
//     } catch (error) {
//         console.error('GET /api/events error:', error);
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//     }
// }