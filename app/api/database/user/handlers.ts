// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function getUserBy(field: string, value: string) {
    try {
        const collection = 'users';
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);

        // Build query dynamically
        const query: Record<string, unknown> = {};
        
        if (field === "_id") {
            // Convert to ObjectId only for _id
            query[field] = new ObjectId(value);
        } else {
            query[field] = value;
        }

        const user = await db.collection(collection).findOne(query);
        
        return user;
    } catch (error) {
        console.error("Error in getUserBy:", error);
    throw new Error("Database query failed");
    }
}

// 🔹 GET all users
// export async function GET() {
//     try {
//         const client = await clientPromise;
//         const db = client.db(process.env.MONGODB_DB);
//         const users = await db.collection('users').find({}).toArray();
//         return NextResponse.json(users);
//     } catch (error) {
//         console.error('GET error:', error);
//         return new NextResponse('Failed to fetch users', { status: 500 });
//     }
// }

// 🔹 POST (Create) a new user
// export async function POST(req: NextRequest) {
//     try {
//         const client = await clientPromise;
//         const db = client.db(process.env.MONGODB_DB);
//         const data = await req.json();
//         const result = await db.collection('users').insertOne(data);
//         return NextResponse.json({ insertedId: result.insertedId });
//     } catch (error) {
//         console.error('POST error:', error);
//         return new NextResponse('Failed to create user', { status: 500 });
//     }
// }

// 🔹 PUT (Update) a user by _id
// export async function PUT(req: NextRequest) {
//     try {
//         const client = await clientPromise;
//         const db = client.db(process.env.MONGODB_DB);
//         const data = await req.json();
        
//         if (!data._id) return new NextResponse('User ID is required', { status: 400 });
        
//         const { _id, ...rest } = data;
//         const result = await db
//         .collection('users')
//         .updateOne({ _id: new ObjectId(_id) }, { $set: rest });
        
//         return NextResponse.json({ updatedCount: result.modifiedCount });
//     } catch (error) {
//         console.error('PUT error:', error);
//         return new NextResponse('Failed to update user', { status: 500 });
//     }
// }

// 🔹 DELETE user by _id (from body)
// export async function DELETE(req: NextRequest) {
//     try {
//         const client = await clientPromise;
//         const db = client.db(process.env.MONGODB_DB);
//         const { _id } = await req.json();
        
//         if (!_id) return new NextResponse('User ID is required', { status: 400 });
        
//         const result = await db
//         .collection('users')
//         .deleteOne({ _id: new ObjectId(_id) });
        
//         return NextResponse.json({ deletedCount: result.deletedCount });
//     } catch (error) {
//         console.error('DELETE error:', error);
//         return new NextResponse('Failed to delete user', { status: 500 });
//     }
// }