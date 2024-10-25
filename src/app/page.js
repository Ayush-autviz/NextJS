"use client";

import React from "react";
import { useForm } from "react-hook-form";
import base_url from "../constants/index";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${base_url}/api/auth/login`, {
        email: data.email,
        password: data.password,
      });
      const token = res.data.token; // Adjust this based on your API response structure

      // Store the token in local storage
      localStorage.setItem("authToken", token);

      router.push("movieCollection");
      console.log(res, "res");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-screen min-h-screen flex items-center justify-center bg-[#093545] relative overflow-hidden">
      {/* Wavy background */}

      {/* Sign in form */}
      <div className="p-8 w-96 z-10">
        <h1 className="text-[64px] font-bold mb-6 text-white text-center">
          Sign in
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[24px]">
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
              className="w-full px-4 py-[15px] bg-[#224957] text-white placeholder-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="w-full px-4 py-[15px] bg-[#224957] placeholder-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              id="remember"
              {...register("remember")}
              className="mr-2 bg-teal-700 border-teal-600 rounded-md text-teal-500 focus:ring-teal-500"
            />
            <label htmlFor="remember" className="text-sm text-white">
              Remember me
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-[15px] px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition duration-200"
          >
            Login
          </button>
        </form>
      </div>

      {/* Pink border */}
    </div>
  );
}
