import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  getFilteredDocuments,
  insertDocument,
  updateDocumentWithId,
} from "../../utilities/db-utils.js";
import { header } from "express-validator";
import { authenticate } from "../../utilities/middlewares.js";
import { ObjectId } from "mongodb";

const usersRouter = Router();
console.log("inside userrouter");

usersRouter.get(
  "/",
  header("username").notEmpty(),
  header("password").notEmpty(),
  async (req, res) => {
    let username = req.headers.username;
    let password = req.headers.password;
    console.log("inside get");
    getFilteredDocuments("users", { username, password }).then(users => {
      console.log("tests", { username, password, users });
      if (users.length > 0) {
        let token = jwt.sign(
          {
            username,
            _id: users[0]._id,
          },
          process.env.SECRET_KEY,
          { expiresIn: process.env.TOKEN_EXPIRES }
        );

        console.log(token);
        res.json({
          status: true,
          token,
        });
      } else {
        res.json({
          status: false,
          token: "",
        });
      }
    });
  }
);

//On the landing screen, this is the signup component api
// usersRouter.post("/signup", (req, res) => {  //old code - to be removed when working
usersRouter.post("/", (req, res) => {
  let { username, password } = req.body;

  insertDocument("users", { username, password }).then(x => {
    res.send({
      success: true,
    });
  });
});

usersRouter.get("/profile", authenticate, async (req, res) => {
  let userId = req.headers.authorId;
  let items = await getFilteredDocuments("users", {
    _id: new ObjectId(userId),
  });
  if (items.length > 0) {
    return res.json(items[0]);
  } else {
    return res.json({
      success: false,
    });
  }
});

usersRouter.patch("/profile", authenticate, async (req, res) => {
  let userId = req.headers.authorId;
  let { username, password } = req.body;
  updateDocumentWithId("users", userId, { username, password }).then(x => {
    return res.json({
      success: x.acknowledged,
    });
  });
});

export default usersRouter;
