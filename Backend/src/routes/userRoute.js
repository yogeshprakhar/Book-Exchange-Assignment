import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import verifyJWT from "../middlewares/jwtCheck.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    // console.log("request is coming",email, password, name)
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Fill all Entries" });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }
    
    user = new User(req.body);
    console.log(user)
    await user.save();

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);
    console.log("making the token");
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.log("Error while signup", error);
    res.status(500).send({ message: "something went wrong while Sign up" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      console.log("Fill All Entries");
      return res.status(400).json({ message: "Fill all Entries" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.log("Error while signin", error);
    res.status(500).json({ message: "error while login user" });
  }
});

router.post("/logout", async (req, res) => {
  res.cookie("auth_token", "");
  res.send();
});

router.get("/currentuser", verifyJWT, async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error while fetching current user" });
  }
});

router.get("/books", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("listedBooks");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.listedBooks);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error while fetchings books Book" });
  }
});

export default router;
