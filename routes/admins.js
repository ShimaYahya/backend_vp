var express = require('express');
var router = express.Router();

var adminsController = require('../controllers/adminsController');
const { isAuthenticatedAdmin } = require('../middlewares/isAuthentuicated');
const {isTheSameAdmin} = require('../middlewares/isTheSameUser');

router.get('/',isAuthenticatedAdmin, adminsController.index);
router.post('/',  adminsController.signup);
router.post('/login', adminsController.login);
router.get('/:id',isTheSameAdmin,  adminsController.show);
router.put('/:id', isAuthenticatedAdmin, isTheSameAdmin, adminsController.update);


module.exports = router;