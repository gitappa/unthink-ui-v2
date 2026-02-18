import React, { useEffect, useMemo, useState } from "react";
import styles from "./authPage.module.scss";
import {
	Input,
	Form,
	notification,
	Result,
	Button,
	Spin,
	Tooltip,
	Alert,
} from "antd";
import {
	EyeInvisibleOutlined,
	EyeOutlined,
	LoadingOutlined,
	InfoCircleOutlined,
	MailFilled,
} from "@ant-design/icons";

import { authAPIs } from "../../helper/serverAPIs";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useNavigate } from "../../helper/useNavigate";
import {
	getIdpLoginMethod,
	getIsSellerLoggedIn,
	setCookie,
	setIdpSignInMethod,
	AdminCheck,
} from "../../helper/utils";
import {
	COOKIE_TT_ID,
	ERR_CODE_USER_NOT_VERIFIED,
	LOCAL_STORAGE_USER_VISITED_CREATE_COLLECTION,
	PATH_CREATE_COLLECTION,
	PATH_ROOT,
	PATH_STORE,
	ROUTES,
	SIGN_IN_EXPIRE_DAYS,
} from "../../constants/codes";
import { userSignInSetLocal, setUserId } from "../../helper/getTrackerInfo";
import { getUserInfo } from "./redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../recommendations/redux/actions";
import {
	adminUserId,
	current_store_name,
	enable_venly,
	isStagingEnv,
	is_store_instance,
	venlyChainSecretType,
} from "../../constants/config";
import googleIcon from "../../images/staticpageimages/googleIcon.svg";
import facebookIcon from "../../images/staticpageimages/facebookIcon.png";
import twitterIcon from "../../images/staticpageimages/twitterIcon.png";
import {
	checkUserRegisteredWithoutVenlyAndSave,
	logoutVenlyUser,
	venlyGetAccount,
	venlyRetrieveUserInfo,
} from "../../helper/venlyUtils";
import SignupSuccess from "./SignupSuccess";

const initialFormValue = {
	email: "",
	password: "",
	cPassword: "",
};

let selectedIdpHintSignIn = "";

console.log('is_store_instance', is_store_instance);

export const redirectOnSuccessSignIn = (isSellerLoggedIn, userData, redirectPage) => {
	console.log('userDataaaaa', userData);
	console.log(userData.attribution?.sammoon);
	console.log(isSellerLoggedIn);

	try {
		// 1️⃣ PRIORITY REDIRECT (works for all users)
		if (redirectPage === "my-products") {
			navigate("/my-products");
			return;
		}
		if (redirectPage === "create-collection") {
			navigate("/create-collection");
			return;
		}
		// 2️⃣ Normal old logic
		if (is_store_instance) {
			// First time user → go to welcome page
			if (
				userData &&
				!(userData.first_name || userData.filters) &&
				!(userData.attribution?.sammoon?.total_collections > 0)
			) {


				navigate(PATH_ROOT);
				return;
			}

			// Seller but not visited create collection
			if (
				isSellerLoggedIn &&
				!localStorage.getItem(LOCAL_STORAGE_USER_VISITED_CREATE_COLLECTION)
			) {
				navigate(PATH_CREATE_COLLECTION);
				return;
			}
			// Default
			// if(userData.is_influencer){
			// navigate(PATH_ROOT);
			// }
			return;
		}

		// Not store instance but already visited collection
		if (localStorage.getItem(LOCAL_STORAGE_USER_VISITED_CREATE_COLLECTION)) {
			navigate(PATH_STORE);
			return;
		}

		// Default for non-store
		// navigate(PATH_CREATE_COLLECTION);

	} catch (error) {

		is_store_instance ? navigate(PATH_ROOT) : navigate(PATH_STORE);
	}
};


export default function SignInFormSection() {
	const router = useRouter();
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const params = new URLSearchParams(router.asPath.split('?')[1] || '');
	const redirectPage = params.get("page");


	const [hasError, setHasError] = useState("");
	const [isSignInWithPasswordActive, setIsSignInWithPasswordActive] =
		useState(true);
	const [hasErrorCode, setHasErrorCode] = useState("");

	const [successState, setSuccessState] = useState({
		showSuccess: false,
		showVerificationMailSent: false,
		showSignInLinkMailSent: false,
		showResetPasswordLinkMailSent: false,
	});
	const [showProcessingLoader, setShowProcessingLoader] = useState(false);

	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const [storeData] = useSelector((state) => [state.store.data]);
	console.log(user);

	const {
		my_products_enable: isMyProductsEnable,
		seller_list: storeSellerList,
		admin_list: admin_list
	} = storeData;

	useEffect(() => {
		setHasError("");
	}, [isSignInWithPasswordActive]);

	useEffect(() => {
		selectedIdpHintSignIn = getIdpLoginMethod();
	}, []);


	const isAdminLoggedIn = AdminCheck(user?.data, current_store_name, adminUserId, admin_list);

	console.log(isAdminLoggedIn);


	const isSellerLoggedIn = useMemo(
		() =>
			(isAdminLoggedIn ||
				getIsSellerLoggedIn(storeSellerList, user?.data.emailId)) &&
			isMyProductsEnable,
		[isAdminLoggedIn, isMyProductsEnable, storeSellerList, user?.data.emailId]
	);

	useEffect(() => {
		if (user.isUserLogin) {
			setIdpSignInMethod(selectedIdpHintSignIn); // store sign in method to show message when user comes back again to sign in
			redirectOnSuccessSignIn(isSellerLoggedIn, user.data, redirectPage);
			console.log("user.data", user.data);

			// if (!(user.data?.first_name || user.data.filters)) {
			// 	navigate(WELCOME);
			// } else {
			// 	is_store_instance ? navigate("/") : navigate("/store/");
			// }
		}
	}, [user.isUserLogin]);

	const handleUserSignInSuccess = (userId, emailId) => {
		// START
		userSignInSetLocal(userId, emailId);
		// END
		dispatch(getUserInfo());
		dispatch(fetchRecommendations());
		// onSuccessSignIn(); // handled with useEffect // REMOVE
		notification["success"]({
			// redirect user to store page using useEffect
			message: "Sign In Success!",
			duration: 3,
		});
		resetErrorCode();
		setUserId(userId); // set login user id
	};

	const resetErrorCode = () => {
		setHasError("");
		setHasErrorCode("");
	};

	const onFinish = async (values) => {
		if (!isSignInWithPasswordActive) {
			// to continue with get link on mail and stop the password form submit
			onSignInWithLinkRequest();
			return;
		}

		selectedIdpHintSignIn = "";
		const { email, password } = values;
		setShowProcessingLoader(true);
		try {
			const res = await authAPIs.signInAPICall({
				email,
				password,
			});
			if (res.data?.status_code) {
				if (
					res.data.status_code === 200 &&
					res.data.data?.user_id &&
					res.data.data?.emailId
				) {
					handleUserSignInSuccess(res.data.data.user_id, res.data.data.emailId);
					navigate(PATH_ROOT);
					resetErrorCode();
				} else {
					if (res.data.status_desc) setHasError(res.data.status_desc);
					if (res.data.err_code) setHasErrorCode(res.data.err_code);
				}
			}
		} catch {
			setHasError("Failed to sign in");
		}
		setShowProcessingLoader(false);
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	const onResetPasswordRequest = async () => {
		try {
			setShowProcessingLoader(true);
			form.validateFields(["email"]);
			if (form.getFieldValue("email")) {
				const res = await authAPIs.resetPasswordRequestAPICall({
					email: form.getFieldValue("email"),
				});
				if (res.data.status_code === 200) {
					setSuccessState({
						...successState,
						showSuccess: true,
						showResetPasswordLinkMailSent: true,
					});
					resetErrorCode();
				} else {
					if (res.data.status_desc) setHasError(res.data.status_desc);
					if (res.data.err_code) setHasErrorCode(res.data.err_code);
				}
			}
		} catch (error) {
				notification["error"]({
			message: error.response.data.status_desc,
		})
		} finally {
			setShowProcessingLoader(false);
		}
	};

	const onSignInWithLinkRequest = async () => {
		try {
			setHasError(() => "");
			setShowProcessingLoader(true);
			form.validateFields(["email"]);
			if (form.getFieldValue("email")) {
				const res = await authAPIs.signInWithLinkRequestAPICall({
					email: form.getFieldValue("email"),
				});
				if (res.data.status_code === 200) {
					setSuccessState({
						...successState,
						showSuccess: true,
						showSignInLinkMailSent: true,
					});
					resetErrorCode();
					setUserId(res.data.data.user_id); // set login user id
				} else {
					if (res.data.status_desc) setHasError(() => res.data.status_desc);
					if (res.data.err_code) setHasErrorCode(res.data.err_code);
				}
			}
		} catch (error) {
			setHasError(() => "Unable to process, Please try again after sometime");
		} finally {
			setShowProcessingLoader(false);
		}
	};

	const onResendVerificationMail = async () => {
		try {
			setShowProcessingLoader(true);
			form.validateFields(["email"]);
			if (form.getFieldValue("email")) {
				const res = await authAPIs.resendVerificationMail({
					email: form.getFieldValue("email"),
				});
				if (res.data.status_code === 200) {
					setSuccessState({
						...successState,
						showSuccess: true,
						showVerificationMailSent: true,
					});
					resetErrorCode();
				} else {
					if (res.data.status_desc) setHasError(res.data.status_desc);
					if (res.data.err_code) setHasErrorCode(res.data.err_code);
				}
			}
		} catch (error) {
		} finally {
			setShowProcessingLoader(false);
		}
	};

	// keeping the venly sessions
	// useEffect(() => {
	// 	try {
	// 		if (window.venlyConnect?.auth) {
	// 			logoutVenlyUser();
	// 		}
	// 	} catch {
	// 		console.log("wallet error");
	// 	}
	// }, [window.venlyConnect]);

	// const connectToVenly = (idpHint) => {
	// 	selectedIdpHintSignIn = idpHint;
	// 	try {
	// 		// Check if a user is authenticated. If not, show the Sign In form
	// 		venlyGetAccount(idpHint, venlyChainSecretType).then(async (result) => {
	// 			if (
	// 				result &&
	// 				result.isAuthenticated &&
	// 				result.auth &&
	// 				result.auth.subject
	// 			) {
	// 				setShowProcessingLoader(true);
	// 				const venlyUserInfo = await venlyRetrieveUserInfo();
	// 				if (venlyUserInfo && venlyUserInfo.email) {
	// 					const isUserRegistered =
	// 						await checkUserRegisteredWithoutVenlyAndSave(
	// 							venlyUserInfo.email,
	// 							handleUserSignInSuccess,
	// 							() => setHasError("user not exists!")
	// 						);
	// 					if (!isUserRegistered) {
	// 						const res = await authAPIs.signInWithVenlyAPICall(
	// 							result.auth.subject
	// 						);

	// 						if (
	// 							res?.data?.status_code === 200 &&
	// 							res?.data?.data?.user_id &&
	// 							res?.data?.data?.emailId
	// 						) {
	// 							handleUserSignInSuccess(
	// 								res.data.data.user_id,
	// 								res.data.data.emailId
	// 							);
	// 						} else if (
	// 							[
	// 								"we couldn't find data matching to this user ",
	// 								"we couldn't find data matching to this userId ",
	// 							].includes(res?.data?.status_desc)
	// 						) {
	// 							navigate("/signup");
	// 						}
	// 					}
	// 				}
	// 				setShowProcessingLoader(false);
	// 			}

	// 			// window.venlyConnect.flows.authenticate({ idpHint }).then((result) =>
	// 			// return result.authenticated(async (auth) => {});

	// 			// .notAuthenticated(() => {
	// 			// 	notification.warning({ message: "Wallet disconnected" });
	// 			// });
	// 		});
	// 	} catch (error) {}
	// };

	// HIDDEN VENLY from sign in for now
	// const greetingMessage = useMemo(() => {
	// 	switch (getIdpLoginMethod()) {
	// 		case "password":
	// 			return "It looks like you signed in with Venly the last time! Use the same method to sign in again.";

	// 		case "google":
	// 			return "It looks like you signed in with Google the last time! Use the same method to sign in again.";

	// 		case "facebook":
	// 			return "Looks like you signed in with Facebook before, try that to sign in again";

	// 		case "twitter":
	// 			return "Looks like you signed in with Twitter before, try that to sign in again";

	// 		default:
	// 			break;
	// 	}

	// 	return "";
	// }, []);

	const SuccessMessage = () => {
		const email = form.getFieldValue("email");

		if (successState.showVerificationMailSent) {
			return (
				<div>
					{/* // used tp show the verification mail sent screen */}
					<SignupSuccess
						email={email}
					// showSignInButton // remove because it is already on sign in page
					/>
				</div>
			);
		} else if (successState.showSignInLinkMailSent) {
			return (
				<div>
					<Result
						className={styles.resultContainer}
						status='success'
						title={
							<span className={styles.textWhite}>
								We have sent a link to {email}, please use that to sign in to
								your account.
							</span>
						}
						subTitle={
							<div className={`${styles.textWhite} ${styles.mt3}`}>
								{/* <p>
									Please click on the link that has just been sent to your email
									account for quick Sign In without password.
								</p> */}
							</div>
						}
					/>
				</div>
			);
		} else if (successState.showResetPasswordLinkMailSent) {
			return (
				<div>
					<Result
						className={styles.resultContainer}
						status='success'
						title={<span className={styles.textWhite}>Success!</span>}
						subTitle={
							<div className={styles.textWhite}>
								<p style={{ margin: 0 }}>
									A reset password link has been sent to your Email Account.
								</p>
								<p>
									Please click on the link that has just been sent to your email
									account to reset your password.
								</p>
							</div>
						}
					/>
				</div>
			);
		}

		return null;
	};

	return (
		<div className={styles.root}>
			{!successState.showSuccess ? (
				<div className={`contact_us_container ${styles.container}`}>
					<div className={`contact_us_inner_container ${styles.innerContainer}`}>
						<h1 className={styles.heading}>
							Welcome Back
						</h1>
						{/* HIDDEN VENLY from sign in for now */}
						{/* {greetingMessage ? (
							<Alert
								message={greetingMessage}
								type='info'
								className='max-w-xl-1 mt-4 mx-auto rounded-md w-max text-base'
							/>
						) : null} */}
						<div className={styles.formWrapper}>
							<Form
								name='signIn'
								form={form}
								initialValues={initialFormValue}
								onFinish={onFinish}
								onFinishFailed={onFinishFailed}
								autoComplete='off'>
								<Form.Item
									name='email'
									rules={[
										{
											required: true,
											message: "Please enter your email!",
										},
									]}>
									<Input
										className={styles.input}
										placeholder='Enter your email'
									/>
								</Form.Item>
								{isSignInWithPasswordActive && (
									<>
										<Form.Item
											name='password'
											rules={[
												{
													required: true,
													message: "Please enter your Password!",
												},
											]}
											className=''>
											<Input.Password
												className={styles.input}
												placeholder='Enter your password'
												iconRender={(visible) =>
													visible ? (
														<EyeOutlined style={{ color: "black" }} />
													) : (
														<EyeInvisibleOutlined style={{ color: "black" }} />
													)
												}
											/>
										</Form.Item>
										<div className={styles.actionsContainer}>
											{!!hasError && (
												<div className=''>
													{/* {hasErrorCode === ERR_CODE_USER_NOT_VERIFIED && ( */}
													<Button
														htmlType='button'
														size='large'
														type='link'
														className={styles.resendButton}
														onClick={onResendVerificationMail}
														title='Click here to resend the verification mail'>
														Resend verification mail
													</Button>
													{/* )} */}
												</div>
											)}
											<p
												className={styles.resetPasswordText}
												onClick={onResetPasswordRequest}>
												Reset Password
											</p>
										</div>
									</>
								)}
								{!!hasError && (
									<div className={styles.alertWrapper}>
										{/* <p className='text-red-500 h-5'>{hasError}</p> */}
										<Alert
											message={hasError}
											type='error'
											className={styles.alert}
										/>
									</div>
								)}

								<Form.Item>
									<div className={styles.submitButtonContainer}>
										{isSignInWithPasswordActive ? (
											<Button
												htmlType='submit'
												size='large'
												className={`loading-button ${styles.signInButton}`}>
												Sign In
											</Button>
										) : (
											<Button
												htmlType='button'
												size='large'
												className={`loading-button ${styles.signInLinkButton}`}
												onClick={() => setIsSignInWithPasswordActive(true)}>
												Sign In with password
											</Button>
										)}

										<div className={styles.submitButtonContainer}>
											<p className={styles.orText}>Or</p>
										</div>

										{isSignInWithPasswordActive ? (
											<div className={styles.flex}>
												<Button
													htmlType='button'
													size='large'
													className={`loading-button ${styles.signInLinkButton}`}
													onClick={() => setIsSignInWithPasswordActive(false)}>
													Get a sign-in link via email
												</Button>
												{/* <p
													className='text-blue-107 text-base text-right ml-auto mb-0 cursor-pointer'
													onClick={() => setIsSignInWithPasswordActive(false)}>
													Get a sign-in link via email
												</p> */}
											</div>
										) : (
											<div className={styles.flex}>
												<Button
													htmlType='submit'
													size='large'
													className={`loading-button ${styles.signInLinkButton}`}>
													Get a sign-in link via email
												</Button>

												{/* <p className='text-blue-107 text-base text-right ml-auto mb-0 cursor-pointer'>
													Sign In with password
												</p> */}
											</div>
										)}

										{/* HIDDEN VENLY from sign in */}
										{/* {enable_venly && (
											<div className={styles.venlyContainer}>
												<p className={styles.orText}>Or</p>
												<div className={styles.venlyButtonContainer}>
													<div className={styles.venlyHeader}>
														<h3 className={styles.venlyTitle}>
															Sign In with <b>Venly</b> and Earn Rewards
														</h3>
														&nbsp;
														<Tooltip title='Sign In with Venly and Earn Rewards'>
															<InfoCircleOutlined className={styles.infoIcon} />
														</Tooltip>
													</div>
													<Button
														onClick={() => connectToVenly("google")}
														size='large'
														className={`loading-button ${styles.venlyButton}`}>
														<img
															className={styles.venlyButtonGoogleImg}
															height={28}
															width={28}
															src={googleIcon}
														/>
														Sign In with Google
													</Button>
													<Button
														onClick={() => connectToVenly("facebook")}
														size='large'
														className={`loading-button ${styles.venlyButton} ${styles.mt4}`}>
														<img
															className={styles.venlyButtonGoogleImg}
															height={28}
															width={28}
															src={facebookIcon}
														/>
														Sign In with Facebook
													</Button>
													<Button
														onClick={() => connectToVenly("twitter")}
														size='large'
														className={`loading-button ${styles.venlyButton} ${styles.mt4}`}>
														<img
															className={`${styles.venlyButtonGoogleImg}`}
															height={28}
															width={28}
															src={twitterIcon}
														/>
														Sign In with Twitter
													</Button>
													<Button
														onClick={() => connectToVenly("password")}
														size='large'
														className={`loading-button ${styles.venlyButton} ${styles.mt4}`}>
														<MailFilled
															className={styles.venlyButtonMailIcon}
															height={28}
															width={28}
														/>
														Sign In with Email
													</Button>
												</div>
											</div>
										)} */}
									</div>
								</Form.Item>
								{/* <div className={styles.signinLinkContainer}>
									<Link className={styles.signinLink} href='/signup'>
										New User?{" "}
										<span className={styles.signinSpan}>
											Sign up
										</span>
									</Link>
								</div> */}
							</Form>
						</div>
					</div>
				</div>
			) : (
				<SuccessMessage />
			)}
			{showProcessingLoader && (
				<div className={styles.loaderOverlay}>
					<Spin indicator={<LoadingOutlined className={styles.loaderIcon} spin />} />
				</div>
			)}
		</div>
	);
}
