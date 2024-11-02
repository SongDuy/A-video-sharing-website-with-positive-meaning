import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import HeaderPage from './components/layout/header';
import Home from './components/layout/index';

import RegisterPage from './components/auth/register';
import ForgotPasswordPage from './components/auth/forgotPassword';
import MyChannel from './components/layout/myChannel';
import ChannelFollowedPage from './components/layout/channelFollowed';
import ChannelVideoPage from './components/layout/channelVideo';

import LoginAdminPage from './components/admin/loginAdmin';
import AdminPage from './components/admin/admin';

import LoginStaffPage from './components/satff/loginStaff';
import VideoPage from './components/layout/video';
import ProfilePage from './components/auth/profile';
import UploadVideoPage from './components/layout/uploadVideo';
import CategoryVideoPage from './components/layout/categoryVideo';
import SearchVideoPage from './components/layout/searchVideo';
import FavoriteVideoPage from './components/layout/favoriteVideo';
import WatchVideoPage from './components/layout/watchVideo';
import LawCategoryPage from './components/layout/lawCategory';

import StaffGroup01Page from './components/satff/staffGroup01';
import StaffGroup02Page from './components/satff/staffGroup02';
import StaffGroup03Page from './components/satff/staffGroup03';

// Thành phần hiển thị trang không tồn tại
const NotFoundPage = () => {
  return (
    <div className="text-center mt-[200px]">
      <h1>Trang không tồn tại</h1>
      {/* Bạn có thể tùy chỉnh nội dung và giao diện của trang lỗi ở đây */}
    </div>
  );
};

const isLoggedIn = localStorage.getItem('login');
const isLoggedInStaffGroup01 = localStorage.getItem('loginStaffGroup01');
const isLoggedInStaffGroup02 = localStorage.getItem('loginStaffGroup02');
const isLoggedInStaffGroup03 = localStorage.getItem('loginStaffGroup03');

const isLoggedInAdmin = localStorage.getItem('loginAdmin');
//console.log(isLoggedIn);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/header" element={<HeaderPage />}></Route>

        <Route path="/register" element={<RegisterPage />}></Route>

        <Route path="/login/admin" element={<LoginAdminPage />}></Route>
        <Route path="/login/staff" element={<LoginStaffPage />}></Route>

        <Route path="/forgotPassword" element={<ForgotPasswordPage />}></Route>
        <Route path="/video" element={<VideoPage />}></Route>
        <Route path="/watch/:videoId" element={<WatchVideoPage />}></Route>

        <Route path="/category/:categoryId" element={<CategoryVideoPage />}> </Route>
        <Route path="/channel/:channelId" element={<ChannelVideoPage />}> </Route>
        <Route path="/search/:searchValue" element={<SearchVideoPage />}></Route>
        <Route path="/law/categories" element={<LawCategoryPage />}></Route>

        {/* Chỉ cho phép truy cập khi đã đăng nhập */}
        {isLoggedIn === "true" && (
          <>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/upload/video" element={<UploadVideoPage />}></Route>
            <Route path="/myChannel/:myId" element={<MyChannel />}> </Route>
            <Route path="/favorite/:favoriteId" element={<FavoriteVideoPage />}></Route>
            <Route path="/channel/followed/:followedId" element={<ChannelFollowedPage />}></Route>
          </>
        )}

        {/* Chỉ cho phép truy cập khi đã đăng nhập tài khoản nhóm 1 */}
        {isLoggedInStaffGroup01 === "true" && (
          <>
            <Route path="/staff/group01/:staffId" element={<StaffGroup01Page />}></Route>

          </>
        )}

        {/* Chỉ cho phép truy cập khi đã đăng nhập tài khoản nhóm 2 */}
        {isLoggedInStaffGroup02 === "true" && (
          <>
            <Route path="/staff/group02/:staffId" element={<StaffGroup02Page />}></Route>

          </>
        )}

        {/* Chỉ cho phép truy cập khi đã đăng nhập tài khoản nhóm 3 */}
        {isLoggedInStaffGroup03 === "true" && (
          <>
            <Route path="/staff/group03/:staffId" element={<StaffGroup03Page />}></Route>

          </>
        )}

        {/* Chỉ cho phép truy cập khi đã đăng nhập tài khoản Admin */}
        {isLoggedInAdmin === "true" && (
          <>
            <Route path="/admin" element={<AdminPage />}></Route>
          </>
        )}

        {/* Xử lý trang lỗi */}
        <Route path="*" element={<Navigate to="/404" />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 
