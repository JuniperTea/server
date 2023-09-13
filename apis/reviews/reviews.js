import { Router } from "express";
import {
  getAllDocuments,
  getFilteredDocuments,
  insertDocument,
  aggregateDocuments,
  getPagedDocuments,
  updateDocumentWithId,
} from "../../utilities/db-utils.js";
import { ObjectId } from "mongodb";

const reviewsRouter = Router();

//post a review for a book
reviewsRouter.post("/", (req, res) => {
  let post = {
    userId: req.headers.userID,
    bookID: req.body.id,
  };
  insertDocument("reviews", post)
    .then(x => {
      res.json({ status: true, message: "Review Created" });
    })
    .catch(err => {
      res.json({ status: false, message: err });
    });
});

//get all the reviews for a book  WIP
reviewsRouter.get("/:bookID", async (req, res) => {
  let userId = req.headers.userID;
  let items = await getFilteredDocuments("reviews", {
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
export default reviewsRouter;
