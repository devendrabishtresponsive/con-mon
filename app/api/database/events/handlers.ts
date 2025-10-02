import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function getEventsByUserId(user_id: string) {
    try {
        // console.log('Fetching user by ID:', user_id);

        const collection = 'events';
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const eventDocuments = await db.collection(collection)
        .find({
            userId: new ObjectId(user_id)
        })
        .toArray();

        // Return empty array if nothing found
        return eventDocuments;
    } catch (error) {
        console.error('Error in getEventsByUserId:', error);
        throw new Error('Database query failed');
    }
}