import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from "formik"

import Avatar from '@mui/material/Avatar';

import LoginPage from '../auth/login';
import '../../index.css';

const userString = localStorage.getItem('user');
const user = userString ? JSON.parse(userString) : " ";

const login = localStorage.getItem('login');

const CommentPage = (props) => {

    const id_user = user.id;
    //console.log(id_user);
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [reloadCreateComments, setReloadCreateComments] = useState(false);
    const [reloadChangeComments, setReloadChangeComments] = useState(false);
    const [reloadDeleteComments, setReloadDeleteComments] = useState(false);

    useEffect(() => {
        axios
            .get('http://localhost:5000/api/comments')
            .then((response) => {
                const commentsData = response.data;

                // Giao đoạn nhân viên sơ tuyển
                const comments = commentsData.filter((comment) => comment.id_video === props.value);
                setComments(comments);
                //console.log(comments);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setReloadCreateComments(false); // Đặt lại giá trị reloadComments thành false sau khi tải xong
                setReloadChangeComments(false);
                setReloadDeleteComments(false);
            });

        axios
            .get('http://localhost:5000/api/users')
            .then((response) => {
                const usersData = response.data;
                setUsers(usersData);
                //console.log(usersData);
            })
            .catch((error) => {
                console.error(error);
            });

    }, [props.value, reloadCreateComments, reloadChangeComments, reloadDeleteComments]);

    // Bình luận

    useEffect(() => {
        // Lọc danh sách người dùng dựa trên id_user của video
        const filteredUsers = users.filter((user) =>
            comments.some((comment) => comment.id_user === user.id)
        );

        setFilteredUsers(filteredUsers);
        //console.log(filteredUsers);

    }, [comments, users]);


    const formik = useFormik({
        initialValues: {
            id_video: props.value,
            id_user: id_user,
            content: '',
        },
        onSubmit: (values) => {
            //console.log(values.id_user);
            axios
                .post('http://localhost:5000/api/createComment', values)
                .then((response) => {
                    // console.log(response.data);
                    formik.resetForm();
                    setReloadCreateComments(true); // Kích hoạt việc tải lại danh sách bình luận
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    })

    const [deleteIdComment, setdeleteIdComment] = useState(null)
    const deleteVideoComments = (commentId) => {
        setdeleteIdComment(commentId);
    };

    const formik01 = useFormik({
        initialValues: {
            id: '',
        },
        onSubmit: (values) => {
            values.id = deleteIdComment;
            // console.log(values);
            axios
                .delete('http://localhost:5000/api/deleteComment', { data: values })
                .then((response) => {
                    //console.log(response.data);
                    formik01.resetForm();
                    setReloadDeleteComments(true); // Kích hoạt việc tải lại danh sách bình luận
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    })

    const [editingCommentId, setEditingCommentId] = useState(null);

    const editingComment = (commentId01) => {

        if (editingCommentId === null) {
            setEditingCommentId(commentId01); // Cancel editing

        } else {
            setEditingCommentId(null); // Start editing the specified comment

        }
        //console.log(commentId);
    };

    const [isCommentId, setIsCommentId] = useState(null)
    const changeVideoComments = (commentId02) => {
        setIsCommentId(commentId02);
    };

    const formik02 = useFormik({
        initialValues: {
            id: '',
            content: '',
        },
        onSubmit: (values) => {
            values.id = isCommentId;
            axios
                .put('http://localhost:5000/api/changeComment', values)
                .then((response) => {
                    //console.log(response.data);
                    formik02.resetForm();
                    setReloadChangeComments(true); // Kích hoạt việc tải lại danh sách bình luận
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    })

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

    const handleCancel = () => {
        formik.resetForm(); // Đặt lại giá trị của form về giá trị ban đầu
    };

    const handleChannelClick = (channel) => {
        window.location.href = '/channel/id:' + channel.firstname + " " + channel.lastname + "  " + channel.id;
        console.log(channel)
    };

    if (login === "true") {
        return (
            <div className="flex w-[450px] h-[675px] py-5 bg-gray-50 rounded-xl shadow overflow-auto">
                <div className="w-full h-full custom-scrollbar-content custom-scrollbar ml-5 ">

                    <div className="text-center flex mb-2">
                        <span className="font-bold bg-blue-800 text-white px-3 py-1 rounded-full">Bình luận </span>
                        <span className="font-bold rounded-full bg-gray-200 px-3 py-1 text-right ml-auto text-blue-900"> ID: {props.value}</span>
                    </div>

                    <div className="box-container ">

                        <div className="h-[462px] custom-scrollbar-content custom-scrollbar z-10">

                            {
                                comments.map((comment, index) => (
                                    <div
                                        key={index}
                                        className="box w-full"
                                    >

                                        {
                                            filteredUsers
                                                .filter((user) => user.id === comment.id_user)
                                                .map((user) => (
                                                    <div key={user.id} className=" mt-3 ">
                                                        <div className="flex items-center">
                                                            <button className="flex items-center">
                                                                <Avatar
                                                                    alt="Remy Sharp"
                                                                    src={user.avatar}
                                                                    sx={{ width: 40, height: 40 }}
                                                                />
                                                                <span
                                                                    className="ml-2 font-bold min-w-[150px] max-h-[150px] text-blue-900 overflow-hidden line-clamp-1"
                                                                    onClick={() => handleChannelClick(user)}
                                                                >
                                                                    {user.firstname + " " + user.lastname}
                                                                </span>
                                                                <span className="ml-2 text-gray-500">{comment.created_at}</span>
                                                            </button>


                                                        </div>

                                                        <div className="mt-2 mb-12">
                                                            {
                                                                (id_user === user.id && login === "true") ?
                                                                    (
                                                                        <div>
                                                                            {editingCommentId !== comment.id ? (

                                                                                <form
                                                                                    onSubmit={formik01.handleSubmit}
                                                                                >
                                                                                    <div>
                                                                                        <div
                                                                                            className="w-full max-h-[150px] ml-2"
                                                                                        >
                                                                                            {comment.content}
                                                                                        </div>

                                                                                        <div
                                                                                            className="float-right"

                                                                                        >
                                                                                            <button
                                                                                                type="button"
                                                                                                className="w-[50px] h-[35px] bg-gray-200 hover:bg-gray-300 rounded-lg mr-2 mb-8"
                                                                                                onClick={() => editingComment(comment.id)}

                                                                                            >
                                                                                                Sửa
                                                                                            </button>

                                                                                            <button
                                                                                                type="submit"
                                                                                                className="w-[50px] h-[35px] bg-gray-200 hover:bg-gray-300 rounded-lg mb-8"
                                                                                                onClick={() => deleteVideoComments(comment.id)}
                                                                                            >
                                                                                                Xóa
                                                                                            </button>
                                                                                        </div>

                                                                                    </div>
                                                                                </form>
                                                                            ) : (
                                                                                <form
                                                                                    onSubmit={formik02.handleSubmit}
                                                                                >
                                                                                    <div>
                                                                                        <div className="w-full max-h-[200px] ml-2">
                                                                                            <textarea
                                                                                                id={`comment-${comment.id}`}
                                                                                                name="content"
                                                                                                type="text"
                                                                                                className="w-full min-h-[150px] border border-gray-900 px-2 py-2"
                                                                                                defaultValue={comment.content}
                                                                                                onChange={formik02.handleChange}
                                                                                            />

                                                                                        </div>

                                                                                        <div
                                                                                            className="float-right"

                                                                                        >
                                                                                            <button
                                                                                                type="button"
                                                                                                className="w-[50px] h-[35px] bg-gray-200 hover:bg-gray-300 rounded-lg mr-2 mb-8"
                                                                                                onClick={() => editingComment(comment.id)}
                                                                                            >
                                                                                                Xong
                                                                                            </button>

                                                                                            <button
                                                                                                type="submit"
                                                                                                className="w-[80px] h-[35px] bg-gray-200 hover:bg-gray-300 rounded-lg mb-8"
                                                                                                onClick={() => { changeVideoComments(comment.id) }}
                                                                                            >
                                                                                                <span>Cập nhật </span>
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </form>

                                                                            )}

                                                                        </div>

                                                                    ) : (
                                                                        <div className="w-full max-h-[150px]">
                                                                            {comment.content}
                                                                        </div>
                                                                    )
                                                            }
                                                        </div>
                                                    </div>

                                                ))
                                        }
                                    </div>
                                ))
                            }

                        </div>

                        {/* Phần nhập bình luận */}
                        <div
                            className="box w-full h-full text-center"
                        >
                            <form
                                className="w-full"
                                onSubmit={formik.handleSubmit}
                            >
                                <textarea
                                    id="content"
                                    name="content"
                                    type="text"
                                    rows={3}
                                    cols={50}
                                    className="w-full py-2 px-2 border-2"
                                    placeholder="Nhập bình luận của bạn..."
                                    value={formik.values.content} // Đặt giá trị của input từ state user
                                    onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi

                                />

                                <button
                                    type="submit"
                                    className="float-right bg-blue-500 w-[100px] h-[35px] rounded-full"
                                >
                                    Bình luận
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="float-right bg-white hover:bg-gray-100 w-[50px] h-[35px] rounded-full mr-2"
                                >
                                    Hủy
                                </button>

                            </form>

                        </div>
                    </div>
                </div>
            </div >
        );
    }
    else {
        return (
            <div className="flex w-[450px] h-[675px] py-5 bg-white rounded-xl border shadow overflow-auto ">
                <div className="w-full h-full custom-scrollbar-content custom-scrollbar ml-5">
                    <div className="text-center flex mb-2">
                        <span className="font-bold bg-blue-800 text-white px-3 py-1 rounded-full">Bình luận </span>
                        <span className="font-bold rounded-full bg-gray-200 px-3 py-1 text-right ml-auto text-blue-900"> ID: {props.value}</span>
                    </div>

                    <div className="box-container">

                        <div className="h-[550px] custom-scrollbar-content custom-scrollbar z-10">

                            {
                                comments.map((comment, index) => (
                                    <div
                                        key={index}
                                        className="box w-full"
                                    >

                                        {
                                            filteredUsers
                                                .filter((user) => user.id === comment.id_user)
                                                .map((user) => (
                                                    <div key={user.id} className=" mt-3 ">
                                                        <div className="flex items-center">
                                                            <button className="flex items-center">
                                                                <Avatar
                                                                    alt="Remy Sharp"
                                                                    src={user.avatar}
                                                                    sx={{ width: 40, height: 40 }}
                                                                />
                                                                <span
                                                                    className="ml-2 font-bold min-w-[150px] max-h-[150px] text-blue-900 overflow-hidden line-clamp-1"
                                                                    onClick={() => handleChannelClick(user)}
                                                                >
                                                                    {user.firstname + " " + user.lastname}
                                                                </span>
                                                                <span className="ml-2 text-gray-500">{comment.created_at}</span>
                                                            </button>
                                                        </div>
                                                        <div className="mt-2 mb-12">
                                                            <div className="w-full max-h-[150px]">
                                                                {comment.content}
                                                            </div>
                                                        </div>
                                                    </div>

                                                ))
                                        }

                                    </div>
                                ))
                            }

                        </div>
                        {/* Phần nhập bình luận */}
                        <div
                            className="box w-full h-full text-center"
                        >

                            <button
                                className="text-blue-500"
                                onClick={openLoginModal}
                            >
                                Cần đăng nhập để bình luận
                            </button>

                        </div>
                    </div>
                </div>
                {isLoginModal && <LoginPage closeModal={closeLoginModal} />}
            </div >
        );
    };
};
export default CommentPage;