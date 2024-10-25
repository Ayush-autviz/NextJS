"use client";

import React, { useEffect, useState } from "react";
import { LogoutIcon, UserCircleIcon, PlusIcon } from "@heroicons/react/outline";
import base_url from "../../constants";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Component() {
  const [movies, setMovies] = useState([]); // All movies
  const [currentPage, setCurrentPage] = useState(1); // Tracks current page
  const [loading, setLoading] = useState(false);
  const moviesPerPage = 5; // Display 5 movies per page

  const router = useRouter();

  // Fetch movies from the API
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(`${base_url}/api/movie`, config);
      setMovies(res.data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Calculate the index range for the current page
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies?.data?.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  // Navigate to the next page
  const nextPage = () => {
    if (currentPage < Math.ceil(movies?.data?.length / moviesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Navigate to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      {!movies || loading ? (
        <>
          <div className="login-screen min-h-screen bg-[#093545] text-white relative overflow-hidden">
            <header className="h-screen flex justify-center items-center">
              <div className="">
                <h1 className="text-[48px] font-bold mb-[40px]">Your movie list is empty </h1>
                <div className="flex justify-center">
                <button
              type="submit"
              className="px-14 py-[15px] bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
            >
              Add a new movie
            </button>
                </div>
                
              </div>
            </header>
          </div>
        </>
      ) : (
        <div className="login-screen min-h-screen bg-[#093545] text-white relative overflow-hidden">
          <header className="p-[120px] flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-[48px] font-bold">My movies</h1>
              <PlusIcon
                onClick={() => {
                  router.push("createMovie");
                }}
                className="cursor-pointer rounded-plus border-2 border-white rounded-full w-8 h-8"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  localStorage.removeItem("authToken");
                  router.push("/");
                }}
                className="flex items-center space-x-1"
              >
                <span className="mr-4">Logout</span>
                <LogoutIcon className="w-8 h-8" />
              </button>
            </div>
          </header>

          <main className="p-[120px] pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[24px]">
              {currentMovies?.map((movie) => (
                <div
                  key={movie._id}
                  className="bg-[#092C39] p-2 rounded-lg overflow-hidden"
                  onClick={() => {
                    router.push(`/editMovie?id=${movie._id}`);
                  }}
                >
                  <img
                    src={`${movie.posterURL}`} // Display base64 image
                    alt={movie.title}
                    className="w-full h-96 object-cover"
                  />
                  <div className="p-4 ">
                    <h2 className="text-[20px] font-semibold">{movie.title}</h2>
                    <p className="text-sm text-teal-300">
                      {movie.publishingYear}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </main>

          <footer className="mb-[190px] p-4 flex justify-center items-center space-x-2">
            <button
              className="px-3 py-1  rounded"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-3 py-1 bg-[#2BD17E] rounded">
              {currentPage}
            </span>
            <button
              className="px-3 py-1 rounded"
              onClick={nextPage}
              disabled={
                currentPage >= Math.ceil(movies?.data?.length / moviesPerPage)
              }
            >
              Next
            </button>
          </footer>
        </div>
      )}
    </>
  );
}
