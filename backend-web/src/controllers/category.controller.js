const { ref, set, push, child, get, update, remove } = require('firebase/database');
const { database } = require('../models/database');
const dbRef = ref(database);

const createCategory = async (req, res) => {
    try {

        // Đường dẫn tham chiếu đến danh mục mới
        const newCategoryRef = push(child(dbRef, 'categories'));
        const newCategoryId = newCategoryRef.key;

        const now = Date.now();
        const date = new Date(now);
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);

        const parts = formattedDate.split('/'); // Tách chuỗi thành các phần tử
        const reversedDate = `${parts[1]}/${parts[0]}/${parts[2]}`; // Đảo ngược định dạng ngày/tháng

        // Thiết lập giá trị của danh mục
        await set(newCategoryRef, {
            id: newCategoryId,
            name: req.body.name,
            motto: req.body.motto,
            suggestion: '',
            modification: '',
            description: '',
            created_at: reversedDate,
        });

        res.status(200).json({ success: true, message: 'Danh mục đã được tạo thành công' });
    } catch (error) {
        console.error('Lỗi khi tạo danh mục:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi tạo danh mục' });
    }
};

const changeCategory = async (req, res) => {
    try {

        const categoriesSnapshot = await get(child(dbRef, 'categories'));
        const categories = categoriesSnapshot.val();

        const existingCategoryKey = Object.keys(categories).find(
            (categoryKey) => categories[categoryKey].id === req.body.id
        );

        if (!existingCategoryKey) {
            // Sai thông tin đăng nhập
            res.status(401).json({ error: 'Sai thông tin đăng nhập' });
            return;
        } else {

            // Cập nhật mật khẩu mới
            const categoriesRef = child(dbRef, `categories/${existingCategoryKey}`);
            update(categoriesRef, {
                name: req.body.name,
                motto: req.body.motto,
            });

            res.status(200).json({ message: 'Danh mục đã được thay đổi thành công' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thay đổi danh mục', errorMessage: error.message });
    }
};

const changeCategorySuggestion = async (req, res) => {
    try {

        const categoriesSnapshot = await get(child(dbRef, 'categories'));
        const categories = categoriesSnapshot.val();

        const existingCategoryKey = Object.keys(categories).find(
            (categoryKey) => categories[categoryKey].id === req.body.id
        );

        if (!existingCategoryKey) {
            // Sai thông tin đăng nhập
            res.status(401).json({ error: 'Sai thông tin đăng nhập' });
            return;
        } else {

            // Cập nhật mật khẩu mới
            const categoriesRef = child(dbRef, `categories/${existingCategoryKey}`);
            update(categoriesRef, {
                suggestion: req.body.suggestion,
            });

            res.status(200).json({ message: 'Danh mục đã được thay đổi thành công' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thay đổi danh mục', errorMessage: error.message });
    }
};

const changeCategoryModification = async (req, res) => {
    try {

        const categoriesSnapshot = await get(child(dbRef, 'categories'));
        const categories = categoriesSnapshot.val();

        const existingCategoryKey = Object.keys(categories).find(
            (categoryKey) => categories[categoryKey].id === req.body.id
        );

        if (!existingCategoryKey) {
            // Sai thông tin đăng nhập
            res.status(401).json({ error: 'Sai thông tin đăng nhập' });
            return;
        } else {

            // Cập nhật mật khẩu mới
            const categoriesRef = child(dbRef, `categories/${existingCategoryKey}`);
            update(categoriesRef, {
                modification: req.body.modification,
                suggestion: req.body.suggestion,
            });

            res.status(200).json({ message: 'Danh mục đã được thay đổi thành công' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thay đổi danh mục', errorMessage: error.message });
    }
};

const changeCategoryDescription = async (req, res) => {
    try {

        const categoriesSnapshot = await get(child(dbRef, 'categories'));
        const categories = categoriesSnapshot.val();

        const existingCategoryKey = Object.keys(categories).find(
            (categoryKey) => categories[categoryKey].id === req.body.id
        );

        if (!existingCategoryKey) {
            // Sai thông tin đăng nhập
            res.status(401).json({ error: 'Sai thông tin đăng nhập' });
            return;
        } else {

            // Cập nhật mật khẩu mới
            const categoriesRef = child(dbRef, `categories/${existingCategoryKey}`);
            update(categoriesRef, {
                description: req.body.description,
                modification: req.body.modification,
            });

            res.status(200).json({ message: 'Danh mục đã được thay đổi thành công' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thay đổi danh mục', errorMessage: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const categoriesSnapshot = await get(child(dbRef, 'categories'));
        const categories = categoriesSnapshot.val();

        const existingCategoryKey = Object.keys(categories).find(
            (categoryKey) => categories[categoryKey].id === req.body.id
        );

        if (!existingCategoryKey) {
            res.status(401).json({ error: 'Sai thông tin đăng nhập' });
            return;
        } else {
            const categoriesRef = child(dbRef, `categories/${existingCategoryKey}`);
            await remove(categoriesRef);

            res.status(200).json({ message: 'Danh mục đã được xóa thành công' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa danh mục', errorMessage: error.message });
    }
};

const categories = async (req, res) => {
    try {
        const snapshot = await get(child(dbRef, 'categories'));
        if (snapshot.exists()) {
            const categoriesData = snapshot.val();
            const categoriesArray = Object.values(categoriesData);
            res.status(200).json(categoriesArray);
        } else {
            res.status(404).json({ message: 'No data available' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    createCategory,
    changeCategory,
    changeCategorySuggestion,
    changeCategoryModification,
    changeCategoryDescription,
    deleteCategory,
    categories,

};