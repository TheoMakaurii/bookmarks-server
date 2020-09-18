const logger = require('../logger');

function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if(!authToken || authToken.split(' ').pop() !== apiToken) {
        logger.error(`You made an unauthorized request to path: ${req.path}`)
        return res
            .status(401)
            .json({error: 'Unauthorized request!!'})
    }
    next();
}

module.exports = validateBearerToken
