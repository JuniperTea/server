import { Router } from "express";
import { getAllDocuments } from "../../utilities/db-utils.js";

const usersListRouter = Router();

//strictly for listing the users in the database
usersListRouter.get("/", (req, res) => {
  getAllDocuments("users").then(x => {
    res.send(x);
  });
});

export default usersListRouter;
