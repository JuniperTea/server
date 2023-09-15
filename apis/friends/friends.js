import { Router } from "express";
import {
  getFilteredDocuments,
  insertDocument,
  deleteDocument,
} from "../../utilities/db-utils.js";
import { ObjectId } from "mongodb";

const friendRouter = Router();

//this gets all the friends of the current user logged in.
friendRouter.get("/", async (req, res) => {
  let userId = req.headers.userID;
  await getFilteredDocuments("friends", { userId })
    .then(friends => {
      if (friends.length > 0) {
        res.send(friends);
      }
    })
    .catch(err => {
      res.json({ status: false, message: err });
    });
});

//this posts the friends chosen from the popup
friendRouter.post("/", async (req, res) => {
  let userId = req.headers.userID;
  let post = {
    userId: userId,
    friendID: req.body.friendID,
    friendName: req.body.friendName,
  };
  await insertDocument("friends", post)
    .then(x => {
      res.json({ status: true, message: "Friend Created" });
    })
    .catch(err => {
      res.json({ status: false, message: err });
    });
});

//this deletes the friend via the main ID of the record
friendRouter.delete("/:id", (req, res) => {
  let id = req.params.id;
  deleteDocument("friends", id).then(x => {
    res.send(x);
  });
});

export default friendRouter;
