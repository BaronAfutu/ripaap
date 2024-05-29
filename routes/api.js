const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {
  createData,
  getData,
  editData,
  deleteData,
  getAnalysers
} = require('../controllers/DataController')
const { testValidation } = require('../helpers/validation');
/**
 * @type {mongoose.Model}
 */
const User = require('../models/user');
/**
 * @type {mongoose.Model}
 */
const Test = require('../models/test');



const decodeToken = async (authorizationString) => {
  const token = authorizationString.split(' ')[1];
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.SECRET || 'this_is_@_temp.secret');
    decoded['success'] = true;
  } catch (err) {
    console.log(err);
    decoded['success'] = false;
  } finally {
    return decoded;
  }
}


router.get('/data/:testType/:testID', getData);
router.get('/analysers/:testType/:testID', getAnalysers);
// may require paid access for non-admin users
router.get('/tests', async (req, res) => {
  const testList = await Test.find();
  if (!testList) return res.status(500).json({ success: false });
  res.json(testList);
})



/* Require Admin Accesss */
router.use('/', async (req, res, next) => {
  const decoded = await decodeToken(req.headers.authorization);
  if (!decoded.success) return res.status(500).json({ status: false });
  if (decoded.admin) return next();
  return res.status(404);
})


router.get('/users', async function (req, res) {
  const userList = await User.find({ isInternalUser: false }, '-password -__v');
  if (!userList) {
    res.status(500).json({ success: false });
    return;
  }
  res.json(userList);
});

router.get('/admins', async function (req, res) {
  const userList = await User.find({ isInternalUser: true }, '-password -__v');
  if (!userList) {
    res.status(500).json({ success: false });
    return;
  }
  res.json(userList);
});



router.post('/data/:testType/:testID', createData);
router.post('/data/:testType/:id', editData);
router.delete('/data/:testType/:id',deleteData);


router.post('/tests/', async (req, res) => { // create test
  const { error, value } = testValidation.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message })

  await Test.findOne({ slug: value.slug }).then(existingTest => {
    if (existingTest) return res.status(302).json({ message: 'Test Already Created!!' });

    const test = new Test(value);
    test.save().then(newTest => {
      return res.json(newTest);
    }).catch(err => {
      console.log(err)
      res.status(500).json({ error: err });
    });

  }).catch(error => {
    return res.status(500).json(error)
  });
})
router.post('/tests/:testid', async (req, res) => { // edit test
  const { error, value } = testValidation.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message })
  try {
    // console.log(req.params.slug);
    const existingTest = await Test.findById(req.params.testid);
    if (!existingTest) return res.status(302).json({ message: 'Test Not Found!!' });
    // console.log(existingTest);
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }

  // Find by slug and update instead. Slugs shouldn't update
  // Looks Like ID's might be messingup Investigate more
  // Maybe change all from id base to slug base
  await Test.findByIdAndUpdate(req.params.testid, {
    name: value.name,
    type: value.type,
    slug: value.slug,
    si: value.si,
    conventional: value.conventional
  })
    .then(updatedTest => {
      return res.json(updatedTest);
    }).catch(err => {
      console.log(err)
      res.status(500).json({ error: err });
    });
})
router.delete('/tests/:testid', (req, res) => { // delete test
  Test.findByIdAndDelete(req.params.testid).then(() => {
    return res.json({ message: "Deleted!" });
  }).catch(err => {
    return res.status(500).json(error)
  })
})


router.post('/makeAdmin/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isInternalUser: true });
  // res.redirect('/api/v1/users');
  res.status(200).json({})
});

router.post('/dropAdmin/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isInternalUser: false });
  res.status(200).json({})
});



module.exports = router;
