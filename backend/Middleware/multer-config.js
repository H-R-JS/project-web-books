const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.memoryStorage();

const upload = multer({ storage }).single("image");

const uploadWithOptimization = (req, res, next) => {
  upload(req, res, async () => {
    if (!req.file) {
      next();
    } else {
      const name = req.file.originalname
        .replace(/\s+/g, "_")
        .replace(/\.[^/.]+$/, "");
      const timestamp = Date.now();
      const outputFilename = `${timestamp}_${name}.webp`;
      const outputPath = path.join("images", outputFilename);

      try {
        const dir = "images";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);

        await sharp(req.file.buffer)
          .resize({ width: 1024 })
          .webp({ quality: 75 })
          .toFile(outputPath);

        req.optimizedImage = outputFilename;

        next();
      } catch (error) {
        console.error("Erreur lors de l'optimisation :", error);
        return res.status(500).json({
          error: "Erreur lors de l'optimisation de l'image : " + error.message,
        });
      }
    }
  });
};

module.exports = uploadWithOptimization;
