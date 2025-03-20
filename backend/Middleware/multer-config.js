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
  upload(req, res, async (err) => {
    if (err || !req.file) {
      console.error(
        "Erreur d'upload :",
        err?.message || "Aucun fichier uploadé"
      );
      return res
        .status(400)
        .json({ error: err?.message || "Aucun fichier uploadé" });
    }

    const name = req.file.originalname
      .replace(/\s+/g, "_")
      .replace(/\.[^/.]+$/, "");
    const timestamp = Date.now();
    const outputFilename = `${timestamp}_${name}.webp`;
    const outputPath = path.join("images", outputFilename);

    console.log("Fichier en mémoire :", req.file.originalname);
    console.log("Fichier optimisé généré :", outputFilename);
    console.log("Chemin complet :", outputPath);

    try {
      const dir = "images";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      await sharp(req.file.buffer)
        .resize({ width: 1024 })
        .webp({ quality: 75 })
        .toFile(outputPath);

      req.optimizedImage = outputFilename;
      console.log("Valeur assignée à req.optimizedImage :", req.optimizedImage);

      next();
    } catch (error) {
      console.error("Erreur lors de l'optimisation :", error);
      return res.status(500).json({
        error: "Erreur lors de l'optimisation de l'image : " + error.message,
      });
    }
  });
};

module.exports = uploadWithOptimization;
