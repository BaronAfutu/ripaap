var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
const mongoose = require('mongoose');
// const { userValidation, userLoginValidation } = require('../helpers/validation');
/**
 * @type {mongoose.Model}
 */
const User = require('../models/user');



router.use('/', async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect(`/login?next=${req.url}`);
  }
  try {
    const user = await User.findById(req.session.user.id,'isInternalUser');
    if(!user) return res.redirect(`/login?next=${req.url}`);
    if(!user.isInternalUser) return res.redirect('/');
  } catch (error) {
    console.log(error);
    return res.redirect('/');
  }
  next();
})

router.get('/', function(req,res){
  res.render('panel/dashboard',{token: jwt.sign(req.session.user,process.env.SECRET)})
})
router.get('/users', function(req,res){
  res.render('panel/users',{token: jwt.sign(req.session.user,process.env.SECRET)})
})
router.get('/admins', function(req,res){
  res.render('panel/admins',{token: jwt.sign(req.session.user,process.env.SECRET)})
})
router.get('/testtypes', function(req,res){
  res.render('panel/testTypes',{token: jwt.sign(req.session.user,process.env.SECRET)})
})
router.get('/data', function(req,res){
  res.render('panel/data',{token: jwt.sign(req.session.user,process.env.SECRET)})
})
router.get('/upload', function(req,res){
  res.render('panel/upload',{token: jwt.sign(req.session.user,process.env.SECRET)})
})
// router.get('/', function(req, res, next) {
//   res.render('panel/panel',{token: jwt.sign(req.session.user,process.env.SECRET)})
// });


module.exports = router;
