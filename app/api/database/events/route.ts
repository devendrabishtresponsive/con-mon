// app/api/database/route.ts

import { cookies } from 'next/headers';

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

import { getEventsByUserId } from './handlers';

export async function GET(request: Request) {
    try {
        // Use await with cookies()
        const cookieStore = await cookies();
        const userId  = cookieStore.get('cm_mongodb_user_id')?.value;
        
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }
        
        const events = await getEventsByUserId(userId);
        
        if (events.length === 0) {
            return NextResponse.json({ error: 'Events not found' }, { status: 404 });
        }
        
        return NextResponse.json(events);
    } catch (error) {
        console.error('GET /api/events error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { accountId, propertyId, eventNames } = body;
        
        if (!accountId || !propertyId || !eventNames) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        
        // Save to DB
        // await connectDB();
        // const newEvent = await Event.create({ accountId, propertyId, eventNames });
        
        // const collection = "events";
        // const userId = "683046c740ff5148b4686446";
        
        // Use await with cookies()
        const cookieStore = await cookies();
        const userId  = cookieStore.get('cm_mongodb_user_id')?.value;
        
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const collection = "events";
        const data = {
            userId: new ObjectId(userId), // store as ObjectId
            accountId,
            propertyId,
            eventNames
        };
        
        // match condition: unique combo of userId + accountId + propertyId
        const filter = {
            userId: new ObjectId(userId),
            accountId,
            propertyId,
        };
        
        const updateDoc = {
            $set: data, // overwrite fields if found
        };
        
        const result = await db.collection(collection).updateOne(filter, updateDoc, {
            upsert: true, // create new if not found
        });
        
        console.log(result);
        
        return NextResponse.json({
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            upsertedId: result.upsertedId || null,
        });
    } catch (err: any) {
        console.error("DB Save Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// export async function POST(req: Request) {
//     try {
//         const body = await req.json();
//         const { accountId, propertyId, eventNames } = body;

//         if (!accountId || !propertyId || !eventNames) {
//             return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//         }

//         // Save to DB
//         // await connectDB();
//         // const newEvent = await Event.create({ accountId, propertyId, eventNames });

//         const collection = "events";
//         const userId = "683046c740ff5148b4686446";

//         const client = await clientPromise;
//         const db = client.db(process.env.MONGODB_DB);
//         const data = {
//             userId: new ObjectId(userId), // ✅ store as ObjectId
//             accountId,
//             propertyId,
//             eventNames
//         };

//         // match condition: unique combo of userId + accountId + propertyId
//         const filter = {
//             userId: new ObjectId(userId),
//             accountId,
//             propertyId,
//         };

//         const updateDoc = {
//             $set: data, // overwrite fields if found
//         };

//         const result = await db.collection(collection).updateOne(filter, updateDoc, {
//             upsert: true, // create new if not found
//         });

//         console.log(result);

//         return NextResponse.json({
//             matchedCount: result.matchedCount,
//             modifiedCount: result.modifiedCount,
//             upsertedId: result.upsertedId || null,
//         });
//     } catch (err: any) {
//         console.error("DB Save Error:", err);
//         return NextResponse.json({ error: err.message }, { status: 500 });
//     }
// }

/**
* POST
* 👉 Used to create new resources.
* Example: Add a new user, product, or order.
*/
// export async function POST(request: Request) {
//   const body = await request.json();
//   return NextResponse.json({ message: "Created new item", data: body }, { status: 201 });
// }

// export async function GET(request: Request) {
//     // Use await with cookies()
//     const cookieStore = await cookies();
//     const cm_mongodb_user_id = cookieStore.get('cm_mongodb_user_id')?.value;
//     if (!cm_mongodb_user_id) {
//         return new NextResponse('User ID is required', { status: 400 });
//     }
//     // if (!accessToken) {
//     //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     // }
//     try {
//         // const url = new URL(request.url);
//         // const collection = url.searchParams.get('collection') ?? '';
//         console.log('Fetching user by ID:', cm_mongodb_user_id);

//         const collection = 'events';
//         const client = await clientPromise;
//         const db = client.db(process.env.MONGODB_DB);
//         // const eventDocuments = await db.collection( collection ).findOne({
//         //     userId: new ObjectId(cm_mongodb_user_id)
//         // });
//         const eventDocuments = await db.collection(collection)
//         .find({
//             userId: new ObjectId(cm_mongodb_user_id)
//         })
//         .toArray();

//         // console.log(eventDocuments); // always []
//         // console.log(eventDocuments);
//         if (!eventDocuments) {
//             return NextResponse.json({ error: 'Events not found' }, { status: 404 });
//         }

//         return NextResponse.json(eventDocuments);


//         // const eventNames = result?.eventNames || {};
//         // console.log(eventNames);
//         // return NextResponse.json(eventNames);
//         // }
//     } catch (error) {
//         console.error('GET error:', error);
//         return new NextResponse('Failed to fetch users', { status: 500 });
//     }
// }