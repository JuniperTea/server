import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  getFilteredDocuments,
  insertDocument,
} from "../../utilities/db-utils.js";
import { header } from "express-validator";

const usersRouter = Router();

//On the landing screen, this is the login component api
//which validates the login with a token
usersRouter.get(
  "/",
  header("username").notEmpty(),
  header("password").notEmpty(),
  async (req, res) => {
    let username = req.headers.username;
    let password = req.headers.password;
    getFilteredDocuments("users", { username, password }).then(users => {
      if (users.length > 0) {
        let token = jwt.sign(
          {
            username,
            _id: users[0]._id,
          },
          process.env.SECRET_KEY,
          { expiresIn: process.env.TOKEN_EXPIRES }
        );
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
usersRouter.post("/", (req, res) => {
  let { username, password } = req.body;
  insertDocument("users", { username, password }).then(x => {
    res.send({
      success: true,
    });
  });
});

export default usersRouter;
