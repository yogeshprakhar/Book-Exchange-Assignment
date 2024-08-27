import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const BrowseBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [filterBooks, setFilterBooks] = useState([])
  
  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(`${API_BASE_URL}/book/allBooks`, {
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
    };
    fetchBooks();
  }, []);

  // Handle the filtering logic
  const filteredBooks = books.filter((book) => {
    return (
      (selectedGenre === "" || book.genre === selectedGenre) &&
      (selectedAuthor === "" || book.author === selectedAuthor) &&
      (searchTerm === "" ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Get unique genres and authors for filter options
  const genres = [...new Set(books.map((book) => book.genre))];
  const authors = [...new Set(books.map((book) => book.author))];

  const handleClick = async(e) =>{
    e.preventDefault()
    const response = await fetch(`${API_BASE_URL}/book/allBooks`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(response.message);
    }
    const data = await response.json();
    setFilterBooks(data)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Browse Books
      </h1>

      <div className="mb-6 flex justify-center gap-4">
        {/* Search by name */}
        <input
          type="text"
          placeholder="Search by title"
          className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filter by genre */}
        <select
          className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        {/* Filter by author */}
        <select
          className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
        >
          <option value="">All Authors</option>
          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
        <button
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
            onClick={(e) => handleClick(e)}
          >
            Search
          </button>
      </div>

      {/* Display filtered books */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div key={book._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              {book.title}
            </h2>
            <p className="text-gray-600">Author: {book.author}</p>
            <p className="text-gray-600">Genre: {book.genre}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseBooks;
