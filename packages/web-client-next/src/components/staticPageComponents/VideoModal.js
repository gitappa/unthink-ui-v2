import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import styles from "./VideoModal.module.css";

const VideoModal = ({ showModal, onCloseModal, videoUrl }) => {
	return (
		showModal && (
			<div className={styles.modalBackdrop}>
				<div className={styles.modalContent}>
					<CloseOutlined
						className={styles.closeIcon}
						onClick={onCloseModal}
					/>
					<iframe
						className={styles.videoFrame}
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
