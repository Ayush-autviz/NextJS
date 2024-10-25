"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UploadIcon } from "@heroicons/react/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import base_url from "../../constants";
import { Suspense } from "react";


export default function Component() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const [base64Image, setBase64Image] = useState(""); // For storing the base64 string
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("authToken");

      // Prepare data with base64 image
      const payload = {
        title: data.title,
        publishingYear: data.year,
        posterURL: base64Image, // Attach base64 image string
      };

      // Set up headers for the request
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Make the POST request to update the movie
      const res = await axios.post(
        `${base_url}/api/movie/?movieId=${id}`,
        payload,
        config
      );

      toast.success("Movie updated successfully");
      router.push("/movieCollection"); // Navigate to movie collection after success
    } catch (error) {
      toast.error("Movie not updated");
      console.error("Error:", error);
      router.push("/movieCollection");
    }
  };

  // Handle image change and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setBase64Image(base64String); // Store the base64 string
        setImagePreview(base64String); // Preview the image
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    
    <div className="min-h-screen bg-[#093545] text-white p-[120px] relative overflow-hidden">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8">Edit Movie</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row gap-[127px]"
      >
        {/* Image upload section */}
        <div className="w-full md:w-1/2">
          <label
            htmlFor="image"
            className="w-full h-[500px] border-2 border-dashed border-white rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-[#224957]"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <UploadIcon className="w-12 h-12 mx-auto mb-2" />
                <span>Drop an image here</span>
              </div>
            )}
            <input
              type="file"
              id="image"
              accept="image/*"
              className="hidden"
              onInput={handleImageChange}
              {...register("image")}
            />
          </label>
          {errors.image && (
            <p className="mt-1 text-red-400">{errors.image.message}</p>
          )}
        </div>

        {/* Form fields section */}
        <div className="w-full md:w-96">
          <div>
            <input
              type="text"
              placeholder="Title"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 2,
                  message: "Title must be at least 2 characters long",
                },
              })}
              className=" mb-6 w-full px-4 py-[10px] bg-[#224957] text-white placeholder-white border rounded-md focus:outline-none border-[#224957]"
            />
            {errors.title && (
              <p className="mt-1 text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              placeholder="Publishing year"
              {...register("year", {
                required: "Publishing year is required",
                min: { value: 1888, message: "Year must be 1888 or later" },
                max: {
                  value: new Date().getFullYear(),
                  message: "Year cannot be in the future",
                },
              })}
              className="w-full px-4 py-[10px] border-[#224957] bg-[#224957] text-white placeholder-white border rounded-md"
            />
            {errors.year && (
              <p className="mt-1 text-red-400">{errors.year.message}</p>
            )}
          </div>

          {/* Submit button */}
          <div className="flex space-x-4 mt-[64px]">
            <button
              type="button"
              className="px-14 py-[15px] border border-white text-white rounded-md hover:bg-teal-800 transition duration-200"
              onClick={() => router.push("/movieCollection")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-14 py-[15px] bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
