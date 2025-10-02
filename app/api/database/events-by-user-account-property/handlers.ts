import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';;

export async function getEventsByUserIdAccountIdPropertyId(user_id: string, account_id: string, property_id: string) {
    try {
        // console.log('Fetching user by ID:', user_id);

        const collection = 'events';
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);

        // console.log("userId:" + user_id);
        // console.log("accountId:" + account_id);
        // console.log("propertyId:" + property_id);
        
        // const eventDocuments = await db.collection(collection)
        // .findOne({
        //     userId: new ObjectId(user_id)
        // })
        // .toArray();
        // console.log("eventDocuments");
        // console.log(eventDocuments);

        // Return empty array if nothing found
        // return eventDocuments;

        const eventDocument = await db.collection(collection).findOne({
            userId: new ObjectId(user_id),
            accountId: account_id,
            propertyId: property_id
        });

        // Convert ObjectId fields to string before sending to frontend
        const serializedEvent =
        eventDocument && {
            ...eventDocument,
            _id: eventDocument._id.toString(),
            userId: eventDocument.userId.toString(),
        };

        return serializedEvent || null;
    } catch (error) {
        console.error('Error in getEventsByUserId:', error);
        throw new Error('Database query failed');
    }
}

// export async function getEventsByUserIdAccountIdPropertyId(userId: string, accountId: string, propertyId: string) {
//     try {
//         const collection = 'events';
//         const client = await clientPromise;
//         const db = client.db(process.env.MONGODB_DB);

//         console.log("userId:" + userId);
//         console.log("accountId:" + accountId);
//         console.log("propertyId:" + propertyId);
        
//         const eventDocuments = await db.collection(collection)
//         .find({
//             userId: new ObjectId(userId),
//             // accountId: accountId,
//             // propertyId: propertyId,
//         })
//         .toArray();

//         // Return empty array if nothing found
//         return eventDocuments;
//     } catch (error) {
//         console.error('Error in getEventsByUserIdAccountIdPropertyId:', error);
//         throw new Error('Database query failed');
//     }
// }