/*
 회원가입 / 로그인 

 */
const path = require('path');
// import
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { Users, Refreshtoken } = require('../../models');
const { validate } = require('../middlewares/validation.js');
const { body } = require('express-validator');
const router = express.Router();
// 회원가입
router.post(
  '/auth/signup',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('email 을 입력해주세요.')
      .isEmail()
      .withMessage('email 형식을 맞춰서 입력해주세요.'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('password 을 입력해주세요.')
      .isLength({ min: 6 })
      .withMessage('6자리 이상 입력해주세요.'),
    body('passwordConfirm')
      .trim()
      .notEmpty()
      .withMessage('passwordConfirm 을 입력해주세요.')
      .isLength({ min: 6 })
      .withMessage('6자리 이상 입력해주세요.'),
    body('username').trim().notEmpty().withMessage('username 을 입력해주세요.'),
    validate,
  ],
  async (req, res, next) => {
    const { email, password, passwordConfirm, username } = req.body;
    // password check
    if (password !== passwordConfirm) {
      return next(new Error('NotCorrect'));
    }
    // find user
    const existsEmail = await Users.findAll({
      where: {
        email,
      },
    });
    if (existsEmail.length) {
      return next(new Error('ExistsEmail'));
    }

    const preUser = {
      email,
      password,
      username,
    };

    const existedUser = await Users.create(preUser);
    if (!existedUser) {
      return next(new Error('CheckDBConnect'));
    }
    const NewUser = existedUser.dataValues;
    delete NewUser.password;
    res.status(201).json({
      NewUser,
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
  async (req, res, next) => {
    const { email, password } = req.body;
    const user = await Users.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return next(new Error('EmailNotFound'));
    }

    const compare = await user.comparePassword(user, password);

    if (!compare) {
      return next(new Error('NotCorrect'));
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.SECRETTEXT, { expiresIn: '30s' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESHSECRETTEXT, { expiresIn: '1d' });
    const preRefreshToken = {
      userId: user.id,
      refrshtoken: refreshToken,
    };
    const findToken = await Refreshtoken.findOne({
      where: {
        userId: user.id,
      },
    });
    if (findToken) {
      return res.send({
        message: 'Access token IS Expiration plz get New access token',
      });
    }

    const saveRefreshToken = await Refreshtoken.create(preRefreshToken);
    if (!saveRefreshToken) {
      return next(new Error('NotCorrect'));
    }
    res.status(200).send({ accessToken, refreshToken });
  }
);

module.exports = router;
