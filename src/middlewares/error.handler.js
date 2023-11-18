function errorHandler(errName, req, res) {
  //console.log(errName);
  switch (errName) {
    case 'ExistsEmail':
      return res.status(400).json({
        errorMessage: '이미 사용인 이메일 입니다.',
      });
    case 'NotCorrect':
      return res.status(400).send({
        errorMessage: '패스워드가 일치하지 않습니다.!',
      });
    case 'ProductEnumCheck':
      return res.status(400).json({
        errorMessage: ' status 확인해주세요.',
      });
    case 'TokenExpiredError':
    case 'JsonWebTokenError':
    case 'jwt expired':
    case 'RefreshTokenNotFound':
      return res.status(401).send({
        errorMessage: '로그인을 해주세요!',
      });
    case 'Forbidden':
      return res.status(403).send({
        errorMessage: '권한이 없습니다.',
      });
    case 'ProductNotFound':
      return res.status(404).send({
        errorMessage: '상품이 없습니다.',
      });
    case 'EmailNotFound':
      return res.status(404).send({
        errorMessage: '이메일을 확인해주세요.',
      });

    case 'CheckDBConnect':
      return res.status(500).send({
        errorMessage: 'DB를 확인해주세요.',
      });

    default:
      return res.status(500).send({
        errorMessage: 'Error Occurred',
      });
  }
}

module.exports = {
  errorHandler,
};
