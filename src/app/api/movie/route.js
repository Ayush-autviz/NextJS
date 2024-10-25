
import { connectionString } from "../../lib/db";
import mongoose from "mongoose";
import Movie from '../../lib/models/movie';
import { NextResponse } from "next/server";
import { authenticate } from '../../middleware/authenticateToken'; 

// Function to connect to the database
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(connectionString);
  }
}


export async function GET(req) {
  await connectDB();

  const authResult = authenticate(req);
  if (!authResult.success) {
    return NextResponse.json({ success: false, message: authResult.message }, { status: authResult.status });
  }

  try {
    const movies = await Movie.find({});
    return NextResponse.json({ success: true, data: movies });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function POST(req) {
  await connectDB();

  const authResult = authenticate(req);
  if (!authResult.success) {
    return NextResponse.json({ success: false, message: authResult.message }, { status: authResult.status });
  }

  try {
    const { title, publishingYear, posterURL } = await req.json();

    if (!title || !publishingYear) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const newMovie = new Movie({ title, publishingYear, posterURL });
    await newMovie.save();
    return NextResponse.json({ success: true, data: newMovie }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
