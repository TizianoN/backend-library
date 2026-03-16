const express = require("express");
const app = express();

// # MIDDLEWARES
const logger = require("./middlewares/logger");

app.use(logger);
app.use(express.static("public"));
app.use(express.json());

// # TEST ROUTE

const connection = require("./database/conn");
app.get("/", (req, res) => {
  const booksSQL = "SELECT * FROM `books`";
  connection.query(booksSQL, (err, result) => {
    if (err) {
      const responseData = {
        message: "Database query failed",
      };

      if (process.env.APP_MODE === "dev") {
        responseData.error = err.message;
      }

      console.log(err.message);
      return res.status(500).json(responseData);
    }

    console.log(result);
    res.send("Hello world");
  });
});

app.get("/test-error", (req, res) => {
  a.b;
  res.send("Hello world");
});

// # ERROR HANDLING
const errorMiddleware = require("./middlewares/errorHandlers");

app.use(errorMiddleware.error404);
app.use(errorMiddleware.error500);

// # SERVER START

app.listen(process.env.APP_PORT, () => {
  console.log("Server environment: " + process.env.APP_MODE);
  console.log("Server listening on " + process.env.APP_URL + ":" + process.env.APP_PORT);
});
