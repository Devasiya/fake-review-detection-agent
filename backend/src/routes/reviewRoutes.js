const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createReview } = require('../controllers/reviewController');
const { getReviews } = require('../controllers/reviewController');
const { getReviewById } = require('../controllers/reviewController');   

router.post('/', protect, createReview);
router.get('/', protect, getReviews);
router.get('/:id', protect, getReviewById);

module.exports = router;