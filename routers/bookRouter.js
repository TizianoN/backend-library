const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const upload = require("../middlewares/multer");

router.get("/", bookController.index);
router.get("/:id", bookController.show);
router.post("/", upload.single("image"), bookController.store);
router.post("/:id/review", bookController.storeReview);
// router.put("/:id", bookController.update);
// router.patch("/:id", bookController.modify);
// router.delete("/:id", bookController.destroy);

module.exports = router;
