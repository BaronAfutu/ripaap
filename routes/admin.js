var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('panel')
});

router.post('/',(req,res)=>{
  if(req.body.username=="admin" && req.body.password=="admin"){
    res.json({
      status:"success",
      token: jwt.sign({name:"Admin",role:"admin"})
    })
  }
})

module.exports = router;
