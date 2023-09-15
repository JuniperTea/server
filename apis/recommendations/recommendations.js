import { Router } from "express";
import {
  getFilteredDocuments,
  insertDocument,
  deleteDocument,
} from "../../utilities/db-utils.js";

const recommendationsRouter = Router();

recommendationsRouter.post("/", (req, res) => {
  let userId = req.headers.userID;
  let bookID = req.body._id;
  let post = {
    userId,
    bookID,
  };

  let items = getFilteredDocuments("recommendations", { userId, bookID });
  if (items.length > 0) {
    deleteDocument("recommendations", { userId, bookID });
  }

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
  let theArray = [];
  console.log("in rec router");
  let userId = req.headers.userID;
  let newArray = [];
  let getFriends = await getFilteredDocuments("friends", { userId });
  if (getFriends.length > 0) {
    getFriends.forEach(x => {
      let userId = x.friendID;
      console.log(userId);
      getFilteredDocuments("recommendations", { userId }).then(x => {
        if (x.length > 0) {
          console.log("inside x.length");
          console.log(x[0]);
          x.map(y => {
            newArray.push(y);
          });
          console.log("newArray");
          console.log(newArray);
        }
      });
    });
  }

  if (newArray.length > 0) {
    return res.json(newArray);
  } else {
    return res.json({
      success: false,
    });
  }
});

export default recommendationsRouter;
