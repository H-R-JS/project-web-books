const mongoose = require("mongoose");
const Thing = require("../ModelDB/thing.js");
const fs = require("fs").promises;
const path = require("path");

function average(numbers) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Fichier supprimé : ${filePath}`);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Erreur lors de la suppression de ${filePath} :`, err);
    }
  }
};

exports.createThing = (req, res, next) => {
  const reqBody = JSON.parse(req.body.book);
  const { userId, title, author, year, genre, averageRating } = reqBody;
  const ratings = [{ userId: userId, rating: reqBody.ratings[0].grade }];
  const imageUrl = `/images/${req.optimizedImage}`;
  if (!title || !author || !imageUrl) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  const thing = new Thing({
    userId,
    title,
    author,
    imageUrl,
    year,
    genre,
    ratings,
    averageRating,
  });
  thing
    .save()
    .then(() => {
      res.status(201).json({
        message: "Le Livre est enregistré !",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id,
  })
    .then((thing) => {
      res.status(200).json(thing);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifyThing = (req, res, next) => {
  // Parser les données du livre depuis req.body.book
  let bookData;
  try {
    bookData = JSON.parse(req.body.book);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Format JSON invalide dans req.body.book" });
  }

  const { userId, title, author, year, genre } = bookData;

  if (!title || !author) {
    return res
      .status(400)
      .json({ message: "Données manquantes (title ou author)" });
  }
  const imageUrl = `/images/${req?.optimizedImage}`;
  console.log(imageUrl);
  Thing.findOne({ _id: req.params.id })
    .then(async (thing) => {
      if (!thing) {
        return res.status(404).json({ error: "Objet non trouvé" });
      }
      if (imageUrl) {
        await deleteFile(`.${thing.imageUrl}`);
        console.log("oui");
      }

      let thingUpdate = {
        userId,
        title,
        author,
        year,
        genre,
        ...(imageUrl && { imageUrl }),
      };

      // Mettre à jour l'objet dans la base de données
      return Thing.updateOne({ _id: req.params.id }, { $set: thingUpdate })
        .then(() => {
          res.status(200).json({ message: "Thing updated successfully!" });
        })
        .catch((error) => {
          res.status(400).json({ error: error.message });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur serveur : " + error.message });
    });
};

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(async (thing) => {
      // Vérifier si l'objet existe
      if (!thing) {
        return res.status(404).json({ error: "Objet non trouvé" });
      }
      await deleteFile(`.${thing.imageUrl}`);
      Thing.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(201).json({
            message: "Delete !",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

exports.getAllStuff = (req, res, next) => {
  Thing.find()
    .then((things) => {
      res.status(200).json(things);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getBestStuff = (req, res, next) => {
  Thing.find()
    .then((things) => {
      things.sort((a, b) => b.averageRating - a.averageRating);
      res.status(200).json(things.slice(0, 3));
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.rateThing = async (req, res, next) => {
  const thingFind = await Thing.findOne({ _id: req.params.id });
  if (!thingFind) {
    return res.status(404).json({ error: "Thing not found!" });
  }
  const arrayRatings = [];

  thingFind.ratings.forEach((element) => {
    arrayRatings.push(element.rating);
  });
  arrayRatings.push(req.body.rating);
  const averageRating = average(arrayRatings);

  Thing.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: { averageRating: averageRating },
      $push: { ratings: req.body },
    },
    { new: true }
  )
    .then((updatedThing) => {
      res.status(200).json(updatedThing);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
