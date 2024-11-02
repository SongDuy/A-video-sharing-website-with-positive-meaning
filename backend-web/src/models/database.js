// models/database.js
const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
// Cấu hình Firebase

const firebaseConfig = {
  apiKey: "AIzaSyB6hE9UhbGRa0VSnEQvkVAdUewhgp_zoMs",
  authDomain: "ct550-b1909890.firebaseapp.com",
  databaseURL: "https://ct550-b1909890-default-rtdb.firebaseio.com",
  projectId: "ct550-b1909890",
  storageBucket: "ct550-b1909890.appspot.com",
  messagingSenderId: "580317969966",
  appId: "1:580317969966:web:11db0867a343b2056fa9bf",
  measurementId: "G-2ER0Z3MDJC"
};

// Khởi tạo kết nối Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)

// Export các phương thức tương tác với Firebase Realtime Database
module.exports = {
  database
};  