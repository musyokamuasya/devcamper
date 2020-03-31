const express =  require('express');

const { 
    getBootcamps,
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampsWithinRadius, 
    uploadBootcampPhoto} = require('../controllers/bootcamps');
// Include routers for other resources
const courseRouter = require('./courses');

const router = express.Router();

router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsWithinRadius);

router.route('/:id/photo').put(uploadBootcampPhoto);


router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;
