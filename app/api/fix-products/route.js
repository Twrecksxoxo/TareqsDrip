import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        return NextResponse.json({ message: 'Fix products endpoint' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
