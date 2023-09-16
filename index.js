import express from "express";
import cors from "cors";
import dotEnv from "dotenv";
import usersRouter from "./apis/users/users.js";
import booksRouter from "./apis/books/books.js";
import friendRouter from "./apis/friends/friends.js";
import currentRouter from "./apis/current/current.js";
import recommendationsRouter from "./apis/recommendations/recommendations.js";
import reviewsRouter from "./apis/reviews/reviews.js";
import usersListRouter from "./apis/users/usersList.js";
import { authenticate } from "./utilities/middlewares.js";
dotEnv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/login", usersRouter); //ladning = source page
app.use("/users", authenticate, usersListRouter);
app.use("/books", authenticate, booksRouter);
app.use("/friends", authenticate, friendRouter);
app.use("/current", authenticate, currentRouter);
app.use("/recommendations", authenticate, recommendationsRouter);
app.use("/reviews", authenticate, reviewsRouter);

app.listen(process.env.PORT, () => {
  console.log("Server started...");
});
