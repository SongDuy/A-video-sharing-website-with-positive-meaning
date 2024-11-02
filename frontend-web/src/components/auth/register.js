import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFormik } from "formik"
import * as Yup from "yup"

const RegisterPage = () => {

    const validationSchema = Yup.object({
        firstname: Yup.string().required('Vui lòng nhập tên'),
        lastname: Yup.string().required('Vui lòng nhập họ'),
        email: Yup.string().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập email'),
        password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
    });

    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values);
            axios
                .post('http://localhost:5000/api/register', values)
                .then((response) => {
                    // Xử lý thành công
                    console.log(response.data);
                    // Hiển thị thông báo đăng ký thành công
                    alert('Đăng ký thành công')
                    window.location.href = '/';

                })
                .catch((error) => {
                    // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
                    console.error(error);
                });
        },
    })

    return (
        <>
            <div className="min-h-screen bg-gray-300 flex flex-col justify-center  py-12 sm:px-6 lg:px-8 fixed inset-0  bg-opacity-30 backdrop-blur-sm z-50  ">
                <div className="bg-white sm:mx-auto sm:rounded-lg sm:w-full sm:max-w-md mt-8 mb-28">
                    <div className=" py-8 px-4 shadow sm:rounded-lg sm:px-10">

                        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                            <h2 className=" text-center text-3xl font-extrabold text-gray-900">
                                Đăng Ký Tài Khoản
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                <Link
                                    className="font-medium text-indigo-600 hover:text-indigo-500 text-red-300"
                                    to="/"
                                >
                                    <b>Quay lại</b>
                                </Link>
                            </p>
                        </div>


                        <div>
                            <form className="space-y-6" onSubmit={formik.handleSubmit}>

                                <div>
                                    <label
                                        htmlFor="firstname"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Họ
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="firstname"
                                            name="firstname"
                                            type="text"
                                            autoComplete="firstname"
                                            placeholder="Nguyễn Văn"
                                            value={formik.values.firstname} // Đặt giá trị của input từ state user
                                            onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    {formik.errors.firstname && formik.touched.firstname && <div>{formik.errors.firstname}</div>}
                                </div>

                                <div>
                                    <label
                                        htmlFor="lastname"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Tên
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="lastname"
                                            name="lastname"
                                            type="text"
                                            autoComplete="lastname"
                                            placeholder="An"
                                            value={formik.values.lastname}
                                            onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    {formik.errors.lastname && formik.touched.lastname && <div>{formik.errors.lastname}</div>}
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="my@gmail.com"
                                            value={formik.values.email}
                                            onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />

                                    </div>
                                    {formik.errors.email && formik.touched.email && <div>{formik.errors.email}</div>}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Mật khẩu
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    {formik.errors.password && formik.touched.password && <div>{formik.errors.password}</div>}
                                </div>

                                <div className="z-10">
                                    <button
                                        type="submit"
                                        className="group  w-full flex justify-center  py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Đăng ký
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );

};



export default RegisterPage;