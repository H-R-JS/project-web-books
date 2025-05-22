const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
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

const BookSchema = mongoose.model('books', bookSchema);
module.exports = BookSchema;
