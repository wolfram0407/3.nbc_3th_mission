// import
const jwt = require('jsonwebtoken');
const { Products } = require('../../models');
// checked login
function isAuthenticated(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({
      errorMessage: '로그인을 해주세요!',
    });
  }

  jwt.verify(token, process.env.SECRETTEXT, (err, user) => {
    if (err) {
      return res.status(403).json({
        errorMessage: '로그인을 해주세요.',
      });
    }
    req.user = user;
    next();
  });
}

async function checkProductOwn(req, res, next) {
  const id = req.params.id;
  const userId = req.user.id;
  const product = await Products.findByPk(id);
  if (!product) {
    return res.status(404).json({
      errorMessage: '상품 조회에 실패하였습니다.',
    });
  }
  if (userId !== product.userId) {
    return res.status(403).json({
      errorMessage: '권한이 없습니다.',
    });
  }
  req.product = product;
  next();
}
module.exports = {
  isAuthenticated,
  checkProductOwn,
};
