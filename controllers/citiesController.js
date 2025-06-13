var models = require('../models');


// SHOW ALL 
exports.index = function (req, res, next) {
    var response = {
        success: false,
        message: [],
        data: {}
    }
    models.Cities.findAll({})
        .then(cities => {
            if (Array.isArray(cities)) {
                response.data = cities
                response.success = true
            } else {
                response.message.push("Somthing wrong happend, try agien")
            }
        }).finally(() => {
            res.send(response)
        })
}

// done