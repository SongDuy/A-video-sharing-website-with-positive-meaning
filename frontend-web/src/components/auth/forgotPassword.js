import React from 'react';
import { Link } from 'react-router-dom';


const ForgotPasswordPage = () =>{
    return ( 
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          
          <div className="bg-white shadow sm:rounded-lg mt-8 sm:mx-auto sm:w-full sm:max-w-md mb-28">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Quên Mật Khẩu
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                <Link
                    to="/Register"
                    className="font-medium text-indigo-600 hover:text-indigo-500 text-red-300"
                >
                    <b>Bạn chưa đăng ký tài khoản?</b>
                </Link>
                </p>
            </div>

            <div className=" py-1 px-4   sm:px-10 mb-26">
              <form className=" space-y-6"
                //onSubmit={handleSubmit}
              >
                <input type="hidden" name="remember" value="true" />
                <div className="rounded-md py-6 shadow-sm -space-y-px-10">
                  <div className="form-outline mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email đăng nhập
                    </label>

                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        // onBlur={handleBlur}
                        // value={values.email}
                        // onChange={(e) => setEmail(e.target.value)}
                        //onChange={handleChange}
                        required
                        placeholder="my@gmail.com"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      {/* {errors.email && touched.email && (
                        <p className="text-red-500">{errors.email}</p>
                      )} */}
                    </div>
                  </div>

                  <div className="py-6">
                    <button
                      type="submit"
                      //disabled={isSubmitting}
                      className="group w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Đặt lại mật khẩu
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
    );
};

export default ForgotPasswordPage;