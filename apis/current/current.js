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
currentRouter.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates = `{
      currentlyReading: req.body.currentlyReading,
    }`;

  updateDocumentWithId("library", _id, updates);

  // let collection = await db.collection("records");
  // let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

export default currentRouter;
