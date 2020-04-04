const express =  require('express');

const { 
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
    
} = require('../controllers/reviews');
const {protect, authorize} = require('../middleware/auth');

const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedRequest');
const router = express.Router({mergeParams: true});


router.route('/').get(advancedResults (Review, {
    path: 'bootcamp',
    select: 'name description'
}) ,getReviews).post(protect, authorize ('user', 'admin'), createReview);

router.route('/:id').get(getReview).put(protect, authorize('admin', 'user'), updateReview).delete(protect, authorize('admin', 'user'), deleteReview);

module.exports = router;