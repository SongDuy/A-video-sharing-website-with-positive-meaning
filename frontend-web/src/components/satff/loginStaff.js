import React from 'react';
//import { Link } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from "formik"
import * as Yup from "yup"

const LoginStaffPage = () => {

    const validationSchema = Yup.object({
        email: Yup.string().email('Địa chỉ email không hợp lệ').required('Vui lòng nhập email'),
        password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values);
            axios
                .post('http://localhost:5000/api/login/staff', values)
                .then((response) => {
                    // Xử lý thành công
                    console.log(response.data);

                    // Hiển thị thông báo đăng ký thành công
                    alert('Đăng nhập thành công')

                    if (response.data.staff.group === "1") {
                        // Đăng nhập thành công
                        localStorage.setItem('loginStaffGroup01', 'true');
                        window.location.href = '/staff/group01/id:' + response.data.staff.id;
                        // Lưu thông tin nhân viên
                        localStorage.setItem('staff', JSON.stringify(response.data.staff));
                        console.log(localStorage.getItem('staff'))

                    } else if (response.data.staff.group === "2") {
                        // Đăng nhập thành công
                        localStorage.setItem('loginStaffGroup02', 'true');
                        window.location.href = '/staff/group02/id:' + response.data.staff.id;
                        // Lưu thông tin nhân viên
                        localStorage.setItem('staff', JSON.stringify(response.data.staff));
                        console.log(localStorage.getItem('staff'))
                    } else {
                        // Đăng nhập thành công
                        localStorage.setItem('loginStaffGroup03', 'true');
                        window.location.href = '/staff/group03/id:' + response.data.staff.id;
                        // Lưu thông tin nhân viên
                        localStorage.setItem('staff', JSON.stringify(response.data.staff));
                        console.log(localStorage.getItem('staff'))
                    }

                })
                .catch((error) => {
                    // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
                    alert('Đăng nhập thất bại', error)
                    console.error(error);
                });
        },
    })

    return (
        <div className="min-h-screen bg-gray-300 flex flex-col justify-center py-12 sm:px-6 lg:px-8 fixed inset-0 z-50" > {/* backdrop-blur-sm */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md mb-28 bg-white py-1 px-4 shadow sm:rounded-lg sm:px-10 mb-26 ">

                <div className="sm:mx-auto sm:w-full sm:max-w-md ">

                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đăng Nhập Nhân Viên
                    </h2>

                </div>

                <div>
                    <form className=" space-y-6" onSubmit={formik.handleSubmit}>
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-md py-6 shadow-sm -space-y-px-10">
                            <div className="form-outline mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Tài khoản nhân viên
                                </label>

                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="my@gmail.com"
                                        required
                                        value={formik.values.email} // Đặt giá trị của input từ state user
                                        onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />

                                </div>
                                {formik.errors.email && formik.touched.email && <div className="text-red-500">{formik.errors.email}</div>}

                            </div>

                            <div className="form-outline mb-4 mt-6">
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
                                        autoComplete="current-password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                        required
                                        placeholder="••••••••"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />

                                </div>
                                {formik.errors.password && formik.touched.password && <div className="text-red-500">{formik.errors.password}</div>}

                            </div>

                        </div>

                        <div className="py-6 flex justify-center  space-x-36 ">
                            <button
                                type="submit"
                                className=" py-2 px-4 w-full border border-transparent text-sm font-medium rounded-md text-black bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginStaffPage;
