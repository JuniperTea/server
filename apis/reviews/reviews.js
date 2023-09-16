import { Router } from "express";
import {
  insertDocument,
  aggregateDocuments,
} from "../../utilities/db-utils.js";
import { ObjectId } from "mongodb";

const reviewsRouter = Router();

//post a review for a book
reviewsRouter.post("/", (req, res) => {
  let post = {
    userId: req.headers.userID,
    bookId: req.body._id,
    review: req.body.review,
    title: req.body.title,
    smallThumbnail: req.body.smallThumbnail,
    pageCount: req.body.pageCount,
    dateOfReview: new Date().toLocaleString() + "",
  };
  insertDocument("reviews", post)
    .then(x => {
      res.json({ status: true, message: "Review Created" });
    })
    .catch(err => {
      res.json({ status: false, message: err });
    });
});

//get all the reviews for a book
reviewsRouter.get("/", async (req, res) => {
  let userId2 = req.headers.userID;
  let r = await aggregateDocuments("library", [
    { $match: { userId: userId2 } },
    {
      $project: {
        bookId: { $toString: "$_id" },
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "bookId",
        foreignField: "bookId",
        as: "revs",
      },
    },
    { $unwind: "$revs" },
    { $replaceRoot: { newRoot: "$revs" } },
  ]);
  if (r.length > 0) {
    return res.json(r);
  } else {
    console.log(e);
  }
});

export default reviewsRouter;
