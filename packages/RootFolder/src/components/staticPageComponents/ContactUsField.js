import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "antd";
import { useNavigate } from "../../helper/useNavigate";

import RequestOurMediaKitModal from "./RequestOurMediaKitModal";
import { generateOnContactFormSubmit } from "../../helper/utils";

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
		<div className='max-w-xl-1 mx-auto'>
			{collectFullInfo && isRequestMediaKitModalOpen && (
				<RequestOurMediaKitModal
					formId={id}
					showModal
					onCloseModal={handleRequestMediaKitModalClose}
					email={userEmailInput}
				/>
			)}
			<form id={formId} ref={contactUsForm}>
				<div className='flex items-center'>
					<Input
						className='text-left h-12 rounded-md lg:rounded-l-md border-0 hover:border-opacity-0 placeholder-gray-400'
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
							className='w-60 text-xs md:text-sm z-10 bg-indigo-600 border-none rounded-md py-3 px-3.5 h-12 font-bold -ml-2.5 text-white'>
							{buttonText || "Request our media kit"}
						</button>
					) : (
						<button
							type='submit'
							className='w-40 text-xs md:text-sm z-10 bg-indigo-600 border-none rounded-md py-3 px-3.5 h-12 font-bold -ml-2.5 text-white'>
							{buttonText || "Get Started"}
						</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default ContactUsField;
