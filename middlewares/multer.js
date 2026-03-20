const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public/img/books/",
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = file.originalname.split(".").at(-1);
    cb(null, uniqueName + "." + fileExt);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
