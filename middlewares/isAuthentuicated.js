const authService = require('../services/auth');

exports.isAuthenticatedAdmin = async function(req, res, next) {
    const token = req.headers?.authorization?.split(' ')[1]
    isVerfied = await authService.verifyAdmin(token);
    console.log('isVerfied', isVerfied)
    if (isVerfied) {
        return next()
    }
    res.status(401)
    res.send({
        success: false,
        messages: [
            'Please login to access this endpoint'
        ]
    })
    return 
}

exports.isAuthenticatedVolunteer = async function(req, res, next) {
    const token = req.headers?.authorization?.split(' ')[1]
    isVerfied = await authService.verifyVolunteer(token);
    console.log('isVerfied', isVerfied)
    if (isVerfied) {
        return next()
    }
    res.status(401)
    res.send({
        success: false,
        messages: [
            'Please login to access this endpoint'
        ]
    })
    return 
}