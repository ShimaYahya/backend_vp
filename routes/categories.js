var express = require('express');
var router = express.Router();

var categoriesController = require('../controllers/categoriesController');
const { isAuthenticatedAdmin } = require('../middlewares/isAuthentuicated');


router.get('/',categoriesController.index);
router.post('/', isAuthenticatedAdmin, categoriesController.add);
router.get('/:id', categoriesController.show);
router.put('/:id', isAuthenticatedAdmin, categoriesController.update);
router.delete('/:id', isAuthenticatedAdmin, categoriesController.delete);


module.exports = router;