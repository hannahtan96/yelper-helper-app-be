const mongoose = require('mongoose');
const { ObjectID } = require('bson');

// reviews
const ReviewSchema = new mongoose.Schema({
  _id: ObjectID,
  review_id: String,
  user_id: String,
  business_id: String,
  stars: Number,
  useful: Number,
  funny: Number,
  cool: Number,
  text: String,
  date: Date
});

const Review = mongoose.model('Review', ReviewSchema, 'reviews');

module.exports = Review;
