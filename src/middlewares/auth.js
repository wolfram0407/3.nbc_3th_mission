// import
const jwt = require('jsonwebtoken');

// checked login
function isAuthenticated(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ errorMessage: '로그인을 해주세요!' });

  jwt.verify(token, process.env.SECRETTEXT, (err, user) => {
    if (err) res.status(403).json({ errorMessage: '로그인을 해주세요.' });

    req.user = user;
    next();
  });
}

async function checkProductOwn(req, res, next) {
  const id = req.params.id;
  const user = req.user.userId;
  const product = await Products.findByPk(id);

  if (user !== product.UserId) {
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
