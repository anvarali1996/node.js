const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists!!!')
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })
    if (user) {
        res.status(201).send({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data!!!')
    }
    res.send({ message: 'Register User' })
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check for user eamil
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.send(
            {
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            }
        )
    } else {
        res.status(400)
        throw new Error('Invalid credentials (EMAIL)!!!')
    }
    res.send({ message: 'Login User' })
})

// const getMe = asyncHandler(async (req, res) => {
//     const { _id, name, email } = await User.findById(req.user.id)
//     res.status(200).send({
//         id: _id,
//         name,
//         email,
//     })
//     res.send({ hey });
// })
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}