const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    console.log(file);
    const name = file.originalname
      .split(" ")
      .join("_")
      .replace(/\.[^/.]+$/, "");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${Date.now()}_${name}.${extension}`);
  },
});

/**+ "." + extension */

module.exports = multer({ storage: storage }).single("image");
