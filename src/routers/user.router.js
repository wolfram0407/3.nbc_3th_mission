// import
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { Users } = require('../../models/users.js');
const { isAuthenticated } = require('../middlewares/auth.js');
const router = express.Router();

router.get('/mypage', isAuthenticated, async (req, res) => {
  const isUser = req.user.userId;
  const user = await Users.findOne({
    attributes: ['userId', 'email', 'username', 'createdAt'],
    where: {
      userID: isUser,
    },
  });
  res.json(user);
});
module.exports = router;
