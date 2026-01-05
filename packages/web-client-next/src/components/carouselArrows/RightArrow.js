import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";

const RightArrow = (props) => {
	const { className, onClick } = props;
	return (
		<div
			className={`${className} z-10 right-1 bg-lightgray-105 bg-opacity-25 shadow-md-1 backdrop-filter backdrop-blur-sm slider-custom-arrow w-8 h-8 lg:w-16 lg:h-16 rounded-full flex justify-center items-center`}
			onClick={onClick}>
			<span className='flex leading-none text-sm lg:text-xl text-black-200'>
				<ArrowRightOutlined />
			</span>
		</div>
	);
};

export default RightArrow;
