const express = require('express');
const router = express.Router();
const FollowController = require('../controllers/follow.controller');

// Tạo danh mục
router.post('/createFollow', FollowController.createFollow);

// xóa danh mục
router.delete('/deleteFollow', FollowController.deleteFollow);

// Danh sách danh mục
router.get('/follows/:id_user', FollowController.follows);

module.exports = router;