const connection = require("../database/conn");
const { handleFailedQuery } = require("../utils/database");

function index(req, res) {
  const booksSQL = "SELECT * FROM `books`";
  connection.query(booksSQL, (err, result) => {
    if (err) return handleFailedQuery(err, res);
    res.json({ result });
  });
}

function show(req, res) {
  res.json({ message: "WIP" });
}

function store(req, res) {
  res.json({ message: "WIP" });
}

function update(req, res) {
  res.json({ message: "WIP" });
}

function modify(req, res) {
  res.json({ message: "WIP" });
}

function destroy(req, res) {
  res.json({ message: "WIP" });
}

module.exports = {
  index,
  show,
  store,
  update,
  modify,
  destroy,
};
