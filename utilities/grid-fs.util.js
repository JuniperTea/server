import { GridFsStorage } from "multer-gridfs-storage";
import crypto from "crypto";
import path from "path";
import multer from "multer";
import mongoose from "mongoose";

const mongoURI = process.env.CONNECTION_STRING;
const promise = mongoose.connect(mongoURI, { useNewUrlParser: true });
const conn = mongoose.connection;

let gfs;

conn.once("open", () => {
  gfs = Grid(conn, mongoose.mongo);
  gfs.collection("uploads");
});

export const storage = new GridFsStorage({
  url: process.env.CONNECTION_STRING + "/" + process.env.COLLECTION,
  db: promise,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

export const upload = multer({ storage });
