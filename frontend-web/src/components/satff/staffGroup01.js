import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from "formik"
//import { useNavigate } from 'react-router-dom';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const staffString = localStorage.getItem('staff');
const staff = staffString ? JSON.parse(staffString) : null;



const closeLogout = () => {
    localStorage.setItem('loginStaffGroup01', 'false');
    window.location.href = '/login/staff';
};



const StaffGroup01Page = () => {
    // const navigate = useNavigate();
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

    const [currentCategoryId, setCurrentCategoryId] = useState('');

    // Dành Cho Nhân Viên

    // Khởi tạo state variable

    const [currentCategorySuggestion, setCurrentCategorySuggestion] = useState('');

    const handleCategorySuggestionClick = (categoryId, categorySuggestion) => {
        // Lưu giá trị mới vào localStorage
        localStorage.setItem('currentCategoryId', categoryId);
        localStorage.setItem('currentCategorySuggestion', categorySuggestion);

        // Cập nhật state variable
        setCurrentCategoryId(categoryId);
        setCurrentCategorySuggestion(categorySuggestion);
    };

    const formik = useFormik({
        initialValues: {
            id: currentCategoryId,
            suggestion: currentCategorySuggestion
        },
        enableReinitialize: true, // Thêm dòng này
        onSubmit: (values) => {
            // Cập nhật currentCategoryId trước khi gửi form
            handleCategorySuggestionClick(values.id);
            console.log('value.id', values.id)
            console.log('value.suggestion', values.suggestion)

            // Hiển thị hộp thoại xác nhận
            if (window.confirm('Bạn có chắc muốn cập nhật không?')) {
                axios
                    .put('http://localhost:5000/api/admin/changeCategorySuggestion', values)
                    .then((response) => {
                        // Xử lý thành công
                        console.log(response.data);
                        // Hiển thị thông báo cập nhật thành công
                        alert('Cập nhật thành công')
                        window.location.href = '/staff/group01/id:' + staff.id; // Sử dụng history để chuyển hướng
                    })
                    .catch((error) => {
                        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
                        console.error(error);
                    });
            }
        },
    });

    // Dành Cho Tổ Phản Biện

    // Khởi tạo state variable

    const [currentCategoryModification, setCurrentCategoryModification] = useState('');

    const handleCategoryModificationClick = (categoryId, categoryModification) => {
        // Lưu giá trị mới vào localStorage
        localStorage.setItem('currentCategoryId', categoryId);
        localStorage.setItem('currentCategoryModification', categoryModification);

        // Cập nhật state variable
        setCurrentCategoryId(categoryId);
        setCurrentCategoryModification(categoryModification);
    };

    const formik01 = useFormik({
        initialValues: {
            id: currentCategoryId,
            modification: currentCategoryModification,
            suggestion: '   Sửa Đổi: <<< Đã Xem Xét >>>'
        },
        enableReinitialize: true, // Thêm dòng này
        onSubmit: (values) => {
            // Cập nhật currentCategoryId trước khi gửi form
            handleCategoryModificationClick(values.id);
            console.log('value.id', values.id)
            console.log('value.modification', values.modification)

            // Hiển thị hộp thoại xác nhận
            if (window.confirm('Bạn có chắc muốn cập nhật không?')) {
                axios
                    .put('http://localhost:5000/api/admin/changeCategoryModification', values)
                    .then((response) => {
                        // Xử lý thành công
                        console.log(response.data);
                        // Hiển thị thông báo cập nhật thành công
                        alert('Cập nhật thành công')
                        window.location.href = '/staff/group01/id:' + staff.id; // Sử dụng history để chuyển hướng
                    })
                    .catch((error) => {
                        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
                        console.error(error);
                    });
            }
        },
    });

    // Dành Cho Quản lý trưởng cập nhật

    // Khởi tạo state variable

    const [currentCategoryDescription, setCurrentCategoryDescription] = useState('');

    const handleCategoryDescriptionClick = (categoryId, categoryDescription) => {
        // Lưu giá trị mới vào localStorage
        localStorage.setItem('currentCategoryId', categoryId);
        localStorage.setItem('currentCategoryDescription', categoryDescription);

        // Cập nhật state variable
        setCurrentCategoryId(categoryId);
        setCurrentCategoryDescription(categoryDescription);
    };

    const formik02 = useFormik({
        initialValues: {
            id: currentCategoryId,
            description: currentCategoryDescription,
            modification: currentCategoryDescription,
        },
        enableReinitialize: true, // Thêm dòng này
        onSubmit: (values) => {
            // Cập nhật currentCategoryId trước khi gửi form
            handleCategoryDescriptionClick(values.id);
            console.log('value.id', values.id)
            console.log('value.description', values.description)

            // Hiển thị hộp thoại xác nhận
            if (window.confirm('Bạn có chắc muốn cập nhật không?')) {
                axios
                    .put('http://localhost:5000/api/admin/changeCategoryDescription', values)
                    .then((response) => {
                        // Xử lý thành công
                        console.log(response.data);
                        // Hiển thị thông báo cập nhật thành công
                        alert('Cập nhật thành công')
                        window.location.href = '/staff/group01/id:' + staff.id; // Sử dụng history để chuyển hướng 
                    })
                    .catch((error) => {
                        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
                        console.error(error);
                    });
            }
        },
    });


    //const inputFirstName = formik.values.firstname === user.firstname ? user.firstname : formik.values.firstname;

    if (staff.level === "1") { // giao diện trang nhân viên sơ tuyển nhóm 01
        return (
            <div className="mb-8 ml-8 mr-8">
                {/* HeaderPage  */}
                <div className="text-center mt-5 ml-8">
                    <b className="text-3xl ml-8 text-blue-800">Trang Nhân Viên Đề Xuất - Nội Dung Danh Mục </b>

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
                {/* Nội dung */}
                <div className="mt-8 border">
                    <table className="min-w-full divide-y divide-gray-100 table-fixed">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="w-1/5 px-6 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider border-r-2">Danh Mục</th>
                                <th className="w-2/5 px-6 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider border-r-2">Tiêu Chuẩn Nội Dung Danh Mục</th>
                                <th className="w-2/5 px-6 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider border-r-2"> Nhân Viên Đề Xuất Sửa Đổi Tiêu Chuẩn Nội Dung Danh Mục</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id} className="bg-gray-50">
                                    <td className="w-1/5 px-6 py-4 whitespace-pre-line border-r-2"> {category.name}</td>
                                    <td className="w-2/5 px-6 py-4 whitespace-pre-line border-r-2 overflow-auto"> <div style={{ maxHeight: '500px' }}> {category.description} </div></td>
                                    <td className="w-2/5 px-6 py-4 whitespace-pre-line border-r-2">
                                        <form onSubmit={formik.handleSubmit}>
                                            <textarea
                                                className="w-full h-[500px] px-2 py-2 border"
                                                type="text"
                                                id={category.id}
                                                name="suggestion"
                                                placeholder="suggestion"
                                                value={formik.values[category.id]?.suggestion || category.suggestion}
                                                onChange={(e) => {
                                                    const updatedValue = e.target.value;
                                                    formik.setFieldValue(`${category.id}.suggestion`, updatedValue);
                                                }}
                                            />
                                            <button
                                                className="w-12 float-right bg-blue-400 px-1 py-1 rounded-md"
                                                type="submit"
                                                onClick={() => handleCategorySuggestionClick(category.id, (formik.values[category.id]?.suggestion || category.suggestion))}
                                            >
                                                Gửi
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        );

    } if (staff.level === "2") { // Giao diện trang tổ phản biện nhóm 01
        return (
            <div className="mb-8 ml-8 mr-8">

                <div>
                    <div className="text-center mt-5 ml-8">
                        <b className="text-3xl ml-8 text-blue-800">Trang Tổ Phản Biện - Nội Dung Danh Mục</b>
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
                <div className="mt-8">
                    <table className="min-w-full divide-y divide-gray-100 table-fixed">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="w-[50px] px-6 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider border-r-2">Danh Mục</th>
                                <th className="w-[300px] px-6 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider border-r-2">Nhân Viên Đề Xuất Sửa Đổi</th>
                                <th className="w-[500px] px-6 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider border-r-2">Tiêu Chuẩn Nội Dung Danh Mục Đã Chỉnh Sửa, Bổ Sung</th>
                                <th className="w-[500px] px-6 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider border-r-2">Tổ Phản Biện Xem Xét, Chỉnh Sửa Tiêu Chuẩn Nội Dung Danh Mục</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id} className="bg-gray-50">
                                    <td className="w-[50px] px-6 py-4 whitespace-pre-line border-r-2"> {category.name}</td>
                                    <td className="w-[300px] px-6 py-4 whitespace-pre-line border-r-2 overflow-auto"> <div style={{ maxHeight: '500px' }}>{category.suggestion}</div></td>
                                    <td className="w-[500px] px-6 py-4 whitespace-pre-line border-r-2 overflow-auto"> <div style={{ maxHeight: '500px' }}>{category.modification}</div></td>
                                    <td className="w-[500px] px-6 py-4 whitespace-pre-line border-r-2">
                                        <form onSubmit={formik01.handleSubmit}>
                                            <textarea
                                                className="w-full h-[500px] px-2 py-2 border"
                                                type="text"
                                                id={category.id}
                                                name="modification"
                                                placeholder="modification"
                                                value={formik01.values[category.id]?.modification || category.description}
                                                onChange={(e) => {
                                                    const updatedValue = e.target.value;
                                                    formik01.setFieldValue(`${category.id}.modification`, updatedValue);
                                                }}
                                            />
                                            <button
                                                className="w-12 float-right bg-blue-400 px-1 py-1 rounded-md"
                                                type="submit"
                                                onClick={() => handleCategoryModificationClick(category.id, (formik01.values[category.id]?.modification || category.description))}
                                            >
                                                Gửi
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        );

    } else { // Giao diện trang quản lý trưởng nhóm 01
        return (
            <div className="mb-8 ml-8 mr-8">

                <div>
                    <div className="text-center mt-5 ml-8">
                        <b className="text-3xl ml-8 text-blue-800">Trang Quản Lý Trưởng - Nội Dung Danh Mục</b>
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
                <div className="mt-8">
                    <table className="min-w-full divide-y divide-gray-100 table-fixed">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="w-[50px] px-6 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider border-r-2">Danh Mục</th>
                                <th className="w-[300px] px-6 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider border-r-2">Phương Châm Danh Mục</th>
                                <th className="w-[500px] px-6 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider border-r-2">Tiêu Chuẩn Nội Dung Danh Mục</th>
                                <th className="w-[500px] px-6 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider border-r-2">Quản Lý Trưởng Xem Xét, Cập Nhật Tiêu Chuẩn Nội Dung Danh Mục</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id} className="bg-gray-50">
                                    <td className="w-[50px] px-6 py-4 whitespace-pre-line border-r-2"> {category.name}</td>
                                    <td className="w-[300px] px-6 py-4 whitespace-pre-line border-r-2 overflow-auto"> <div style={{ maxHeight: '500px' }}> {category.motto} </div> </td>
                                    <td className="w-[500px] px-6 py-4 whitespace-pre-line border-r-2 overflow-auto"> <div style={{ maxHeight: '500px' }}> {category.description} </div></td>
                                    <td className="w-[500px] px-6 py-4 whitespace-pre-line border-r-2">
                                        <form onSubmit={formik02.handleSubmit}>
                                            <textarea
                                                className="w-full h-[500px] px-2 py-2 border"
                                                type="text"
                                                id={category.id}
                                                name="description"
                                                placeholder="description"
                                                value={formik02.values[category.id]?.description || category.modification}
                                                onChange={(e) => {
                                                    const updatedValue = e.target.value;
                                                    formik02.setFieldValue(`${category.id}.description`, updatedValue);
                                                }}
                                            />
                                            <button
                                                className="w-20 float-right bg-blue-400 px-1 py-1 rounded-md"
                                                type="submit"
                                                onClick={() => handleCategoryDescriptionClick(category.id, (formik02.values[category.id]?.description || category.description))}
                                            >
                                                Cập Nhật
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        );
    }
};

export default StaffGroup01Page;
