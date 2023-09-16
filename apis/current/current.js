import { Router } from "express";
import {
  getFilteredDocuments,
  insertDocument,
  deleteDocument,
} from "../../utilities/db-utils.js";
import { ObjectId } from "mongodb";

const currentRouter = Router();

currentRouter.get("/", (req, res) => {
  let userId = req.headers.userID;
  getFilteredDocuments("current", { userId })
    .then(reading => {
      res.json(reading);
    })
    .catch(err => {
      console.log(err);
    });
});

currentRouter.post("/", (req, res) => {
  let userId = req.headers.userID;
  let _id = req.body._id;
  let post = {
    userId: userId,
    bookID: req.body._id,
    title: req.body.title,
    description: req.body.description,
    authors: req.body.authors,
    categories: req.body.categories,
    language: req.body.language,
    pageCount: req.body.pageCount,
    printType: req.body.printType,
    publisher: req.body.publisher,
    publishedDate: req.body.publishedDate,
    maturityRating: req.body.maturityRating,
    smallThumbnail: req.body.smallThumbnail,
    id: req.body.id,
    // isbn: req.body.industryIdentifiers[0]?.identifier,
  };

  let items = getFilteredDocuments("current", { userId, _id });
  if (items.length > 0) {
    deleteDocument("current", { userId, _id });
  }
  insertDocument("current", post)
    .then(x => {
      res.json({ status: true, message: "Book Created" });
    })
    .catch(err => {
      res.json({ status: false, message: err });
    });
});

//this deletes the current reading document via the main ID of the record
currentRouter.delete("/:id", (req, res) => {
  let id = req.params.id;
  deleteDocument("current", { id }).then(x => {
    res.send(x);
  });
});
export default currentRouter;
