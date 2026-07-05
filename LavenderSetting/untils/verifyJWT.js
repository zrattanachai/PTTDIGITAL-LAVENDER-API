const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports.isAuthen = (req, res, next) => { 

    const authorization = req.headers.authorization
    if (!authorization || !(authorization.search('Bearer ') === 0)) {
        return next(new Error('Missing Authorization Header'))
    }

    const token = authorization.split(' ')[1]
    if (!token) {
        return next(new Error('Missing Bearer Token'))
    }

    try {
        const decoded = jwt.verify(token ,config.tokenSettings.publicKey)
        req.jwtDecode = decoded
    } catch(err) {
        res.statusCode = 401;
        return res.send({'message': 'Invalid Access Token'});
    }

    next()
}