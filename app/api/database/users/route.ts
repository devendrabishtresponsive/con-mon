import { NextResponse } from 'next/server';

import { getAllUsers } from './handlers';

// GET all users
export async function GET() {
    const users = await getAllUsers();
    return NextResponse.json(users);
}