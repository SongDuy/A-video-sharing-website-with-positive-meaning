import React from 'react';

import '../../index.css';

const StandardPage = (props) => {
    return (
        <div className="flex w-[450px] h-[675px] py-5 bg-gray-50 rounded-xl border shadow overflow-auto ">
            <div className="w-full h-full custom-scrollbar-content custom-scrollbar ml-5 mr-5">
                <span className="whitespace-pre-line"> {props.value}</span>

            </div>
        </div>
    );
};
export default StandardPage;