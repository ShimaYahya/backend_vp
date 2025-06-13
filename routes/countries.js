var express = require('express');
var router = express.Router();

var countriesController = require('../controllers/countriesController');


router.get('/',countriesController.index);


module.exports = router;