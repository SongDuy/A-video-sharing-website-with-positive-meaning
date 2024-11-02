import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import axios from 'axios';
import { useFormik } from "formik"
import { useParams } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Avatar from '@mui/material/Avatar';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';

import HeaderPage from './header';
import CommentPage from './comment';
import DescriptionPage from './description';
import SkeletonChildrenDemo from './skeletonChildrenDemo';

const userString = localStorage.getItem('user');
const user = userString ? JSON.parse(userString) : " ";

const FavoriteVideoPage = () => {
    const { favoriteId } = useParams();
    const str = favoriteId;
    const id = str.substring(str.indexOf("-") + 1);
    const id_favorite = `-${id}`;

    //console.log(id_favorite);

    const [videos, setVideos] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);

    const [reloadFavorites, setReloadFavorites] = useState(false);
    const [reloadFollows, setReloadFollows] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [isMyUser, setIsMyUser] = useState();
    useEffect(() => {
        axios.get(`http://localhost:5000/api/follows/${id_favorite}`)
            .then((followsResponse) => {
                const followsData = followsResponse.data;

                axios.get(`http://localhost:5000/api/favorites/${id_favorite}`)
                    .then((favoritesResponse) => {
                        const favoritesData = favoritesResponse.data;

                        axios.get('http://localhost:5000/api/acceptedVideos')
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

                                const followVideos = filteredVideos.filter((video) => video.isFavorite === true);
                                setVideos(followVideos);
                                setIsLoading(true);
                                setIsMyUser(user.id);
                                //console.log(followVideos);
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
    }, [reloadFavorites, reloadFollows, id_favorite]);

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

    const [favorites, setFavorites] = useState(false);

    const handleFavoriteClick = (videoId, favorite) => {
        formik.setValues({
            id: id_favorite,
            id_video: videoId,
        });
        formik.handleSubmit();
        setFavorites(favorite);
    };

    const formik = useFormik({
        initialValues: {
            id: '',
            id_video: '',
        },
        onSubmit: (values) => {

            if (favorites !== true) {
                axios
                    .post('http://localhost:5000/api/createFavorite', values)
                    .then((response) => {
                        // console.log(response.data);
                        setReloadFavorites(true); // Kích hoạt việc tải lại danh sách bình luận

                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                axios
                    .delete('http://localhost:5000/api/deleteFavorite', { data: values })
                    .then((response) => {
                        // console.log(response.data);
                        setReloadFavorites(true); // Kích hoạt việc tải lại danh sách bình luận

                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }

        }

    });

    const [follows, setFollows] = useState(false);

    const handleFollowClick = (followId, follow) => {
        formik01.setValues({
            id: id_favorite,
            id_follow: followId,
        });
        formik01.handleSubmit();
        setFollows(follow);
    };

    const formik01 = useFormik({
        initialValues: {
            id: '',
            id_follow: '',
        },
        onSubmit: (values) => {
            if (follows !== true) {
                axios
                    .post('http://localhost:5000/api/createFollow', values)
                    .then((response) => {
                        // console.log(response.data);
                        setReloadFollows(true);

                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                axios
                    .delete('http://localhost:5000/api/deleteFollow', { data: values })
                    .then((response) => {
                        // console.log(response.data);
                        setReloadFollows(true);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
    });

    const handleChannelClick = (channel) => {
        window.location.href = '/channel/id:' + channel.lastname + channel.firstname + channel.id;
    };

    const handleMyChannelClick = (userId) => {
        window.location.href = '/myChannel/id:' + userId;
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

    return (
        <div>
            <HeaderPage />
            <div className="w-full h-full overflow-auto bg-gray-50 pt-[70px]">
                {
                    videos.length === 0 ? (
                        <React.Fragment>
                            {isLoading ? (
                                <div className="w-full h-screen flex items-center justify-center ">
                                    <div>
                                        <h1 className="text-2xl text-gray-500">Bạn hãy thêm video yêu thích vào danh mục</h1>
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
                            <div key={index} className="flex justify-center items-center" >
                                <div className="flex flex-wrap justify-center items-center mb-8">
                                    <div className="min-w-[1000px] min-h-[675px] max-w-[1000px] max-h-[675px] px-5 bg-gray-50 rouder-xl flex justify-center rounded-2xl border shadow">
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
                                                    loop={true} // Tự động lặp lại video
                                                    playing={currentPlayingVideo === video.cloudinary_id}
                                                    onPlay={() => handleVideoPlay(video.cloudinary_id)}
                                                />
                                            </div>
                                            <div className="mt-2 w-full h-full">
                                                <h1 className="font-bold text-xl overflow-hidden line-clamp-1 mr-5 text-blue-900">{video.title} </h1>
                                                {filteredUsers
                                                    .filter((user) => user.id === video.id_user)
                                                    .map((user) => (
                                                        <div key={user.id} className="flex items-center mt-2">

                                                            <button
                                                                className="flex items-center"
                                                                onClick={() => handleChannelClick(user)}
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

                                                            {
                                                                isMyUser === user.id ? (
                                                                    <div>
                                                                        <button
                                                                            type="button"
                                                                            className="w-[125px] h-[35px] ml-3 bg-red-800 text-white font-bold rounded-full hover:bg-gray-800"
                                                                            onClick={() => handleMyChannelClick(user.id)}
                                                                        >
                                                                            Quản lý video
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    video.isFollowed === true ? (
                                                                        <div
                                                                            onSubmit={formik01.handleSubmit}
                                                                        >
                                                                            <button
                                                                                type="submit"
                                                                                className="w-[110px] h-[35px] ml-3 bg-red-100 text-black font-bold rounded-full hover:bg-red-200"
                                                                                onClick={() => handleFollowClick(user.id, video.isFollowed)}
                                                                            >
                                                                                Đã đăng ký
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            onSubmit={formik01.handleSubmit}
                                                                        >
                                                                            <button
                                                                                type="submit"
                                                                                className="w-[110px] h-[35px] ml-3 bg-black text-white font-bold rounded-full hover:bg-gray-800"
                                                                                onClick={() => handleFollowClick(user.id, video.isFollowed)}
                                                                            >
                                                                                Đăng ký
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )
                                                            }
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
                                                                    {video.isFavorite === true ? (
                                                                        <li className="mr-4 text-red-500" onSubmit={formik.handleSubmit}>
                                                                            <button
                                                                                type="submit"
                                                                                className="w-[50px] h-[50px] bg-gray-100 rounded-full hover:bg-gray-200"
                                                                                title="Yêu thích"
                                                                                onClick={() => handleFavoriteClick(video.cloudinary_id, video.isFavorite)}
                                                                            >
                                                                                <FavoriteRoundedIcon />
                                                                            </button>
                                                                        </li>
                                                                    ) : (
                                                                        <li className="mr-4" onSubmit={formik.handleSubmit}>
                                                                            <button
                                                                                type="submit"
                                                                                className="w-[50px] h-[50px] bg-gray-100 rounded-full hover:bg-gray-200"
                                                                                title="Yêu thích"
                                                                                onClick={() => handleFavoriteClick(video.cloudinary_id, video.isFavorite)}
                                                                            >
                                                                                <FavoriteBorderRoundedIcon />
                                                                            </button>
                                                                        </li>
                                                                    )}

                                                                    <li
                                                                        className="mr-4 "
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

                                                                    <li
                                                                        className=""
                                                                    >
                                                                        <button
                                                                            className="w-[50px] h-[50px] bg-gray-100 rounded-full hover:bg-gray-200"
                                                                            title='Báo cáo'
                                                                        >
                                                                            <FlagOutlinedIcon />
                                                                        </button>
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
            </div>
        </div>
    );
};

export default FavoriteVideoPage;