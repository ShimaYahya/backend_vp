var express = require('express');
var router = express.Router();

var citiesController = require('../controllers/citiesController');


router.get('/',citiesController.index);


module.exports = router;