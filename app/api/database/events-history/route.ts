import { cookies } from 'next/headers';

import { NextRequest, NextResponse } from 'next/server';

import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

import { saveEventsMetricsToDatabase } from './handlers';

// export async function GET(request: Request) {
//     try {
//         // Use await with cookies()
//         const cookieStore = await cookies();
//         const userId  = cookieStore.get('cm_mongodb_user_id')?.value;
        
//         if (!userId) {
//             return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
//         }
        
//         const events = await getEventsByUserId(userId);
        
//         if (events.length === 0) {
//             return NextResponse.json({ error: 'Events not found' }, { status: 404 });
//         }
        
//         return NextResponse.json(events);
//     } catch (error) {
//         console.error('GET /api/events error:', error);
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//     }
// }

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, accountId, propertyId, eventsMetrics } = body;
        
        if (!userId || !accountId || !propertyId || !eventsMetrics) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const insertedId = saveEventsMetricsToDatabase(userId, accountId, propertyId, eventsMetrics);

        return NextResponse.json({
            insertedId: insertedId || null
        });
        
        // // Save to DB
        // // await connectDB();
        // // const newEvent = await Event.create({ accountId, propertyId, eventNames });
        
        // // const collection = "events";
        // // const userId = "683046c740ff5148b4686446";
        
        // // Use await with cookies()
        // // const cookieStore = await cookies();
        // // const userId  = cookieStore.get('cm_mongodb_user_id')?.value;
        
        // const client = await clientPromise;
        // const db = client.db(process.env.MONGODB_DB);
        // const collection = "events_history";

        // const now = new Date();

        // // Log the full Date object
        // console.log("Now:", now);

        // // Raw current date (ISO format)
        // const rawDate = now.toISOString();
        // console.log("Raw Date:", rawDate);

        // // Human-readable format (dd-mm-yyyy)
        // const readableDate = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;

        // console.log("Human Readable Date:", readableDate);

        // const data = {
        //     userId: new ObjectId(userId), // store as ObjectId
        //     accountId,
        //     propertyId,
        //     eventsMetrics: eventsMetrics,
        //     updatedAt: rawDate,
        //     updatedAtReadable: readableDate,
        // };

        // // Insert a new document
        // const result = await db.collection(collection).insertOne(data);

        // console.log("InsertedId:", result.insertedId);
        
        // return NextResponse.json({
        //     insertedId: result.insertedId || null
        // });
    } catch (err: any) {
        console.error("DB Save Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}