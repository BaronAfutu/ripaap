const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { testValidation, userLoginValidation } = require('../helpers/validation');
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

router.get('/tests', async (req, res) => {
  const testList = await Test.find();
  if (!testList) return res.status(500).json({ success: false });
  res.json(testList);
})

// const { error, value } = categoryValidation.validate(req.body);
// if (error) return res.status(400).json({ status: false, errMsg: error.details[0].message });

/* GET users listing. */

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

router.post('/makeAdmin/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isInternalUser: true });
  // res.redirect('/api/v1/users');
  res.status(200).json({})
});

router.post('/dropAdmin/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isInternalUser: false });
  res.status(200).json({})
});

router.post('/tests/', async (req, res) => {
  const { error, value } = testValidation.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message })

  await Test.findOne({ name: value.name }).then(existingTest => {
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



router.post('/tests/:id', async (req, res) => {
  const { error, value } = testValidation.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message })
try {
  const existingTest = await Test.findById(req.params.id);
  if (!existingTest) return res.status(302).json({ message: 'Test Not Found!!' });
} catch (error) {
  console.log(error);
  return res.status(500).json({});
}

  await Test.findByIdAndUpdate(req.params.id, { name: value.name, si: value.si, conventional: value.conventional })
    .then(updatedTest => {
      return res.json(updatedTest);
    }).catch(err => {
      console.log(err)
      res.status(500).json({ error: err });
    });
})

router.delete('/tests/:id', (req, res) => {
  Test.findByIdAndDelete(req.params.id).then(() => {
    return res.json({ message: "Deleted!" });
  }).catch(err => {
    return res.status(500).json(error)
  })
})



module.exports = router;
