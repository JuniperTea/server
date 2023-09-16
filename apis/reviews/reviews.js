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
  let userId = req.headers.userID;

  let r = await aggregateDocuments("library", [
    { $match: { userId: userId } },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "bookID",
        as: "revs",
      },
    },
    {
      $addFields: {
        review: "$revs.review",
        dateofReview: "$revs.dateofReview",
      },
    },
    // {
    //   $project: {
    //     revs: 0,
    //   },
    // },
  ]);

  return res.json(r);
});
export default reviewsRouter;
