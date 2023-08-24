import { Router } from "express";
import {
  getAllDocuments,
  getFilteredDocuments,
  insertDocument,
  aggregateDocuments,
  getPagedDocuments,
} from "../../utilities/db-utils.js";
import { ObjectId } from "mongodb";

const booksRouter = Router();

booksRouter.post("/", (req, res) => {
  // let authorId = req.headers.authorId
  let { content } = req.body; // { content:"Heyy", authorId:"12jkjdksl3kedjkljsfk" }
  let post = {
    author: req.body.author,
    coverArt: req.body.coverArt,
    description: req.body.description,
    format: req.body.format,
    genre: req.body.genre,
    isbn: req.body.isbn,
    pages: req.body.pages,
    publisher: req.body.publisher,
    publishedDate: req.body.publishedDate,
    title: req.body.title,
    series: req.body.series,
    bookNumber: req.body.bookNumber,
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
  console.log("we are in the booksrouter get api");
  let page = req.query.page;
  console.log("booksrouter get" + page);
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
  console.log("inside bookrouter getid");
  aggregateDocuments("library", [
    {
      $match: { _id: new ObjectId(bookId) },
    },
    // {
    //   $lookup: {
    //     from: "library",
    //     localField: "_id",
    //   },
    // },
    // {
    //   $project: { authorsThatMatched: false, "author.password": false },
    // },
  ]).then(data => {
    res.json(data);
  });
});

export default booksRouter;
