const express = require('express');
const { body } = require('express-validator');
const { Products, Users, sequelize } = require('../../models');

const { validate, validateLeastOne } = require('../middlewares/validation.js');
const { isAuthenticated, checkProductOwn } = require('../middlewares/auth.js');
const { productEnum } = require('../../config/product.enum.js');
const { emit } = require('nodemon');
const router = express.Router();

//getProducts
router.get('/products', isAuthenticated, async (req, res) => {
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
  res.send(products);
});
// getProductOne
router.get('/product/:id', isAuthenticated, async (req, res) => {
  const id = req.params.id;
  const product = await Products.findByPk(id, {
    attributes: ['id', 'userId', 'title', 'contents', 'status', [sequelize.col('username'), 'username'], 'createdAt'],
    include: {
      model: Users,
      attributes: [],
    },
  });
  if (!product) {
    return res.status(404).json({
      errorMessage: '해당 상품이 없습니다.',
    });
  }
  res.send(product);
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
  async (req, res) => {
    const { title, price, contents } = req.body;
    const userId = req.user.id;

    const newProduct = {
      userId,
      title,
      price,
      contents,
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
    body('contents').trim().notEmpty().withMessage('price 을 입력해주세요.'),
    body('price').trim().notEmpty().withMessage('contents 을 입력해주세요.'),
    body('status').trim().notEmpty().withMessage('state 을 입력해주세요.'),
    validateLeastOne,
  ],

  async (req, res) => {
    const id = req.params.id;
    const { title, price, contents, status } = req.body;
    // enum check
    if (status && !productEnum.find(enums => enums === status)) {
      return res.status(400).json({
        errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
      });
    }

    const product = req.product;
    const updateProduct = {
      UserId: product.UserId,
      title: title ? title : product.title,
      price: price ? price : product.price,
      contents: contents ? contents : product.contents,
      status: status ? status : product.status,
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
