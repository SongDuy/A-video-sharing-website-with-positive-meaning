import React from 'react';
import axios from 'axios';
import { useFormik } from "formik"

const AdminChangeStaffPage = ({ closeModal, values }) => {
    //console.log(values.id);
    // console.log(category_Name);
    if (`${values.group}` === "Nhóm Ban Hành Quy Định") {
        values.group = "1"
    } else if (`${values.group}` === "Nhóm Phát Hành Video") {
        values.group = "2"

    } else if (`${values.group}` === "Nhóm Kiểm Tra Giám Sát") {
        values.group = "3"

    }
    console.log(`"${values.group}"`);
    // console.log(values.level);

    const formik = useFormik({
        initialValues: {
            id: values.id,
            name: values.name,
            email: values.email,
            group: values.group,
            level: values.level,
        },
        onSubmit: (values) => {
            // console.log(values);
            axios
                .put('http://localhost:5000/api/admin/changeStaff', values)
                .then((response) => {
                    // Xử lý thành công
                    //console.log(response.data);
                    // Hiển thị thông báo đăng ký thành công
                    alert('Cập nhật danh mục thành công')
                    //window.location.href = '/admin';

                })
                .catch((error) => {
                    // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
                    console.error(error);
                });
        },
    })

    const inputName = formik.values.name === values.name ? values.name : formik.values.name;
    const inputEmail = formik.values.email === values.email ? values.email : formik.values.email;
    const inputGroup = formik.values.group === values.group ? values.group : formik.values.group;
    const inputLevel = formik.values.level === values.level ? values.level : formik.values.level;

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
                        Cập Nhật Thông Tin
                    </h1>

                </div>

                <div>
                    <form className=" space-y-6" onSubmit={formik.handleSubmit}>

                        <div className="form-outline mt-6 mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Họ Tên
                            </label>

                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="name"
                                    autoComplete="name"
                                    placeholder="my@gmail.com"
                                    value={inputName} // Đặt giá trị của input từ state user
                                    onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />

                            </div>
                            {formik.errors.name && formik.touched.name && <div className="text-red-500">{formik.errors.name}</div>}
                        </div>

                        <div className="form-outline mb-4 mt-6">
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
                                    value={inputEmail}
                                    onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />

                            </div>
                            {formik.errors.email && formik.touched.email && <div>{formik.errors.email}</div>}
                        </div>

                        <div className="form-outline mb-4 mt-6">
                            <label
                                htmlFor="group"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nhóm Nhân Viên
                            </label>
                            <div className="mt-1">
                                <select
                                    id="group"
                                    name="group"
                                    type="group"
                                    autoComplete="group"
                                    placeholder="my@gmail.com"
                                    value={inputGroup}
                                    onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option className="text-center" value=""> --- Chọn Nhóm Nhân Viên --- </option>
                                    <option value="1">Nhóm Ban Hành Quy Định </option>
                                    <option value="2">Nhóm Phát Hành Video</option>
                                    <option value="3">Nhóm Kiểm Tra Giám Sát</option>
                                </select>

                            </div>
                            {formik.errors.group && formik.touched.group && <div>{formik.errors.group}</div>}
                        </div>

                        <div className="form-outline mb-4 mt-6">
                            <label
                                htmlFor="level"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Cấp Bậc Nhân Viên
                            </label>
                            <div className="mt-1">
                                <select
                                    id="level"
                                    name="level"
                                    type="level"
                                    autoComplete="level"
                                    value={inputLevel}
                                    onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option className="text-center" value=""> --- Chọn Cấp Bậc Nhân Viên Trong Nhóm --- </option>
                                    <option value="1">Cấp 1</option>
                                    <option value="2">Cấp 2</option>
                                    <option value="3">Cấp 3</option>
                                </select>

                            </div>
                            {formik.errors.level && formik.touched.level && <div>{formik.errors.level}</div>}
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
                                Đăng ký
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminChangeStaffPage;