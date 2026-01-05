import React, { useMemo, useState } from "react";
import { Input, Form, notification, Button } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import Link from 'next/link';
import { useNavigate } from "../../helper/useNavigate";
import AuthHeader from "../AuthHeader";
import { authAPIs } from "../../helper/serverAPIs";
import { getParams } from "../../helper/utils";

const initialFormValue = {
	password: "",
	cPassword: "",
};

const ResetPasswordFrom = (props) => {
	const navigate = useNavigate();
	const [hasError, setHasError] = useState("");
	const [isResetting, setIsResetting] = useState(false);

	const token = useMemo(() => props["*"] ?? props.token, [props]);
	const name = getParams("name");

	const onFinish = async (values) => {
		const { password } = values;
		setIsResetting(true);
		const res = await authAPIs.resetPasswordAPICall({ token, password });

		if (res?.data?.status_code) {
			if (res.data.status_code === 200) {
				setHasError("");
				notification.success({ message: "Password reset successfully!" });
				navigate("/signin/");
			} else if (res?.data?.status_desc) {
				setHasError(res?.data?.status_desc);
			}
		}
		setIsResetting(false);
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div className='h-screen static_page_bg'>
			<div className='auth-header-container'>
				<AuthHeader
					userTextLink={{
						text: "Sign In",
						to: "/signin",
					}}
				/>
			</div>
			<div className='my-11 contact_us_container max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto py-10 lg:py-20 px-7 md:px-14 lg:px-28 rounded-md'>
				<div className='contact_us_inner_container py-8 lg:py-16 rounded-md'>
					<h1 className='max-w-md px-6 lg:max-w-2xl mx-auto text-lg lg:text-2xl lg:leading-44 font-bold text-white text-center mb-3'>
						Welcome Back {name}!
					</h1>
					<h1 className='max-w-md px-6 lg:max-w-2xl mx-auto text-2xl lg:text-4xl lg:leading-44 font-bold text-white text-center'>
						Reset Password
					</h1>
					<div className={`max-w-xl-1 mx-auto px-8 py-8`}>
						<Form
							name='resetPassword'
							initialValues={initialFormValue}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete='off'>
							<Form.Item
								name='password'
								rules={[
									{
										required: true,
										message: "Please enter your password!",
									},
								]}>
								<Input.Password
									placeholder='Enter a password'
									className='text-left h-12 rounded-md lg:rounded-l-md reset-password-input'
									iconRender={(visible) =>
										visible ? (
											<EyeOutlined style={{ color: "white" }} />
										) : (
											<EyeInvisibleOutlined style={{ color: "white" }} />
										)
									}
								/>
							</Form.Item>

							<Form.Item
								name='cPassword'
								rules={[
									{
										required: true,
										message: "Please Confirm your Password!",
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue("password") === value) {
												return Promise.resolve();
											}
											return Promise.reject(
												new Error(
													"The two passwords that you entered do not match!"
												)
											);
										},
									}),
								]}>
								<Input
									type='password'
									placeholder='Confirm your password'
									className='text-left h-12 rounded-md lg:rounded-l-md'
								/>
							</Form.Item>
							<p className='text-red-500 h-5'>{hasError}</p>
							<Form.Item>
								<div className='flex justify-center'>
									<Button
										loading={isResetting}
										htmlType='submit'
										className='loading-button w-24 md:w-40 text-xs md:text-sm z-10 mt-4 md:mt-0 bg-indigo-600 border-none rounded-md py-3 px-3.5 h-full font-bold -ml-2.5 text-white'>
										Reset Password
									</Button>
								</div>
							</Form.Item>
							<div className='text-center'>
								<Link className='text-white' href='/signin'>
									<span className='text-blue-107'>Sign In</span>
								</Link>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordFrom;
