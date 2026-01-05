import React, { useState } from "react";
import { Input, Form, Result, Button, notification } from "antd";

import AuthHeader from "../AuthHeader";
import { authAPIs } from "../../helper/serverAPIs";
import { useNavigate } from "../../helper/useNavigate";
import {
	ERR_CODE_USER_ALREADY_REGISTERED,
	ROUTES,
} from "../../constants/codes";

const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
		<div className='min-h-screen static_page_bg'>
			<div className='auth-header-container'>
				<AuthHeader hideProfile />
			</div>
			<div className='flex auth-container'>
				<div className='w-full py-11 font-firaSans'>
					{!isSuccess ? (
						<div className='contact_us_container max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto py-10 lg:py-20 px-7 md:px-14 lg:px-28 rounded-md'>
							<div className='contact_us_inner_container py-8 lg:py-16 rounded-md'>
								<h1 className='max-w-md px-6 lg:max-w-2xl mx-auto text-lg lg:text-3xl-1 lg:leading-44 font-bold text-white text-center'>
									Create your first collection
								</h1>
								<div className={`max-w-xl-1 mx-auto px-8 pt-8 md:py-8`}>
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
												className='text-left h-12 rounded-md lg:rounded-l-md'
												placeholder='Enter your email'
											/>
										</Form.Item>
										<p className='text-red-500 text-center mb-4'>{error}</p>
										<Form.Item className='mb-0 md:mb-6'>
											<div className='flex justify-center'>
												<Button
													loading={isSigningUp}
													htmlType='submit'
													size='large'
													className='loading-button w-24 md:w-40 text-xs md:text-sm z-10 lg:mt-6 bg-indigo-600 border-none rounded-md py-3 px-3.5 h-full font-bold text-white'>
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
							className='lg:w-2/4 mx-auto'
							status='success'
							title={<span className='text-white'>You are almost there!</span>}
							subTitle={
								<p className='text-white max-w-md mx-auto'>
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
