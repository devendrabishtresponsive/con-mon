import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function saveEventsMetricsToDatabase(userId: string, accountId: string, propertyId: string, eventsMetrics: any) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const collection = "eventsHistory";

        const now = new Date();

        // Log the full Date object
        console.log("Now:", now);

        // Raw current date (ISO format)
        const rawDate = now.toISOString();
        console.log("Raw Date:", rawDate);

        // Human-readable format (dd-mm-yyyy)
        const readableDate = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;

        console.log("Human Readable Date:", readableDate);

        const data = {
            userId: new ObjectId(userId), // store as ObjectId
            accountId: accountId,
            propertyId: propertyId,
            eventsMetrics: eventsMetrics,
            updatedAt: rawDate,
            updatedAtReadable: readableDate,
        };

        // Insert a new document
        const result = await db.collection(collection).insertOne(data);

        console.log("InsertedId:", result.insertedId);

        const insertedId = result.insertedId;
        
        return insertedId || null;
    } catch (error) {
        console.error('Error in saveEventsMetricsToDb:', error);
        throw new Error('Database query failed');
    }
}