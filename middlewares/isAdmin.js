const authService = require('../services/auth');

exports.isAdmin = async function(req, res, next) {
    const token = req.headers?.authorization?.split(' ')[1]
    isVerfied = await authService.verifyUser(token);
    if (isVerfied?.user_type == 1) {
        return next()
    }
    res.status(403)
    res.send({
        success: false,
        messages: [
            'you are not admin'
        ]
    })
    return 
}