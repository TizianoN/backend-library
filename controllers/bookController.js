const connection = require("../database/conn");
const { handleFailedQuery, handleResourceNotFound } = require("../utils/database");

function index(req, res) {
  const booksSQL = `
    SELECT 
      books.id,
      books.title,
      books.author,
      books.abstract,
      books.image,
      AVG(reviews.vote) average_vote

    FROM 
        books

    LEFT JOIN reviews
    ON books.id = reviews.book_id

    GROUP BY books.id`;

  connection.query(booksSQL, (err, bookResult) => {
    if (err) return handleFailedQuery(err, res);

    const books = bookResult.map((book) => {
      return {
        ...book,
        average_vote: parseInt(book.average_vote),
        image: buildBookImgPath(book.image),
      };
    });

    res.json({ result: books });
  });
}

function show(req, res) {
  const { id } = req.params;

  const booksSQL = `
    SELECT books.*
    FROM  library.books
    WHERE id = ?`;

  connection.query(booksSQL, [id], (err, bookResult) => {
    if (err) return handleFailedQuery(err, res);
    const [book] = bookResult;
    if (!book) return handleResourceNotFound(res);

    const reviewSQL = `
      SELECT * 
      FROM reviews 
      WHERE book_id = ? 
      ORDER BY created_at DESC
    `;
    connection.query(reviewSQL, [id], (err, reviewsResult) => {
      if (err) return handleFailedQuery(err, res);
      book.reviews = reviewsResult;
      book.image = buildBookImgPath(book.image);

      res.json({ result: book });
    });
  });
}

function store(req, res) {
  const { filename } = req.file;
  const { title, author, abstract } = req.body;

  const storeBookSQL = `INSERT INTO library.books 
  (title, author, abstract, image) 
  VALUES (?, ?, ?, ?);`;

  connection.query(storeBookSQL, [title, author, abstract, filename], (err, result) => {
    const { insertId } = result;
    res.status(201).json({ insertId });
  });
}

function storeReview(req, res) {
  const { id } = req.params;
  const { name, vote, text } = req.body;

  console.log(id, name, vote, text);

  const storeReviewSQL = `
  INSERT INTO library.reviews
  (book_id, name, vote, text) VALUES
  (?, ?, ?, ?);
  `;

  connection.query(storeReviewSQL, [id, name, vote, text], (err, result) => {
    const { insertId } = result;
    res.status(201).json({ insertId });

    // const showReviewSQL = `SELECT * from reviews WHERE id = ?`;
    // connection.query(showReviewSQL, [result.insertId], (err, result) => {
    //   const [review] = result;
    //   res.json(review);
    // });
  });
}

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
  store,
  storeReview,
  //   update,
  //   modify,
  //   destroy,
};

function buildBookImgPath(image) {
  return `${process.env.APP_URL}:${process.env.APP_PORT}/img/books/${image}`;
}
