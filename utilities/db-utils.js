import { MongoClient, ObjectId } from "mongodb";

function getClient() {
  return new MongoClient(process.env.CONNECTION_STRING);
}

export function getAllDocuments(collectionName) {
  return getClient()
    .connect()
    .then(connection => {
      const db = connection.db(process.env.COLLECTION);
      return db.collection(collectionName).find().toArray();
    });
}

export function getFilteredDocuments(collectionName, query) {
  return getClient()
    .connect()
    .then(connection => {
      const db = connection.db(process.env.COLLECTION);
      return db.collection(collectionName).find(query).toArray();
    });
}

export function insertDocument(collectionName, document) {
  return getClient()
    .connect()
    .then(connection => {
      const db = connection.db(process.env.COLLECTION);
      return db
        .collection(collectionName)
        .insertOne(document)
        .then(x => {
          return db.collection(collectionName).find().toArray();
        });
    });
}

export function deleteDocument(collectionName, id) {
  return getClient()
    .connect()
    .then(connection => {
      const db = connection.db(process.env.COLLECTION);
      return db
        .collection(collectionName)
        .deleteOne({ _id: new ObjectId(id) })
        .then(x => {
          return db.collection(collectionName).find().toArray();
        });
    });
}

export function updateDocumentWithId(collectionName, id, newValues) {
  return getClient()
    .connect()
    .then(connection => {
      const db = connection.db(process.env.COLLECTION);
      return db
        .collection(collectionName)
        .updateOne({ _id: new ObjectId(id) }, { $set: newValues });
    });
}

export function aggregateDocuments(collectionName, pipeline) {
  return getClient()
    .connect()
    .then(connection => {
      const db = connection.db(process.env.COLLECTION);
      return db.collection(collectionName).aggregate(pipeline).toArray();
    });
}

export function getPagedDocuments(collectionName, page, itemsPerPage) {
  let skipCount = (page - 1) * itemsPerPage;
  return aggregateDocuments(collectionName, [
    {
      $skip: skipCount,
    },
    {
      $limit: Number(itemsPerPage),
    },
  ]);
}
