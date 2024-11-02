const express = require('express');
const router = express.Router();
const VideoController = require('../controllers/video.controller');

const storage = require('../configs/multer.config')

// Tải video
router.post('/uploadVideo', storage.single('file'), VideoController.uploadVideo);

// Danh sách video
router.get('/videos', VideoController.videos);

// Danh sách các video được chấp nhận
router.get('/acceptedVideos', VideoController.acceptedVideos);

// Đổi trạng thái 
router.put('/admin/video/changeStatus', VideoController.changeVideoStatus);

// Xóa video
router.delete('/deleteVideo', VideoController.deleteVideoAndContent);

// Tìm video theo tiêu đề 
router.post('/searchVideosByTitle', VideoController.searchVideosByTitle);

module.exports = router;

