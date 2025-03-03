const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const stuffCtrl = require("../Controllers/stuffController");

router.get("/book", stuffCtrl.getAllStuff);
router.get("/books/bestrating", stuffCtrl.getBestStuff);
router.post("/book", auth, multer, stuffCtrl.createThing);
router.get("/book/:id", stuffCtrl.getOneThing);
router.put("/book/:id", auth, multer, stuffCtrl.modifyThing);
router.delete("/book/:id", auth, stuffCtrl.deleteThing);
router.post("/book/:id/rating", auth, stuffCtrl.rateThing);

module.exports = router;
