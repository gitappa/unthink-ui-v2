import React, { useMemo, useState } from "react";
import styles from "./authPage.module.scss";
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
		<div className={`static_page_bg ${styles.resetRoot}`}>
			<div className={styles.authHeaderContainer}>
				<AuthHeader
					userTextLink={{
						text: "Sign In",
						to: "/signin",
					}}
				/>
			</div>
			<div className={`contact_us_container ${styles.resetContainer}`}>
				<div className={`contact_us_inner_container ${styles.innerContainer}`}>
					<h1 className={styles.headingWelcome}>
						Welcome Back {name}!
					</h1>
					<h1 className={styles.headingReset}>
						Reset Password
					</h1>
					<div className={styles.formWrapperReset}>
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
									className={`reset-password-input ${styles.input}`}
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
									className={styles.input}
								/>
							</Form.Item>
							<p className={styles.errorText}>{hasError}</p>
							<Form.Item>
								<div className={styles.buttonWrapper}>
									<Button
										loading={isResetting}
										htmlType='submit'
										className={`loading-button ${styles.submitButton}`}>
										Reset Password
									</Button>
								</div>
							</Form.Item>
							<div className={styles.signinLinkContainer}>
								<Link className={styles.signinLink} href='/signin'>
									<span className={styles.signinSpan}>Sign In</span>
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
