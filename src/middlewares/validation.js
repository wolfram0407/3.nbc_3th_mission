const { validationResult } = require('express-validator');

function validation(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({
    message: errors.array()[0].msg,
  });
}

module.exports = {
  validation,
};
