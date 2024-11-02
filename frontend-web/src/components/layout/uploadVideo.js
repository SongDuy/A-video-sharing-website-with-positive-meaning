import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFormik } from "formik"
import * as Yup from "yup"

const userString = localStorage.getItem('user');
const user = userString ? JSON.parse(userString) : null;

const UploadVideoPage = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const validationSchema = Yup.object({
        id_category: Yup.string().required('Vui lòng chọn danh mục'),
        title: Yup.string().required('Vui lòng nhập tiêu đề'),
        description: Yup.string().required('Vui lòng nhập mô tả'),
        file: Yup.string().required('Vui lòng chọn file'),
    });

    const formik = useFormik({
        initialValues: {
            id_user: user.id,
            id_category: '',
            title: '',
            description: '',

            file: null,
            name_file: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {

            setLoading(true); // Đặt giá trị loading thành true trước khi gọi API
            console.log(values);

            const formData = new FormData();
            formData.append("id_user", values.id_user);
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("id_category", values.id_category);
            formData.append("file", values.file);
            formData.append("name_file", values.name_file); // Thêm trường name_file vào FormData

            axios
                .post("http://localhost:5000/api/uploadVideo", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },

                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        console.log("Phần trăm đã tải:", percentCompleted);
                        // Cập nhật giá trị phần trăm đã tải vào biến trạng thái của bạn
                        setProgress(percentCompleted);
                    },
                })
                .then((response) => {
                    // Xử lý thành công
                    console.log(response.data);

                })
                .catch((error) => {
                    if (error.response) {
                        // Xử lý lỗi trả về từ backend
                        const errorMessage = error.response.data.error;
                        formik.setErrors({ file: errorMessage });
                        console.error(errorMessage);
                    } else {
                        // Xử lý lỗi không nhận được phản hồi từ backend
                        const errorMessage = "Đã xảy ra lỗi khi tải video lên";
                        console.error(errorMessage);
                        console.error(error);
                    }
                })
                .finally(() => {
                    setLoading(false);// Đặt giá trị loading thành false sau khi gọi API hoàn tất
                });
        },
    });

    return (
        <>
            <div className="min-h-screen bg-gray-300 flex flex-col justify-center  py-12 sm:px-6 lg:px-8 fixed inset-0  bg-opacity-30 backdrop-blur-sm z-50  ">
                <div className="bg-white min-w-[550px] max-w-[550px] sm:mx-auto sm:rounded-lg sm:w-full sm:max-w-md">
                    <div className=" py-8 px-4 shadow sm:rounded-lg sm:px-10">

                        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-5">
                            <h2 className=" text-center text-3xl font-extrabold text-gray-900">
                                Đăng video
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
                            <form className="space-y-6" onSubmit={formik.handleSubmit} encType="multipart/form-data">

                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Tiêu đề
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="title"
                                            name="title"
                                            type="text"
                                            autoComplete="title"
                                            placeholder="Title video"
                                            value={formik.values.title} // Đặt giá trị của input từ state user
                                            onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    {formik.errors.title && formik.touched.title && <div className="text-red-500">{formik.errors.title}</div>}
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Mô tả
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            id="description"
                                            name="description"
                                            type="address"
                                            autoComplete="description"
                                            placeholder="Description video"
                                            value={formik.values.description}
                                            onChange={formik.handleChange} // Gọi hàm formik.handleChange khi giá trị thay đổi
                                            style={{ resize: 'vertical', padding: '12px', minHeight: '150px' }}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    {formik.errors.description && formik.touched.description && <div className="text-red-500">{formik.errors.description}</div>}
                                </div>

                                <div>
                                    <label htmlFor="id_category" className="block text-sm font-medium text-gray-700">
                                        Danh mục
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="id_category"
                                            name="id_category"
                                            autoComplete="id_category"
                                            value={formik.values.id_category}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option className="text-center" value=""> --- Chọn Danh Mục Nội Dung Video --- </option>
                                            <option value="-Ni2oT1OjzLvW5OjQNiV">Kiến thức</option>
                                            <option value="-Ni4IGIgtvsfrcGO_p-8">Tư duy</option>
                                            <option value="-Ni4INdSYhoO7u_32aa_">Ngôn từ</option>
                                            <option value="-Ni4IeNfdJUxfvpgqzu5">Hàng động</option>
                                            <option value="-Ni4IoHTb0uA0nS7eU71">Đời sống</option>
                                            <option value="-Ni4IvqCtiMhNWROKB45">Nổ lực</option>
                                            <option value="-Ni4IzxzbICvVoSyWmQF">Tập trung</option>
                                            <option value="-Ni4J2URv1NXYvpydBPv">Thư giản</option>
                                            {/* Thêm các tùy chọn khác tại đây */}
                                        </select>
                                    </div>
                                    {formik.errors.id_category && formik.touched.id_category && <div className="text-red-500">{formik.errors.id_category}</div>}
                                </div>

                                <div>
                                    <label htmlFor="video" className="block text-sm font-medium text-gray-700">
                                        Video
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="file"
                                            name="file"
                                            type="file" // Thay đổi type thành "file" để cho phép tải tệp
                                            accept="video/*" // Chỉ chấp nhận các tệp video
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];
                                                formik.setFieldValue("file", file);
                                                formik.setFieldValue("name_file", file.name); // Lưu trữ tên file vào trường name_file
                                            }}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    {formik.errors.file && formik.touched.file && (
                                        <div className="text-red-500">{formik.errors.file}</div>
                                    )}
                                </div>

                                {
                                    loading === true ? (
                                        <div className="flex justify-center mt-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                                            <p className="ml-2">Đang tải... {progress}%</p>
                                        </div>
                                    ) : (
                                        <div className="z-10 flex justify-center">
                                            <button
                                                type="submit"
                                                className="group py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Xong
                                            </button>
                                        </div>
                                    )
                                }

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );

};

export default UploadVideoPage;