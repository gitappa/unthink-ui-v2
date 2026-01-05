import React, { useEffect, useRef, useState } from "react";
import { Input } from "antd";
import Link from "next/link";
import { generateOnContactFormSubmit } from "../../helper/utils";
import styles from "./staticPageComponents.module.scss";

const ContactUs = ({
	title,
	showLink = false,
	id,
	onSuccessCallback,
	submitButtonText = "Get Started",
}) => {
	const [pageUrl, setPageUrl] = useState("");
	const emailFormInout = useRef(null);

	const clearEmailInput = () => {
		if (emailFormInout.current && emailFormInout.current.setValue) {
			emailFormInout.current.setValue("");
		}
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
	}, []);

	return (
		<div
			className={`${styles.contact_us_container} max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto py-10 lg:py-20 px-7 md:px-14 lg:px-28 rounded-md`}>
			<div
				className={`${styles.contact_us_inner_container} pt-8 lg:pt-16 pb-14 lg:pb-28 rounded-md`}>
				<h1 className='max-w-md px-6 lg:max-w-2xl mx-auto text-lg lg:text-3xl-1 lg:leading-44 font-bold text-white text-center'>
					{title}
				</h1>
				<div
					className={`max-w-xl-1 mx-auto px-8 ${
						showLink ? "pt-8 lg:pt-16" : "py-8 lg:py-16"
					} `}>
					<form id={id}>
						<div className='md:h-12 flex flex-col md:flex-row items-center'>
							<Input
								required
								className='text-left h-12 rounded-md lg:rounded-l-md'
								placeholder='Enter your email'
								name='email'
								type='text'
								ref={emailFormInout}
							/>

							<input name='contact_number' type='hidden' />
							<input
								name='page_url'
								type='hidden'
							value={pageUrl}
						/>
						<input name='page_section' type='hidden' value={id} />

						<button
								type='submit'
								className='w-24 md:w-40 text-xs md:text-sm z-10 mt-4 md:mt-0 bg-indigo-600 border-none rounded-md py-3 px-3.5 h-full font-bold -ml-2.5 text-white'>
								{submitButtonText}
							</button>
						</div>
					</form>
					{showLink && (
						<h5 className='text-center mt-9 mb-0'>
							<Link href='/signup' className='text-white underline p-0'>
								Are you a Influence Management Agency?
							</Link>
						</h5>
					)}
				</div>
			</div>
		</div>
	);
};

export default ContactUs;
