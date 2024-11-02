const { ref, set, push, child, get, update, remove } = require('firebase/database');
const { database } = require('../models/database');
const dbRef = ref(database);

const createComment = async (req, res) => {
    try {

        // Đường dẫn tham chiếu đến danh mục mới
        const newCommentRef = push(child(dbRef, 'comments'));
        const newCommentId = newCommentRef.key;

        const now = Date.now();
        const date = new Date(now);
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);

        const parts = formattedDate.split('/'); // Tách chuỗi thành các phần tử
        const reversedDate = `${parts[1]}/${parts[0]}/${parts[2]}`; // Đảo ngược định dạng ngày/tháng

        // Thiết lập giá trị của danh mục
        await set(newCommentRef, {
            id: newCommentId,
            id_video: req.body.id_video,
            id_user: req.body.id_user,
            content: req.body.content,
            created_at: reversedDate,
        });

        res.status(200).json({ success: true, message: 'Bình luận đã được tạo thành công' });
    } catch (error) {
        console.error('Lỗi khi tạo bình luận:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi tạo danh mục' });
    }
};

const changeComment = async (req, res) => {
    try {

        const commentsSnapshot = await get(child(dbRef, 'comments'));
        const comments = commentsSnapshot.val();

        const existingCommentKey = Object.keys(comments).find(
            (commentKey) => comments[commentKey].id === req.body.id
        );

        if (!existingCommentKey) {
            // Sai thông tin đăng nhập
            res.status(401).json({ error: 'Sai thông tin nhập' });
            return;
        } else {

            // Cập nhật bình luận mới
            const commentsRef = child(dbRef, `comments/${existingCommentKey}`);
            update(commentsRef, {
                content: req.body.content,
            });

            res.status(200).json({ message: 'Bình luận đã được thay đổi thành công' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thay đổi bình luận', errorMessage: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const commentsSnapshot = await get(child(dbRef, 'comments'));
        const comments = commentsSnapshot.val();

        const existingCommentKey = Object.keys(comments).find(
            (commentKey) => comments[commentKey].id === req.body.id
        );

        if (!existingCommentKey) {
            res.status(401).json({ error: 'Sai thông tin nhập' });
            return;
        } else {
            const commentsRef = child(dbRef, `comments/${existingCommentKey}`);
            await remove(commentsRef);

            res.status(200).json({ message: 'Bình luận đã được xóa thành công' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa bình luận', errorMessage: error.message });
    }
};

const comments = async (req, res) => {
    try {
        const snapshot = await get(child(dbRef, 'comments'));
        if (snapshot.exists()) {
            const commentsData = snapshot.val();
            const commentsArray = Object.values(commentsData);
            //res.status(200).json(commentsArray);

            const reversedCommentsArray = commentsArray.reverse();
            res.status(200).json(reversedCommentsArray);
        } else {
            res.status(404).json({ message: 'No data available' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createComment,
    changeComment,
    deleteComment,
    comments,

};