import React, { useState } from "react";
import styles from "./authPage.module.scss";
import { Input, Form, Result, Button, notification } from "antd";

import AuthHeader from "../AuthHeader";
import { authAPIs } from "../../helper/serverAPIs";
import { useNavigate } from "../../helper/useNavigate";
import {
	ERR_CODE_USER_ALREADY_REGISTERED,
	ROUTES,
} from "../../constants/codes";

const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[ ^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const GuestSignupForm = ({ defaultEmail }) => {
	const navigate = useNavigate();
	const initialFormValue = {
		email: defaultEmail || "",
	};

	const [error, setError] = useState("");
	const [validateEmail, setValidateEmail] = useState("");
	const [isSuccess, setIsSuccess] = useState("");
	const [isSigningUp, setIsSigningUp] = useState(false);

	const [form] = Form.useForm();

	const validateData = (email) => {
		let isValid = true;

		if (!email) {
			setValidateEmail("Please enter email");
			isValid = false;
		} else if (!String(email).toLowerCase().match(emailRegex)) {
			setValidateEmail("Please enter valid email");
			isValid = false;
		} else {
			setValidateEmail("");
		}
		return isValid;
	};

	const onFinish = async (values) => {
		const { email } = values;

		if (validateData(email)) {
			setIsSigningUp(true);
			try {
				const res = await authAPIs.GuestSignupAPICall({
					email,
				});

				if (res?.data?.status_code) {
					if (res.data.status_code === 200) {
						setError("");
						setIsSuccess(true);
					} else if (res.data.error_code === ERR_CODE_USER_ALREADY_REGISTERED) {
						navigate(ROUTES.SIGN_IN_PAGE);
						if (res.data.status_desc) {
							notification.info({ message: res.data.status_desc });
						}
					} else if (res.data.status_desc) {
						setError(res.data.status_desc);
					}
				}
			} catch (error) {
				setError(
					"Unable to process your request. Please try again in sometimes."
				);
			}

			setIsSigningUp(false);
		}
	};

	return (
		<div className={`static_page_bg ${styles.guestSignupRoot}`}>
			<div className={styles.authHeaderContainer}>
				<AuthHeader hideProfile />
			</div>
			<div className={`${styles.welcomeContainer} ${styles.authContainer}`}>
				<div className={styles.guestSignupContent}>
					{!isSuccess ? (
						<div className={`contact_us_container ${styles.container}`}>
							<div className={`contact_us_inner_container ${styles.innerContainer}`}>
								<h1 className={styles.heading}>
									Create your first collection
								</h1>
								<div className={styles.guestSignupFormWrapper}>
									<Form
										name='signIn'
										form={form}
										initialValues={initialFormValue}
										onFinish={onFinish}
										autoComplete='off'>
										<Form.Item
											validateStatus={validateEmail && "error"}
											help={validateEmail}
											name='email'>
											<Input
												className={styles.input}
												placeholder='Enter your email'
											/>
										</Form.Item>
										<p className={styles.guestSignupError}>{error}</p>
										<Form.Item className={styles.guestSignupFormItem}>
											<div className={styles.guestSignupButtonWrapper}>
												<Button
													loading={isSigningUp}
													htmlType='submit'
													size='large'
													className={`loading-button ${styles.guestSignupButton}`}>
													Try it now
												</Button>
											</div>
										</Form.Item>
									</Form>
								</div>
							</div>
						</div>
					) : (
						<Result
							className={styles.resultContainer}
							status='success'
							title={<span className={styles.guestSignupResultTitle}>You are almost there!</span>}
							subTitle={
								<p className={styles.guestSignupResultSubtitle}>
									Click on the verification mail sent to{" "}
									{form.getFieldValue("email")} and come back to create your
									first collection!{" "}
								</p>
							}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default GuestSignupForm;
