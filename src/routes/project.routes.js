const express = require('express');
const { createProject, getAllProjects, updateProjectStatus } = require('../controllers/project.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

const router = express.Router();

router.post('/', isAuthenticated, allowRoles('BUYER'), createProject);
router.get('/', isAuthenticated, getAllProjects);
router.put('/:projectId/status', isAuthenticated, allowRoles('SELLER'), updateProjectStatus);

module.exports = router;
