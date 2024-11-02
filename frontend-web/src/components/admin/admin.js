import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from "formik"

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import AdminAddStaffPage from './adminAddStaff';
import AdminAddCategoryPage from './adminAddCategory';

import AdminChangeStaffPage from './adminChangeStaff';
import AdminChangeCategoryPage from './adminChangeCategory';

import AdminWatchVideoPage from './adminWatchVideo';

import '../../index.css';

const closeLogout = () => {
    localStorage.setItem('loginAdmin', 'false');
    window.location.href = '/login/admin';
};

const AdminPage = () => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [staffs, setStaffs] = useState([]);

    const [staff_Id, setStaff_Id] = useState();
    const [staff_Name, setStaff_Name] = useState();
    const [staff_Email, setStaff_Email] = useState();
    const [staff_Group, setStaff_Group] = useState();
    const [staff_Level, setStaff_Level] = useState();

    const [categories, setCategories] = useState([]);

    const [category_Id, setCategory_Id] = useState();
    const [category_Name, setCategory_Name] = useState();
    const [category_Motto, setCategory_Motto] = useState();

    const [comments, setComments] = useState([]);

    const [videos, setVideos] = useState([]);
    const [video_Id, setVideo_Id] = useState();
    //console.log(video_Id)
    const [reloadStaffs, setReloadStaffs] = useState(false);

    const [reloadCategories, setReloadCategories] = useState(false);

    const [reloadVideos, setReloadVideos] = useState(false);

    const [reloadComments, setReloadComments] = useState(false);

    useEffect(() => {
        axios
            .get('http://localhost:5000/api/staffs')
            .then((response) => {
                // console.log(response.data);
                const staffsData = response.data;
                setStaffs(staffsData);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setReloadStaffs(false); // Đặt lại giá trị reloadComments thành false sau khi tải xong
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
            })
            .finally(() => {
                setReloadCategories(false); // Đặt lại giá trị reloadComments thành false sau khi tải xong
            });

        axios
            .get('http://localhost:5000/api/videos')
            .then((response) => {
                // console.log(response.data);
                const videosData = response.data;
                setVideos(videosData);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setReloadVideos(false); // Đặt lại giá trị reloadComments thành false sau khi tải xong
            });

        axios
            .get('http://localhost:5000/api/comments')
            .then((response) => {
                // console.log(response.data);
                const commentsData = response.data;
                setComments(commentsData);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setReloadComments(false); // Đặt lại giá trị reloadComments thành false sau khi tải xong
            });

    }, [reloadStaffs, reloadCategories, reloadVideos, reloadComments]);

    // Phần Quản lý Nhân Viên

    const handleEditStaff = (staffId, staffName, staffEmail, staffGroup, staffLevel) => {
        setStaff_Id(staffId);
        setStaff_Name(staffName);
        setStaff_Email(staffEmail);
        setStaff_Group(staffGroup);
        setStaff_Level(staffLevel);
        //console.log(staffId);

    }

    const handleDeleteStaff = (staffId) => {
        formik01.setValues({
            id: staffId,
        });
        formik01.handleSubmit();
    };

    const formik01 = useFormik({
        initialValues: {
            id: '',
        },
        onSubmit: (values) => {
            axios
                .delete('http://localhost:5000/api/admin/deleteStaff', { data: values })
                .then((response) => {
                    // console.log(response.data);
                    setReloadStaffs(true);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    });

    const handleReloadStaffs = () => {
        setReloadStaffs(true)
        //console.log(reloadStaffs);
    }

    const columnsStaffs = [
        { field: 'id', headerName: 'ID', width: 200, align: 'center', headerAlign: 'center' },
        { field: 'name', headerName: 'Họ Tên', width: 250, align: 'center', headerAlign: 'center' },
        { field: 'email', headerName: 'Email', width: 200, align: 'center', headerAlign: 'center', },
        { field: 'group', headerName: 'Nhóm Nhân Viên', width: 200, align: 'center', headerAlign: 'center', },
        { field: 'level', headerName: 'Cấp Bậc Nhân Viên', type: 'number', width: 200, align: 'center', headerAlign: 'center', },
        {
            field: 'actions',
            headerName: 'Quản Lý Nhân Viên',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <div
                    className="button-group"
                    onSubmit={formik01.handleSubmit}
                >
                    <div
                        onClick={openChangeStaffModal}
                    >
                        <IconButton
                            className="px-5"
                            onClick={() => handleEditStaff(params.row.id, params.row.name, params.row.email, params.row.group, params.row.level)}
                            color="primary"
                            type="submit"
                        >
                            <EditIcon />
                        </IconButton>
                    </div>

                    <IconButton
                        onClick={() => handleDeleteStaff(params.row.id)}
                        color="error"
                        type="submit"
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    const rowsStaffs = staffs.map((staff) => {
        let group;

        if (staff.group === "1") {
            group = "Nhóm Ban Hành Quy Định";
        } else if (staff.group === "2") {
            group = "Nhóm Phát Hành Video";
        } else if (staff.group === "3") {
            group = "Nhóm Kiểm Tra Giám Sát";
        }

        return {
            id: staff.id,
            name: staff.name,
            email: staff.email,
            group: group,
            level: staff.level,
        };
    });

    // Thêm nhân viên
    const [isAddStaffModal, setIsAddStaffModal] = useState(false);
    const openAddStaffModal = () => {
        if (isAddStaffModal === true) {
            setIsAddStaffModal(false);
        } else {
            setIsAddStaffModal(true);
        }

    };

    const closeAddStaffModal = () => {
        setIsAddStaffModal(false);
    };

    // Thay đổi thông tin nhân viên
    const [isChangeStaffModal, setIsChangeStaffModal] = useState(false);
    const openChangeStaffModal = () => {
        if (isChangeStaffModal === true) {
            setIsChangeStaffModal(false);
        } else {
            setIsChangeStaffModal(true);
        }

    };

    const closeChangeStaffModal = () => {
        setIsChangeStaffModal(false);
    };

    // Phần Quản Lý Danh Mục

    const handleEditCategory = (categoryId, categoryName, categoryMotto) => {

        setCategory_Id(categoryId);
        setCategory_Name(categoryName);
        setCategory_Motto(categoryMotto);

        setReloadCategories(true);
        //console.log(categoryId)
    }
    const handleDeleteCategory = (categoryId) => {
        formik02.setValues({
            id: categoryId,
        });
        formik02.handleSubmit();
    }

    const formik02 = useFormik({
        initialValues: {
            id: '',
        },
        onSubmit: (values) => {
            axios
                .delete('http://localhost:5000/api/admin/deleteCategory', { data: values })
                .then((response) => {
                    // console.log(response.data);
                    setReloadCategories(true);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    });
    const handleReloadCategories = () => {
        setReloadCategories(true)
        //console.log(reloadCategories);
    }

    const columnsCategories = [
        { field: 'id', headerName: 'ID', width: 200, align: 'center', headerAlign: 'center' },
        { field: 'name', headerName: 'Tên Danh Mục', width: 200, align: 'center', headerAlign: 'center' },

        {
            field: 'motto',
            headerName: 'Phương Châm Danh Mục',
            width: 650,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <div
                    style={{
                        height: '100%', // Đặt chiều cao cố định cho div chứa nội dung
                        overflow: 'auto', // Sử dụng 'auto' để cho phép cuộn khi nội dung vượt quá kích thước
                        display: 'flex', // Sử dụng flexbox để căn giữ theo chiều dọc
                        alignItems: 'center', // Căn giữ theo chiều dọc (vertical center)
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                    }}
                    title={params.value}
                >
                    {params.value}
                </div>
            ),
        },
        {
            field: 'actions',
            headerName: 'Quản Lý Danh Mục',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <div
                    className="button-group"
                    onSubmit={formik02.handleSubmit}
                >
                    <div
                        onClick={openChangeCategoryModal}
                    >

                        <IconButton
                            className="px-5"
                            onClick={() => handleEditCategory(params.row.id, params.row.name, params.row.motto)}
                            color="primary"
                            type="submit"
                        >
                            <EditIcon />
                        </IconButton>
                    </div>

                    <IconButton
                        onClick={() => handleDeleteCategory(params.row.id)}
                        color="error"
                        type="submit"
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    const rowsCategories = categories.map((category) => ({
        id: category.id,
        name: category.name,
        motto: category.motto,

    }));

    // Thêm danh mục
    const [isAddCategoryModal, setIsAddCategoryModal] = useState(false);
    const openAddCategoryModal = () => {
        if (isAddCategoryModal === true) {
            setIsAddCategoryModal(false);
        } else {
            setIsAddCategoryModal(true);
        }

    };

    const closeAddCategoryModal = () => {
        setIsAddCategoryModal(false);
    };

    // Thay đổi danh mục
    const [isChangeCategoryModal, setIsChangeCategoryModal] = useState(false);
    const openChangeCategoryModal = () => {
        if (isChangeCategoryModal === true) {
            setIsChangeCategoryModal(false);
        } else {
            setIsChangeCategoryModal(true);
        }

    };

    const closeChangeCategoryModal = () => {
        setIsChangeCategoryModal(false);
    };

    // Phần Quản Lý Video

    const handleWatchVideo = (videoId) => {
        setVideo_Id(videoId);
        //console.log(videoId);
    }
    const handleDeleteVideo = (videoId) => {
        formik03.setValues({
            cloudinary_id: videoId,
        });
        formik03.handleSubmit();
    };

    const formik03 = useFormik({
        initialValues: {
            cloudinary_id: '',
        },
        onSubmit: (values) => {
            axios
                .delete('http://localhost:5000/api/deleteVideo', { data: values })
                .then((response) => {
                    // console.log(response.data);
                    setReloadVideos(true);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    });

    const columnsVideos = [
        { field: 'id', headerName: 'ID', width: 250, align: 'center', headerAlign: 'center' },

        {
            field: 'title',
            headerName: 'Tiêu Đề Video',
            width: 300,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <div
                    style={{
                        maxHeight: '100%', // Tăng giá trị maxHeight để hiển thị nội dung đầy đủ
                        overflow: 'auto',
                        display: 'flex', // Sử dụng flexbox để căn giữ theo chiều dọc
                        alignItems: 'center', // Căn giữ theo chiều dọc (vertical center)
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                    }}
                    title={params.value}
                >
                    {params.value}
                </div>
            ),
        },

        { field: 'id_user', headerName: 'Mã User', width: 250, align: 'center', headerAlign: 'center' },

        { field: 'status', headerName: 'Trạng Thái', width: 150, align: 'center', headerAlign: 'center' },

        { field: 'created_at', headerName: 'Ngày Tải Lên', width: 150, align: 'center', headerAlign: 'center' },


        {
            field: 'actions',
            headerName: 'Quản Lý Video',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <div
                    className="button-group"
                    onSubmit={formik02.handleSubmit}
                >
                    <div
                        onClick={openWatchVideoModal}
                    >
                        <IconButton
                            className="px-5"
                            onClick={() => handleWatchVideo(params.row.id)}
                            color="primary"
                            type="submit"
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </div>

                    <IconButton
                        onClick={() => handleDeleteVideo(params.row.id)}
                        color="error"
                        type="submit"
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    const rowsVideos = videos.map((video) => ({
        id: video.cloudinary_id,
        title: video.title,
        id_user: video.id_user,
        status: video.status,
        created_at: video.created_at,

    }));

    // Xem Video
    const [isWatchVideoModal, setIsWatchVideoModal] = useState(false);
    const openWatchVideoModal = () => {
        if (isWatchVideoModal === true) {
            setIsWatchVideoModal(false);
        } else {
            setIsWatchVideoModal(true);
        }

    };

    const closeWatchVideoModal = () => {
        setIsWatchVideoModal(false);
    };

    // Phần Quản Lý Bình Luận
    // const handleEditComment = (commentId) => {

    // }

    const handleDeleteComment = (commentId) => {
        formik04.setValues({
            id: commentId,
        });
        formik04.handleSubmit();
    };

    const formik04 = useFormik({
        initialValues: {
            id: '',
        },
        onSubmit: (values) => {
            axios
                .delete('http://localhost:5000/api/deleteComment', { data: values })
                .then((response) => {
                    // console.log(response.data);
                    setReloadVideos(true);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    });

    const columnsComments = [
        { field: 'id', headerName: 'ID', width: 200, align: 'center', headerAlign: 'center' },
        { field: 'id_video', headerName: 'Mã Video', width: 220, align: 'center', headerAlign: 'center' },
        { field: 'id_user', headerName: 'Mã Tài Khoản Người Dùng', width: 200, align: 'center', headerAlign: 'center' },
        {
            field: 'content',
            headerName: 'Nội Dung Bình Luận',
            width: 400,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <div
                    style={{
                        height: '100%', // Đặt chiều cao cố định cho div chứa nội dung
                        overflow: 'auto', // Sử dụng 'auto' để cho phép cuộn khi nội dung vượt quá kích thước
                        display: 'flex', // Sử dụng flexbox để căn giữ theo chiều dọc
                        alignItems: 'center', // Căn giữ theo chiều dọc (vertical center)
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                    }}
                    title={params.value}
                >
                    {params.value}
                </div>
            ),
        },
        { field: 'created_at', headerName: 'Ngày Bình Luận', width: 150, align: 'center', headerAlign: 'center' },

        {
            field: 'actions',
            headerName: 'Quản Lý Bình Luận',
            width: 150,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <div
                    className="button-group"
                    onSubmit={formik02.handleSubmit}
                >
                    {/* <IconButton
                        className="px-5"
                        onClick={() => handleEditComment(params.row.id)}
                        color="primary"
                        type="submit"
                    >
                        <EditIcon />
                    </IconButton> */}
                    <IconButton
                        onClick={() => handleDeleteComment(params.row.id)}
                        color="error"
                        type="submit"
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    const rowsComments = comments.map((comment) => ({
        id: comment.id,
        id_video: comment.id_video,
        id_user: comment.id_user,
        content: comment.content,
        created_at: comment.created_at,
    }));

    return (
        <div>
            <div className="text-center mt-5 ml-8">
                <b className="text-3xl ml-8 text-blue-800">Trang Admin </b>

                <div className=" float-right mr-8">
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

            <div className='w-full px-12 mt-5'>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab
                                    label="Quản lý nhân viên"
                                    value="1"
                                />
                                <Tab
                                    label="Quản lý danh mục"
                                    value="2"
                                />
                                <Tab
                                    label="Quản lý video"
                                    value="3"
                                />
                                <Tab
                                    label="Quản lý bình luận"
                                    value="4"
                                />
                                <Tab
                                    label="Quản lý báo cáo"
                                    value="5"
                                />
                            </TabList>
                        </Box>

                        <TabPanel value="1">
                            <div>
                                <div>
                                    <button
                                        type="button"
                                        className="w-[150px] py-1 bg-blue-800 hover:bg-blue-600 text-white rounded-lg font-bold"
                                        onClick={openAddStaffModal}
                                    >
                                        Thêm Nhân Viên
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-[150px] ml-8 py-1 bg-blue-800 hover:bg-blue-600 text-white rounded-lg font-bold"
                                        onClick={() => handleReloadStaffs()}
                                    >
                                        Tải lại trang
                                    </button>
                                </div>
                                <div
                                    style={{ height: 500, width: '100%' }}
                                    className="text-center mt-5"
                                >
                                    <DataGrid
                                        rows={rowsStaffs}
                                        columns={columnsStaffs}
                                        initialState={{
                                            pagination: {
                                                paginationModel: { page: 0, pageSize: 10 },
                                            },
                                        }}
                                        pageSizeOptions={[10, 20]}
                                        checkboxSelection
                                    />
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel value="2">
                            <div>
                                <div>
                                    <button
                                        className="w-[150px] py-1 bg-blue-800 hover:bg-blue-600 text-white rounded-lg font-bold"
                                        onClick={openAddCategoryModal}
                                    >
                                        Thêm Danh Mục
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-[150px] ml-8 py-1 bg-blue-800 hover:bg-blue-600 text-white rounded-lg font-bold"
                                        onClick={() => handleReloadCategories()}
                                    >
                                        Tải lại trang
                                    </button>
                                </div>
                                <div
                                    style={{ height: 500, width: '100%' }}
                                    className="text-center mt-5"
                                >
                                    <DataGrid
                                        rows={rowsCategories}
                                        columns={columnsCategories}
                                        initialState={{
                                            pagination: {
                                                paginationModel: { page: 0, pageSize: 10 },
                                            },
                                        }}
                                        pageSizeOptions={[10, 20]}
                                        checkboxSelection
                                        rowHeight={100} // Đặt chiều cao cố định cho mỗi dòng là 150px
                                    />
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value="3">
                            <div
                                style={{ height: 550, width: '100%' }}
                                className="text-center"
                            >
                                <DataGrid
                                    rows={rowsVideos}
                                    columns={columnsVideos}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                        },
                                    }}
                                    pageSizeOptions={[10, 20]}
                                    checkboxSelection
                                    rowHeight={100} // Đặt chiều cao cố định cho mỗi dòng là 150px
                                />
                            </div>
                        </TabPanel>
                        <TabPanel value="4">
                            <div
                                style={{ height: 550, width: '100%' }}
                                className="text-center"
                            >
                                <DataGrid
                                    rows={rowsComments}
                                    columns={columnsComments}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                        },
                                    }}
                                    pageSizeOptions={[10, 20]}
                                    checkboxSelection
                                    rowHeight={100} // Đặt chiều cao cố định cho mỗi dòng là 150px
                                />
                            </div>
                        </TabPanel>
                        <TabPanel value="5">
                            <div className="text-red-500">
                                Item One
                            </div>
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
            {isAddStaffModal && <AdminAddStaffPage closeModal={closeAddStaffModal} />}
            {isAddCategoryModal && <AdminAddCategoryPage closeModal={closeAddCategoryModal} />}
            {isChangeStaffModal && <AdminChangeStaffPage closeModal={closeChangeStaffModal} values={{ id: staff_Id, name: staff_Name, email: staff_Email, group: staff_Group, level: staff_Level }} />}
            {isChangeCategoryModal && <AdminChangeCategoryPage closeModal={closeChangeCategoryModal} values={{ id: category_Id, name: category_Name, motto: category_Motto }} />}

            {isWatchVideoModal && <AdminWatchVideoPage closeModal={closeWatchVideoModal} value={video_Id} />}

        </div>

    );
};

export default AdminPage;
