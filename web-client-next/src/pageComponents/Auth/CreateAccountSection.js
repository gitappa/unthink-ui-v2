import React, { useEffect, useState } from "react";
import { Input, Form, Tooltip, Button, Alert, Spin, Checkbox } from "antd";
import {
    InfoCircleOutlined,
    CheckCircleOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    LoadingOutlined,
    MailFilled,
} from "@ant-design/icons";

import { authAPIs, profileAPIs } from "../../helper/serverAPIs";
import Link from 'next/link';
import { useNavigate } from "../../helper/useNavigate";
import { getUserInfo } from "./redux/actions";
import { useDispatch } from "react-redux";
import {
    COOKIE_TT_ID,
    SIGN_IN_EXPIRE_DAYS,
    WELCOME,
} from "../../constants/codes";
import {
    getIdpLoginMethod,
    isEmpty,
    setCookie,
    setIdpSignInMethod,
} from "../../helper/utils";
import googleIcon from "../../images/staticpageimages/googleIcon.svg";
import facebookIcon from "../../images/staticpageimages/facebookIcon.png";
import twitterIcon from "../../images/staticpageimages/twitterIcon.png";
import {
    enable_venly,
    isStagingEnv,
    is_store_instance,
    venlyChainSecretType,
} from "../../constants/config";
import {
    checkUserRegisteredWithoutVenlyAndSave,
    generateVenlyUserDetails,
    isVenlyUserAuthenticated,
    logoutVenlyUser,
    saveVenlyUserInfo,
    venlyGetAccount,
    venlyRetrieveUserInfo,
} from "../../helper/venlyUtils";
import SignupSuccess from "./SignupSuccess";
import appTracker from "../../helper/webTracker/appTracker";
import { setIsRegistered, setUserEmail } from "../../helper/getTrackerInfo";
import styles from "./authPage.module.scss";

const initialFormValue = {
    email: "",
    user_name: "",
    iCode: "",
    password: "",
    cPassword: "",
    insta_user_name: "",
    is_shop: false,
};

let selectedIdpHintSignUp = "";

export default function CreateAccountSection() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const formEmailValue = form.getFieldValue("email");

    const [hasError, setHasError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isVerifyLinkVisible, setIsVerifyLinkVisible] = useState(false);
    const [isICodeVerified, setIsICodeVerified] = useState(false);
    const [isUserVerifyLinkVisible, setIsUserVerifyLinkVisible] = useState(false);
    const [isUserNameVerified, setIsUserNameVerified] = useState(false);
    const [isVenlyConnected, setIsVenlyConnected] = useState(false);
    const [venlyUserInfo, setVenlyUserInfo] = useState(null);
    const [showProcessingLoader, setShowProcessingLoader] = useState(false);

    const dispatch = useDispatch();

    // set ttid in cookies
    // fetch the logged-in user details
    // redirect user to signup success screen with welcome message
    const handleUserSignupSuccess = (
        user_id,
        emailId,
        isUserAlreadyRegistered,
        venlyUser = {},
        iCode
    ) => {
        setCookie(COOKIE_TT_ID, user_id, SIGN_IN_EXPIRE_DAYS);
        setIsRegistered(true);
        emailId && setUserEmail(emailId);
        appTracker.onSignUpSuccess({
            user_id,
            emailId,
            iCode,
        });
        dispatch(getUserInfo());
        setIdpSignInMethod(selectedIdpHintSignUp);
        navigate("/profile/")
    };

    const onFinish = async (values) => {
        const { email, user_name, iCode, password, insta_user_name, is_shop } = values;

        console.log(values);


        if (user_name) {
            const isValid = await verifyUsername(user_name);
            if (!isValid) return false;
        }

        if (iCode) {
            const isValid = await verifyICode(email, iCode);
            if (!isValid) return false;
        }

        setShowProcessingLoader(true);
        const payload = {
            email,
            user_name,
            iCode,
            password,
            insta_user_name,
            is_shop
        };

        try {
            const res = await authAPIs.createAccountAPICall(payload);

            console.log(res);


            if (res?.data?.status_code === 200) {
                setHasError("");
                if (
                    res.data.data.user_id
                ) {
                    handleUserSignupSuccess(
                        res.data.data.user_id,
                        res.data.data.emailId,
                        false,
                        res.data.data.venlyUser,
                        res.data.data.influencer_code
                    );
                } else {
                    setIsSuccess(true);
                }
            } else if (res?.data?.status_desc) {
                setHasError(res?.data?.status_desc);
            }
        } catch (error) {
            setHasError("Failed to signup");
        }

        setShowProcessingLoader(false);
    };

    const verifyICode = async (email, iCode) => {
        const res = await authAPIs.verifyInfluencerCodeAPICall({
            email,
            iCode,
        });
        if (res?.data?.status_code) {
            if (res.data.status_code !== 200 && res.data.status_desc) {
                setHasError(res.data.status_desc);
                return false;
            }
        }
        setIsICodeVerified(true);
        return true;
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const onFieldsChange = ([data]) => {
        if (data?.name) {
            hasError && setHasError("");
            const [name] = data.name;
            if (name === "iCode") {
                isICodeVerified && setIsICodeVerified(false);
                if (data.value) {
                    !isVerifyLinkVisible && setIsVerifyLinkVisible(true);
                } else {
                    isVerifyLinkVisible && setIsVerifyLinkVisible(false);
                }
            }
            if (name === "user_name") {
                isUserNameVerified && setIsUserNameVerified(false);
                if (data.value) {
                    !isUserVerifyLinkVisible && setIsUserVerifyLinkVisible(true);
                } else {
                    isUserVerifyLinkVisible && setIsUserVerifyLinkVisible(false);
                }
            }
        }
    };

    const verifyUsername = async (user_name, enableError = true) => {
        try {
            const res = await authAPIs.verifyUsernameAPICall({
                user_name,
            });
            if (res?.data?.status_code) {
                if (res.data.status_code !== 200 && res.data.status_desc) {
                    enableError && setHasError(res.data.status_desc);
                    return false;
                }
                if (res.data?.data?.exist) {
                    enableError && setHasError("Username already exists!");
                    setIsUserNameVerified(false);
                    return false;
                } else {
                    setIsUserVerifyLinkVisible(true);
                    setIsUserNameVerified(true);
                }
            }
            return true;
        } catch (error) { }
    };

    const onEmailBlur = async (e) => {
        if (!form.getFieldValue(["user_name"])) {
            const email = form.getFieldValue(["email"]);
            const userName = email.substr(0, email.indexOf("@"));
            if (userName) {
                const verified = await verifyUsername(userName, false);
                if (verified && !form.getFieldValue(["user_name"]))
                    form.setFieldsValue({ user_name: userName });
            }
        }
    };

    const onWalletConnected = async () => {
        setShowProcessingLoader(true);
        try {
            const venlyUserInfo = await generateVenlyUserDetails();
            if (venlyUserInfo && venlyUserInfo.email) {
                const isUserRegistered = await checkUserRegisteredWithoutVenlyAndSave(
                    venlyUserInfo.email,
                    handleUserSignupSuccess,
                    () => setHasError("user already exists!")
                );
                if (!isUserRegistered) {
                    form.setFieldsValue({ email: venlyUserInfo.email });
                    onEmailBlur();
                    setIsVenlyConnected(true);
                    setVenlyUserInfo(venlyUserInfo);
                }
            }
        } catch {
            console.log("wallet error");
        }
        setShowProcessingLoader(false);
    };

    useEffect(() => {
        if (window.venlyConnect?.auth?.authenticated) onWalletConnected();
        selectedIdpHintSignUp = getIdpLoginMethod();
    }, []);

    const connectToVenly = (idpHint) => {
        selectedIdpHintSignUp = idpHint;
        // Check if a user is authenticated. If not, show the login form
        setShowProcessingLoader(true);

        venlyGetAccount(idpHint, venlyChainSecretType).then(async (result) => {
            if (
                result &&
                result.isAuthenticated &&
                result.auth &&
                result.auth.subject
            ) {
                onWalletConnected();
            }
        });

        setShowProcessingLoader(false);
        // this is the old integrated flow
        // window.venlyConnect.flows.authenticate({ idpHint }).then((result) => {
        // 	return result.authenticated(() => {
        // 		onWalletConnected();
        // 	});
        // .notAuthenticated(() => {
        // 	notification.warning({ message: "Wallet not connecteddd" });
        // });
        // });
    };

    return (
        <div className={styles.root}>
            {!isSuccess ? (
                <div className={`contact_us_container ${styles.container}`}>
                    <div className={`contact_us_inner_container ${styles.innerContainer}`}>
                        <h1 className={styles.heading}>
                            Join our growing community today!
                        </h1>
                        <div className={styles.formWrapper}>
                            <Form
                                name='signup'
                                form={form}
                                initialValues={initialFormValue}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete='off'
                                onFieldsChange={onFieldsChange}>
                                {
                                    <div
                                        className={
                                            !enable_venly && !isVenlyConnected ? "" : styles.hidden // hiding for disabled venly and if venly connected
                                        }>
                                        <label htmlFor='email' className={styles.label}>
                                            Email
                                        </label>
                                        <Form.Item
                                            className={`${styles.formItem} signup_email`}
                                            name='email'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please enter your email!",
                                                },
                                            ]}>
                                            <Input
                                                id='email'
                                                className={`${styles.input} ${isVenlyConnected ? styles.inputVenlyConnected : ""}`}
                                                placeholder='Enter your email'
                                                onBlur={onEmailBlur}
                                                disabled={isVenlyConnected}
                                            />
                                        </Form.Item>
                                    </div>
                                }
                                {(isVenlyConnected || !enable_venly) && (
                                    <>
                                        <label htmlFor='username' className={styles.label}>
                                            Account Name
                                        </label>
                                        <Form.Item
                                            className={styles.formItem}
                                            name='user_name'
                                            rules={[
                                                { required: true, message: "Please enter a username!" },
                                            ]}>
                                            <Input
                                                id='user_name'
                                                className={styles.inputUsername}
                                                placeholder='Enter a username'
                                                autoComplete='off'
                                            />
                                        </Form.Item>
                                    </>
                                )}
                                {(isVenlyConnected || !enable_venly) && (
                                    <>
                                        <label htmlFor='username' className={styles.label}>
                                            UserName
                                        </label>
                                        <Form.Item
                                            className={styles.formItem}
                                            name='insta_user_name'
                                            rules={[
                                                { required: true, message: "Please enter a username!" },
                                            ]}>
                                            <Input
                                                id='insta_user_name'
                                                className={styles.inputUsername}
                                                placeholder='Enter a Instagram user_name'
                                                autoComplete='off'

                                            />
                                        </Form.Item>
                                    </>
                                )}
                                {!enable_venly && !isVenlyConnected && (
                                    <>
                                        <label htmlFor='password' className={styles.label}>
                                            Password
                                        </label>
                                        <Form.Item
                                            className={styles.formItem}
                                            name='password'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please enter your Password!",
                                                },
                                            ]}>
                                            <Input.Password
                                                id='password'
                                                className={styles.input}
                                                placeholder='Create a password'
                                                iconRender={(visible) =>
                                                    visible ? (
                                                        <EyeOutlined style={{ color: "black" }} />
                                                    ) : (
                                                        <EyeInvisibleOutlined style={{ color: "black" }} />
                                                    )
                                                }
                                            />
                                        </Form.Item>

                                        <label htmlFor='cPassword' className={styles.label}>
                                            Confirm Password
                                        </label>
                                        <Form.Item
                                            className={styles.formItem}
                                            name='cPassword'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please confirm your password!",
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
                                                id='cPassword'
                                                type={"password"}
                                                className={styles.input}
                                                placeholder='Confirm your password'
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            id='is_shop'
                                            name='is_shop'
                                            valuePropName='checked'
                                            className={styles.formItem}
                                        >
                                            <Checkbox className={styles.checkboxLabel}>Yes, this is a shop account</Checkbox>
                                        </Form.Item>
                                    </>
                                )}
                                {hasError && (
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
                                        {/* //
							// hidden the custom email sign up options for now to let user continue with venly only when venly is enabled //
							// */}
                                        {(isVenlyConnected || !enable_venly) && (
                                            <Button
                                                htmlType='submit'
                                                size='large'
                                                className={`loading-button ${styles.submitButton}`}>
                                                {isVenlyConnected ? "Continue" : "Sign Up"}
                                            </Button>
                                        )}
                                        {!isVenlyConnected && enable_venly && (
                                            <div className={styles.venlyContainer}>
                                                {/* <p className={styles.orText}>Or</p> */}
                                                <div className={styles.venlyButtonContainer}>
                                                    {/* removed border and extra padding from above line */}
                                                    <div className={styles.venlyHeader}>
                                                        <h3 className={styles.venlyTitle}>
                                                            Sign Up with <b>Venly</b> and Earn Rewards
                                                        </h3>
                                                        &nbsp;
                                                        <Tooltip title='Sign Up with Venly and Earn Rewards'>
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
                                                        Sign Up with Google
                                                    </Button>
                                                    {/* <Button
								onClick={() => connectToVenly("facebook")}
								size='large'
								className={`loading-button ${styles.venlyButton} ${styles.mt4}`}>
								<img
									className={styles.venlyButtonGoogleImg}
									height={28}
									width={28}
									src={facebookIcon}
								/>
								Sign Up with Facebook
							</Button> */}
                                                    {/* <Button
								onClick={() => connectToVenly("twitter")}
								size='large'
								className={`loading-button ${styles.venlyButton} ${styles.mt4}`}>
								<img
									className={styles.venlyButtonGoogleImg}
									height={28}
									width={28}
									src={twitterIcon}
								/>
								Sign Up with Twitter
							</Button> */}
                                                    <Button
                                                        onClick={() => connectToVenly("password")}
                                                        size='large'
                                                        className={`loading-button ${styles.venlyButton} ${styles.mt4}`}>
                                                        <MailFilled
                                                            className={styles.venlyButtonMailIcon}
                                                            height={28}
                                                            width={28}
                                                        />
                                                        Sign Up with Email
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Form.Item>
                            </Form>
                            {!isVenlyConnected && (
                                <div className={styles.signinLinkContainer}>
                                    <Link className={styles.signinLink} href='/signin'>
                                        Already have an account?{" "}
                                        <span className={styles.signinSpan}>
                                            Sign in
                                        </span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <SignupSuccess
                        isICodeVerified={isICodeVerified}
                        email={formEmailValue}
                        showSignInButton={isICodeVerified}
                    />
                </div>
            )}
            {showProcessingLoader && (
                <div className={styles.loaderOverlay}>
                    <Spin indicator={<LoadingOutlined className={styles.loaderIcon} spin />} />
                </div>
            )}
        </div>
    );
}

