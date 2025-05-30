const express = require('express');
const { createBid, getProjectBids } = require('../controllers/bid.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

const router = express.Router();

router.post('/', isAuthenticated, allowRoles('SELLER'), createBid);
router.get('/:projectId', isAuthenticated, getProjectBids);

module.exports = router;
