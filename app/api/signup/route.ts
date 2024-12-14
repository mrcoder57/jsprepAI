import { NextRequest, NextResponse } from 'next/server';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import connectToDb from '@/utils/database/connectToDb';
import User from '@/model/user/userModel';
// Connect to the database


export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { userName, email, password } = await req.json();

    // Validate input
    if (!userName || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDb();

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email is already in use.' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { success: true, message: 'User registered successfully.', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in sign-up API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
