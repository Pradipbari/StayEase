// const mongo = require("mongodb");

// const MongoClient = mongo.MongoClient;

// const MONGO_URL =
//   "mongodb+srv://baripradip1:2h3taA3FyFmtBtCN@cluster0.hk3h57v.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster0";

// let _db;

// const mongoconnect = (callback) => {
//   MongoClient.connect(MONGO_URL)
//     .then((client) => {
//       _db = client.db("airbnb");
//       callback();
//     })
//     .catch((err) => {
//       console.log("Error while connecting to Mongo :", err);
//     });
// };

// const getDB = () => {
//   if (!_db) {
//     throw new Error("Mongo Not connected");
//   }
//   return _db;
// };

// module.exports = {
//   mongoconnect,
//   getDB,
// };
