// import
const jwt = require('jsonwebtoken');
const { Products } = require('../../models');

// checked login
function isAuthenticated(req, res, next) {
  const token = req.headers['authorization'];
  // const accessTokenToken = req.cookies.accessTokenToken;
  // const refreshToken = req.cookies.refreshToken;

  // if(refreshToken)
  jwt.verify(token, process.env.SECRETTEXT, (err, user) => {
    if (err) {
      return next(err);
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
    return next(new Error('ProductNotFound'));
  }

  if (userId !== product.userId) {
    return next(new Error('Forbidden'));
  }
  req.product = product;
  next();
}
module.exports = {
  isAuthenticated,
  checkProductOwn,
};
