const { ref, get, set, child, update, push } = require('firebase/database');
const { database } = require('../models/database');
const dbRef = ref(database);

const createFollow = async (req, res) => {
    try {
        const id = req.body.id;
        const id_follow = req.body.id_follow;

        if (!id_follow) {
            return res.status(400).json({ error: 'Missing id_follow' });
        }

        const now = Date.now();
        const date = new Date(now);
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);

        const parts = formattedDate.split('/');
        const reversedDate = `${parts[1]}/${parts[0]}/${parts[2]}`;

        const followsRef = child(dbRef, 'follows');
        const newFollowRef = push(followsRef);
        const newFollowKey = newFollowRef.key;

        const snapshot = await get(followsRef);
        if (snapshot.exists()) {
            const follows = snapshot.val();
            const existingFollowKey = Object.keys(follows).find(key => follows[key].id === id);
            if (existingFollowKey) {
                const existingFollow = follows[existingFollowKey]; // Thay đổi biến favorites thành follows
                const existingIdFollows = Array.isArray(existingFollow.id_follows) ? existingFollow.id_follows : []; // Thay đổi biến id_follow thành id_follows
                if (existingIdFollows.includes(id_follow)) {
                    return res.status(200).json({ success: false, message: 'Đã tồn tại trong danh sách đăng ký' });
                }
                const updatedIdFollows = [...existingIdFollows, id_follow];
                await update(child(followsRef, `${existingFollowKey}`), { id_follows: updatedIdFollows, created_at: reversedDate }); // Thay đổi biến favorites thành follows
            } else {
                await set(child(followsRef, newFollowKey), {
                    id: id,
                    id_follows: [id_follow], // Thay đổi biến id_follow thành id_follows
                    created_at: reversedDate,
                });
            }
        } else {
            await set(child(followsRef, newFollowKey), {
                id: id,
                id_follows: [id_follow], // Thay đổi biến id_follow thành id_follows
                created_at: reversedDate,
            });
        }

        res.status(200).json({ success: true, message: 'Danh mục đã được tạo hoặc cập nhật thành công' });
    } catch (error) {
        console.error('Lỗi khi tạo hoặc cập nhật danh mục:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi tạo hoặc cập nhật danh mục' });
    }
};


const deleteFollow = async (req, res) => {
    try {
        const id = req.body.id;
        const id_follow = req.body.id_follow;

        if (!id_follow) {
            throw new Error('Missing id_follow');
        }

        const followsRef = child(dbRef, 'follows');
        const snapshot = await get(followsRef);

        if (snapshot.exists()) {
            const follows = snapshot.val();
            const existingFollowKey = Object.keys(follows).find(key => follows[key].id === id);

            if (existingFollowKey) {
                const existingFollow = follows[existingFollowKey];
                const existingIdFollows = Array.isArray(existingFollow.id_follows) ? existingFollow.id_follows : [];
                const updatedIdFollows = existingIdFollows.filter(followId => followId !== id_follow);

                await update(child(followsRef, `${existingFollowKey}`), { id_follows: updatedIdFollows });

                res.status(200).json({ success: true, message: 'Kênh đã được xóa khỏi kênh đăng ký' });
            } else {
                res.status(404).json({ success: false, message: 'Không tìm thấy kênh đăng ký cho id đã cho' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy kênh đăng ký' });
        }
    } catch (error) {
        console.error('Lỗi khi xóa video khỏi danh mục yêu thích:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xóa kênh đăng ký khỏi danh mục đăng ký' });
    }
};

const follows = async (req, res) => {
    try {
        const id_user = req.params.id_user;

        const snapshot = await get(child(dbRef, 'follows'));
        if (snapshot.exists()) {
            const followsData = snapshot.val();
            const followsArray = Object.values(followsData);

            const filteredFollows = followsArray.filter(
                (follow) => follow.id === id_user
            );

            res.status(200).json(filteredFollows);
        } else {
            res.status(200).json([]); // Trả về mảng rỗng khi không có dữ liệu
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createFollow,
    deleteFollow,
    follows,
};