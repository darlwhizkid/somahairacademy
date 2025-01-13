const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/soma_academy');

// Review Schema
const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  review: String,
  date: { type: Date, default: Date.now },
  adminResponse: String
});

const Review = mongoose.model('Review', reviewSchema);

// API Routes
app.post('/api/reviews', async (req, res) => {
  const review = new Review(req.body);
  await review.save();
  res.json(review);
});

app.get('/api/reviews', async (req, res) => {
  const reviews = await Review.find().sort('-date');
  res.json(reviews);
});
