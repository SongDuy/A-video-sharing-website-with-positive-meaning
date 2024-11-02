import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import axios from 'axios';
import { useFormik } from "formik"

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';

import StandardPage from '../layout/standard';
import DescriptionPage from '../layout/description';

const staffString = localStorage.getItem('staff');
const staff = staffString ? JSON.parse(staffString) : null;

const closeLogout = () => {
    localStorage.setItem('loginStaffGroup03', 'false');
    window.location.href = '/login/staff';
};

const StaffGroup03Page = () => {
    const [videosStatus01, setVideosStatus01] = useState([]);

    const [users, setUsers] = useState([]);

    const [categories, setCategories] = useState([]);

    const [filteredUsers01, setFilteredUsers01] = useState([]);

    const [filteredCategories01, setFilteredCategories01] = useState([]);

    const [reloadDeleteVideos, setReloadDeleteVideos] = useState(false);

    useEffect(() => {
        axios
            .get('http://localhost:5000/api/videos')
            .then((response) => {
                const videosData = response.data;

                // Giao đoạn nhân viên sơ tuyển
                const VideosStatus01 = videosData.filter((video) => video.status === "loại");
                setVideosStatus01(VideosStatus01);
                console.log(VideosStatus01)
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setReloadDeleteVideos(false);
            });

        axios
            .get('http://localhost:5000/api/users')
            .then((response) => {
                // console.log(response.data);
                const usersData = response.data;
                setUsers(usersData);
            })
            .catch((error) => {
                console.error(error);
            });

        axios
            .get('http://localhost:5000/api/admin/categories')
            .then((response) => {
                // console.log(response.data);
                const categoriesData = response.data;
                setCategories(categoriesData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [reloadDeleteVideos]);

    // Giao đoạn nhân viên sơ tuyển
    useEffect(() => {
        // Lọc danh sách người dùng dựa trên id_user của video
        const filteredUsers = users.filter((user) =>
            videosStatus01.some((video) => video.id_user === user.id)
        );

        setFilteredUsers01(filteredUsers);

        // Lọc danh mục dựa trên id_category của video
        const filteredCategories = categories.filter((category) =>
            videosStatus01.some((video) => video.id_category === category.id)
        );

        setFilteredCategories01(filteredCategories);
    }, [videosStatus01, users, categories]);

    const [isSelectVideoDescription, setIsSelectVideoDescription] = useState(null);
    const [isSelectVideoStandard, setIsSelectVideoStandard] = useState(null);

    const [isDescriptionModal, setIsDescriptionModal] = useState(false);
    const [isStandardModal, setIsStandardModal] = useState(false);

    const DescriptionModal = (videoId) => {

        if (isDescriptionModal === false) {
            //console.log(videoId);
            setIsSelectVideoDescription(videoId);
            setIsDescriptionModal(true);
            setIsStandardModal(false);
        }
        if (isDescriptionModal === true) {
            //  console.log(videoId);
            setIsSelectVideoDescription(videoId);
            setIsDescriptionModal(true);
            setIsStandardModal(false);
        }
        if (isDescriptionModal === true && isSelectVideoDescription === videoId) {
            //console.log(videoId);
            setIsSelectVideoDescription(null);
            setIsDescriptionModal(false);
        }
    };
    const [isVideoStandard, setIsVideoStandard] = useState(null);
    const StandardModal = (videoId, videoStandard) => {

        if (isStandardModal === false) {
            //console.log(videoId);
            setIsSelectVideoStandard(videoId);
            setIsStandardModal(true);
            setIsDescriptionModal(false);
        }
        if (isStandardModal === true) {
            //  console.log(videoId);
            setIsSelectVideoStandard(videoId);
            setIsStandardModal(true);
            setIsDescriptionModal(false);
        }
        if (isStandardModal === true && isSelectVideoStandard === videoId) {
            //console.log(videoId);
            setIsSelectVideoStandard(null);
            setIsStandardModal(false);
        }

        setIsVideoStandard(videoStandard);
    };

    const ChangeVideoStatus = (cloudinaryId, status) => {
        formik.setValues({
            cloudinary_id: cloudinaryId, // Gán giá trị cho cloudinary_id
            status: status, // Gán giá trị cho status
        });
        formik.handleSubmit(); // Gọi hàm handleSubmit để gửi dữ liệu
    };

    const formik = useFormik({
        initialValues: {
            cloudinary_id: '',
            status: '',
        },
        enableReinitialize: true, // Thêm dòng này
        onSubmit: (values) => {
            console.log(values.cloudinary_id)

            // Hiển thị hộp thoại xác nhận
            if (window.confirm('Bạn có chắc muốn chấp nhận video không?')) {
                axios
                    .put('http://localhost:5000/api/admin/video/changeStatus', values)
                    .then((response) => {
                        console.log(response.data);
                        alert('Chấp nhận nội dung theo danh mục thành công');
                        window.location.href = '/staff/group02/id:' + staff.id; // Sử dụng history để chuyển hướng 

                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        },
    });

    const handleDeleteVideoClick = (videoId) => {
        formik04.setValues({
            cloudinary_id: videoId,
        });
        formik04.handleSubmit();
    };

    const formik04 = useFormik({
        initialValues: {
            cloudinary_id: '',
        },
        onSubmit: (values) => {
            axios
                .delete('http://localhost:5000/api/deleteVideo', { data: values })
                .then((response) => {
                    // console.log(response.data);
                    setReloadDeleteVideos(true);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    });

    if (staff.level === "1") { // giao diện trang nhân viên sơ tuyển nhóm 03
        return (
            <div>

                <div className="fixed top-0 left-0 w-full h-[65px] bg-gray-50 shadow z-50">
                    <div className="text-center mt-2 ml-8">
                        <b className="text-3xl ml-8 text-blue-800">Trang Kiểm tra giám sát</b>
                        <div className="float-right mr-4">
                            <button
                                className="flex justify-center items-center text-blue-500 mt-1 w-[120px] h-10 hover:bg-blue-100 rounded-full border border-blue-500"
                                title="Đăng xuất"
                                onClick={closeLogout}
                            >
                                <div className="mr-2">
                                    <AccountCircleIcon />
                                </div>
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Nội dung */}
                <div className="w-full h-full overflow-auto bg-gray-50">
                    {
                        videosStatus01.length === 0 ? (
                            <div className="w-full h-screen flex justify-center items-center">
                                <h1 className="text-2xl text-gray-500">Đã Kiểm Tra Hết Video Trong Danh Sách Sơ Tuyển</h1>
                            </div>
                        ) : (
                            videosStatus01.map((video, index) => (
                                <div key={index} className="flex justify-center items-center pt-[70px]" >
                                    <div className="flex flex-wrap justify-center items-center mb-8">
                                        <div className="min-w-[1000px] min-h-[675px] max-w-[1000px] max-h-[675px] bg-gray-50 rouder-xl flex justify-center rounded-2xl border shadow">
                                            <div className="overflow-hidden" >

                                                <div className="mt-5" >
                                                    <ReactPlayer
                                                        url={video.url_video}
                                                        width="960px"
                                                        height="540px"
                                                        controls
                                                        allowFullScreen={true}
                                                        loading="lazy"
                                                        preload="true"
                                                    />
                                                </div>
                                                <div className="mt-2 w-full h-full">
                                                    <h1 className="font-bold text-xl overflow-hidden line-clamp-1 mr-5 text-blue-900">{video.title} </h1>
                                                    {filteredUsers01
                                                        .filter((user) => user.id === video.id_user)
                                                        .map((user) => (
                                                            <div key={user.id} className="flex items-center mt-3">

                                                                <Avatar
                                                                    alt="Remy Sharp"
                                                                    src={user.avatar}
                                                                    sx={{ width: 50, height: 50 }}
                                                                />
                                                                <span className="ml-2 font-bold max-w-[180px] text-blue-900 overflow-hidden line-clamp-1">{user.firstname + " " + user.lastname}</span>
                                                                <div className="text-right ml-auto">
                                                                    <ul className="flex">

                                                                        {filteredCategories01
                                                                            .filter((category) => category.id === video.id_category)
                                                                            .map((category) => (
                                                                                <div
                                                                                    key={category.id}
                                                                                    className=" flex mr-auto"
                                                                                >
                                                                                    <li
                                                                                        className="mr-4 text-blue-800 text-xl font-bold"
                                                                                        onClick={() => DescriptionModal(video.cloudinary_id)}
                                                                                    >
                                                                                        <button
                                                                                            className="min-w-[125px] max-w-[125px] h-[50px] bg-gray-100 rounded-full hover:bg-gray-200"
                                                                                        >
                                                                                            {category.name}
                                                                                        </button>
                                                                                    </li>

                                                                                    <li
                                                                                        className="mr-4"
                                                                                        onClick={() => StandardModal(video.cloudinary_id, category.description)}
                                                                                    >
                                                                                        <button className="w-[50px] h-[50px] bg-gray-100 rounded-full hover:bg-gray-200" title='Tiêu chuẩn nội dung danh mục'>
                                                                                            <GavelOutlinedIcon />
                                                                                        </button>
                                                                                    </li>

                                                                                    <li
                                                                                        className="mr-4 text-white text-xl font-bold"

                                                                                        onSubmit={formik.handleSubmit}
                                                                                    >
                                                                                        <button
                                                                                            type="submit"
                                                                                            className="min-w-[125px] max-w-[125px] h-[50px] bg-blue-900 rounded-full hover:bg-yellow-600"
                                                                                            onClick={() => ChangeVideoStatus(video.cloudinary_id, "sơ tuyển")}
                                                                                        >
                                                                                            Kiểm tra
                                                                                        </button>
                                                                                    </li>

                                                                                    <li
                                                                                        className="mr-auto text-white text-xl font-bold"
                                                                                        onSubmit={formik04.handleSubmit}
                                                                                    >
                                                                                        <button
                                                                                            type="submit"
                                                                                            className="min-w-[125px] max-w-[125px] h-[50px] bg-red-900 rounded-full hover:bg-yellow-600"
                                                                                            onClick={() => handleDeleteVideoClick(video.cloudinary_id)}
                                                                                        >
                                                                                            Xóa
                                                                                        </button>
                                                                                    </li>
                                                                                </div>
                                                                            ))}

                                                                    </ul>

                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                        {isSelectVideoDescription === video.cloudinary_id && isDescriptionModal && <DescriptionPage value={video.description} />}
                                        {isSelectVideoStandard === video.cloudinary_id && isStandardModal && <StandardPage value={isVideoStandard} />}
                                    </div>
                                </div>
                            ))

                        )
                    }

                </div>
            </div>
        );

    } if (staff.level === "2") { // Giao diện trang tổ phản biện nhóm 03
        return (
            <div>

                <div className="fixed top-0 left-0 w-full h-[65px] bg-gray-50 shadow z-50">
                    <div className="text-center mt-2 ml-8">
                        <b className="text-3xl ml-8 text-blue-800">Trang Tổ Phản Biện Nhóm 03</b>
                        <div className="float-right mr-4">
                            <button
                                className="flex justify-center items-center text-blue-500 mt-1 w-[120px] h-10 hover:bg-blue-100 rounded-full border border-blue-500"
                                title="Đăng xuất"
                                onClick={closeLogout}
                            >
                                <div className="mr-2">
                                    <AccountCircleIcon />
                                </div>
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Nội dung */}
                <div className="w-full h-full overflow-auto bg-gray-50">
                    {
                        videosStatus01.length === 0 ? (
                            <div className="w-full h-screen flex justify-center items-center">
                                <h1 className="text-2xl text-gray-500">Đã Kiểm Tra Hết Video Trong Danh Sách Sơ Tuyển</h1>
                            </div>
                        ) : (
                            videosStatus01.map((video, index) => (
                                <div key={index} className="flex justify-center items-center pt-[70px]" >
                                    <div className="flex flex-wrap justify-center items-center mb-8">
                                        <div className="min-w-[1000px] min-h-[675px] max-w-[1000px] max-h-[675px] bg-gray-50 rouder-xl flex justify-center rounded-2xl border shadow">
                                            <div className="overflow-hidden" >

                                                <div className="mt-5" >
                                                    <ReactPlayer
                                                        url={video.url_video}
                                                        width="960px"
                                                        height="540px"
                                                        controls
                                                        allowFullScreen={true}
                                                        loading="lazy"
                                                        preload="true"
                                                    />
                                                </div>
                                                <div className="mt-2 w-full h-full">
                                                    <h1 className="font-bold text-xl overflow-hidden line-clamp-1 mr-5 text-blue-900">{video.title} </h1>
                                                    {filteredUsers01
                                                        .filter((user) => user.id === video.id_user)
                                                        .map((user) => (
                                                            <div key={user.id} className="flex items-center mt-3">

                                                                <Avatar
                                                                    alt="Remy Sharp"
                                                                    src={user.avatar}
                                                                    sx={{ width: 50, height: 50 }}
                                                                />
                                                                <span className="ml-2 font-bold max-w-[180px] text-blue-900 overflow-hidden line-clamp-1">{user.firstname + " " + user.lastname}</span>
                                                                <div className="text-right ml-auto">
                                                                    <ul className="flex">

                                                                        {filteredCategories01
                                                                            .filter((category) => category.id === video.id_category)
                                                                            .map((category) => (
                                                                                <div
                                                                                    key={category.id}
                                                                                    className=" flex mr-auto"
                                                                                >
                                                                                    <li
                                                                                        className="mr-4 text-blue-800 text-xl font-bold"
                                                                                        onClick={() => DescriptionModal(video.cloudinary_id)}
                                                                                    >
                                                                                        <button
                                                                                            className="min-w-[125px] max-w-[125px] h-[50px] bg-gray-100 rounded-full hover:bg-gray-200"
                                                                                        >
                                                                                            {category.name}
                                                                                        </button>
                                                                                    </li>

                                                                                    <li
                                                                                        className="mr-4"
                                                                                        onClick={() => StandardModal(video.cloudinary_id, category.description)}
                                                                                    >
                                                                                        <button className="w-[50px] h-[50px] bg-gray-100 rounded-full hover:bg-gray-200" title='Tiêu chuẩn nội dung danh mục'>
                                                                                            <GavelOutlinedIcon />
                                                                                        </button>
                                                                                    </li>

                                                                                    <li
                                                                                        className="mr-4 text-white text-xl font-bold"

                                                                                        onSubmit={formik.handleSubmit}
                                                                                    >
                                                                                        <button
                                                                                            type="submit"
                                                                                            className="min-w-[125px] max-w-[125px] h-[50px] bg-blue-900 rounded-full hover:bg-yellow-600"
                                                                                            onClick={() => ChangeVideoStatus(video.cloudinary_id, "sơ tuyển")}
                                                                                        >
                                                                                            Kiểm tra
                                                                                        </button>
                                                                                    </li>

                                                                                    <li
                                                                                        className="mr-auto text-white text-xl font-bold"
                                                                                        onSubmit={formik04.handleSubmit}
                                                                                    >
                                                                                        <button
                                                                                            type="submit"
                                                                                            className="min-w-[125px] max-w-[125px] h-[50px] bg-red-900 rounded-full hover:bg-yellow-600"
                                                                                            onClick={() => handleDeleteVideoClick(video.cloudinary_id)}
                                                                                        >
                                                                                            Xóa
                                                                                        </button>
                                                                                    </li>
                                                                                </div>
                                                                            ))}

                                                                    </ul>

                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                        {isSelectVideoDescription === video.cloudinary_id && isDescriptionModal && <DescriptionPage value={video.description} />}
                                        {isSelectVideoStandard === video.cloudinary_id && isStandardModal && <StandardPage value={isVideoStandard} />}
                                    </div>
                                </div>
                            ))

                        )
                    }

                </div>

            </div>
        );

    } else { // Giao diện trang quản lý trưởng nhóm 03
        return (
            <div>

                <div className="fixed top-0 left-0 w-full h-[65px] bg-gray-50 shadow z-50">
                    <div className="text-center mt-2 ml-8">
                        <b className="text-3xl ml-8 text-blue-800">Trang Quản Lý Trưởng Nhóm 03</b>
                        <div className="float-right mr-4">
                            <button
                                className="flex justify-center items-center text-blue-500 mt-1 w-[120px] h-10 hover:bg-blue-100 rounded-full border border-blue-500"
                                title="Đăng xuất"
                                onClick={closeLogout}
                            >
                                <div className="mr-2">
                                    <AccountCircleIcon />
                                </div>
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Nội dung */}
                <div className="w-full h-full overflow-auto bg-gray-50">
                    {
                        videosStatus01.length === 0 ? (
                            <div className="w-full h-screen flex justify-center items-center">
                                <h1 className="text-2xl text-gray-500">Đã Kiểm Tra Hết Video Trong Danh Sách Sơ Tuyển</h1>
                            </div>
                        ) : (
                            videosStatus01.map((video, index) => (
                                <div key={index} className="flex justify-center items-center pt-[70px]" >
                                    <div className="flex flex-wrap justify-center items-center mb-8">
                                        <div className="min-w-[1000px] min-h-[675px] max-w-[1000px] max-h-[675px] bg-gray-50 rouder-xl flex justify-center rounded-2xl border shadow">
                                            <div className="overflow-hidden" >

                                                <div className="mt-5" >
                                                    <ReactPlayer
                                                        url={video.url_video}
                                                        width="960px"
                                                        height="540px"
                                                        controls
                                                        allowFullScreen={true}
                                                        loading="lazy"
                                                        preload="true"
                                                    />
                                                </div>
                                                <div className="mt-2 w-full h-full">
                                                    <h1 className="font-bold text-xl overflow-hidden line-clamp-1 mr-5 text-blue-900">{video.title} </h1>
                                                    {filteredUsers01
                                                        .filter((user) => user.id === video.id_user)
                                                        .map((user) => (
                                                            <div key={user.id} className="flex items-center mt-3">

                                                                <Avatar
                                                                    alt="Remy Sharp"
                                                                    src={user.avatar}
                                                                    sx={{ width: 50, height: 50 }}
                                                                />
                                                                <span className="ml-2 font-bold max-w-[180px] text-blue-900 overflow-hidden line-clamp-1">{user.firstname + " " + user.lastname}</span>
                                                                <div className="text-right ml-auto">
                                                                    <ul className="flex">

                                                                        {filteredCategories01
                                                                            .filter((category) => category.id === video.id_category)
                                                                            .map((category) => (
                                                                                <div
                                                                                    key={category.id}
                                                                                    className=" flex mr-auto"
                                                                                >
                                                                                    <li
                                                                                        className="mr-4 text-blue-800 text-xl font-bold"
                                                                                        onClick={() => DescriptionModal(video.cloudinary_id)}
                                                                                    >
                                                                                        <button
                                                                                            className="min-w-[125px] max-w-[125px] h-[50px] bg-gray-100 rounded-full hover:bg-gray-200"
                                                                                        >
                                                                                            {category.name}
                                                                                        </button>
                                                                                    </li>

                                                                                    <li
                                                                                        className="mr-4"
                                                                                        onClick={() => StandardModal(video.cloudinary_id, category.description)}
                                                                                    >
                                                                                        <button className="w-[50px] h-[50px] bg-gray-100 rounded-full hover:bg-gray-200" title='Tiêu chuẩn nội dung danh mục'>
                                                                                            <GavelOutlinedIcon />
                                                                                        </button>
                                                                                    </li>

                                                                                    <li
                                                                                        className="mr-4 text-white text-xl font-bold"

                                                                                        onSubmit={formik.handleSubmit}
                                                                                    >
                                                                                        <button
                                                                                            type="submit"
                                                                                            className="min-w-[125px] max-w-[125px] h-[50px] bg-blue-900 rounded-full hover:bg-yellow-600"
                                                                                            onClick={() => ChangeVideoStatus(video.cloudinary_id, "sơ tuyển")}
                                                                                        >
                                                                                            Kiểm tra
                                                                                        </button>
                                                                                    </li>

                                                                                    <li
                                                                                        className="mr-auto text-white text-xl font-bold"
                                                                                        onSubmit={formik04.handleSubmit}
                                                                                    >
                                                                                        <button
                                                                                            type="submit"
                                                                                            className="min-w-[125px] max-w-[125px] h-[50px] bg-red-900 rounded-full hover:bg-yellow-600"
                                                                                            onClick={() => handleDeleteVideoClick(video.cloudinary_id)}
                                                                                        >
                                                                                            Xóa
                                                                                        </button>
                                                                                    </li>
                                                                                </div>
                                                                            ))}

                                                                    </ul>

                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                        {isSelectVideoDescription === video.cloudinary_id && isDescriptionModal && <DescriptionPage value={video.description} />}
                                        {isSelectVideoStandard === video.cloudinary_id && isStandardModal && <StandardPage value={isVideoStandard} />}
                                    </div>
                                </div>
                            ))

                        )
                    }

                </div>

            </div>
        );
    }
};

export default StaffGroup03Page;
