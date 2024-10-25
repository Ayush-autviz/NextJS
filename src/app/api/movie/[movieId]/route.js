// src/app/api/movie/[movieId]/route.js
import { connectionString } from "../../../lib/db";
import mongoose from "mongoose";
import Movie from '../../../lib/models/movie';
import { NextResponse } from "next/server";
import { authenticate } from '../../../middleware/authenticateToken'; 

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(connectionString);
  }
}

export async function GET(req, { params }) {
  await connectDB();

  const authResult = authenticate(req);
  if (!authResult.success) {
    return NextResponse.json({ success: false, message: authResult.message }, { status: authResult.status });
  }

  try {
    const { movieId } = params; 
    const movie = await Movie.findById(movieId); 

    if (!movie) {
      return NextResponse.json({ success: false, message: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: movie });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function POST(req, { params }) {
  await connectDB();

  const authResult = authenticate(req);
  if (!authResult.success) {
    return NextResponse.json({ success: false, message: authResult.message }, { status: authResult.status });
  }

  try {
    const { movieId } = params; 
    const { title, publishingYear, posterURL } = await req.json(); 

    if (!title && !publishingYear && !posterURL) {
      return NextResponse.json({ success: false, message: "At least one field must be provided for update" }, { status: 400 });
    }


    const updateData = {};
    if (title) updateData.title = title;
    if (publishingYear) updateData.publishingYear = publishingYear;
    if (posterURL) updateData.posterURL = posterURL;

    const updatedMovie = await Movie.findByIdAndUpdate(movieId, updateData, { new: true }); // Update the movie

    if (!updatedMovie) {
      return NextResponse.json({ success: false, message: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedMovie });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
