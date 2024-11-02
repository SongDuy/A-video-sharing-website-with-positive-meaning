// app.js
// const express = require('express');
// const bodyParser = require('body-parser');
// const databaseRoutes = require('./routes/database');

// const app = express();

// // Cấu hình middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Cấu hình tuyến API
// app.use('/api/database', databaseRoutes);

// // Khởi chạy server
// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

// const express = require('express');
// const session = require('express-session');
// const firebaseAdmin = require('firebase-admin');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// const port = 3000;

// // Cấu hình Firebase Admin SDK
// const serviceAccount = {
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
// };

// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(serviceAccount),
// });

// // Cấu hình middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(session({
//   secret: 'secret-key',
//   resave: false,
//   saveUninitialized: false
// }));

// // Middleware kiểm tra xem người dùng đã đăng nhập chưa
// function requireLogin(req, res, next) {
//   if (!req.session.userId) {
//     return res.redirect('/login');
//   }
//   next();
// }

// // Trang đăng nhập
// app.get('/login', (req, res) => {
//   res.send(`
//     <h1>Trang đăng nhập</h1>
//     <form method="POST" action="/login">
//       <input type="text" name="email" placeholder="Email" required><br>
//       <input type="password" name="password" placeholder="Mật khẩu" required><br>
//       <button type="submit">Đăng nhập</button>
//     </form>
//   `);
// });

// // Xử lý đăng nhập
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;
//   firebaseAdmin.auth().getUserByEmail(email)
//     .then(user => {
//       firebaseAdmin.auth().signInWithEmailAndPassword(user.email, password)
//         .then(() => {
//           req.session.userId = user.uid; // Lưu userId trong session
//           res.redirect('/dashboard');
//         })
//         .catch(error => {
//           console.error('Lỗi đăng nhập: ', error);
//           res.redirect('/login');
//         });
//     })
//     .catch(error => {
//       console.error('Lỗi đăng nhập: ', error);
//       res.redirect('/login');
//     });
// });

// // Trang dashboard (yêu cầu đăng nhập)
// app.get('/dashboard', requireLogin, (req, res) => {
//   res.send(`<h1>Trang dashboard</h1><p>Chào mừng bạn đến với dashboard!</p>`);
// });

// // Đăng xuất
// app.get('/logout', (req, res) => {
//   req.session.destroy(() => {
//     res.redirect('/login');
//   });
// });

// // Khởi động server
// app.listen(port, () => {
//   console.log(`Server đang chạy trên cổng ${port}`);
// });