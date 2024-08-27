import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const BookListing = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);
  const [newBook, setNewBook] = useState({ title: "", author: "", genre: "" });

  // Fetching Books
  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(`${API_BASE_URL}/user/books`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 401) {
        navigate("/signin");
      }
      if (!response.ok) {
        throw new Error(response.message);
      }
      const data = await response.json();
      setBooks(data);
      console.log(books);
    };
    fetchBooks();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  // Add book
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit is called");
    const response = await fetch(`${API_BASE_URL}/book`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      console.log(response.message);
      throw new Error(response.message);
    }
    const data = await response.json();
    setBooks(data);
    setNewBook({ title: "", author: "", genre: "" });
  };

  // Update Book
  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("handleSubmit is called");
    const response = await fetch(`${API_BASE_URL}/book/${editingBookId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      console.log(response.message);
      throw new Error(response.message);
    }
    const data = await response.json();
    setBooks(data);
    setNewBook({ title: "", author: "", genre: "" });
    setEditingBookId(null);
  };

  // Remove book
  const handleRemove = async (e, bookId) => {
    e.preventDefault();
    console.log("handleSubmit is called");
    const response = await fetch(`${API_BASE_URL}/book/${bookId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      console.log(response.message);
      throw new Error(response.message);
    }
    const data = await response.json();
    setBooks(data);
  };

  // Edit book
  const handleEdit = (book) => {
    setEditingBookId(book._id);
    setNewBook({ title: book.title, author: book.author, genre: book.genre });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        List Your Books
      </h1>

      <form className="bg-white p-4 rounded-lg shadow-md max-w-lg mx-auto mb-8">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newBook.title}
            onChange={handleInputChange}
            required
            className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="author"
            className="block text-gray-700 font-bold mb-2"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={newBook.author}
            onChange={handleInputChange}
            required
            className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="genre" className="block text-gray-700 font-bold mb-2">
            Genre
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={newBook.genre}
            onChange={handleInputChange}
            required
            className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {editingBookId ? (
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Update Book
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add Book
          </button>
        )}
      </form>
      <div className="border bg-pink-200 rounded-xl mt-5 mb-5">
        <h1 className="text-3xl font-bold p-5 text-gray-800">Your Books</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              {book.title}
            </h2>
            <p className="text-gray-600">Author: {book.author}</p>
            <p className="text-gray-600">Genre: {book.genre}</p>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEdit(book)}
                className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={(e) => handleRemove(e, book._id)}
                className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookListing;
