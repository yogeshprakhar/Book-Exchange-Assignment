import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import verifyJWT from "../middlewares/jwtCheck.js";
import ExchangeRequest from "../models/exchange.js";
import Book from "../models/book.js";

const router = express.Router();

router.get("/potential-matches", verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    const matches = await findPotentialMatches(userId);
    res.status(200).json(matches);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error finding potential matches" });
  }
});

router.post("/send-exchange-request", verifyJWT, async (req, res) => {
  try {
    const { toUserId, toBookId } = req.body;

    const exchangeRequest = new ExchangeRequest({
      fromUser: req.userId,
      toUser: toUserId,
      toBook: toBookId,
    });

    const savedRequest = await exchangeRequest.save();

    // Add this request to both users
    await User.findByIdAndUpdate(req.userId, {
      $push: { exchangeRequests: savedRequest._id },
    });
    await User.findByIdAndUpdate(toUserId, {
      $push: { exchangeRequests: savedRequest._id },
    });

    res.status(201).json({
      message: "Exchange request sent successfully",
      exchangeRequest: savedRequest,
    });
  } catch (error) {
    console.error("Error sending exchange request:", error);
    res.status(500).json({ message: "Error sending exchange request" });
  }
});

router.get("/exchange-requests", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "exchangeRequests",
      populate: { path: "fromUser toUser toBook" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.exchangeRequests);
  } catch (error) {
    console.error("Error fetching exchange requests:", error);
    res.status(500).json({ message: "Error fetching exchange requests" });
  }
});

export default router;

const findPotentialMatches = async (userId) => {
  try {
    // Find the current user and populate their listedBooks and wantedBooks
    const user = await User.findById(userId).populate("listedBooks");

    if (!user) {
      throw new Error("User not found");
    }

    let genres = [];
    if (user.listedBooks.length > 0) {
      genres = user.listedBooks.map((item) => item.genre);
    }

    const potentialMatches = await Book.find({
      genre: { $in: genres },
      listedBy: { $ne: userId },
    });
    return potentialMatches;
  } catch (error) {
    console.error("Error finding potential matches:", error);
    throw error;
  }
};
