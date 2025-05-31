const express = require('express');
const { signup, login,getUserDetails } = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/signup', signup);

router.get('/details',isAuthenticated, getUserDetails);
router.post('/login', login);

module.exports = router;
