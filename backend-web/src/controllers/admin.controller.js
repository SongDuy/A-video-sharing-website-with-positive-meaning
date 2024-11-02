
const { ref, child, set, get, push, update } = require('firebase/database');
const { database } = require('../models/database');
const dbRef = ref(database);

const jwt = require('jsonwebtoken');
const secretAdminKey = 'LyHySD0599'; // Thay thế bằng khóa bí mật của bạn

const bcrypt = require('bcrypt');

const login = async (req, res) => {
  try {
    const adminSnapshot = await get(child(dbRef, 'admin'));
    const admin = adminSnapshot.val();

    const existingAdmin = Object.values(admin).find(
      (admin) => admin.email === req.body.email //&& admin.password === req.body.password
    );

    if (existingAdmin) {
      const passwordMatch = await bcrypt.compare(req.body.password, existingAdmin.password);

      if (passwordMatch) {
        delete existingAdmin.password;
        res.status(200).json({ message: 'Đăng nhập thành công', admin: existingAdmin });
      } else {
        res.status(401).json({ error: 'Sai thông tin đăng nhập' });
      }
    } else {
      // Sai thông tin đăng nhập
      res.status(401).json({ error: 'Sai thông tin đăng nhập' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng nhập', errorMessage: error.message });
  }
};

const register = async (req, res) => {
  try {
    const adminSnapshot = await get(child(dbRef, 'admin'));
    const admin = adminSnapshot.val();

    const existingAdmin = Object.values(admin).find(
      (admin) => admin.id === req.body.id || admin.email === req.body.email //|| admin.password === req.body.password
    );

    if (existingAdmin) {
      // Dữ liệu đã tồn tại, không thêm người dùng mới
      res.status(400).json({ error: 'Người dùng đã tồn tại' });
    } else {
      // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Tạo ID tự động cho người dùng mới
      const newAdminRef = push(child(dbRef, 'admin'));
      const newAdminId = newAdminRef.key;

      const now = Date.now();
      const date = new Date(now);
      const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
      const formattedDate = date.toLocaleDateString(undefined, options);

      const parts = formattedDate.split('/'); // Tách chuỗi thành các phần tử
      const reversedDate = `${parts[1]}/${parts[0]}/${parts[2]}`; // Đảo ngược định dạng ngày/tháng

      await set(newAdminRef, {
        id: newAdminId,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        created_at: reversedDate
      });

      res.status(200).json({ message: 'Dữ liệu đã được thêm thành công', adminId: newAdminId });
    }
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm người dùng', errorMessage: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    // Kiểm tra email và mật khẩu hiện tại
    const adminSnapshot = await get(child(dbRef, 'admin'));
    const admin = adminSnapshot.val();

    const existingAdminKey = Object.keys(admin).find(
      (adminKey) => admin[adminKey].email === req.body.email && bcrypt.compareSync(req.body.password, admin[adminKey].password)
    );

    if (!existingAdminKey) {
      // Sai thông tin đăng nhập
      res.status(401).json({ error: 'Sai thông tin đăng nhập' });
      return;
    } else {

      // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
      const hashedPassword = await bcrypt.hash(req.body.newpassword, 10);

      // Cập nhật mật khẩu mới
      const adminRef = child(dbRef, `admin/${existingAdminKey}`);
      update(adminRef, {
        password: hashedPassword
      });

      res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thay đổi mật khẩu', errorMessage: error.message });
  }
};

const admin = async (req, res) => {
  try {
    const snapshot = await get(child(dbRef, 'admin'));
    if (snapshot.exists()) {
      const adminData = snapshot.val();
      const adminArray = Object.values(adminData);
      adminArray.forEach((admin) => {
        delete admin.password;
      });
      res.status(200).json(adminArray);
    } else {
      res.status(404).json({ message: 'No data available' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  login,
  register,
  changePassword,
  admin
};  