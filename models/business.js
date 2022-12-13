const mongoose = require('mongoose');
const { ObjectID } = require('bson');

// business
const BusinessSchema = new mongoose.Schema({
  _id: ObjectID,
  business_id: String,
  name: String,
  address: String,
  city: String,
  state: String,
  postal_code: String,
  latitude: Number,
  longitude: Number,
  stars: Number,
  review_count: Number,
  is_open: Number,
  attributes: Map,
  categories: [String],
  hours: String
});

const Business = mongoose.model('Business', BusinessSchema, 'businesses');

module.exports = Business;
