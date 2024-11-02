const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/favorite.controller');

// Tạo danh mục
router.post('/createFavorite', FavoriteController.createFavorite);

// xóa danh mục
router.delete('/deleteFavorite', FavoriteController.deleteFavorite);

// Danh sách danh mục
router.get('/favorites/:id_user', FavoriteController.favorites);

module.exports = router;