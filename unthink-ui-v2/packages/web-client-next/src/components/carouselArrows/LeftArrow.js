import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";

const LeftArrow = (props) => {
	const { className, style, onClick } = props;
	return (
		<div
			className={`${className} z-10 left-1 bg-lightgray-105 bg-opacity-25 shadow-md-1 backdrop-filter backdrop-blur-sm slider-custom-arrow w-8 h-8 lg:w-16 lg:h-16 rounded-full flex justify-center items-center`}
			onClick={onClick}>
			<span className='flex leading-none text-sm lg:text-xl text-black-200'>
				<ArrowLeftOutlined />
			</span>
		</div>
	);
};

export default LeftArrow;
