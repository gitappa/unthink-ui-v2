import React, { useEffect, useState } from "react";
import { Modal, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "../../helper/useNavigate";

import { setHelpMeShopModalOpen } from "../../pageComponents/shared/redux/actions";

const { TextArea } = Input;

export default function HelpMeShopModal() {
	const navigate = useNavigate();
	const [message, setMessage] = useState("");

	const [isOpen, sharedPageLink] = useSelector((state) => [
		state?.shared?.helpMeShopModal.isOpen ?? false,
		state?.shared?.helpMeShopModal.sharedPageLink ?? false,
	]);

	const dispatch = useDispatch();

	const handleOk = () => {
		dispatch(setHelpMeShopModalOpen(false));
		navigate(`${sharedPageLink}?messageText=${message}`);
	};

	const handleCancel = () => {
		dispatch(setHelpMeShopModalOpen(false));
	};

	useEffect(() => {
		if (!isOpen) {
			setMessage("");
		}
	}, [isOpen]);

	const handleMessageInputChange = (e) => {
		const { value } = e.target;
		setMessage(value || "");
	};

	return (
		<>
			<Modal
				title='Help me Shop'
				open={isOpen}
				onOk={handleOk}
				okText='Preview'
				onCancel={handleCancel}>
				<p>Enter your message for shopping help</p>
				<p className='mb-2'>Message :</p>
				<TextArea
					rows={4}
					value={message}
					placeholder='Enter message'
					name='message'
					onChange={handleMessageInputChange}
				/>
			</Modal>
		</>
	);
}
