const express = require("express");
const app = express();

// # MIDDLEWARES
const logger = require("./middlewares/logger");

app.use(logger);
app.use(express.static("public"));
app.use(express.json());

// # TEST ROUTE
app.get("/", (req, res) => {
  res.send("Hello world");
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

app.listen(3000, () => {
  console.log("Server listening");
});
