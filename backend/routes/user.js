const { signupUser, loginUser, updateUser } = require('../controllers/userController');
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

// login route 
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser);

// update route 
router.post('/update-password', updateUser);


module.exports = router;