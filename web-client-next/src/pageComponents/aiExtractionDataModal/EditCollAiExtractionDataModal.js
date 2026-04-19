import React, { useCallback } from "react";
import Router from 'next/router';
import styles from "./EditCollAiExtractionDataModal.module.css";

const navigate = (path) => Router.push(path);
import { useDispatch } from "react-redux";

import Modal from "../../components/modal/Modal";
import {
	setAiExtractionData,
	setShowChatModal,
} from "../../hooks/chat/redux/actions";

const EditCollAiExtractionDataModal = ({ extractionData, showChatModal }) => {
	const dispatch = useDispatch();

	const handleModalClose = useCallback(() => {
		dispatch(setAiExtractionData(null));
	}, []);

	const handleViewClick = useCallback(() => {
		navigate(`/collection/${extractionData.request.collection_id}/review`);
		if (showChatModal) {
			dispatch(setShowChatModal(false));
		}
		handleModalClose();
	}, []);

	return (
		<Modal
			isOpen
			headerText={"Content prepared"}
			// onClose={handleModalClose}
			size='sm'>
			<div>
				<h3 className={styles.modalTitle}>
					Updated new content and keywords in{" "}
					<b>{extractionData?.data?.title}</b>, You may click on View button to
					check and find products.
				</h3>
				<div className={styles.buttonContainer}>
					<button
						type='button'
						onClick={() => handleModalClose()}
						className={styles.closeButton}>
						Close
					</button>
					<button
						className={styles.viewButton}
						onClick={handleViewClick}>
						View
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default React.memo(EditCollAiExtractionDataModal);
