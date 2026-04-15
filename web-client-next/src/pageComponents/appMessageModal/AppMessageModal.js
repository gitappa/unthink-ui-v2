import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../../components/modal/Modal";
import { closeAppMessage } from "./redux/actions";
import { APP_MESSAGE_MODAL_TYPES } from "../../constants/codes";

const AppMessageModal = ({}) => {
	const [isModalOpen, messageData] = useSelector((state) => [
		state.appState.appMessageModal.isOpen,
		state.appState.appMessageModal.data,
	]);
	const dispatch = useDispatch();

	const onModalClose = () => {
		dispatch(closeAppMessage());
	};

	const modalContent = useMemo(() => {
		switch (messageData.type) {
			case APP_MESSAGE_MODAL_TYPES.DEFAULT:
			default:
				return (
					<>
						<p className='text-xl font-medium'>{messageData.message}</p>
					</>
				);
		}
	}, [messageData.type]);

	const modalSize = useMemo(() => {
		switch (messageData.type) {
			case APP_MESSAGE_MODAL_TYPES.DEFAULT:
				return "sm";

			default:
				break;
		}

		return "md";
	}, [messageData.type]);

	return (
		<Modal
			isOpen={isModalOpen}
			headerText={messageData.title}
			onClose={onModalClose}
			size={modalSize}>
			{modalContent}
		</Modal>
	);
};

export default React.memo(AppMessageModal);
