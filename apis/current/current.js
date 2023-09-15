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

const currentRouter = Router();

// This section will help you update a record by id.
currentRouter.patch("/:bookID", async (req, res) => {
  const _id = req.params.bookID;
  let currentlyReading = req.body.currentlyReading;
  const updates = {
    currentlyReading,
  };

  let result = await updateDocumentWithId("library", _id, updates);

  res.send(result).status(200);
});

currentRouter.get("/", async (req, res) => {
  let userId = req.headers.userID;
  let currentlyReading = true;
  await getFilteredDocuments("library", { userId, currentlyReading })
    .then(reading => {
      if (reading.length > 0) {
        res.json(reading);
      }
    })
    .catch(err => {
      console.log(e);
    });
});
export default currentRouter;
