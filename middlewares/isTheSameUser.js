const authService = require('../services/auth');
// const { isAdmin } = require('./isAdmin');

exports.isTheSameAdmin = async function(req, res, next) {
    const token = req.headers?.authorization?.split(' ')[1]
    isVerfied = await authService.verifyAdmin(token);
    // if (isVerfied?.id == req.params.id || isAdmin) {
    if (isVerfied?.id == req.params.id ) {
        return next()
    }
    res.status(403)
    res.send({
        success: false,
        messages: [
            'is Different User'
        ]
    })
    return 
}

exports.isTheSameVolunteer = async function(req, res, next) {
    const token = req.headers?.authorization?.split(' ')[1]
    isVerfied = await authService.verifyVolunteer(token);
    // if (isVerfied?.id == req.params.id || isAdmin) {
    if (isVerfied?.id == req.params.id ) {
        return next()
    }
    res.status(403)
    res.send({
        success: false,
        messages: [
            'is Different User'
        ]
    })
    return 
}