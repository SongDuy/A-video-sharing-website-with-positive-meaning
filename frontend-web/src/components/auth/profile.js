import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFormik } from "formik"
//import * as Yup from "yup"

import Avatar from '@mui/material/Avatar';

const userString = localStorage.getItem('user');
const user = userString ? JSON.parse(userString) : " ";

const ProfilePage = () => {

    const formik = useFormik({
        initialValues: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            avatar: user.avatar,
            phone: user.phone,
            address: user.address,
            gender: user.gender,
            birthday: user.birthday,
        },
        onSubmit: (values) => {
            //console.log(values);
            axios
                .put('http://localhost:5000/api/changeProfile', values)
                .then((response) => {
                    // Xử lý thành công
                    //console.log(response.data);
                    // Hiển thị thông báo cập nhật thành công
                    alert('Cập nhật thành công')
                    localStorage.setItem('user', JSON.stringify(response.data.user));

                    window.location.href = '/';
                })
                .catch((error) => {
                    // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
                    console.error(error);
                });
        },
    })

    const inputFirstName = formik.values.firstname === user.firstname ? user.firstname : formik.values.firstname;
    const inputLastName = formik.values.lastname === user.lastname ? user.lastname : formik.values.lastname;
    const inputAvatar = formik.values.avatar === user.avatar ? user.avatar : formik.values.avatar;
    const inputPhone = formik.values.phone === user.phone ? user.phone : formik.values.phone;
    const inputAddress = formik.values.address === user.address ? user.address : formik.values.address;
    const inputGender = formik.values.gender === user.gender ? user.gender : formik.values.gender;
    const inputBirthday = formik.values.birthday === user.birthday ? user.birthday : formik.values.birthday;

    // Định nghĩa hàm xử lý sự kiện khi thay đổi giá trị của ngày, tháng và năm
    const handleDateChange = (event) => {
        const { name, value } = event.target;
        const [year, month, day] = value.split('-');

        if (year >= 1970 && month && day) {
            const selectedDate = new Date(year, month - 1, day);
            selectedDate.setDate(selectedDate.getDate() + 1);

            if (!isNaN(selectedDate)) {
                const formattedDate = selectedDate.toISOString().split('T')[0];
                formik.setFieldValue(name, formattedDate);
                return;
            }
        }

        console.error('Invalid date:', value);
    };
    return (
        <>
            <div className="min-h-screen bg-gray-300 flex flex-col justify-center  py-12 sm:px-6 lg:px-8 fixed inset-0  bg-opacity-30 backdrop-blur-sm z-50  ">
                <div className="bg-white sm:mx-auto sm:rounded-lg sm:w-full sm:max-w-md mt-8 mb-28">
                    <div className=" py-8 px-4 shadow sm:rounded-lg sm:px-10">

                        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                            <h2 className=" text-center text-3xl font-extrabold text-gray-900">
                                Thông Tin Tài Khoản
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
                                <div className="flex">
                                    <div className="w-1/2 mr-2">
                                        <label
                                            htmlFor="firstname"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Họ
                                        </label>
                                        <div className="mt-[10px]">
                                            <input
                                                id="firstname"
                                                name="firstname"
                                                type="text"
                                                autoComplete="firstname"
                                                //placeholder={user.firstname}
                                                value={inputFirstName}
                                                // Đặt giá trị của input từ state user
                                                onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                                // required
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        {formik.errors.firstname && formik.touched.firstname && <div>{formik.errors.firstname}</div>}
                                    </div>

                                    <div className="w-1/2 mr-2">
                                        <label
                                            htmlFor="lastname"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Tên
                                        </label>
                                        <div className="mt-[10px]">
                                            <input
                                                id="lastname"
                                                name="lastname"
                                                type="text"
                                                autoComplete="lastname"
                                                //placeholder={user.lastname}
                                                value={inputLastName}
                                                onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                                // required
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        {formik.errors.lastname && formik.touched.lastname && <div>{formik.errors.lastname}</div>}
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="w-1/2 mr-2">
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                            Giới tính
                                        </label>
                                        <div className="mt-[20px] flex">
                                            <div className="mr-4">
                                                <label htmlFor="male" className="inline-flex items-center">
                                                    <input
                                                        id="male"
                                                        name="gender"
                                                        type="radio"
                                                        value="Nam"
                                                        checked={inputGender === "Nam"}
                                                        onChange={formik.handleChange}
                                                        className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                                    />
                                                    <span className="ml-2">Nam</span>
                                                </label>
                                            </div>
                                            <div>
                                                <label htmlFor="female" className="inline-flex items-center">
                                                    <input
                                                        id="female"
                                                        name="gender"
                                                        type="radio"
                                                        value="Nữ"
                                                        checked={inputGender === "Nữ"}
                                                        onChange={formik.handleChange}
                                                        className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                                    />
                                                    <span className="ml-2">Nữ</span>
                                                </label>
                                            </div>

                                        </div>
                                        {formik.errors.gender && formik.touched.gender && <div>{formik.errors.gender}</div>}
                                    </div>

                                    <div className="w-1/2 mr-2">
                                        <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                                            Ngày sinh
                                        </label>
                                        <div className="mt-[10px]">
                                            <div className="flex">
                                                <input
                                                    id="birthday"
                                                    name="birthday"
                                                    type="date"
                                                    value={inputBirthday ? inputBirthday : ''}
                                                    onChange={handleDateChange}
                                                    //min="1935-01-01" // Thêm thuộc tính min để cho phép chọn năm lớn hơn 1937
                                                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                        {formik.errors.birthday && formik.touched.birthday && <div>{formik.errors.birthday}</div>}
                                    </div>
                                </div>

                                <div className="flex">

                                    <div className="w-1/2 mr-2">
                                        <label
                                            htmlFor="avatar"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Ảnh đại diện
                                        </label>
                                        <div className="mt-1 flex justify-center items-center">
                                            <Avatar
                                                alt="Remy Sharp"
                                                src={inputAvatar}
                                                sx={{ width: 50, height: 50 }}
                                            />
                                            <select
                                                id="avatar"
                                                name="avatar"
                                                type="avatar"
                                                autoComplete="avatar"
                                                placeholder="Link to your avatar"
                                                value={inputAvatar}
                                                onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                                // required
                                                className="ml-2 appearance-none block w-full h-[38px] border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option className="text-center text-blue-600" value=""> Chọn Ảnh Avatar</option>
                                                <option
                                                    value="https://internetviettel.vn/wp-content/uploads/2017/05/1-2.jpg"
                                                    className="text-center"
                                                >
                                                    Avatar 01
                                                </option>

                                                <option
                                                    value="https://vapa.vn/wp-content/uploads/2022/12/anh-3d-thien-nhien.jpeg"
                                                    className="text-center"
                                                >
                                                    Avatar 02
                                                </option>

                                                <option
                                                    value="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrQdrE5Hne0l2Z1UInCTXVse-nQ2m6GVXf0w&usqp=CAU"
                                                    className="text-center"
                                                >
                                                    Avatar 03
                                                </option>

                                                <option
                                                    value="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/06/tai-hinh-nen-dep-nhat-the-gioi-43.jpg"
                                                    className="text-center"
                                                >
                                                    Avatar 04
                                                </option>

                                                <option
                                                    value="https://didongviet.vn/dchannel/wp-content/uploads/2023/08/dong-vat-hinh-nen-iphone-doc-dep-didongviet-23@2x-min-1-576x1024.jpg"
                                                    className="text-center"
                                                >
                                                    Avatar 05
                                                </option>

                                                <option
                                                    value="https://treobangron.com.vn/wp-content/uploads/2022/09/background-dep-5-2.jpg"
                                                    className="text-center"
                                                >
                                                    Avatar 06
                                                </option>

                                            </select>
                                        </div>
                                        {formik.errors.avatar && formik.touched.avatar && <div>{formik.errors.avatar}</div>}
                                    </div>

                                    <div className="w-1/2 mr-2">
                                        <label
                                            htmlFor="phone"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Số điện thoại
                                        </label>
                                        <div className="mt-[10px]">
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="phone"
                                                autoComplete="phone"
                                                //placeholder={user.phone}
                                                value={inputPhone}
                                                onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                                // required
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        {formik.errors.phone && formik.touched.phone && <div>{formik.errors.phone}</div>}
                                    </div>

                                </div>

                                <div>
                                    <label
                                        htmlFor="address"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Địa chỉ
                                    </label>
                                    <div className="mt-[10px]">
                                        <input
                                            id="address"
                                            name="address"
                                            type="address"
                                            autoComplete="address"
                                            // placeholder={user.address}
                                            value={inputAddress}
                                            onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                            // required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    {formik.errors.address && formik.touched.address && <div>{formik.errors.address}</div>}
                                </div>

                                <div className="z-10">
                                    <button
                                        type="submit"
                                        className="group  w-full flex justify-center  py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cập nhật
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



export default ProfilePage;