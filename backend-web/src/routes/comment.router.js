const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment.controller');

// Tạo danh mục
router.post('/createComment', CommentController.createComment);

// Đổi danh mục
router.put('/changeComment', CommentController.changeComment);

// Xóa danh mục
router.delete('/deleteComment', CommentController.deleteComment);

// Danh sách danh mục
router.get('/comments', CommentController.comments);

module.exports = router;