// app/api/users/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// 🔹 GET all users
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const collection = url.searchParams.get('collection') ?? '';
        const action = url.searchParams.get('action') ?? '';
        const id = url.searchParams.get('id') ?? '';

        if( action === 'getDocumentByID' && id ) {
            console.log('Fetching user by ID:', id);
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_DB);
            const result = await db.collection( collection ).findOne({ _id: new ObjectId(id) });
            if (!result) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
            return NextResponse.json(result);
        }
        else {
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_DB);
            const users = await db.collection('users').find({}).toArray();
            return NextResponse.json(users);
        }
    } catch (error) {
        console.error('GET error:', error);
        return new NextResponse('Failed to fetch users', { status: 500 });
    }
}

// 🔹 POST (Create) a new user
export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const collection = url.searchParams.get('collection') ?? '';
        // const action = url.searchParams.get('action') ?? '';
        // const id = url.searchParams.get('id') ?? '';

        console.log('Creating user in collection:', collection);
        if (!collection) return new NextResponse('Collection name is required', { status: 400 });

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const data = await req.json();
        const result = await db.collection( collection ).insertOne(data);
        return NextResponse.json({ insertedId: result.insertedId });
    } catch (error) {
        console.error('POST error:', error);
        return new NextResponse('Failed to create user', { status: 500 });
    }
}

// 🔹 PUT (Update) a user by _id
export async function PUT(req: NextRequest) {
    // Use await with cookies()
    const cookieStore = await cookies();
    const userID = cookieStore.get('cm_mongodb_user_id')?.value;
    
    // if (!userID) return new NextResponse('User ID is required', { status: 400 });

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const data = await req.json();

        if (!userID) return new NextResponse('User ID is required', { status: 400 });

        data._id = userID; // Ensure _id is set from cookie
        
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
        const { _id } = await req.json();
        
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