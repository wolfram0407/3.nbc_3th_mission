const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
}

function validateLeastOne(req, res, next) {
  const errors = validationResult(req);
  if (errors.errors.length === 4) {
    return res.status(400).json({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
  next();
}

module.exports = {
  validate,
  validateLeastOne,
};
