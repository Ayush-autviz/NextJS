"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { UploadIcon } from "@heroicons/react/outline";
import axios from "axios";
import base_url from "../../constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function CreateMovie() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null); // Added to store base64 string
  const router = useRouter();

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle Image Change
  const handleImageChange = async (e) => {
    console.log("handle image change");
    const file = e.target.files[0];
    if (file) {
      const base64String = await convertToBase64(file);
      setImageBase64(base64String); // Store base64 string
      setImagePreview(URL.createObjectURL(file)); // Preview the image
    }
  };

  // Submit Form
  const onSubmit = async (data) => {
    try {
      // Get the token from local storage
      const token = localStorage.getItem("authToken");

      // Prepare the JSON payload
      const payload = {
        title: data.title,
        publishingYear: data.year,
        posterURL: imageBase64, // Send the base64 string as the 'poster'
      };

      // Set up headers for JSON data
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Make the POST request
      const res = await axios.post(`${base_url}/api/movie`, payload, config);

      toast.success("Movie added successfully");
      router.push("movieCollection"); // Redirect to movie collection

      console.log(res.data); // Log the response
    } catch (error) {
      toast.error("Error adding movie");
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="login-screen min-h-screen bg-[#093545] text-white p-[120px] relative overflow-hidden">
      <h1 className="text-3xl font-bold mb-8">Create a new movie</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row gap-[120px]"
      >
        {/* Image Upload Section */}
        <div className="w-full md:w-1/2">
          <label
            htmlFor="image"
            className="w-full h-[500px] border-2 bg-[#224957] border-dashed border-white rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
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
              id="image"
              className="hidden"
              type="file"
              onInput={handleImageChange}
              {...register("image", { required: "Image is required" })}
            />
          </label>
          {errors.image && (
            <p className="mt-1 text-red-400">{errors.image.message}</p>
          )}
        </div>

        {/* Form Fields Section */}
        <div className="w-full md:w-96">
          {/* Title Input */}
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
              className="mb-4 w-full px-3 py-2 bg-[#224957] text-white placeholder-white border border-[#224957] rounded-md"
            />
            {errors.title && (
              <p className="mt-1 text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* Year Input */}
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
              className="w-[241px] px-3 py-2 bg-[#224957] text-white placeholder-white border border-[#224957] rounded-md"
            />
            {errors.year && (
              <p className="mt-1 text-red-400">{errors.year.message}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 mt-16">
            <button
              type="button"
              className="px-[55px] py-4 border border-white text-white rounded-md hover:bg-teal-800 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-[55px] py-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <ToastContainer /> {/* Toast notifications */}
    </div>
  );
}
