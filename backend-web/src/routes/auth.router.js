const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

// Đăng nhập
router.post('/login', AuthController.login);

// Đăng ký
router.post('/register', AuthController.register);

// Danh sách user
router.get('/users', AuthController.users);

// Đổi mật khẩu
router.put('/changePassword', AuthController.changePassword);

// Đổi thông tin tài khoản
router.put('/changeProfile', AuthController.changeProfile);

// Xóa user
router.delete('/deleteUser', AuthController.deleteUser);



module.exports = router;