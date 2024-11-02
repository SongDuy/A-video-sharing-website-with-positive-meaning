import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import HeaderPage from './header';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ChannelVideoPage = () => {
    const { channelId } = useParams();
    const str = channelId;
    const id = str.substring(str.indexOf("-") + 1);
    const id_channel = `-${id}`;

    //console.log(channelId); // Output: "DươngHoàng"

    const [videos, setVideos] = useState([]);

    const [channel, setChannel] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {

        axios.get('http://localhost:5000/api/acceptedVideos')
            .then((videosResponse) => {
                const videosData = videosResponse.data;
                const channelVideos = videosData.filter((video) => video.id_user === id_channel);
                setVideos(channelVideos);
                setIsLoading(true);
                //console.log(categoryVideos);
            })
            .catch((error) => {
                console.error(error);
            })

        axios
            .get('http://localhost:5000/api/users')
            .then((response) => {
                // console.log(response.data);
                const usersData = response.data;
                const channel = usersData.filter((user) => user.id === id_channel);
                setChannel(channel[0]);
                //console.log(channel[0].firstname);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id_channel]);
    //console.log(channel.birthday);
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

    const handleWatchVideoClick = (videoId) => {
        const str = videoId;
        const parts = str.split("/");
        const id = parts[parts.length - 1].trim();
        window.location.href = '/watch/id:' + id;
    };

    return (
        <div>
            <HeaderPage />
            <div className="w-full h-screen overflow-auto bg-gray-50 pt-[70px]">
                {
                    videos.length === 0 ? (
                        <React.Fragment>
                            {isLoading ? (
                                <div className="ml-12 mr-12">
                                    <div className="w-full h-[150px] border-b-2 mb-5 py-5">
                                        <div className=" items-center flex">
                                            <Avatar
                                                alt="Remy Sharp"
                                                src={channel.avatar}
                                                sx={{ width: 100, height: 100 }}
                                            />
                                            <div className="ml-5">
                                                <div className="flex-wrap">
                                                    <span
                                                        className="ml-2 font-bold text-3xl max-w-[500px] h-[50px] text-blue-900 overflow-hidden line-clamp-1"
                                                    >
                                                        {channel.firstname + " " + channel.lastname}
                                                    </span>
                                                    <div
                                                        className="ml-2 font-bold max-w-[550px] overflow-hidden line-clamp-1"
                                                    >
                                                        <span>Mã id: </span>
                                                        <button
                                                            className="bg-red-300 w-[215px] text-white rounded-full px-2 mr-5"
                                                        >
                                                            {channel.id}
                                                        </button>

                                                        <span> Giới tính: </span>
                                                        <button
                                                            className="bg-red-300 w-[50px] text-white rounded-full px-2"
                                                        >
                                                            {channel.gender}
                                                        </button>
                                                    </div>
                                                    <div
                                                        className="ml-2 font-bold max-w-[300px] overflow-hidden line-clamp-1 mt-2"
                                                    >

                                                        <span>Ngày tham gia: </span>
                                                        <button
                                                            className="bg-red-300 w-[125px] text-white rounded-full px-2"
                                                        >
                                                            {channel.created_at}
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>


                                    </div>
                                    <div className="text-center">
                                        <span>Danh sách video trống</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-screen flex justify-center items-center">
                                    <Box sx={{ display: 'flex' }}>
                                        <CircularProgress />
                                    </Box>
                                </div>
                            )}
                        </React.Fragment>
                    ) : (
                        <div className=" ml-12 mr-12">
                            <div className="w-full h-[150px] border-b-2 mb-5 py-5">
                                <div className=" items-center flex">
                                    <Avatar
                                        alt="Remy Sharp"
                                        src={channel.avatar}
                                        sx={{ width: 100, height: 100 }}
                                    />
                                    <div className="ml-5">
                                        <div className="flex-wrap">
                                            <span
                                                className="ml-2 font-bold text-3xl max-w-[500px] h-[50px] text-blue-900 overflow-hidden line-clamp-1"
                                            >
                                                {channel.firstname + " " + channel.lastname}
                                            </span>
                                            <div
                                                className="ml-2 font-bold max-w-[550px] overflow-hidden line-clamp-1"
                                            >
                                                <span>Mã id: </span>
                                                <button
                                                    className="bg-red-300 text-white rounded-full px-2 mr-5"
                                                >
                                                    {channel.id}
                                                </button>

                                                <span> Giới tính: </span>
                                                <button
                                                    className="bg-red-300 text-white rounded-full px-2"
                                                >
                                                    {channel.gender}
                                                </button>
                                            </div>
                                            <div
                                                className="ml-2 font-bold max-w-[300px] overflow-hidden line-clamp-1 mt-2"
                                            >

                                                <span>Ngày tham gia: </span>
                                                <button
                                                    className="bg-red-300 text-white rounded-full px-2"
                                                >
                                                    {channel.created_at}
                                                </button>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {videos.map((video, index) => (
                                    <div
                                        className="w-[335px] h-[270px] col-span-1 border-2 shadow-xl rounded-xl overflow-hidden ml-2 mr-2 mb-5"
                                        key={index}
                                    >
                                        {/* Hiển thị nội dung video */}
                                        <div className="py-2 px-4">
                                            <div className="mt-2 mb-2">
                                                <ReactPlayer
                                                    id={video.cloudinary_id}
                                                    url={video.url_video}
                                                    width="300px"
                                                    height="180px"
                                                    controls={true}
                                                    allowFullScreen={true}
                                                    loading="lazy"
                                                    preload="true"
                                                    loop={true}
                                                    playing={currentPlayingVideo === video.cloudinary_id}
                                                    onPlay={() => handleVideoPlay(video.cloudinary_id)}
                                                />
                                            </div>
                                        </div>

                                        {/* Hiển thị tiêu đề video */}
                                        <div
                                            className="overflow-hidden line-clamp-2 max-h-[50px] ml-4 mr-4 font-bold text-blue-900 hover:text-blue-500"
                                        >
                                            <button
                                                onClick={() => handleWatchVideoClick(video.cloudinary_id)}
                                            >
                                                {video.title}
                                            </button>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default ChannelVideoPage;