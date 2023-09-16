import { Router } from "express";
import {
  getFilteredDocuments,
  insertDocument,
  deleteDocument,
} from "../../utilities/db-utils.js";

const booksRouter = Router();

booksRouter.post("/", (req, res) => {
  let post = {
    userId: req.headers.userID,
    googleId: req.body._id,
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
    isbn: req.body.industryIdentifiers[0].identifier,
  };
  insertDocument("library", post)
    .then(x => {
      res.json({ status: true, message: "Book Created" });
    })
    .catch(err => {
      res.json({ status: false, message: err });
    });
});

booksRouter.get("/", (req, res) => {
  let userId = req.headers.userID;
  getFilteredDocuments("library", { userId }).then(ui => {
    if (ui.length > 0) {
      res.json(ui);
    }
  });
});

//this deletes the current reading document via the main ID of the record
booksRouter.delete("/:id", (req, res) => {
  let id = req.params.id;
  deleteDocument("library", { id }).then(x => {
    res.send(x);
  });
});

export default booksRouter;
