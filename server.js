const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);
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

// Admin response endpoint
app.post('/api/reviews/:id/respond', async (req, res) => {
    const { id } = req.params;
    const { adminResponse } = req.body;
    
    const review = await Review.findByIdAndUpdate(
        id,
        { adminResponse },
        { new: true }
    );
    
    res.json(review);
});

const adminRouter = express.Router();

adminRouter.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Add proper authentication here
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

app.use('/admin', adminRouter);
