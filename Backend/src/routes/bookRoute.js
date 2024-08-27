import express from "express";
import User from "../models/user.js";
import verifyJWT from "../middlewares/jwtCheck.js";
import Book from "../models/book.js";

const router = express.Router();

router.post("/", verifyJWT, async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "Please login again" });
    }
    // Validate the input
    const { title, author, genre } = req.body;
    if (!title || !author || !genre) {
      return res.status(401).json({ message: "All fields are required" });
    }
    // Check if the user already has a book with the same title and author
    const existingBook = user.listedBooks.find(
      (book) => book.title === title && book.author === author
    );

    if (existingBook) {
      return res
        .status(409)
        .json({ message: "You already have this book listed" });
    }
    const newBook = new Book({
      title,
      author,
      genre,
      listedBy: req.userId,
    });
    const savedBook = await newBook.save();
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $push: { listedBooks: savedBook._id } }, // Add the book's ID to the user's listedBooks
      { new: true }
    ).populate("listedBooks"); // Optionally populate the user's listedBooks

    // Send a success response
    res.status(201).json(updatedUser.listedBooks);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error while Creating new Book" });
  }
});

router.get("/allBooks", verifyJWT, async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "Please login again" });
    }
    const books = await Book.find().limit(30);
    console.log(books);
    res.status(200).json(books);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error while fetchings books Book" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { title, author, genre } = req.query;
    
    // Build the query object dynamically based on provided search criteria
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" }; // Case-insensitive regex search
    }

    if (author) {
      query.author = { $regex: author, $options: "i" }; // Case-insensitive regex search
    }

    if (genre) {
      query.genre = { $regex: genre, $options: "i" }; // Case-insensitive regex search
    }

    // Execute the query
    const books = await Book.find(query);

    // Send the search results
    res.status(200).json(books);
  } catch (error) {
    console.error("Error searching for books:", error);
    res.status(500).json({ message: "Error searching for books" });
  }
});

router.put("/:editingBookId", verifyJWT, async (req, res) => {
  try {
    // Find the book by ID and update it with the data from req.body
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.editingBookId,
      req.body,
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    // If the book is not found, return a 404 error
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Find the user by ID and populate the listedBooks field
    const user = await User.findById(req.userId).populate("listedBooks");

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated list of books
    res.status(200).json(user.listedBooks);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error while fetchings books Book" });
  }
});

router.delete("/:bookId", verifyJWT, async (req, res) => {
  try {
    const { bookId } = req.params;
    console.log("value in params", bookId);

    // Find the book by ID
    const book = await Book.findById(bookId);

    // Check if the book exists
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete the book
    await book.deleteOne();

    // Remove the book from the user's listedBooks array
    const updatedUser = await User.findByIdAndUpdate(req.userId, {
      $pull: { listedBooks: bookId },
    }).populate("listedBooks");

    // Return success response
    res.status(200).json(updatedUser.listedBooks);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error while fetchings books Book" });
  }
});

export default router;
