const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const uploadWithOptimization = require("../middleware/multer-config");

const BooksCtrl = require("../Controllers/BooksController");

router.get("/book", stuffCtrl.getAllBooks);
router.get("/books/bestrating", stuffCtrl.getBestBooks);
router.get("/book/:id", stuffCtrl.getOneBook);
router.post("/book", auth, uploadWithOptimization, stuffCtrl.createBook);
router.post("/book/:id/rating", auth, stuffCtrl.rateBook);
router.put("/book/:id", auth, uploadWithOptimization, stuffCtrl.modifyBook);
router.delete("/book/:id", auth, stuffCtrl.deleteBook);

module.exports = router;
