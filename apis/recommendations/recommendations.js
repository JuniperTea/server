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

const recommendationsRouter = Router();

recommendationsRouter.post("/", (req, res) => {
  let post = {
    userId: req.headers.authorId,
    bookID: req.body.id,
  };
  insertDocument("recommendations", post)
    .then(x => {
      res.json({ status: true, message: "Recommendation Created" });
    })
    .catch(err => {
      res.json({ status: false, message: err });
    });
});

//get all the reccomendations for a book made by friends WIP
recommendationsRouter.get("/", async (req, res) => {
  let userId = req.headers.authorId;
  let items = await getFilteredDocuments("recommendations", {
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
// let userId = req.headers.authorId;
// aggregateDocuments("recommendations", [
//   {
//     $match: { _id: new ObjectId(userId) },
//   },
// ]).then(data => {
//   res.json(data);
// });
// });

export default recommendationsRouter;
