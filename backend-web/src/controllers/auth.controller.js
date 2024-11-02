
const { ref, child, set, get, push, update } = require('firebase/database');
const { database } = require('../models/database');
const dbRef = ref(database);

const jwt = require('jsonwebtoken');
const secretKey = 'LyHySD05'; // Thay thế bằng khóa bí mật của bạn

const bcrypt = require('bcrypt');

const login = async (req, res) => {
  try {
    const usersSnapshot = await get(child(dbRef, 'users'));
    const users = usersSnapshot.val();

    const existingUser = Object.values(users).find(
      (user) => user.email === req.body.email
    );

    if (existingUser) {
      const passwordMatch = await bcrypt.compare(req.body.password, existingUser.password);

      if (passwordMatch) {
        // Loại bỏ mật khẩu trước khi gửi phản hồi  
        delete existingUser.password;
        // Đăng nhập thành công
        // const token = jwt.sign({ email: existingStaff.email }, secretKey, { expiresIn: '1h' });
        // res.status(200).json({ message: 'Đăng nhập thành công', token: token });
        res.status(200).json({ message: 'Đăng nhập thành công', user: existingUser });
        //res.status(200).json({ user: existingUser });
      } else {
        res.status(401).json({ error: 'Sai thông tin đăng nhập' });
      }
    } else {
      res.status(401).json({ error: 'Sai thông tin đăng nhập' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng nhập', errorMessage: error.message });
  }
};

const register = async (req, res) => {
  try {
    const usersSnapshot = await get(child(dbRef, 'users'));
    const users = usersSnapshot.val();

    const existingUser = Object.values(users).find(
      (user) => user.id === req.body.id || user.email === req.body.email
    );

    if (existingUser) {
      // Dữ liệu đã tồn tại, không thêm người dùng mới
      res.status(400).json({ error: 'Người dùng đã tồn tại' });
    } else {
      // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Tạo ID tự động cho người dùng mới 
      const newUserRef = push(child(dbRef, 'users'));
      const newUserId = newUserRef.key;

      const now = Date.now();
      const date = new Date(now);
      const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
      const formattedDate = date.toLocaleDateString(undefined, options);

      const parts = formattedDate.split('/'); // Tách chuỗi thành các phần tử
      const reversedDate = `${parts[1]}/${parts[0]}/${parts[2]}`; // Đảo ngược định dạng ngày/tháng

      await set(newUserRef, {
        id: newUserId,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword, // Lưu mật khẩu đã được mã hóa
        avatar: "",
        phone: "",
        address: "",
        gender: "",
        birthday: "",
        created_at: reversedDate,
      });

      res.status(200).json({ message: 'Dữ liệu đã được thêm thành công', userId: newUserId });
    }
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm người dùng', errorMessage: error.message });
  }
};

// const users = async (req, res) => {
//   try {
//     const snapshot = await get(child(dbRef, 'users'));
//     if (snapshot.exists()) {
//       const usersData = snapshot.val();
//       const usersArray = Object.values(usersData);
//       usersArray.forEach((user) => {
//         delete user.password;
//       });
//       res.status(200).json(usersArray);
//     } else {
//       res.status(404).json({ message: 'No data available' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const users = async (req, res) => {
  try {
    const snapshot = await get(child(dbRef, 'users'));
    if (snapshot.exists()) {
      const usersData = snapshot.val();
      const usersArray = Object.values(usersData);
      usersArray.forEach((user) => {
        const parts = user.birthday.split('-'); // Tách chuỗi ngày sinh thành mảng các phần tử
        const formattedBirthday = `${parts[2]}/${parts[1]}/${parts[0]}`; // Định dạng lại chuỗi ngày sinh
        user.birthday = formattedBirthday; // Gán lại giá trị ngày sinh đã định dạng
        delete user.password;
      });
      res.status(200).json(usersArray);
    } else {
      res.status(404).json({ message: 'No data available' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    // Kiểm tra email và mật khẩu hiện tại
    const usersSnapshot = await get(child(dbRef, 'users'));
    const users = usersSnapshot.val();

    const existingUserKey = Object.keys(users).find(
      (userKey) => users[userKey].email === req.body.email && bcrypt.compareSync(req.body.password, users[userKey].password)
    );

    if (!existingUserKey) {
      // Sai thông tin đăng nhập
      res.status(401).json({ error: 'Sai thông tin đăng nhập' });
      return;
    } else {

      // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
      const hashedPassword = await bcrypt.hash(req.body.newpassword, 10);

      // Cập nhật mật khẩu mới
      const usersRef = child(dbRef, `users/${existingUserKey}`);
      update(usersRef, {
        password: hashedPassword
      });

      res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thay đổi mật khẩu', errorMessage: error.message });
  }
};
const changeProfile = async (req, res) => {
  try {
    // Kiểm tra id
    const usersSnapshot = await get(child(dbRef, 'users'));
    const users = usersSnapshot.val();

    const existingUserKey = Object.keys(users).find(
      (userKey) => users[userKey].id === req.body.id
    );

    if (existingUserKey) {
      // Cập nhật profile mới
      const usersRef = child(dbRef, `users/${existingUserKey}`);
      update(usersRef, {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        avatar: req.body.avatar,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender,
        birthday: req.body.birthday,
      });

      // Lấy thông tin người dùng sau khi cập nhật
      const updatedUserSnapshot = await get(child(dbRef, `users/${existingUserKey}`));
      let updatedUser = updatedUserSnapshot.val();

      // Loại bỏ trường password
      if (updatedUser) {
        delete updatedUser.password;
      }

      res.status(200).json({ message: 'Profile đã được thay đổi thành công', user: updatedUser });
    } else {
      res.status(404).json({ error: 'Người dùng không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thay đổi profile', errorMessage: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.body.id; // Lấy userId từ URL parameter

    // Kiểm tra xem người dùng có tồn tại hay không
    const userSnapshot = await get(child(dbRef, `users/${userId}`));
    const user = userSnapshot.val();

    if (!user) {
      // Người dùng không tồn tại
      res.status(404).json({ error: 'Người dùng không tồn tại' });
      return;
    }

    // Xóa người dùng từ Firebase Realtime Database
    await set(child(dbRef, `users/${userId}`), null);

    res.status(200).json({ message: 'Người dùng đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa người dùng', errorMessage: error.message });
  }
};

module.exports = {
  login,
  register,
  changePassword,
  changeProfile,
  deleteUser,
  users,
};