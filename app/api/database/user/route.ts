// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

import { getUserBy } from './handlers';

// GET user by ID
export async function GET(request: Request) {
    try {
        // 1. Try query param
        const { searchParams } = new URL(request.url);
        let field = searchParams.get("field") || "_id";
        let value = searchParams.get("value") || null;
        
        // 2. If not in query, try request body
        if (!field || !value) {
            try {
                const body = await request.json();
                field = body?.field || "_id";
                value = body?.value || null;
            } catch {
                // ignore if no body / invalid JSON
            }
        }
        
        // 3. If still missing, return error
        if (!field || !value) {
            return NextResponse.json(
                { error: "Missing field/value in query or body" },
                { status: 400 }
            );
        }
        
        // 4. Fetch user from DB
        const user = await getUserBy(field, value);
        
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(user, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        );
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
export async function POST(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const data = await request.json();
        const result = await db.collection('users').insertOne(data);
        return NextResponse.json({ insertedId: result.insertedId });
    } catch (error) {
        console.error('POST error:', error);
        return new NextResponse('Failed to create user', { status: 500 });
    }
}

// 🔹 PUT (Update) a user by _id
export async function PUT(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const data = await request.json();
        
        if (!data._id) return new NextResponse('User ID is required', { status: 400 });
        
        const { _id, ...rest } = data;
        const result = await db
        .collection('users')
        .updateOne({ _id: new ObjectId(_id) }, { $set: rest });
        
        return NextResponse.json({ updatedCount: result.modifiedCount });
    } catch (error) {
        console.error('PUT error:', error);
        return new NextResponse('Failed to update user', { status: 500 });
    }
}

// 🔹 DELETE user by _id (from body)
export async function DELETE(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const { _id } = await request.json();
        
        if (!_id) return new NextResponse('User ID is required', { status: 400 });
        
        const result = await db
        .collection('users')
        .deleteOne({ _id: new ObjectId(_id) });
        
        return NextResponse.json({ deletedCount: result.deletedCount });
    } catch (error) {
        console.error('DELETE error:', error);
        return new NextResponse('Failed to delete user', { status: 500 });
    }
}