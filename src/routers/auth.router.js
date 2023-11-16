/*
 회원가입 / 로그인 

 */

// import
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { Users } = require('../../models');
const { validate } = require('../middlewares/validation.js');
const { body } = require('express-validator');
const router = express.Router();
// 회원가입
router.post(
  '/auth/signup',
  [
    body('email').trim().notEmpty().isEmail().withMessage('email 을 입력해주세요.'),
    body('password').trim().notEmpty().isLength({ min: 6 }).withMessage('password 을 입력해주세요.'),
    body('passwordConfirm').trim().notEmpty().withMessage('passwordConfirm 을 입력해주세요.'),
    body('username').trim().notEmpty().withMessage('username 을 입력해주세요.'),
    validate,
  ],
  async (req, res) => {
    const { email, password, passwordConfirm, username } = req.body;

    // password check
    if (password !== passwordConfirm) {
      return res.status(401).json({
        message: '패스워드가 일치하지 않습니다.',
      });
    }
    // find user
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

    await Users.create(newUser);
    delete newUser.password;
    res.status(201).json({
      ...newUser,
      message: '회원가입이 되었습니다.',
    });
  }
);
// 로그인
router.post(
  '/auth/login',
  [
    body('email').trim().notEmpty().isEmail().withMessage('email 을 입력해주세요.'),
    body('password').trim().notEmpty().isLength({ min: 6 }).withMessage('password 을 입력해주세요.'),
    validate,
  ],
  async (req, res) => {
    const { email, password } = req.body;

    const user = await Users.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
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
    res.status(200).send({ accessToken: accessToken });
  }
);

module.exports = router;
