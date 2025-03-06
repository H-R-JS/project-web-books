const mongoose = require("mongoose");
const Thing = require("../ModelDB/thing.js");

function average(numbers) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

exports.createThing = (req, res, next) => {
  const reqBody = JSON.parse(req.body.book);
  const { userId, title, author, year, genre, averageRating } = reqBody;
  console.log(reqBody);
  const ratings = [{ userId: userId, rating: reqBody.ratings[0].grade }];
  const imageUrl = req.file.filename;
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
  const { userId, title, author, year, genre } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  const imageUrl = req?.file?.filename;

  let thingUpdate = { userId, title, author, year, genre };

  Thing.updateOne({ _id: req.params.id }, { $set: thingUpdate })
    .then(() => {
      res.status(201).json({
        message: "Thing updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteThing = (req, res, next) => {
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

  Thing.updateOne(
    { _id: req.params.id },
    { $set: { averageRating: averageRating }, $push: { ratings: req.body } }
  )
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
};
