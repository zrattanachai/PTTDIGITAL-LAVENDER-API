const jwt = require('jsonwebtoken')

module.exports.isAuthen = async (req, res, next) => {
    try {
        const token = req.headers["authtoken"]
        if (!token) {
            res.send(401, { message: "No token available"  });
            return
        }
        jwt.verify(token,'jwt-secret');
        next();
    } catch (err) {
        res.send(401, { message: err.message  });
        return;
    }
}