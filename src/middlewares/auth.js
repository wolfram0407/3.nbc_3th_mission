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

function checkAuthenticated(req, res, next) {}

module.exports = {
  isAuthenticated,
};
