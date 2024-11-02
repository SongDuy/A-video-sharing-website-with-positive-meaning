import React, { useEffect, useState } from 'react';
import axios from 'axios';

import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

import FooterPage from './footer';
import LoginPage from '../auth/login';
import '../../index.css';

const userString = localStorage.getItem('user');
const user = userString ? JSON.parse(userString) : null;

// Trả về giá trị đăng nhập
const login = localStorage.getItem('login');

const MenuPage = ({ closeModal }) => {
    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            closeModal(); // Gọi hàm closeModal khi nhấp vào nền
        }
    };

    const [categories, setCategories] = useState([]);

    useEffect(() => {
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

    }, []);

    const [isLoginModal, setIsLoginModal] = useState(false);
    const openLoginModal = () => {
        if (login === "true") {
            setIsLoginModal(false);
        } else {
            setIsLoginModal(true);
        }

    };

    const closeLoginModal = () => {
        setIsLoginModal(false);
    };

    const handleHomeClick = () => {
        window.location.href = '/';
    };

    const handleCategoryClick = (categoryId, categoryName) => {
        window.location.href = '/category/id:' + categoryName + categoryId;
    };

    const handleMyChannelClick = (userId) => {
        window.location.href = '/myChannel/id:' + userId;
    };

    const handleFavoriteClick = (userId) => {
        window.location.href = '/favorite/id:' + userId;
    };

    const handleChannelFollowedClick = (userId) => {
        window.location.href = '/channel/followed/id:' + userId;
    };

    return (

        <div className="w-screen h-screen bg-black bg-opacity-50 flex py fixed inset-0 z-50 " onClick={handleBackdropClick}>
            <div className="w-[250px] h-screen bg-gray-50 relative slide-in">
                <div className="ml-5 mt-3 mr-4">

                    <div className="mb-5">
                        <button
                            className="flex justify-center items-center 
                            w-10 h-10 hover:bg-gray-100 rounded-full"
                            onClick={handleBackdropClick}
                        >
                            <DensityMediumIcon
                                onClick={handleBackdropClick}
                            />
                        </button>

                        {/* logo website */}
                    </div>

                    <div>
                        <div>

                            {login === "true" ? (
                                <ul className="mb-2 font-bold">

                                    <li
                                        className="hover:bg-gray-200 hover:text-blue-800 py-2 px-2 rounded-xl cursor-pointer"
                                        onClick={handleHomeClick}
                                    >
                                        <HomeOutlinedIcon className="mr-4" />
                                        Trang Chủ
                                    </li>

                                    <li
                                        className="hover:bg-gray-200 hover:text-blue-800 py-2 px-2 rounded-xl cursor-pointer"
                                        onClick={() => handleMyChannelClick(user.id)}
                                    >
                                        <LiveTvOutlinedIcon className="mr-4" />
                                        Kênh Của Tôi
                                    </li>

                                    <li className="hover:bg-gray-200 hover:text-blue-800 py-2 px-2 rounded-xl cursor-pointer"
                                        onClick={() => handleChannelFollowedClick(user.id)}
                                    >
                                        <SubscriptionsOutlinedIcon className="mr-4" />
                                        Kênh Đăng Ký
                                    </li>

                                    <li className="hover:bg-gray-200 hover:text-blue-800 py-2 px-2 rounded-xl cursor-pointer"
                                        onClick={() => handleFavoriteClick(user.id)}
                                    >
                                        <FavoriteBorderOutlinedIcon className="mr-4" />
                                        Video yêu thích
                                    </li>
                                </ul>
                            ) : (
                                <ul className="mb-2 font-bold">
                                    <li
                                        className="hover:bg-gray-200 hover:text-blue-800 py-2 px-2 rounded-xl cursor-pointer mb-2"
                                        onClick={handleHomeClick}
                                    >
                                        <HomeOutlinedIcon className="mr-4" />
                                        Trang Chủ
                                    </li>

                                    <li
                                        className="hover:bg-gray-200 hover:text-blue-800 text-white bg-blue-600 py-2 px-2 rounded-xl cursor-pointer text-center mb-5"
                                        onClick={openLoginModal}
                                    >
                                        Đăng nhập tài khoản
                                    </li>


                                </ul>
                            )}

                        </div>
                        <hr />
                        {/* <span className="flex justify-center items-center mt-2 text-blue-500 font-bold">Danh mục</span> */}
                        {categories.map((category) => (
                            <div key={category.id}>
                                <ul className="mt-2">
                                    <li className="hover:bg-gray-200 hover:text-blue-500 py-2 px-2 rounded-xl cursor-pointer text-blue-900 font-bold"
                                        onClick={() => handleCategoryClick(category.id, category.name)}
                                    >
                                        <SubscriptionsOutlinedIcon className="mr-4" />
                                        {category.name}
                                    </li>
                                </ul>
                            </div>
                        ))}
                        <div className="absolute bottom-0">
                            <FooterPage />
                        </div>
                    </div>

                </div>

            </div>
            {isLoginModal && <LoginPage closeModal={closeLoginModal} />}
        </div>

    );
};

export default MenuPage;