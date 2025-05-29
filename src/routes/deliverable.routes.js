const express = require('express');
const { uploadDeliverable } = require('../controllers/deliverable.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

const router = express.Router();

router.post('/', isAuthenticated, allowRoles('SELLER'), uploadDeliverable);

module.exports = router;
