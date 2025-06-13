var models = require('../models');
const execution_type = require('../models/execution_type');
var authService = require('../services/auth');
const { Op } = require("sequelize");


// SHOW ALL 
exports.index = function (req, res, next) {
    var response = {
        success: false,
        message: [],
        data: {}
    }
    models.Execution_types.findAll({})
        .then(execution_type => {
            if (Array.isArray(execution_type)) {
                response.data = execution_type
                response.success = true
            } else {
                response.message.push("Somthing wrong happend, try agien")
            }
        }).finally(() => {
            res.send(response)
        })
}


// ADD CITY
exports.add = async function (req, res, next) {
    var response = {
        success: true,
        message: [],
        data: {}
    }
    const token = req.headers?.authorization.split(' ')[1]
    isVerfied = await authService.verifyAdmin(token);
    if (!req.body?.execution_type?.length) {
        response.message.push("Please add a execution_type")
        response.success = false
    }
    if (!response.success) {
        res.send(response)
        return
    }
    const userId = isVerfied.id;
    const [execution_type, execution_typeCreated] = await models.Execution_types.findOrCreate({
        where: {
            execution_type: req.body.execution_type
        },
        defaults: {
            createdBy: userId
        }
    });
    if (execution_typeCreated) {
        response.message.push("execution_type successfully added")
        response.success = true
        res.send(response);
    } else {
        response.message.push("This execution_type already exists")
        response.success = false
        res.send(response);
    }
}

// SHOW CITY BY ID 
exports.show = async function (req, res, next) {
    var response = {
        success: false,
        message: [],
        data: {}
    }
    const id = req.params.id
    if (isNaN(id)) {
        response.message.push("Please provide a valid ID")
        response.success = false
        res.send(response)
    }
    const execution_type = await models.Execution_types.findByPk(id, {})
    if (execution_type) {
        if (execution_type)
            response.success = true;
            response.data = execution_type
    } else {
        response.message.push("execution_type not found")
        res.status(404)
    }
    res.send(response)
}

// UPDATE CITY
exports.update = async function (req, res, next) {
    let response = {
        success: true,
        message: [],
        data: {}
    }
    try {
        const id = req.params.id
        if (isNaN(id)) {
            response.message.push("Please provide a valid ID")
            response.success = false
            res.send(response)
        }
        if (!req.body?.execution_type?.length) {
            response.message.push("Please add a execution_type Name")
            response.success = false
        }
        if (!response.success) {
            res.send(response)
            return
        }

        await models.Execution_types.findByPk(id).then((updated) => {
                if (req.body.execution_type ) {
                    updated.execution_type = req.body.execution_type
                    response.success = true
                }
                if (response.success = true) {
                   updated.save().then((execution_type) => {
                        response.message.push('execution_type successfully Updated')
                        response.success = true
                        response.data = execution_type
                        return res.send(response)
                    }).catch((e)=>{
                        console.error(e)
                        res.status(400);
                        response.message.push('execution_type already exist.')
                        response.success = false
                        return res.send(response)
                    })
                }
                    
        }).catch((e) => {
            console.error(e)
            res.status(400);
            response.message.push('execution_type already exist.')
            response.success = false
            return res.send(response)
        })
    } catch(e) {
        console.error(e)
        res.status(400);
        response.message.push('There was a problem updating the execution_type. Or execution_type already exist.')
        response.success = false
        return res.send(response)
    }
}

// DELETE CITY
// exports.delete = async function (req, res, next) {
//     var response = {
//         success: false,
//         message: [],
//         data: {}
//     }
//     const token = req.headers.authorization.split(' ')[1]
//     isVerfied = await authService.verifyAdmin(token);
//     const id = req.params.id
//     if (isNaN(id)) {
//         response.message.push("Please provide a valid ID")
//         response.success = false
//         res.send(response)
//         return
//     }
//     const deleted = await models.Categories.findByPk(id)
//     const userId = isVerfied.id;
//     if (deleted) {
//         if (deleted.deletedAt == null) {
//             req.body.deletedAt = new Date()
//             deleted.deletedAt = req.body.deletedAt
//         }
//         if (deleted.deletedBy == null) {
//             req.body.deletedBy = userId
//             deleted.deletedBy = req.body.deletedBy
//         }
//         deleted.save().then((city) => {
//             response.data = city
//             response.message.push("City has been deleted")
//             response.success = true
//             res.send(response)
//         })
//     } else {
//         response.message.push("City not found")
//         res.send(response)
//     }
// }


exports.delete = async function (req, res) {
    const response = {
        success: false,
        message: [],
        data: {}
    };

    try {
        // التحقق من وجود توصل صالح
        const token = req.headers?.authorization?.split(' ')[1];
        if (!token) {
            response.message.push("Authorization token required");
            return res.status(401).json(response);
        }

        // التحقق من صلاحية الأدمن
        const isVerified = await authService.verifyAdmin(token);
        if (!isVerified) {
            response.message.push("Unauthorized access");
            return res.status(403).json(response);
        }

        // التحقق من صحة الـ ID
        const execution_typeId = req.params.id;
        if (!execution_typeId || isNaN(execution_typeId)) {
            response.message.push("Invalid execution_type ID");
            return res.status(400).json(response);
        }

        // البحث عن الكاتيجوري وحذفها
        const execution_type = await models.Execution_types.findByPk(execution_typeId);
        
        if (!execution_type) {
            response.message.push("execution_type not found");
            return res.status(404).json(response);
        }

        // الحذف الفعلي
        await execution_type.destroy();
        
        response.success = true;
        response.message.push("execution_type deleted successfully");
        res.status(200).json(response);

    } catch (error) {
        console.error("Delete execution_type error:", error);
        response.message.push("Internal server error");
        res.status(500).json(response);
    }
}

// done