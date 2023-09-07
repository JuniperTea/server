import express from "express";
import cors from "cors";
import dotEnv from "dotenv";
import mongo from "mongodb";
import usersRouter from "./apis/users/users.js";
import booksRouter from "./apis/books/books.js";
import friendRouter from "./apis/friends/friends.js";
import { authenticate } from "./utilities/middlewares.js";
dotEnv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/login", usersRouter); //ladning = source page
// app.use("/notes", authenticate, notesRouter);
//app.use("/add-books", authenticate, booksRouter);
app.use("/books", authenticate, booksRouter);
// app.use("/posts", authenticate, postsRoutes);
// app.use("/comments", authenticate, commentsRouter);
// app.use("/likes", authenticate, likesRouter);
app.use("/friends", authenticate, friendRouter);
app.use("/profile", authenticate, usersRouter);

app.listen(process.env.PORT, () => {
  console.log("Server started...");
});
