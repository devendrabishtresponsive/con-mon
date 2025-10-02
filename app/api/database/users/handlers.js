import clientPromise from '@/lib/mongodb';

export async function getAllUsers() {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const users = await db.collection('users').find({}).toArray();
        // console.log('Fetched users:');
        // console.log(users);
        return users;
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        throw new Error('Database query failed | getAllUsers');
    }
}