const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "images";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .replace(/\s+/g, "_")
      .replace(/\.[^/.]+$/, "");
    const ext = MIME_TYPES[file.mimetype] || "jpg";
    const timestamp = Date.now();
    req.optimizedFilename = `${timestamp}_${name}.webp`;
    cb(null, `${timestamp}_${name}.${ext}`);
  },
});

const upload = multer({ storage }).single("image");

const uploadWithOptimization = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err || !req.file)
      return res
        .status(400)
        .json({ error: err?.message || "Aucun fichier uploadé" });

    const inputPath = path.join("images", req.file.filename);
    const outputPath = path.join("images", req.optimizedFilename);

    try {
      await sharp(inputPath)
        .resize({ width: 1024 })
        .webp({ quality: 75 })
        .toFile(outputPath);
      fs.unlink(inputPath, () => {}); // suppression sans bloquer si le fichier est en lecture
      req.optimizedImage = req.optimizedFilename;
      next();
    } catch (error) {
      console.error("Erreur Sharp :", error);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'optimisation de l'image" });
    }
  });
};

module.exports = uploadWithOptimization;
