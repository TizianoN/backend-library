const express = require("express");
const app = express();

// # MIDDLEWARES
const cors = require("cors");
const logger = require("./middlewares/logger");

app.use(logger);
app.use(express.static("public"));
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// # ROUTES
const globalRouter = require("./routers/globalRouter");
const bookRouter = require("./routers/bookRouter");

app.use(globalRouter);
app.use("/books", bookRouter);

// # ERROR MIDDLEWARES
const errorMiddleware = require("./middlewares/errorHandlers");

app.use(errorMiddleware.error404);
app.use(errorMiddleware.error500);

// # SERVER START
app.listen(process.env.APP_PORT, () => {
  console.log("Server environment: " + process.env.APP_MODE);
  console.log("Server listening on " + process.env.APP_URL + ":" + process.env.APP_PORT);
});
