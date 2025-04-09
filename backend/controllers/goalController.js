const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel')
const User = require('../models/userModel')


const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id });
    res.send(goals);
});

const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
        res.status(400)
        throw new Error('Goal not found!')
    };

    // const user = await User.findById(req.user.id)

    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }
    if (goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized!')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.
        body, {
        new: true,
    });
    res.send(updatedGoal)
});

const deletetGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
        res.status(400)
        throw new Error('Goal not found!')
    }
    // const user = await User.findById(req.user.id)

    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }
    if (goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized!')
    }

    await goal.deleteOne();
    // await Goal.findByIdAndDelete(req.params.id);
    res.send({ id: req.params.id });
});

const setGoals = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error('Please keep silence!!!')
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    console.log(req.body);
    res.send(goal);
});

module.exports = {
    getGoals,
    updateGoal,
    deletetGoals,
    setGoals
}