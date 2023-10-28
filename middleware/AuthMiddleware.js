const jsonWebToken = require('jsonwebtoken')

function verifyToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (!token) {
        return res.status(401).json({error: 'No token provided'});
    }
    if (!authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Invalid Token'});
    }

    const token = authorizationHeader.slice(7);
    if (!token) {
        return res.status(401).json({error: 'Invalid Token'});
    }
    try {
        const decodedData = jsonWebToken.verify(token, process.env.SECRET_KEY);
        next();
    } catch (e) {
        return res.status(401).json({error: 'Invalid Token'});
    }
}

module.exports = verifyToken;