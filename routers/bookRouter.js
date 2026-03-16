const express = require("express");
const connection = require("../database/conn");
const { handleFailedQuery } = require("../utils/database");
const router = express.Router();

router.get("/", (req, res) => {
  const booksSQL = "SELECT * FROM `books`";
  connection.query(booksSQL, (err, result) => {
    if (err) return handleFailedQuery(err, res);
    res.json({ result });
  });
});

module.exports = router;
