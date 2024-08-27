import jwt from "jsonwebtoken";
import User from "../models/user.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies["auth_token"];
    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error while jwtCheck", error);
  }
};

export default verifyJWT;
