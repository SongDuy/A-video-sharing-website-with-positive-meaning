const cloudinary = require("../configs/cloudinary.config");
const { ref, child, push, get, update, remove } = require('firebase/database');

const { database } = require('../models/database');
const dbRef = ref(database);

const uploadVideo = async (req, res) => {
    try {
        const uploadRef = child(dbRef, 'videos');
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video",
            folder: "video",
        });

        const now = Date.now();
        const date = new Date(now);
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);

        const parts = formattedDate.split('/'); // Tách chuỗi thành các phần tử
        const reversedDate = `${parts[1]}/${parts[0]}/${parts[2]}`; // Đảo ngược định dạng ngày/tháng

        const newUpload = {
            cloudinary_id: result.public_id,
            name_file: req.file.originalname,
            url_video: result.url,
            id_user: req.body.id_user,
            title: req.body.title,
            description: req.body.description,
            id_category: req.body.id_category,
            status: 'chờ xem xét',
            created_at: reversedDate
        };

        push(uploadRef, newUpload)
            .then((snapshot) => {
                console.log('Upload added successfully');
                const response = {
                    message: 'Upload added successfully',
                    key: snapshot.key
                };
                return res.status(200).send(response);
            })
            .catch((error) => {
                console.error('Error adding upload:', error);
                return res.status(500).send(error);
            });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Đã xảy ra lỗi khi tải video', errorMessage: error.message });
    }
};

const deleteVideoAndContent = async (req, res) => {
    try {
        const cloudinaryId = req.body.cloudinary_id;
        const videosSnapshot = await get(child(dbRef, 'videos'));
        const videos = videosSnapshot.val();

        const existingVideoKey = Object.keys(videos).find(
            (videoKey) => videos[videoKey].cloudinary_id === cloudinaryId
        );

        if (!existingVideoKey) {
            res.status(401).json({ error: 'Sai mã video' });
            return;
        } else {
            const response = await cloudinary.uploader.destroy(cloudinaryId, { resource_type: "video" });
            console.log(response);
            const videosRef = child(dbRef, `videos/${existingVideoKey}`);
            await remove(videosRef);

            res.status(200).json({ message: 'Video đã được xóa thành công' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa video', errorMessage: error.message });
    }
};

const videos = async (req, res) => {
    try {
        const snapshot = await get(child(dbRef, 'videos'));
        if (snapshot.exists()) {
            const videoList = [];
            snapshot.forEach((childSnapshot) => {
                const video = childSnapshot.val();
                videoList.push(video);
            });
            res.status(200).json(videoList);
        } else {
            res.status(404).json({ message: 'No data available' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const acceptedVideos = async (req, res) => {
    try {
        const snapshot = await get(child(dbRef, 'videos'));
        if (snapshot.exists()) {
            const videoList = [];
            snapshot.forEach((childSnapshot) => {
                const video = childSnapshot.val();
                videoList.push(video);
            });

            // Lọc danh sách video với status === "chấp nhận"
            const acceptedVideosList = videoList.filter(video => video.status === "chấp nhận");

            if (acceptedVideosList.length > 0) {
                const reversedVideosList = acceptedVideosList.reverse();
                res.status(200).json(reversedVideosList);
            } else {
                res.status(404).json({ message: 'No accepted videos available' });
            }
        } else {
            res.status(404).json({ message: 'No data available' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const changeVideoStatus = async (req, res) => {
    try {

        const videosSnapshot = await get(child(dbRef, 'videos'));
        const videos = videosSnapshot.val();

        const existingVideoKey = Object.keys(videos).find(
            (videoKey) => videos[videoKey].cloudinary_id === req.body.cloudinary_id
        );

        if (!existingVideoKey) {
            // Sai thông tin đăng nhập
            res.status(401).json({ error: 'Sai id video' });
            return;
        } else {

            // Cập nhật mật khẩu mới
            const videosRef = child(dbRef, `videos/${existingVideoKey}`);
            update(videosRef, {
                status: req.body.status,
            });

            res.status(200).json({ message: 'Trạng thái video đã được thay đổi thành công' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thay đổi trạng thái', errorMessage: error.message });
    }
};

const searchVideosByTitle = async (req, res) => {
    try {
        const searchTitle = req.body.title; // Get video title from the request body

        if (!searchTitle) {
            // Missing or empty 'title' parameter
            return res.status(400).json({ error: 'Thiếu thông tin tìm kiếm video' });
        }

        const videosSnapshot = await get(child(dbRef, 'videos'));
        const videos = videosSnapshot.val();

        if (!videos) {
            // No videos found in the database
            return res.status(200).json({ videos: [] });
        }

        // Filter videos with status === 'chấp nhận'
        const filteredVideos = Object.values(videos).filter((video) => video.status === 'chấp nhận');

        const regex = new RegExp(searchTitle, 'i');
        const matchingVideos = filteredVideos.filter((video) => video.title && regex.test(video.title));

        res.status(200).json({ videos: matchingVideos });
    } catch (error) {
        // Error handling
        console.error('Error when searching for videos:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi tìm kiếm video', errorMessage: error.message });
    }
};

module.exports = {
    uploadVideo,
    videos,
    acceptedVideos,
    changeVideoStatus,
    deleteVideoAndContent,
    searchVideosByTitle,
}