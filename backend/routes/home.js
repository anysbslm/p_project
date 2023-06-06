const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');



router.get('/',(req,res)=>{
    res.send('home page route') ;
});


module.exports = router;
