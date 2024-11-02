
const { ref, child, set, get, push, update, remove } = require('firebase/database');
const { database } = require('../models/database');
const dbRef = ref(database);

const jwt = require('jsonwebtoken');
const secretKey = 'LyHySD0505'; // Thay thế bằng khóa bí mật của bạn

const bcrypt = require('bcrypt');

const login = async (req, res) => {
  try {
    const staffsSnapshot = await get(child(dbRef, 'staffs'));
    const staffs = staffsSnapshot.val();

    const existingStaff = Object.values(staffs).find(
      (staff) => staff.email === req.body.email //&& staff.password === req.body.password
    );

    if (existingStaff) {
      const passwordMatch = await bcrypt.compare(req.body.password, existingStaff.password);

      if (passwordMatch) {
        delete existingStaff.password;
        res.status(200).json({ message: 'Đăng nhập thành công', staff: existingStaff });
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
    const staffsSnapshot = await get(child(dbRef, 'staffs'));
    const staffs = staffsSnapshot.val();

    const existingStaff = Object.values(staffs).find(
      (staff) => staff.id === req.body.id || staff.email === req.body.email //|| staff.password === req.body.password
    );

    if (existingStaff) {
      // Dữ liệu đã tồn tại, không thêm người dùng mới
      res.status(400).json({ error: 'Người dùng đã tồn tại' });
    } else {
      // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Tạo ID tự động cho người dùng mới
      const newStaffRef = push(child(dbRef, 'staffs'));
      const newStaffId = newStaffRef.key;

      const now = Date.now();
      const date = new Date(now);
      const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
      const formattedDate = date.toLocaleDateString(undefined, options);

      const parts = formattedDate.split('/'); // Tách chuỗi thành các phần tử
      const reversedDate = `${parts[1]}/${parts[0]}/${parts[2]}`; // Đảo ngược định dạng ngày/tháng

      await set(newStaffRef, {
        id: newStaffId,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        group: req.body.group,
        level: req.body.level,
        created_at: reversedDate // sử dụng thời gian hiện tại
      });

      res.status(200).json({ message: 'Dữ liệu đã được thêm thành công', staffId: newStaffId });
    }
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm người dùng', errorMessage: error.message });
  }
};

const changeStaff = async (req, res) => {
  try {

    const staffsSnapshot = await get(child(dbRef, 'staffs'));
    const staffs = staffsSnapshot.val();

    const existingStaffKey = Object.keys(staffs).find(
      (staffKey) => staffs[staffKey].id === req.body.id
    );

    if (!existingStaffKey) {
      // Sai thông tin đăng nhập
      res.status(401).json({ error: 'Sai thông tin ID' });
      return;
    } else {
      // const hashedPassword = await bcrypt.hash(req.body.newpassword, 10);
      // Cập nhật mật khẩu mới
      const staffsRef = child(dbRef, `staffs/${existingStaffKey}`);
      update(staffsRef, {
        name: req.body.name,
        email: req.body.email,
        // password: hashedPassword,
        group: req.body.group,
        level: req.body.level,
      });

      res.status(200).json({ message: 'Thông tin nhân viên đã được thay đổi thành công' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thay đổi thông tin nhân viên', errorMessage: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    // Kiểm tra email và mật khẩu hiện tại
    const staffsSnapshot = await get(child(dbRef, 'staffs'));
    const staffs = staffsSnapshot.val();

    const existingStaffKey = Object.keys(staffs).find(
      (staffKey) => staffs[staffKey].email === req.body.email && bcrypt.compareSync(req.body.password, staffs[staffKey].password)
    );

    if (!existingStaffKey) {
      // Sai thông tin đăng nhập
      res.status(401).json({ error: 'Sai thông tin đăng nhập' });
      return;
    } else {
      // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
      const hashedPassword = await bcrypt.hash(req.body.newpassword, 10);

      // Cập nhật mật khẩu mới
      const staffsRef = child(dbRef, `staffs/${existingStaffKey}`);
      update(staffsRef, {
        password: hashedPassword
      });

      res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thay đổi mật khẩu', errorMessage: error.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const staffsSnapshot = await get(child(dbRef, 'staffs'));
    const staffs = staffsSnapshot.val();

    const existingStaffKey = Object.keys(staffs).find(
      (staffKey) => staffs[staffKey].id === req.body.id
    );

    if (!existingStaffKey) {
      res.status(401).json({ error: 'Sai thông tin ID' });
      return;
    } else {
      const staffsRef = child(dbRef, `staffs/${existingStaffKey}`);
      await remove(staffsRef);

      res.status(200).json({ message: 'Tài khoản nhân viên đã được xóa thành công' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa tài khoản nhân viên', errorMessage: error.message });
  }
};

const staffs = async (req, res) => {
  try {
    const snapshot = await get(child(dbRef, 'staffs'));
    if (snapshot.exists()) {
      const staffsData = snapshot.val();
      const staffsArray = Object.values(staffsData);
      staffsArray.forEach((staff) => {
        delete staff.password;
      });
      res.status(200).json(staffsArray);
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
  changeStaff,
  changePassword,
  staffs,
  deleteStaff
};