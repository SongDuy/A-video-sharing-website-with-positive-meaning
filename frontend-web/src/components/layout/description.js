import React from 'react';

import '../../index.css';

const DescriptionPage = (props) => {
    return (
        <div className="flex w-[450px] h-[675px] py-5 bg-gray-50 rounded-xl shadow overflow-auto">
            <div className="w-full h-full custom-scrollbar-content custom-scrollbar ml-5">
                <div className="text-center flex mb-2">
                    <span className="font-bold bg-blue-800 text-white px-6 py-1 rounded-full">Mô tả </span>
                    <span className="font-bold rounded-full bg-gray-200 px-3 py-1 text-right ml-auto text-blue-900"> ID: {props.values.cloudinaryId}</span>
                </div>

                <div className="ml-2 mb-2 mt-5">
                    <span className="whitespace-pre-line"> {props.values.description}</span>
                </div>
            </div>
        </div>
    );
};
export default DescriptionPage;