import React, { useCallback } from "react";
import Router from 'next/router';

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
				<h3 className='text-xl mb-4'>
					Updated new content and keywords in{" "}
					<b>{extractionData?.data?.title}</b>, You may click on View button to
					check and find products.
				</h3>
				<div className='flex justify-end gap-4'>
					<button
						type='button'
						onClick={() => handleModalClose()}
						className='min-w-24 text-xs md:text-sm z-10 rounded-md py-2.5 px-3.5 h-full font-bold text-indigo-400 border-2 border-indigo-400'>
						Close
					</button>
					<button
						className='bg-indigo-600 py-2 px-8 text-white rounded-lg text-lg'
						onClick={handleViewClick}>
						View
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default React.memo(EditCollAiExtractionDataModal);
