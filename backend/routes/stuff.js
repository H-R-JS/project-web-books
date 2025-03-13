const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const uploadWithOptimization = require("../middleware/multer-config");

const stuffCtrl = require("../Controllers/stuffController");

router.get("/book", stuffCtrl.getAllStuff);
router.get("/books/bestrating", stuffCtrl.getBestStuff);
router.get("/book/:id", stuffCtrl.getOneThing);
router.post("/book", auth, uploadWithOptimization, stuffCtrl.createThing);
router.post("/book/:id/ratingg", auth, stuffCtrl.rateThing);
router.put("/book/:id", auth, uploadWithOptimization, stuffCtrl.modifyThing);
router.delete("/book/:id", auth, stuffCtrl.deleteThing);

module.exports = router;
