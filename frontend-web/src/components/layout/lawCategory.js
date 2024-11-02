import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LawCategoryPage = () => {

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

    return (

        <div className="w-full h-full py-12 px-12 bg-white ">
            <h1 className="text-3xl ml-8 text-center text-blue-800 font-bold">Quy Định Nội Dung Các Danh Mục </h1>
            {categories.map((category) => (
                <div key={category.id} className="mb-12">

                    <h1 className=" py-2 px-2 rounded-xl  text-2xl text-blue-900 font-bold" //cursor-pointer
                    >
                        {category.name}
                    </h1>
                    <span className="whitespace-pre-line"> {category.description}</span>
                </div>
            ))}

        </div>

    );
};

export default LawCategoryPage;