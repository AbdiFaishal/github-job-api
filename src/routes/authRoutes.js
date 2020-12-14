const express = require('express');
const router = express.Router();

const { signUp, signIn, checkAuth } = require('../controllers/auth');
const { isAuth } = require('../middleware/checkAuth');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/check-auth', isAuth, checkAuth);

module.exports = router;
