const express =  require('express');

const { 
    getBootcamps,
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampsWithinRadius, 
    uploadBootcampPhoto} = require('../controllers/bootcamps');

const advancedResults = require('../middleware/advancedRequest');
const Bootcamp = require('../models/Bootcamp');
// Include routers for other resources
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');
const {protect, authorize} = require('../middleware/auth');

const router = express.Router();

router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsWithinRadius);

router.route('/:id/photo').put(protect, authorize('admin', 'publisher') , uploadBootcampPhoto);


router.route('/').get(advancedResults(Bootcamp, 'courses'),
 getBootcamps).post(protect, authorize('admin', 'publisher'), createBootcamp);
router.route('/:id').get(getBootcamp).put(protect, authorize('admin', 'publisher'),  updateBootcamp).delete(protect, authorize('admin', 'publisher'),  deleteBootcamp);

module.exports = router;
