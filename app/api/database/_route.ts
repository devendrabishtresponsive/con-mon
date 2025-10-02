// app/api/database/route.ts

import { cookies } from 'next/headers';

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { accountId, propertyId, eventNames } = body;

//     if (!accountId || !propertyId || !eventNames) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // Save to DB
//     // await connectDB();
//     // const newEvent = await Event.create({ accountId, propertyId, eventNames });

//     const collection = "events";
//     // const userId = "683046c740ff5148b4686446";

//     // Use await with cookies()
//     const cookieStore = await cookies();
//     const userId  = cookieStore.get('cm_mongodb_user_id')?.value;

//     const client = await clientPromise;
//     const db = client.db(process.env.MONGODB_DB);
//     const data = {
//         userId: new ObjectId(userId), // ✅ store as ObjectId
//         accountId,
//         propertyId,
//         eventNames
//     };

//     // match condition: unique combo of userId + accountId + propertyId
//     const filter = {
//       userId: new ObjectId(userId),
//       accountId,
//       propertyId,
//     };

//     const updateDoc = {
//       $set: data, // overwrite fields if found
//     };

//     const result = await db.collection(collection).updateOne(filter, updateDoc, {
//       upsert: true, // create new if not found
//     });

//     console.log(result);

//     return NextResponse.json({
//       matchedCount: result.matchedCount,
//       modifiedCount: result.modifiedCount,
//       upsertedId: result.upsertedId || null,
//     });
//   } catch (err: any) {
//     console.error("DB Save Error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// 🔹 GET all users
export async function GET(request: Request) {
  // Use await with cookies()
  const cookieStore = await cookies();
  const cm_mongodb_user_id = cookieStore.get('cm_mongodb_user_id')?.value;
  if (!cm_mongodb_user_id) {
    return new NextResponse('User ID is required', { status: 400 });
  }
  // if (!accessToken) {
  //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }
    try {
        const url = new URL(request.url);
        const collection = url.searchParams.get('collection') ?? '';
        console.log('Fetching user by ID:', cm_mongodb_user_id);
          const client = await clientPromise;
          const db = client.db(process.env.MONGODB_DB);
          const result = await db.collection( collection ).findOne({ userId: new ObjectId(cm_mongodb_user_id) });
          const eventNames = result?.eventNames || {};
          console.log(result);
          console.log(eventNames);
          if (!result) {
              return NextResponse.json({ error: 'User not found' }, { status: 404 });
          }
          // return NextResponse.json(result);
          return NextResponse.json(eventNames);

        // const action = url.searchParams.get('action') ?? '';
        // const id = url.searchParams.get('id') ?? '';

        // if( action === 'getDocumentByID' && id ) {
        //     console.log('Fetching user by ID:', id);
        //     const client = await clientPromise;
        //     const db = client.db(process.env.MONGODB_DB);
        //     const result = await db.collection( collection ).findOne({ userId: new ObjectId(cm_mongodb_user_id) });
        //     console.log(result);
        //     if (!result) {
        //         return NextResponse.json({ error: 'User not found' }, { status: 404 });
        //     }
        //     return NextResponse.json(result);
        // }
        // else {
        //     const client = await clientPromise;
        //     const db = client.db(process.env.MONGODB_DB);
        //     const users = await db.collection('users').find({}).toArray();
        //     return NextResponse.json(users);
        // }
    } catch (error) {
        console.error('GET error:', error);
        return new NextResponse('Failed to fetch users', { status: 500 });
    }
}

// // app/api/users/route.ts
// import { cookies } from 'next/headers';
// import { NextRequest, NextResponse } from 'next/server';
// import clientPromise from '@/lib/mongodb';
// import { ObjectId } from 'mongodb';

// // 🔹 GET all users
// export async function GET(request: Request) {
//     try {
//         const url = new URL(request.url);
//         const action = url.searchParams.get('action') ?? '';
//         const userID = url.searchParams.get('userID') ?? '';

//         if( action === 'getUserByID' && userID ) {
//             console.log('Fetching user by ID:', userID);
//             const client = await clientPromise;
//             const db = client.db(process.env.MONGODB_DB);
//             const user = await db.collection('users').findOne({ _id: new ObjectId(userID) });
//             if (!user) {
//                 return NextResponse.json({ error: 'User not found' }, { status: 404 });
//             }
//             return NextResponse.json(user);
//         }



//         const client = await clientPromise;
//         const db = client.db(process.env.MONGODB_DB);
//         const users = await db.collection('users').find({}).toArray();
//         return NextResponse.json(users);
//     } catch (error) {
//         console.error('GET error:', error);
//         return new NextResponse('Failed to fetch users', { status: 500 });
//     }
// }

// // 🔹 POST (Create) a new user
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

// // 🔹 PUT (Update) a user by _id
// export async function PUT(req: NextRequest) {
//     // Use await with cookies()
//     const cookieStore = await cookies();
//     const userID = cookieStore.get('cm_mongodb_user_id')?.value;
    
//     // if (!userID) return new NextResponse('User ID is required', { status: 400 });

//     try {
//         const client = await clientPromise;
//         const db = client.db(process.env.MONGODB_DB);
//         const data = await req.json();

//         if (!userID) return new NextResponse('User ID is required', { status: 400 });

//         data._id = userID; // Ensure _id is set from cookie
        
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

// // 🔹 DELETE user by _id (from body)
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