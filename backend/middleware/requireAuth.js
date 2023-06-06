const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requireAuth = async (req, res, next) => {
    // verify authentication
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' })
    }

    // header: 'bearer token' we want the token so: 
    const token = authorization.split(' ')[1]

    try {
        // grab id by the token
        const { _id } = jwt.verify(token, process.env.JWT_SECRET)

        // find user in db with id 
        req.user = await User.findOne({ _id }).select('_id')
        next()
    } catch (error) {
        throw new Error('Request is not authorized')
    }
}

module.exports = requireAuth



