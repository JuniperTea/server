import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  getFilteredDocuments,
  insertDocument,
  updateDocumentWithId,
} from "../../utilities/db-utils.js";
import { header } from "express-validator";
import { authenticate } from "../../utilities/middlewares.js";
import { ObjectId } from "mongodb";

const friendRouter = Router();

friendRouter.get("/friends", authenticate, async (req, res) => {
  let userId = req.headers.authorId;
  let items = await getFilteredDocuments("users", {
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

friendRouter.patch("/friends", authenticate, async (req, res) => {
  let userId = req.headers.authorId;
  let { friends } = req.body;
  updateDocumentWithId("users", userId, { friends }).then(x => {
    return res.json({
      success: x.acknowledged,
    });
  });
});

export default friendRouter;
