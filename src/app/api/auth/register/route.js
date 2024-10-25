import mongoose from "mongoose";
import User from "../../../lib/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import { connectionString } from "../../../lib/db";

export async function POST(req) {
  await mongoose.connect(connectionString);

  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { success: true, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
