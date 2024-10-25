"use client";

import React from "react";
import { useForm } from "react-hook-form";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-900 relative overflow-hidden">
      {/* Wavy background */}


      {/* Sign in form */}
      <div className="bg-teal-800 p-8 rounded-lg shadow-md w-96 z-10">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          Sign in
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-3 py-2 bg-teal-700 text-white placeholder-teal-300 border border-teal-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-3 py-2 bg-teal-700 text-white placeholder-teal-300 border border-teal-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              {...register("remember")}
              className="mr-2 bg-teal-700 border-teal-600 text-teal-500 focus:ring-teal-500"
            />
            <label htmlFor="remember" className="text-sm text-teal-300">
              Remember me
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition duration-200"
          >
            Login
          </button>
        </form>
      </div>

      {/* Pink border */}

    </div>
  );
}
