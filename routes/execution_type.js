var express = require('express');
var router = express.Router();


var executionTypeController = require('../controllers/executionTypeController');
const { isAuthenticatedAdmin } = require('../middlewares/isAuthentuicated');


router.get('/',executionTypeController.index);
router.post('/', isAuthenticatedAdmin, executionTypeController.add);
router.get('/:id', executionTypeController.show);
router.put('/:id', isAuthenticatedAdmin, executionTypeController.update);
router.delete('/:id', isAuthenticatedAdmin, executionTypeController.delete);


module.exports = router;
