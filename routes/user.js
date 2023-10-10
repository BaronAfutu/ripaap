const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { userValidation, userLoginValidation } = require('../helpers/validation');
/**
 * @type {mongoose.Model}
 */
const User = require('../models/user');


router.get('/register', (req,res)=>{
  res.redirect('/login');
})


router.post('/register', async (req, res) => {
  const { error, value } = userValidation.validate(req.body);
  if (error){
    return res.status(400).render('login', {
      subTitle: '- Login', 
      status: { 
       form: 'register', 
       status: 'danger', 
       message: error.details[0].message
     },
     formData: req.body
   });
    
  } 
  let message = "Couldn't register. Something went wrong.";

  const { title, firstName, lastName, email, institution, position, city, country, password } = value;
  
  try {
    // console.log(email);
    const existUser = await User.findOne({email:email},'id email')
    // console.log(existUser)
    if (existUser) return res.status(200).render('login', {
      subTitle: '- Login', 
      status: { 
       form: 'register', 
       status: 'danger', 
       message: "Email already taken!" 
     },
     formData: req.body
   });
  } catch (error) {
    console.log(error)
    return res.status(500).render('login', {
      subTitle: '- Login', 
      status: { 
       form: 'register', 
       status: 'danger', 
       message: message 
     },
     formData: req.body
   });
  }
  
  const user = new User({
    title, firstName, lastName, email, institution, position, city, country, password: bcrypt.hashSync(password, 10)
  });
  user.save().then(newUser => {
    req.session.user = {id:user.id,admin:user.isInternalUser};
    return res.redirect('/search');
  }).catch(err => {
    console.log(error)
    return res.status(500).render('login', {
      subTitle: '- Login', 
      status: { 
       form: 'register', 
       status: 'danger', 
       message: message 
     },
     formData: req.body
   });
  });
})

router.post('/login', async (req, res) => {
  const { error, value } = userLoginValidation.validate(req.body);
  if (error){
    return res.status(400).render('login', {
      subTitle: '- Login', 
      status: { 
       form: 'login', 
       status: 'danger', 
       message: error.details[0].message
     },
     formData: req.body
   });
    
  } 
  let message = 'Couldn\'t register. Something went wrong.';


  const { email, password } = value;
  // console.log(username);
  let user = await User.findOne({ 'email': email });

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = {id:user.id,admin:user.isInternalUser};
    return res.redirect('/search');
  }
  return  res.status(404).render('login', {
    subTitle: '- Login', 
    status: { 
     form: 'login', 
     status: 'danger', 
     message: "Invalid Email or Password!"
   },
   formData: req.body
 });
})

router.get('/logout', (req,res)=>{
  return req.session.destroy(err=>{
    res.redirect('/');
  })
  return res.redirect('/');
})

module.exports = router;
