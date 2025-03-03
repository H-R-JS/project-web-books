const mongoose = require("mongoose");

const thingSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  genre: { type: String, required: true },
  imageUrl: { type: String },
  author: { type: String, required: true },
  year: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      rating: { type: Number, required: true },
    },
  ],
  averageRating: { type: Number },
});

const ThingSchema = mongoose.model("books", thingSchema);
module.exports = ThingSchema;
