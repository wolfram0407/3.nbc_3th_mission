const express = require('express');
const { body } = require('express-validator');
const { Products, Users, sequelize } = require('../../models');

const { validate, validateLeastOne } = require('../middlewares/validation.js');
const { isAuthenticated, checkProductOwn } = require('../middlewares/auth.js');
const { productEnum } = require('../../config/product.enum.js');

const router = express.Router();

//getProducts
router.get('/products', isAuthenticated, async (req, res, next) => {
  const query = req.query;
  const sort = query.sort ? query.sort : 'DESC';
  const products = await Products.findAll({
    attributes: ['id', 'userId', 'title', 'contents', 'status', [sequelize.col('username'), 'username'], 'createdAt'],
    include: {
      model: Users,
      attributes: [],
    },
    order: [['createdAt', sort]],
  });
  if (!products) {
    return next(new Error('CheckDBConnect'));
  }
  if (req.accessToken) {
    return res.status(200).send({ products, accessToken: req.accessToken });
  }
  return res.status(200).send(products);
});
// getProductOne
router.get('/product/:id', isAuthenticated, async (req, res, next) => {
  const id = req.params.id;
  const product = await Products.findByPk(id, {
    attributes: ['id', 'userId', 'title', 'contents', 'status', [sequelize.col('username'), 'username'], 'createdAt'],
    include: {
      model: Users,
      attributes: [],
    },
  });
  if (!product) {
    return next(new Error('ProductNotFound'));
  }
  if (req.accessToken) {
    return res.status(200).send({ product, accessToken: req.accessToken });
  }
  return res.status(200).send(product);
});
// add new product
router.post(
  '/products/new',
  isAuthenticated,
  [
    body('title').trim().notEmpty().withMessage('title 을 입력해주세요.'),
    body('contents').trim().notEmpty().withMessage('price 을 입력해주세요.'),
    body('price').trim().notEmpty().withMessage('contents 을 입력해주세요.'),
    validate,
  ],
  async (req, res, next) => {
    const { title, price, contents } = req.body;
    const userId = req.user.id;

    const preProduct = {
      userId,
      title,
      price,
      contents,
    };
    const newProduct = await Products.create(preProduct);
    if (!newProduct) {
      return next(new Error('CheckDBConnect'));
    }
    if (req.accessToken) {
      return res.status(200).send({ message: '등록되었습니다.', accessToken: req.accessToken });
    }
    return res.status(201).json({
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
    body('contents').trim().notEmpty().withMessage('price 을 입력해주세요.'),
    body('price').trim().notEmpty().withMessage('contents 을 입력해주세요.'),
    body('status').trim().notEmpty().withMessage('state 을 입력해주세요.'),
    validateLeastOne,
  ],

  async (req, res, next) => {
    const id = req.params.id;
    const { title, price, contents, status } = req.body;
    // enum check
    if (status && !productEnum.find(enums => enums === status)) {
      return next(new Error('ProductEnumCheck'));
    }

    const product = req.product;
    const updateProduct = {
      UserId: product.UserId,
      title: title ? title : product.title,
      price: price ? price : product.price,
      contents: contents ? contents : product.contents,
      status: status ? status : product.status,
    };
    const updateProducts = await Products.update(updateProduct, {
      where: {
        id: id,
      },
    });
    if (!updateProducts) {
      return next(new Error('CheckDBConnect'));
    }
    if (req.accessToken) {
      return res.status(200).json({
        message: '상품 수정하였습니다.',
        accessToken: req.accessToken,
      });
    }
    return res.status(200).json({
      message: '상품 수정하였습니다.',
    });
  }
);
// delete product
router.delete('/product/:id', [isAuthenticated, checkProductOwn], async (req, res, next) => {
  const id = req.params.id;
  const deleteProduct = await Products.destroy({
    where: {
      id: id,
    },
  });
  if (!deleteProduct) {
    return next(new Error('CheckDBConnect'));
  }
  if (req.accessToken) {
    return res.status(200).json({
      message: '상품 삭제하였습니다.',
      accessToken: req.accessToken,
    });
  }
  return res.status(200).json({
    message: '상품 삭제하였습니다.',
  });
});

module.exports = router;
