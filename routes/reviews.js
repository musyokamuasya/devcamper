const express =  require('express');

const { 
    getReviews,
    getReview,
    createReview
    
} = require('../controllers/reviews');
const {protect, authorize} = require('../middleware/auth');

const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedRequest');
const router = express.Router({mergeParams: true});


router.route('/').get(advancedResults (Review, {
    path: 'bootcamp',
    select: 'name description'
}) ,getReviews).post(protect, authorize ('user', 'admin'), createReview);

router.route('/:id').get(getReview);

module.exports = router;