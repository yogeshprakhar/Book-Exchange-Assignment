import express from "express";
import mongoose from "mongoose";
import "dotenv/config.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRoute from "./routes/userRoute.js";
import BookRoute from "./routes/bookRoute.js";
import ExchangeRoute from "./routes/exchangeRoute.js";
import path from "path";
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("connected to database"))
  .catch((e) => console.log("Error occured", e));

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-exchange-assignment.vercel.app",
      "https://assignement-frontend.netlify.app/",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  req.userId = ""; // Initialize userId on the request object
  next();
});
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/user", UserRoute);
app.use("/book", BookRoute);
app.use("/exchange", ExchangeRoute);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(8000, () => {
  console.log("server started at localhost 8000");
});
