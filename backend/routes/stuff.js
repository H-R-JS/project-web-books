const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const stuffCtrl = require("../Controllers/stuffController");

router.get("/", auth, stuffCtrl.getAllStuff);
router.post("/", auth, stuffCtrl.createThing);
router.get("/:id", auth, stuffCtrl.getOneThing);
router.put("/:id", auth, stuffCtrl.modifyThing);
router.delete("/:id", auth, stuffCtrl.deleteThing);

module.exports = router;
