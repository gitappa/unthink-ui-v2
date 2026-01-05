import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const PageLoader = ({ isLoading = false }) =>
	isLoading ? (
		<div className='fixed top-0 left-0 flex justify-center items-center w-full min-h-screen h-full backdrop-filter backdrop-contrast-75 z-40'>
			<Spin indicator={<LoadingOutlined className='text-3xl-1' spin />} />
		</div>
	) : null;

export default React.memo(PageLoader);
