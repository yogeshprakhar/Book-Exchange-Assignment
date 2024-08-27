import React from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const Header = () => {
  const navigate = useNavigate();
  const handleClick = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log(response.message);
      throw new Error(response.message);
    }
    navigate("/signin");
  };
  return (
    <header className=" bg-stone-200 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Website Name */}
        <h1 className="text-xl font-bold text-gray-800">
          Book Exchange Platform
        </h1>

        {/* Logout Button */}
        <div className="flex gap-3">
        <Link
            to={"/"}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Browse Books
          </Link>
          <Link
            to={"/listing"}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Your Books
          </Link>
          <Link
            to={"/matches"}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Potential Matches
          </Link>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
            onClick={(e) => handleClick(e)}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
