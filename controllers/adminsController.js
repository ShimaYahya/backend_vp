var models = require('../models');
var authService = require('../services/auth');

exports.index = function (req, res) {
    
    var response = {
        success: false,
        message: [],
        data: {}
    }

    models.Admins.findAll({})
        .then(admin => {
            if (Array.isArray(admin)) {
                response.data = admin
                response.success = true
            } else {
                response.message.push("something wrong happened in admins index ")
            }
        }).finally(() => {
            res.send(response)
        })
}


//SignUp admin

exports.signup = async function (req, res, next) {
    var response = {
        success: true,
        message: [],
        data: {}
    }
    if (!req.body?.firstName?.length) {
        response.message.push("Please add a first Name")
        response.success = false
    }
    if (!req.body?.lastName?.length) {
        response.message.push("Please add a last Name")
        response.success = false
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body?.email))) {
        response.message.push("Please add a valid email")
        response.success = false
    }
    if (req?.body?.password?.length < 6) {
        response.message.push("Please add a valid password")
        response.success = false
    }
    if (req?.body?.password != req?.body?.password_confirmation) {
        response.message.push("Your password and password confirmation do not match")
        response.success = false
    }
    if (!(/^[\+]?[0-9]+$/.test(req.body?.phone_num))) {
        response.message.push("Please add a valid phone number")
        response.success = false
    }
    if (!response.success) {
        res.send(response)
        return 
    }
    const [admin, created] = await models.Admins.findOrCreate({
        where: {
            email: req.body.email
        },
        defaults: {
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            phone_num: req.body.phone_num,
            password: authService.hashPassword(req.body.password)
        }
    });
    if (created) {
    
        response.data = admin
        response.message.push("admin successfully created")
        response.success = true
        res.send(response)
        
    } else {
        response.message.push("This admin already exists")
        response.success = false
        res.send(response);
    }
}



//Login User

exports.login = async function (req, res, next) {
    console.log("req.body.email")
    var response = {
        success: false,
        message: [],
        data: {}
    }
    models.Admins.findOne({
        where: {
            email: req.body.email
        }
    }).then(admin => {
        // console.log("adminnn", admin)
        if (!admin) {
            response.message.push("Login Failed")
            response.success = false
            res.send(response);
        } else {
            let passwordMatch = authService.comparePasswords(req.body.password, admin.password);
            if (passwordMatch) {
                let token = authService.signUser(admin);
                response.message.push("Login successful")
                response.success = true
                response.token = token
                res.send(response);
            } else {
                response.message.push("Wrong password")
                response.success = false
                res.send(response);
            }
        }
    })
        .catch(err => {
            res.status(400);
            response.message.push("There was a problem in logging in. Make sure of the information you entered")
            response.success = false
            res.send(response)
        });
}


//show User

exports.show = async function (req, res, next) {
    const id = req.params.id
    var response = {
        success: false,
        message: [],
        data: {}
    }
    if (isNaN(id)) {
        response.message.push("Please provide a valid ID")
        response.success = false
        res.send(response)
        return
    }
    const admin = await models.Admins.findByPk(id)
    if (admin) {
        response.success = true;
        response.data = admin
    } else {
        response.message.push("admin not found")
        res.status(404)
    }
    res.send(response)
}




//update User
exports.update = async function (req, res, next) {
    let response = {
        messages: [],
        success: true,
        data: {}
    }
    const id = req.params.id
    if (isNaN(id)) {
        response.messages.push("Please provide a valid ID")
        response.success = false
        res.send(response)
        return
    }
    if (!req.body?.firstName?.length) {
        response.messages.push("Please add a first Name")
        response.success = false
    }
    if (!req.body?.lastName?.length) {
        response.messages.push("Please add a last Name")
        response.success = false
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body?.email))) {
        response.messages.push("Please add a valid email")
        response.success = false
    }
    if (req?.body?.password != req?.body?.password_confirmation) {
        response.messages.push("Your password and password confirmation do not match")
        response.success = false
    }
    if (!(/^[\+]?[0-9]+$/.test(req.body?.phone_num))) {
        response.messages.push("Please add a valid phone number")
        response.success = false
    }
    if (!response.success) {
        res.send(response)
        return
    }
    const updated = await models.Admins.findByPk(id)
    if (updated) {
        if (req.body.firstName) {
            updated.firstName = req.body.firstName
        }
        if (req.body.lastName) {
            updated.lastName = req.body.lastName
        }
        if (req.body.password) {
            updated.password = authService.hashPassword(req.body.password)
        }
        if (req.body.email) {
            updated.email = req.body.email
        }
        if (req.body.phone_num) {
            updated.phone_num = req.body.phone_num
        }
        updated.save().then((admin) => {
            response.messages.push('Successfully Updated')
            response.success = true
            response.data = admin
            res.send(response)
        })
    } else {
        res.status(400);
        response.messages.push('There was a problem updating the admin info.  Please check the admin information.')
        response.success = false
        res.send(response)
    }
    
}

//delete user
// exports.delete = async function (req, res, next) {
//     let response = {
//         messages: [],
//         success: false,
//         data: {}
//     }
//     const id = req.params.id
//     if (isNaN(id)) {
//         response.messages.push("Please provide a valid ID")
//         response.success = false
//         res.send(response)
//         return
//     }
//     const deleted = await models.Users.destroy({
//         where: {
//             id: id
//         }
//     })
//     if (deleted == 1) {
//         response.messages.push("Admin has been deleted")
//         response.success = true
//     } else {
//         response.messages.push("Admin has not been deleted")
//     }
//     res.send(response)
// }