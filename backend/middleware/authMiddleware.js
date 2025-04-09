const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized');
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token!!!')
    }
})

module.exports = { protect }

// const jwt = require('jsonwebtoken');
// const asyncHandler = require('express-async-handler');
// const User = require('../models/userModel');

// const protect = asyncHandler(async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         token = req.headers.authorization.split(' ')[1];

//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);

//             req.user = await User.findById(decoded.id).select('-password');
//             if (!req.user) {
//                 res.status(401);
//                 throw new Error('User not found');
//             }

//             next();
//         } catch (error) {
//             console.error('Error during token verification:', error);
//             res.status(401);
//             if (error.name === 'TokenExpiredError') {
//                 throw new Error('Token expired');
//             } else {
//                 throw new Error('Token is invalid');
//             }
//         }
//     } else {
//         res.status(401);
//         throw new Error('Not authorized, no token provided');
//     }
// });

// module.exports = { protect };
