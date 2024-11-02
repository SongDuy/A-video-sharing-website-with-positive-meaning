const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');

// Tạo danh mục
router.post('/admin/createCategory', CategoryController.createCategory);

// Đổi danh mục
router.put('/admin/changeCategory', CategoryController.changeCategory);

// Đề Xuất tiêu chuẩn nội dung danh mục
router.put('/admin/changeCategorySuggestion', CategoryController.changeCategorySuggestion);

// Chỉnh sửa tiêu chuẩn nội dung danh mục
router.put('/admin/changeCategoryModification', CategoryController.changeCategoryModification);

// Cập nhật tiêu chuẩn nội dung danh mục
router.put('/admin/changeCategoryDescription', CategoryController.changeCategoryDescription);

// Xóa danh mục
router.delete('/admin/deleteCategory', CategoryController.deleteCategory);

// Danh sách danh mục
router.get('/admin/categories', CategoryController.categories);

module.exports = router;