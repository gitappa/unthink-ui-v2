import React, { useEffect, useRef, useState } from "react";
import { Input } from "antd";
import Link from "next/link";
import { generateOnContactFormSubmit } from "../../helper/utils";
import styles from "./ContactUs.module.css";

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
			className={styles.container}>
			<div
				className={styles.innerContainer}>
				<h1 className={styles.title}>
					{title}
				</h1>
				<div
					className={`${styles.formWrapper} ${showLink ? styles.formWrapperLink : styles.formWrapperPaddingY
						} `}>
					<form id={id}>
						<div className={styles.inputGroup}>
							<Input
								required
								className={styles.emailInput}
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
								className={styles.submitButton}>
								{submitButtonText}
							</button>
						</div>
					</form>
					{showLink && (
						<h5 className={styles.linkHeader}>
							<Link href='/signup' className={styles.link}>
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
