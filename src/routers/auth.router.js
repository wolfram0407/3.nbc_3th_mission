/*
 회원가입 / 로그인 

 */

// import
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { Users } = require('../../models');

const router = express.Router();

router.post('/auth/signup', async (req, res) => {
  const { email, password, passwordConfirm, username } = req.body;

  // inputData checks
  if (!email || !password || !passwordConfirm || !username) {
    return res.status(400).json({
      message: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }

  // password check
  if (password !== passwordConfirm) {
    return res.status(401).json({
      message: '패스워드가 일치하지 않습니다.',
    });
  }

  const existsEmail = await Users.findAll({
    where: {
      email,
    },
  });

  if (existsEmail.length) {
    res.status(400).json({
      errorMessage: '이미 사용인 이메일 입니다.',
    });
    return;
  }

  const newUser = {
    email,
    password,
    username,
  };
  try {
    await Users.create(newUser);
    res.status(201).json({
      message: '회원가입이 되었습니다.',
    });
  } catch (e) {
    console.error(e);
  }
});
//login
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // inputdata checks
  if (!email || !password) {
    return res.status(400).json({
      message: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }

  const user = await Users.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({
      errorMessage: '이메일을 확인해주세요.',
    });
  }

  const compare = await user.comparePassword(user, password);
  if (!compare) {
    return res.status(400).json({
      errorMessage: '패스워드를 확인해주세요.',
    });
  }

  const accessToken = jwt.sign({ id: user.id }, process.env.SECRETTEXT, { expiresIn: '30m' });
  res.send(accessToken);
});
//logout
router.post('/logout', (req, res) => {
  req.logOut(function (err) {
    if (err) return next(err);
  });
});

module.exports = router;
