import { Router } from "express";
import {
  getFilteredDocuments,
  insertDocument,
  updateDocumentWithId,
} from "../../utilities/db-utils.js";
import { ObjectId } from "mongodb";

const friendRouter = Router();

friendRouter.get("/", async (req, res) => {
  let userId = req.headers.userID;
  let items = await getFilteredDocuments("friends", {
    userId: new ObjectId(userId),
  });
  if (items.length > 0) {
    return res.json(items[0]);
  } else {
    return res.json({
      success: false,
    });
  }
});

friendRouter.post("/", (req, res) => {
  let userId = req.headers.userID;
  let post = {
    userId: userId,
    friendID: req.body.friendID,
    friendName: req.body.friendName,
  };
  insertDocument("friends", post)
    .then(x => {
      res.json({ status: true, message: "Friend Created" });
    })
    .catch(err => {
      res.json({ status: false, message: err });
    });
});

friendRouter.delete("/:id", (req, res) => {
  let id = req.params.id;
  deleteDocument("friends", id).then(x => {
    res.send(x);
  });
});

export default friendRouter;
