// import
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { Users } = require('../../models');
const { isAuthenticated } = require('../middlewares/auth.js');
const router = express.Router();

router.get('/mypage', isAuthenticated, async (req, res) => {
  const isUser = req.user.id;
  const user = await Users.findOne({
    attributes: ['id', 'email', 'username', 'createdAt'],
    where: {
      id: isUser,
    },
  });
  res.json(user);
});
module.exports = router;
