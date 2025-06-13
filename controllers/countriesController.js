var models = require('../models');


// SHOW ALL 
exports.index = function (req, res, next) {
    var response = {
        success: false,
        message: [],
        data: {}
    }
    models.Countries.findAll({})
        .then(countries => {
            if (Array.isArray(countries)) {
                response.data = countries
                response.success = true
            } else {
                response.message.push("Somthing wrong happend, try agien")
            }
        }).finally(() => {
            res.send(response)
        })
}

// done