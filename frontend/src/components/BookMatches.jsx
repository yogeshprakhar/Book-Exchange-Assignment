import React, { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const PotentialMatches = () => {
  const [matches, setMatches] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [user, setUser] = useState({});
  useEffect(() => {
    getCurrentUser();
    fetchMatches();
    fetchExchangeRequest();
  }, []);

  const fetchMatches = async () => {
    const response = await fetch(`${API_BASE_URL}/exchange/potential-matches`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log(response.message);
      throw new Error(response.message);
    }
    const data = await response.json();
    setMatches(data);
  };

  const handleExchangeRequest = async (toUserId, toBookId) => {
    const response = await fetch(
      `${API_BASE_URL}/exchange/send-exchange-request`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toUserId, toBookId }),
      }
    );
    if (!response.ok) {
      console.log(response.message);
      throw new Error(response.message);
    }
    fetchExchangeRequest()
  };

  const getCurrentUser = async () => {
    const response = await fetch(`${API_BASE_URL}/user/currentuser`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.log(response.message);
      throw new Error(response.message);
    }
    const data = await response.json();
    setUser(data);
  };
  const fetchExchangeRequest = async () => {
    const response = await fetch(`${API_BASE_URL}/exchange/exchange-requests`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log(response.message);
      throw new Error(response.message);
    }
    const data = await response.json();
    setExchanges(data);
  };
  return (
    <div className="container mx-auto">
      <div>
        <h1 className="text-2xl font-bold my-4">Potential Matches</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.length > 0 ? (
            matches.map((match) => (
              <div
                key={match._id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  {match.title}
                </h2>
                <p className="text-gray-600">Author: {match.author}</p>
                <p className="text-gray-600">Genre: {match.genre}</p>
                <button
                  onClick={() =>
                    handleExchangeRequest(match.listedBy, match._id)
                  }
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Initiate Exchange
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full">
              No matches found based on your book preferences.
            </p>
          )}
        </div>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-bold my-4">Exchange Request</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exchanges.length > 0
            ? exchanges.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <h2 className="text-xl font-bold mb-2 text-gray-800">
                    {item.toBook.title}
                  </h2>
                  <p className="text-gray-600">Author: {item.toBook.author}</p>
                  <p className="text-gray-600">Genre: {item.toBook.genre}</p>
                  <p className="text-gray-600">
                    By:{" "}
                    {item.fromUser.username == user.username ? (
                      <span>You</span>
                    ) : (
                      item.fromUser.username
                    )}
                  </p>
                  <p className="text-gray-600">
                    For:{" "}
                    {item.toUser.username == user.username ? (
                      <span>You</span>
                    ) : (
                      item.toUser.username
                    )}
                  </p>
                  <p className="text-gray-600">Status: {item.status}</p>
                </div>
              ))
            : null}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default PotentialMatches;
