const express = require('express');
const router = express.Router();

const projectCategoryController = require('../controllers/projectsCategoriesController');
const { isAuthenticatedAdmin } = require('../middlewares/isAuthentuicated');


// مسارات إدارة علاقات المشاريع والفئات
router.post('/link', isAuthenticatedAdmin, projectCategoryController.addCategoryToProject);
router.delete('/unlink', isAuthenticatedAdmin, projectCategoryController.removeCategoryFromProject);
router.get('/project/:projectId', projectCategoryController.getProjectCategories);
router.get('/category/:categoryId', projectCategoryController.getCategoryProjects);
router.put('/project/:projectId', isAuthenticatedAdmin, projectCategoryController.updateProjectCategories);

module.exports = router;