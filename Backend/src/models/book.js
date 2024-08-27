import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the user who listed the book
  createdAt: { type: Date, default: Date.now },
});

const Book = mongoose.model("Book", bookSchema);
export default Book;