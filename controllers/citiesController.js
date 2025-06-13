var models = require('../models');


// // SHOW ALL 
// exports.index = function (req, res, next) {
//     var response = {
//         success: false,
//         message: [],
//         data: {}
//     }
//     models.Cities.findAll({})
//         .then(cities => {
//             if (Array.isArray(cities)) {
//                 response.data = cities
//                 response.success = true
//             } else {
//                 response.message.push("Somthing wrong happend, try agien")
//             }
//         }).finally(() => {
//             res.send(response)
//         })
// }

// // done






exports.index = function (req, res, next) {
    const response = {
        success: false,
        message: [],
        data: {}
    };

    models.Cities.findAll()
        .then(cities => {
            if (Array.isArray(cities) && cities.length > 0) {
                response.data = cities;
                response.success = true;
            } else {
                response.message.push("No cities found.");
            }
        })
        .catch(err => {
            console.error("❌ Error fetching cities:", err);
            response.message.push("Database error occurred");
        })
        .finally(() => {
            res.send(response);
        });
};
