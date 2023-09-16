import { Router } from "express";
import {
  getFilteredDocuments,
  insertDocument,
  deleteDocument,
  aggregateDocuments,
} from "../../utilities/db-utils.js";

const recommendationsRouter = Router();

recommendationsRouter.post("/", (req, res) => {
  let userId = req.headers.userID;
  let bookId = req.body._id;
  let title = req.body.title;
  let description = req.body.description;
  let authors = req.body.authors;
  let smallThumbnail = req.body.smallThumbnail;
  let post = {
    userId,
    bookId,
    title,
    description,
    authors,
    smallThumbnail,
  };

  //first we delete the past recommendations for this book by user
  let items = getFilteredDocuments("recommendations", { bookId });
  if (items.length > 0) {
    deleteDocument("recommendations", { bookId });
  }
  //re-insert recommendation
  insertDocument("recommendations", post)
    .then(x => {
      res.json({ status: true, message: "Recommendation Created" });
    })
    .catch(err => {
      res.json({ status: false, message: err });
    });
});

//get all the reccomendations for a book made by friends
recommendationsRouter.get("/", async (req, res) => {
  let userId = req.headers.userID;

  let r = await aggregateDocuments(
    "friends",

    [
      { $match: { userId: userId } },
      {
        $lookup: {
          from: "recommendations",
          localField: "friendID",
          foreignField: "userId",
          as: "recs",
        },
      },
      { $match: { recs: { $exists: true } } },
    ]
  );

  return res.json(r);
});

export default recommendationsRouter;
