import React from 'react';
import axios from 'axios';
import { useFormik } from "formik"
import * as Yup from "yup"

const AdminAddCategoryPage = ({ closeModal }) => {

    const validationSchema = Yup.object({
        name: Yup.string().required('Vui lòng nhập tên'),
        motto: Yup.string().required('Vui lòng nhập phương châm danh mục'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            motto: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values);
            axios
                .post('http://localhost:5000/api/admin/createCategory', values)
                .then((response) => {
                    // Xử lý thành công
                    console.log(response.data);
                    // Hiển thị thông báo đăng ký thành công
                    alert('Tạo danh mục thành công')
                    //window.location.href = '/admin';

                })
                .catch((error) => {
                    // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
                    console.error(error);
                });
        },
    })

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            // Kiểm tra xem đăng nhập đã thành công hay chưa
            closeModal(); // Gọi hàm closeModal khi nhấp vào nền và đăng nhập không thành công
        }
    };

    return (
        <div className="min-h-screen bg-black bg-opacity-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 fixed inset-0 z-50" onClick={handleBackdropClick}> {/* backdrop-blur-sm */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white py-1 px-4 shadow sm:rounded-lg sm:px-10 ">

                <div className="sm:mx-auto sm:w-full sm:max-w-md ">

                    <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Tạo Danh Mục
                    </h1>

                </div>

                <div>
                    <form className=" space-y-6" onSubmit={formik.handleSubmit}>

                        <div className="form-outline mt-6 mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Tên Danh Mục
                            </label>

                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="name"
                                    autoComplete="name"
                                    placeholder="Thư giãn"
                                    value={formik.values.name} // Đặt giá trị của input từ state user
                                    onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />

                            </div>
                            {formik.errors.name && formik.touched.name && <div className="text-red-500">{formik.errors.name}</div>}
                        </div>

                        <div className="form-outline mb-4 mt-6">
                            <label
                                htmlFor="motto"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Phương Châm
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="motto"
                                    name="motto"
                                    type="motto"
                                    autoComplete="motto"
                                    placeholder="........."
                                    value={formik.values.motto}
                                    style={{ resize: 'vertical', padding: '12px', minHeight: '150px' }}
                                    onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />

                            </div>
                            {formik.errors.motto && formik.touched.motto && <div>{formik.errors.motto}</div>}
                        </div>

                        <div className="py-6 flex justify-center  space-x-50 ">
                            <button
                                type="button"
                                className=" py-2 mr-8 px-4 w-full border border-transparent text-sm font-medium rounded-md text-black bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={closeModal}
                            >
                                Thoát
                            </button>
                            <button
                                type="submit"
                                className=" py-2 px-4 w-full border border-transparent text-sm font-medium rounded-md text-black bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Thêm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminAddCategoryPage;