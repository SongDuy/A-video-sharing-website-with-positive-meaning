const { ref, get, set, child, update, push } = require('firebase/database');
const { database } = require('../models/database');
const dbRef = ref(database);

const createFavorite = async (req, res) => {
    try {
        const id = req.body.id;
        const id_video = req.body.id_video;

        if (!id_video) {
            return res.status(400).json({ error: 'Missing id_video' });
        }

        const now = Date.now();
        const date = new Date(now);
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);

        const parts = formattedDate.split('/');
        const reversedDate = `${parts[1]}/${parts[0]}/${parts[2]}`;

        const favoritesRef = child(dbRef, 'favorites');
        const snapshot = await get(favoritesRef);

        if (snapshot.exists()) {
            const favorites = snapshot.val();
            const existingFavoriteKey = Object.keys(favorites).find((key) => favorites[key].id === id);

            if (existingFavoriteKey) {
                const existingFavorite = favorites[existingFavoriteKey];
                const existingIdVideos = Array.isArray(existingFavorite.id_videos) ? existingFavorite.id_videos : [];

                if (existingIdVideos.includes(id_video)) {
                    return res
                        .status(200)
                        .json({ success: false, message: 'Đã tồn tại trong danh sách yêu thích' });
                }

                const updatedIdVideos = [...existingIdVideos, id_video];
                await update(child(favoritesRef, `${existingFavoriteKey}`), {
                    id_videos: updatedIdVideos,
                    created_at: reversedDate,
                });

                return res
                    .status(200)
                    .json({ success: true, message: 'Danh mục đã được cập nhật thành công' });
            }
        }

        const newFavoriteRef = push(favoritesRef);
        const newFavoriteKey = newFavoriteRef.key;

        await set(child(favoritesRef, newFavoriteKey), {
            id: id,
            id_videos: [id_video],
            created_at: reversedDate,
        });

        res.status(200).json({ success: true, message: 'Danh mục đã được tạo thành công' });
    } catch (error) {
        console.error('Lỗi khi tạo hoặc cập nhật danh mục:', error);
        res
            .status(500)
            .json({ success: false, message: 'Đã xảy ra lỗi khi tạo hoặc cập nhật danh mục' });
    }
};

const deleteFavorite = async (req, res) => {
    try {
        const id = req.body.id;
        const id_video = req.body.id_video;

        if (!id_video) {
            return res.status(400).json({ error: 'Missing id_video' });
        }

        const favoritesRef = child(dbRef, 'favorites');
        const snapshot = await get(favoritesRef);

        if (snapshot.exists()) {
            const favorites = snapshot.val();
            const existingFavoriteKey = Object.keys(favorites).find(key => favorites[key].id === id);

            if (existingFavoriteKey) {
                const existingFavorite = favorites[existingFavoriteKey];
                const existingIdVideos = Array.isArray(existingFavorite.id_videos) ? existingFavorite.id_videos : [];
                const updatedIdVideos = existingIdVideos.filter(videoId => videoId !== id_video);

                await update(child(favoritesRef, `${existingFavoriteKey}`), { id_videos: updatedIdVideos });

                res.status(200).json({ success: true, message: 'Video đã được xóa khỏi danh mục yêu thích' });
            } else {
                res.status(404).json({ success: false, message: 'Không tìm thấy danh mục yêu thích cho id đã cho' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy danh mục yêu thích' });
        }
    } catch (error) {
        console.error('Lỗi khi xóa video khỏi danh mục yêu thích:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xóa video khỏi danh mục yêu thích' });
    }
};
const favorites = async (req, res) => {
    try {
        const id_user = req.params.id_user;

        const snapshot = await get(child(dbRef, 'favorites'));
        if (snapshot.exists()) {
            const favoritesData = snapshot.val();
            const favoritesArray = Object.values(favoritesData);

            const filteredFavorites = favoritesArray.filter(
                (favorite) => favorite.id === id_user
            );

            res.status(200).json(filteredFavorites);
        } else {
            res.status(200).json([]); // Trả về mảng rỗng khi không có dữ liệu
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createFavorite,
    deleteFavorite,
    favorites,
}; 