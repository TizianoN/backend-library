const connection = require("../database/conn");
const { handleFailedQuery, handleResourceNotFound } = require("../utils/database");

function index(req, res) {
  const booksSQL = `
    SELECT 
        books.*,
        AVG(reviews.vote) avg_vote

    FROM 
        library.books

    INNER JOIN reviews
    ON books.id = reviews.book_id

    GROUP BY books.id`;

  connection.query(booksSQL, (err, bookResult) => {
    if (err) return handleFailedQuery(err, res);

    const books = bookResult.map((book) => {
      return {
        ...book,
        avg_vote: parseInt(book.avg_vote),
        image: buildBookImgPath(book.image),
      };
    });

    res.json({ result: books });
  });
}

function show(req, res) {
  const { id } = req.params;

  const booksSQL = `SELECT * FROM books WHERE id = ?`;
  connection.query(booksSQL, [id], (err, bookResult) => {
    if (err) return handleFailedQuery(err, res);
    const [book] = bookResult;
    if (!book) return handleResourceNotFound(res);

    const reviewSQL = `SELECT * FROM reviews WHERE book_id = ?`;
    connection.query(reviewSQL, [id], (err, reviewsResult) => {
      if (err) return handleFailedQuery(err, res);
      book.reviews = reviewsResult;
      book.image = buildBookImgPath(book.image);

      res.json({ result: book });
    });
  });
}

// function store(req, res) {
//   res.json({ message: "WIP" });
// }

// function update(req, res) {
//   res.json({ message: "WIP" });
// }

// function modify(req, res) {
//   res.json({ message: "WIP" });
// }

// function destroy(req, res) {
//   res.json({ message: "WIP" });
// }

module.exports = {
  index,
  show,
  //   store,
  //   update,
  //   modify,
  //   destroy,
};

function buildBookImgPath(image) {
  return `${process.env.APP_URL}:${process.env.APP_PORT}/img/books/${image}`;
}
