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
  let page = req.query.page;
  if (page) {
    let itemsPerPage = req.query.itemsPerPage ?? 10;
    getPagedDocuments("library", page, itemsPerPage).then(x => {
      aggregateDocuments("library", [{ $count: "count" }]).then(c => {
        let totalItems = c[0].count;

        let totalPages =
          Math.floor(totalItems / itemsPerPage) < totalItems / itemsPerPage
            ? Math.floor(totalItems / itemsPerPage) + 1
            : Math.floor(totalItems / itemsPerPage);

        res.json({
          page,
          itemsPerPage,
          totalPages,
          totalItems,
          data: x,
        });
      });
    });
  } else {
    // read all docs
    getAllDocuments("library").then(x => {
      res.json(x);
    });
  }
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

export default booksRouter;
