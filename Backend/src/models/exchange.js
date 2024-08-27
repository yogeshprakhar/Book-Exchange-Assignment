import mongoose, { Schema } from "mongoose";

const exchangeRequestSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // The user initiating the request
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The user receiving the request
  // fromBook: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Book",
  //   required: true,
  // }, // The book offered for exchange
  toBook: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, // The book requested in exchange
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const ExchangeRequest = mongoose.model(
  "ExchangeRequest",
  exchangeRequestSchema
);
export default ExchangeRequest;
