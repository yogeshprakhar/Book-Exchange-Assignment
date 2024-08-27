import express from "express"
import mongoose from "mongoose";
import "dotenv/config.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import UserRoute from "./routes/userRoute.js"
import BookRoute from "./routes/bookRoute.js"
import ExchangeRoute from "./routes/exchangeRoute.js"

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("connected to database"))
  .catch((e) => console.log("Error occured", e));

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use((req, res, next) => {
  req.userId = '';  // Initialize userId on the request object
  next();
});

app.use("/user",UserRoute)
app.use("/book",BookRoute)
app.use("/exchange",ExchangeRoute)

app.listen(8000,()=>{
    console.log("server started at localhost 8000")
})