const jwt = require('jsonwebtoken');
const secretKey = 'LyHySD05'; // Thay thế bằng khóa bí mật của bạn

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

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

module.exports = authenticateToken;