require("dotenv").config();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const jwt = require('jsonwebtoken');


const createToken = (_id) => {
    return jwt.sign({_id}, `${process.env.JWT_SECRET}`, {expiresIn: '3d'})
}

// login user 
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    
    try{
        const user = await User.login(email, password)
    
        // create a token 
        const token = createToken(user._id)
    
        res.status(200).json({email, token})
    }
    catch (error){
     res.status(400).json({error: error.message})
    }
}


// signup user
const signupUser = async (req,res) => {

const {email,password} = req.body
 
try{
    const user = await User.signup(email, password)

    // create a token 
    const token = createToken(user._id)

    res.status(200).json({email, token})
}
catch (error){
 res.status(400).json({error: error.message})
}
}


// update user's password :
const updateUser = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({email});

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the current password with the one stored in the database
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // Generate a new password hash
    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password field in the user document
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {loginUser,signupUser, updateUser};
