import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  listedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], // Books owned by the user
  wantedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], // Books the user wants
  exchangeRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExchangeRequest' }], // Exchange requests associated with the user
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
