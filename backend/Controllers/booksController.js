const mongoose = require("mongoose");
const Book = require("../ModelDB/book.js");
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

exports.createBook = (req, res, next) => {
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

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifyBook = (req, res, next) => {
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
  Book.findOne({ _id: req.params.id })
    .then(async (book) => {
      if (!book) {
        return res.status(404).json({ error: "Objet non trouvé" });
      }
      if (imageUrl) {
        await deleteFile(`.${book.imageUrl}`);
        console.log("oui");
      }

      let bookUpdate = {
        userId,
        title,
        author,
        year,
        genre,
        ...(imageUrl && { imageUrl }),
      };

      // Mettre à jour l'objet dans la base de données
      return Book.updateOne({ _id: req.params.id }, { $set: bookUpdate })
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

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(async (book) => {
      // Vérifier si l'objet existe
      if (!book) {
        return res.status(404).json({ error: "Objet non trouvé" });
      }
      await deleteFile(`.${book.imageUrl}`);
      Book.deleteOne({ _id: req.params.id })
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

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getBestBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      books.sort((a, b) => b.averageRating - a.averageRating);
      res.status(200).json(books.slice(0, 3));
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.rateBook = async (req, res, next) => {
  const bookFind = await Book.findOne({ _id: req.params.id });
  if (!bookFind) {
    return res.status(404).json({ error: "Thing not found!" });
  }
  const arrayRatings = [];

  bookFind.ratings.forEach((element) => {
    arrayRatings.push(element.rating);
  });
  arrayRatings.push(req.body.rating);
  const averageRating = average(arrayRatings);

  Book.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: { averageRating: averageRating },
      $push: { ratings: req.body },
    },
    { new: true }
  )
    .then((updatedBook) => {
      res.status(200).json(updatedBook);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
