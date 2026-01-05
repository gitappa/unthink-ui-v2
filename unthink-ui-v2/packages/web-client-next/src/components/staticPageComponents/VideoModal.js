import React from "react";
import { CloseOutlined } from "@ant-design/icons";

const VideoModal = ({ showModal, onCloseModal, videoUrl }) => {
	return (
		showModal && (
			<div className='fixed flex justify-center items-center w-full h-screen left-0 top-0 z-40 backdrop-filter backdrop-blur-sm'>
				<div className='w-80 md:w-504 xl:w-695 mx-auto'>
					<CloseOutlined
						onClick={onCloseModal}
						className='text-xl-2 text-white float-right py-4 cursor-pointer'
					/>
					<iframe
						className='h-56 md:h-340 xl:h-456'
						width='100%'
						height='100%'
						src={videoUrl}
						title='YouTube video player'
						frameBorder='0'
						allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; autoplay'
						allowFullScreen='allowFullScreen'></iframe>
				</div>
			</div>
		)
	);
};

export default VideoModal;
