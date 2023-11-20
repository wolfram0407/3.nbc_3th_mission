// import
const jwt = require('jsonwebtoken');
const { Products, Refreshtoken } = require('../../models');

// checked login
async function isAuthenticated(req, res, next) {
  // const token = req.headers['authorization'];
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // accessToken verified
  if (!accessToken) {
    console.log('accessToken NotFound not found');
    return next(new Error('accessTokenNotFound')); //
  }
  const verifiedAccessToken = verifyAccessToken(accessToken);
  // 인증 성공하면
  if (verifiedAccessToken) {
    req.user = verifiedAccessToken;
    next();
  }
  // accessToken not verified
  if (!refreshToken) {
    return next(new Error('accessTokenNotFound'));
  }
  // exist refresh token
  const verifiedRefreshToken = await verifyRefreshToken(refreshToken);
  if (!verifiedRefreshToken) {
    return next(new Error('refreshTokenNotFound'));
  }

  const findDBToken = await Refreshtoken.findOne({
    where: {
      userId: verifiedRefreshToken.id,
    },
  });
  const findToken = findDBToken.dataValues.refrshtoken;
  if (findToken !== refreshToken) {
    return next(new Error('refreshTokenNotMatched'));
  }

  // 재발급 진행
  const neqAccessToken = jwt.sign({ id: verifiedRefreshToken.id }, process.env.SECRETTEXT, { expiresIn: '30s' });
  const newVerifyAccessToken = verifyAccessToken(neqAccessToken);
  console.log(newVerifyAccessToken);

  req.user = newVerifyAccessToken;
  req.accessToken = neqAccessToken;

  next();
}

function verifyAccessToken(accessTokenToken) {
  try {
    console.log(accessTokenToken);
    return jwt.verify(accessTokenToken, process.env.SECRETTEXT);
  } catch (error) {
    return false;
  }
}
async function verifyRefreshToken(refreshTokenToken) {
  try {
    console.log(refreshTokenToken);
    return jwt.verify(refreshTokenToken, process.env.REFRESHSECRETTEXT);
  } catch (error) {
    return false;
  }
}

//   if (accessTokenToken) {
//     jwt.verify(accessTokenToken, process.env.SECRETTEXT, (err, user) => {
//       if (err) {
//         if (err.name === 'TokenExpiredError') {
//           console.log('accessTokenToken  검증에러 발생');
//         }
//         console.log('accessTokenToken  에러 발생');
//         console.log(err.name);
//       }
//       req.user = user;
//       next();
//     });
//     console.log(verifyAccessToken);
//   }
//   console.log('!!2');
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
