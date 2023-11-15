const express = require('express');
const { body, validationResult } = require('express-validator');
const { Products, Users, sequelize } = require('../../models');

const { validate } = require('../middlewares/validation.js');
const { isAuthenticated, checkProductOwn } = require('../middlewares/auth.js');

const router = express.Router();

//getProducts
router.get('/products', isAuthenticated, async (req, res) => {
  const products = await Products.findAll({
    attributes: ['id', 'userId', 'title', 'contents', 'status', [sequelize.col('username'), 'username']],
    include: {
      model: Users,
      attributes: [],
    },
  });
  res.send(products);
});
// getProductOne
router.get('/product/:id', isAuthenticated, async (req, res) => {
  const id = req.params.id;
  const product = await Products.findByPk(id, {
    attributes: ['id', 'userId', 'title', 'contents', 'status', [sequelize.col('username'), 'username']],
    include: {
      model: Users,
      attributes: [],
    },
  });
  res.send(product);
});
// add new product
router.post(
  '/products/new',
  isAuthenticated,
  [
    body('title').trim().notEmpty().withMessage('title 을 입력해주세요.'),
    body('price').trim().notEmpty().withMessage('price 을 입력해주세요.'),
    body('contents').trim().notEmpty().withMessage('contents 을 입력해주세요.'),
    body('contents').trim().notEmpty().withMessage('password 을 입력해주세요.'),
    validate,
  ],
  async (req, res) => {
    const { title, price, contents, password } = req.body;
    const userId = req.user.id;

    // inputData checks
    if (!title || !contents || !password) {
      return res.status(400).json({
        message: '요청한 데이터 형식이 올바르지 않습니다.',
      });
    }
    const newProduct = {
      userId,
      title,
      price,
      contents,
      password,
    };
    await Products.create(newProduct);
    res.status(201).json({
      message: '등록되었습니다.',
    });
  }
);
// update product
router.put(
  '/product/:id',
  [isAuthenticated, checkProductOwn],
  [
    body('title').trim().notEmpty().withMessage('title 을 입력해주세요.'),
    body('price').trim().notEmpty().withMessage('price 을 입력해주세요.'),
    body('contents').trim().notEmpty().withMessage('contents 을 입력해주세요.'),
    body('contents').trim().notEmpty().withMessage('password 을 입력해주세요.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    const id = req.params.id;
    const { title, price, contents, state, password } = req.body;
    // 해당 유저인지 미들웨어 체크 필요

    if (!title || !price || !contents || !state || !password) {
      return res.status(400).json({
        message: '요청한 데이터 형식이 올바르지 않습니다.',
      });
    }
    const product = req.product;
    const updateProduct = {
      UserId: product.UserId,
      title: title ? title : product.title,
      price: price ? price : product.price,
      contents: contents ? contents : product.contents,
      state: state ? state : product.state,
    };
    await Products.update(updateProduct, {
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: '상품 수정하였습니다.',
    });
  }
);
// delete product
router.delete('/product/:id', [isAuthenticated, checkProductOwn], async (req, res) => {
  const id = req.params.id;

  await Products.destroy({
    where: {
      id: id,
    },
  });
  res.status(200).json({
    message: '상품 삭제하였습니다.',
  });
});

module.exports = router;
