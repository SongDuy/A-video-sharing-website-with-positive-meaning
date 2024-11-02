import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Avatar from '@mui/material/Avatar';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import ReplyIcon from '@mui/icons-material/Reply';

import CommentPage from '../layout/comment';
import DescriptionPage from '../layout/description';
import SkeletonChildrenDemo from '../layout/skeletonChildrenDemo';

const userString = localStorage.getItem('user');
const user = userString ? JSON.parse(userString) : " ";

// Trả về giá trị đăng nhập
const login = localStorage.getItem('login');

const AdminWatchVideoPage = ({ closeModal, value }) => {
    //console.log(value);
    const [videos, setVideos] = useState([]);

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);

    const [reloadFavorites, setReloadFavorites] = useState(false);
    const [reloadFollows, setReloadFollows] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (login === "true") {
            axios.get(`http://localhost:5000/api/follows/${user.id}`)
                .then((followsResponse) => {
                    const followsData = followsResponse.data;

                    axios.get(`http://localhost:5000/api/favorites/${user.id}`)
                        .then((favoritesResponse) => {
                            const favoritesData = favoritesResponse.data;

                            axios.get('http://localhost:5000/api/videos')
                                .then((videosResponse) => {
                                    const videosData = videosResponse.data;

                                    // Lọc danh sách video dựa trên id_videos và cloudinary_id
                                    const filteredVideos = videosData.map((video) => {
                                        // Kiểm tra điều kiện lọc theo id_videos và cloudinary_id
                                        const isFavorite = favoritesData.some((favorite) =>
                                            favorite.id_videos &&
                                            Array.isArray(favorite.id_videos) &&
                                            favorite.id_videos.includes(video.cloudinary_id)
                                        );

                                        // Kiểm tra điều kiện lọc theo id_user
                                        const isFollowed = followsData.some((followed) =>
                                            followed.id_follows &&
                                            Array.isArray(followed.id_follows) &&
                                            followed.id_follows.includes(video.id_user)
                                        );

                                        // Trả về video với thuộc tính isFavorite và isFollowed
                                        return {
                                            ...video,
                                            isFavorite: isFavorite,
                                            isFollowed: isFollowed
                                        };
                                    });

                                    // Sử dụng danh sách video đã lọc
                                    const watchVideo = filteredVideos.filter((video) => video.cloudinary_id === value);
                                    setVideos(watchVideo);
                                    setIsLoading(true);
                                    //console.log(filteredVideos);
                                })
                                .catch((error) => {
                                    console.error(error);
                                })
                                .finally(() => {
                                    setReloadFavorites(false);
                                    setReloadFollows(false);
                                });
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            axios.get('http://localhost:5000/api/videos')
                .then((videosResponse) => {
                    const videosData = videosResponse.data;
                    const watchVideo = videosData.filter((video) => video.cloudinary_id === value);

                    setVideos(watchVideo);
                    //console.log(filteredVideos);
                })
                .catch((error) => {
                    console.error(error);
                });
        }

        axios.get('http://localhost:5000/api/users')
            .then((response) => {
                const usersData = response.data;
                setUsers(usersData);
            })
            .catch((error) => {
                console.error(error);
            });

        axios.get('http://localhost:5000/api/admin/categories')
            .then((response) => {
                const categoriesData = response.data;
                setCategories(categoriesData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [reloadFavorites, reloadFollows, value]);

    useEffect(() => {
        // Lọc danh sách người dùng dựa trên id_user của video
        const filteredUsers = users.filter((user) =>
            videos.some((video) => video.id_user === user.id)
        );
        setFilteredUsers(filteredUsers);

        // Lọc danh mục dựa trên id_category của video
        const filteredCategories = categories.filter((category) =>
            videos.some((video) => video.id_category === category.id)
        );
        setFilteredCategories(filteredCategories);
    }, [videos, users, categories]);

    const [isSelectVideoDescription, setIsSelectVideoDescription] = useState(null);
    const [isSelectVideoComment, setIsSelectVideoComment] = useState(null);

    const [isDescriptionModal, setIsDescriptionModal] = useState(false);
    const [isCommentModal, setIsCommentModal] = useState(false);

    const DescriptionModal = (videoId) => {

        if (isDescriptionModal === false) {
            //console.log(videoId);
            setIsSelectVideoDescription(videoId);
            setIsDescriptionModal(true);
            setIsCommentModal(false);
        }
        if (isDescriptionModal === true) {
            //  console.log(videoId);
            setIsSelectVideoDescription(videoId);
            setIsDescriptionModal(true);
            setIsCommentModal(false);
        }
        if (isDescriptionModal === true && isSelectVideoDescription === videoId) {
            //console.log(videoId);
            setIsSelectVideoDescription(null);
            setIsDescriptionModal(false);
        }
    };

    const CommentModal = (videoId) => {

        if (isCommentModal === false) {
            //console.log(videoId);
            setIsSelectVideoComment(videoId);
            setIsCommentModal(true);
            setIsDescriptionModal(false);
        }
        if (isCommentModal === true) {
            //  console.log(videoId);
            setIsSelectVideoComment(videoId);
            setIsCommentModal(true);
            setIsDescriptionModal(false);
        }
        if (isCommentModal === true && isSelectVideoComment === videoId) {
            //console.log(videoId);
            setIsSelectVideoComment(null);
            setIsCommentModal(false);
        }
    };

    const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);
    const playerRef = useRef(null);

    const handleVideoPlay = (cloudinaryId) => {
        if (currentPlayingVideo && currentPlayingVideo !== cloudinaryId) {
            const previousPlayer = playerRef.current;
            if (previousPlayer) {
                previousPlayer.pause();
            }
        }
        setCurrentPlayingVideo(cloudinaryId);
    };

    const handleChannelClick = (channel) => {
        window.location.href = '/channel/id:' + channel.firstname + " " + channel.lastname + "  " + channel.id;
    };

    const handleSpanClick = (videoId) => {
        const str = videoId;
        const id = str.substring(str.indexOf("/") + 1);
        const text = `http://localhost:3000/watch/id:${id}`;
        navigator.clipboard.writeText(text)
            .then(() => {
                toast.success(`Địa chỉ video đã được sao chép`);
            })
            .catch((error) => {
                console.error('Lỗi khi sao chép địa chỉ', error);
            });
    };
    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            // Kiểm tra xem đăng nhập đã thành công hay chưa
            closeModal(); // Gọi hàm closeModal khi nhấp vào nền và đăng nhập không thành công
        }
    };

    return (
        <div className="min-h-screen w-screen bg-black bg-opacity-50 flex flex-col justify-center items-center py-5 sm:px-6 lg:px-8 fixed inset-0 z-50" onClick={handleBackdropClick}> {/* backdrop-blur-sm */}
            <div className="w-screen h-screen overflow-auto">
                {
                    videos.length === 0 ? (
                        <React.Fragment>
                            {isLoading ? (
                                <div className="w-full h-screen flex items-center justify-center ">
                                    <div>
                                        <h1 className="text-2xl text-gray-500">Danh mục không có nội dung phù hợp</h1>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-screen flex justify-center">
                                    <SkeletonChildrenDemo />
                                </div>
                            )}
                        </React.Fragment>
                    ) : (
                        videos.map((video, index) => (
                            <div key={index} className="flex justify-center items-center mb-2" >
                                <div className="flex flex-wrap justify-center items-center">
                                    <div className="min-w-[1000px] min-h-[675px] max-w-[1000px] max-h-[675px] px-5 bg-gray-50 rouder-xl flex justify-center rounded-2xl shadow">
                                        <div className="overflow-hidden" >

                                            <div className="mt-5" >
                                                <ReactPlayer
                                                    id={video.cloudinary_id}
                                                    url={video.url_video}
                                                    width="960px"
                                                    height="540px"
                                                    controls={true}
                                                    allowFullScreen={true}
                                                    loading="lazy"
                                                    preload="true"
                                                    loop={true}
                                                    playing={currentPlayingVideo === video.cloudinary_id}
                                                    onPlay={() => handleVideoPlay(video.cloudinary_id)}
                                                />
                                            </div>
                                            <div className="mt-2 w-full h-full">
                                                <h1 className="font-bold text-xl overflow-hidden line-clamp-1 mr-5 text-blue-900">{video.title}</h1>
                                                {filteredUsers
                                                    .filter((user) => user.id === video.id_user)
                                                    .map((user) => (
                                                        <div key={user.id} className="flex items-center mt-2">

                                                            <button
                                                                className="flex items-center"
                                                                onClick={() => handleChannelClick(user)} //(user.firstname + " " + user.lastname), user.id
                                                            >
                                                                <Avatar
                                                                    alt="Remy Sharp"
                                                                    src={user.avatar}
                                                                    sx={{ width: 50, height: 50 }}
                                                                />
                                                                <div className="flex-wrap">
                                                                    <span className="ml-2 font-bold max-w-[180px] text-blue-900 overflow-hidden line-clamp-1">{user.firstname + " " + user.lastname}</span>
                                                                    <span className="ml-2 max-w-[180px] text-sm text-red-400 overflow-hidden line-clamp-1">Ngày đăng {video.created_at}</span>
                                                                </div>

                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="w-[250px] h-[35px] ml-3 bg-black text-yellow-500 rounded-full flex justify-center items-center"
                                                            >
                                                                {video.cloudinary_id}

                                                            </button>

                                                            <div className="text-right ml-auto">
                                                                <ul className="flex">
                                                                    {filteredCategories
                                                                        .filter((category) => category.id === video.id_category)
                                                                        .map((category) => (
                                                                            <li
                                                                                key={category.id}
                                                                                className="mr-4 text-blue-900 text-xl font-bold"
                                                                                onClick={() => DescriptionModal(video.cloudinary_id)}
                                                                            >
                                                                                <button
                                                                                    type="button"
                                                                                    className="min-w-[125px] max-w-[125px] h-[50px] bg-gray-100 rounded-full hover:bg-gray-200"
                                                                                >
                                                                                    {category.name}
                                                                                </button>
                                                                            </li>

                                                                        ))}

                                                                    <li
                                                                        className="mr-4"
                                                                    >
                                                                        <button
                                                                            className="w-[50px] h-[50px] bg-gray-100 rounded-full hover:bg-gray-200"
                                                                            title='Bình luận'
                                                                            onClick={() => CommentModal(video.cloudinary_id)}
                                                                        >
                                                                            <InsertCommentOutlinedIcon />
                                                                        </button>

                                                                    </li>

                                                                    <li
                                                                        className="mr-4"
                                                                    >
                                                                        <button
                                                                            className="w-[50px] h-[50px] bg-gray-100 rounded-full hover:bg-gray-200 transform scale-x-[-1]"
                                                                            title='Sao chép địa chỉ'
                                                                            onClick={() => handleSpanClick(video.cloudinary_id)}
                                                                        >
                                                                            <ReplyIcon />
                                                                        </button>
                                                                        <div>
                                                                            <ToastContainer />
                                                                        </div>
                                                                    </li>

                                                                </ul>

                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                    {isSelectVideoDescription === video.cloudinary_id && isDescriptionModal && <DescriptionPage values={{ description: video.description, cloudinaryId: video.cloudinary_id }} />}
                                    {isSelectVideoComment === video.cloudinary_id && isCommentModal && <CommentPage value={video.cloudinary_id} />}
                                </div>
                            </div>
                        ))
                    )}
            </div >
        </div>
    );
};

export default AdminWatchVideoPage;