const jwt = require('jsonwebtoken');
const secretKey = 'LyHySD0599'; // Thay thế bằng khóa bí mật của bạn

const adminenticateToken = (req, res, next) => {
  const token = req.headers.adminorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token không tồn tại' });
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ error: 'Token không hợp lệ' });
    }

    req.user = decodedToken;
    next();
  });
};

module.exports = adminenticateToken;