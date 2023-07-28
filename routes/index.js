var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { subTitle: '' , user:req.session.user||undefined});
});

router.get('/login', (req, res) => {
  if(req.session.user) return res.redirect('/');
  if (typeof req.query.next == 'undefined') {
    return res.render('login', {
      subTitle: '- Login',
      formData: req.body
    });
  }else{
    return res.render('login', {
      subTitle: '- Login',
      status: {
        form: 'login',
        status: 'danger',
        message: "Login to continue!"
      },
      formData: req.body
    })
  }
})

router.use('/search', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect(`/login?next=${req.url}`);
  }
  next();
})

router.get('/search', (req, res) => {
  res.render('search', { 
    subTitle: '- Search' ,
    user: req.session.user,
    token: jwt.sign(req.session.user,process.env.SECRET)
  });
})

module.exports = router;
