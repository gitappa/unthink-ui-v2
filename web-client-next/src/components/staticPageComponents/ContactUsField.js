import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "antd";
import { useNavigate } from "../../helper/useNavigate";

import RequestOurMediaKitModal from "./RequestOurMediaKitModal";
import { generateOnContactFormSubmit } from "../../helper/utils";

import styles from './ContactUsField.module.css';

const ContactUsField = ({
	id,
	inputProps = {},
	collectFullInfo = false,
	buttonText,
	handleSubmitButtonClick,
	clearEmailOnSuccess = false,
	onSuccessCallback,
}) => {
	const navigate = useNavigate();
	const [isRequestMediaKitModalOpen, setIsRequestMediaKitModalOpen] =
		useState(false);
	const [userEmailInput, setUserEmailInput] = useState("");
	const [pageUrl, setPageUrl] = useState("");
	const contactUsForm = useRef(null);
	const emailFormInout = useRef(null);

	const clearEmailInput = () => {
		if (clearEmailOnSuccess) {
			if (emailFormInout.current && emailFormInout.current.setValue) {
				emailFormInout.current.setValue("");
			}
		}
	};

	const handleRequestMediaKitModalOpen = (e) => {
		e.preventDefault();

		const form = contactUsForm.current;

		if (form["email"] && form["email"].value) {
			setUserEmailInput(form["email"].value);
			clearEmailInput();
		}
		navigate("/schedule-demo");
	};

	const handleRequestMediaKitModalClose = () => {
		setIsRequestMediaKitModalOpen(false);
		setUserEmailInput("");
	};

	const onSuccessSubmit = () => {
		onSuccessCallback &&
			onSuccessCallback(emailFormInout.current?.state?.value);
		clearEmailInput();
	};

	useEffect(() => {
		// Set page URL on client side only
		if (typeof window !== "undefined") {
			setPageUrl(window.location.href);
		}
	}, []);

	useEffect(() => {
		if (!collectFullInfo) {
			document
				.getElementById(id)
				?.addEventListener(
					"submit",
					generateOnContactFormSubmit(id, true, onSuccessSubmit)
				);
			return () => {
				document
					.getElementById(id)
					?.removeEventListener(
						"submit",
						generateOnContactFormSubmit(id, true, onSuccessSubmit)
					);
			};
		}
	}, []);

	useEffect(() => {
		if (handleSubmitButtonClick) {
			document
				.getElementById(id)
				?.addEventListener("submit", handleSubmitButtonClick);
			return () => {
				document
					.getElementById(id)
					?.removeEventListener("submit", handleSubmitButtonClick);
			};
		}
	}, []);

	const formId = useMemo(
		() =>
			collectFullInfo
				? "contact-info-form" + Math.floor(100000 + Math.random() * 900000)
				: id,
		[]
	);

	return (
		<div className={styles.container}>
			{collectFullInfo && isRequestMediaKitModalOpen && (
				<RequestOurMediaKitModal
					formId={id}
					showModal
					onCloseModal={handleRequestMediaKitModalClose}
					email={userEmailInput}
				/>
			)}
			<form id={formId} ref={contactUsForm}>
				<div className={styles.inputWrapper}>
					<Input
						className={styles.inputField}
						placeholder='Enter your email address'
						name='email'
						type='text'
						required
						ref={emailFormInout}
						{...inputProps}
					/>

					<input name='contact_number' type='hidden' />
					<input name='page_url' type='hidden' value={pageUrl} />

					{collectFullInfo ? (
						<button
							type='submit'
							onClick={handleRequestMediaKitModalOpen}
							className={`${styles.submitButton} ${styles.submitButtonWide}`}>
							{buttonText || "Request our media kit"}
						</button>
					) : (
						<button
							type='submit'
							className={`${styles.submitButton} ${styles.submitButtonNormal}`}>
							{buttonText || "Get Started"}
						</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default ContactUsField;
