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

const booksRouter = Router();

booksRouter.post("/", (req, res) => {
  let post = {
    userId: req.headers.userID,
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
    currentlyReading: req.body.currentlyReading,
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

booksRouter.get("/:bookID", (req, res) => {
  let bookId = req.params.bookID;
  aggregateDocuments("library", [
    {
      $match: { _id: new ObjectId(bookId) },
    },
  ]).then(data => {
    res.json(data);
  });
});

booksRouter.patch("/:bookID", async (req, res) => {
  let userId = req.headers.userID;
  let currentlyReading = req.body.currentlyReading;
  let _id = new ObjectId(req.params.bookID);
  let x = await getFilteredDocuments("books", {
    _id,
    userId,
  });
  if (x && x.length > 0) {
    await updateDocumentWithId("books", _id, {
      currentlyReading: currentlyReading,
    }).then(
      res.json({
        success: true,
      })
    );
  }
});
export default booksRouter;
