// app/api/auth/login/route.js
import mongoose from 'mongoose';
import User from '../../../lib/models/user';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';  // Import jsonwebtoken package
import { connectionString } from '../../../lib/db';

export async function POST(req) {
  await mongoose.connect(connectionString);

  const { email, password } = await req.json();

  // Check if email and password are provided
  if (!email || !password) {
    return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    // Check if the provided password matches the hashed password in the database
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }

    // Generate JWT token upon successful login
    const token = jwt.sign(
      { id: user._id, email: user.email },  // Payload with user ID and email
      "wANfQv8JNbvgjwgV",               // JWT secret key from environment variables
      { expiresIn: '1h' }                   // Token expiration time
    );

    // Return the JWT token in the response
    return NextResponse.json({ success: true, token });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Login failed' }, { status: 500 });
  }
}
