const express = require('express');
const router = express.Router();

const { getAllJobs, searchJobs, detailJob } = require('../controllers/jobs');

const { isAuth } = require('../middleware/checkAuth');

router.get('/jobs', isAuth, getAllJobs);
router.get('/search', isAuth, searchJobs);
router.get('/job/:id', isAuth, detailJob);

module.exports = router;
