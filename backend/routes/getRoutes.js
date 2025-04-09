const express = require('express');
const router = express.Router();
const { getGoals, setGoals, updateGoal, deletetGoals } = require('../controllers/goalController');

// router.get('/', (req, res) => {
//     res.send("hey it's working")
//     // res.status(200).json({ message: "Het" })
// });


// router.get('/', getGoals);
// router.post('/', setGoals);
// router.put('/:id', updateGoals);
// router.delete('/:id', deletetGoals);

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getGoals).post(protect, setGoals);
router.route('/:id').delete(protect, deletetGoals).put(protect, updateGoal);

module.exports = router;