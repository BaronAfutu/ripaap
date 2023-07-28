var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
const mongoose = require('mongoose');
// const { execQuery, decodeToken } = require('../../controllers/GeneralController');
const { userValidation, userLoginValidation } = require('../helpers/validation');
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


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('panel/panel',{token: jwt.sign(req.session.user,process.env.SECRET)})
});

// router.post('/',(req,res)=>{
//   if(req.body.username=="admin" && req.body.password=="admin"){
//     res.json({
//       status:"success",
//       token: jwt.sign({name:"Admin",role:"admin"},process.env.SECRET)
//     })
//   }
// })

module.exports = router;
