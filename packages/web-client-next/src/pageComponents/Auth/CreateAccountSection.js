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
        <div className='py-11'>
            {!isSuccess ? (
                <div className='contact_us_container max-w-340 md:max-w-748 lg:max-w-4xl xl:max-w-1260 mx-auto py-10 lg:py-20 px-7 md:px-14 lg:px-28 rounded-md'>
                    <div className='contact_us_inner_container py-8 lg:py-16 rounded-md'>
                        <h1 className='max-w-md px-6 lg:max-w-2xl mx-auto text-lg lg:text-3xl-1 lg:leading-44 font-bold text-white text-center'>
                            Join our growing community today!
                        </h1>
                        <div className='max-w-xl-1 mx-auto p-4 sm:p-8'>
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
                                            !enable_venly && !isVenlyConnected ? "" : "hidden" // hiding for disabled venly and if venly connected
                                        }>
                                        <label htmlFor='email' className='text-white'>
                                            Email
                                        </label>
                                        <Form.Item
                                            className='w-full signup_email'
                                            name='email'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please enter your email!",
                                                },
                                            ]}>
                                            <Input
                                                id='email'
                                                className={`text-left h-12 rounded-md lg:rounded-l-md ${isVenlyConnected ? "bg-gray-104" : ""
                                                    }`}
                                                placeholder='Enter your email'
                                                onBlur={onEmailBlur}
                                                disabled={isVenlyConnected}
                                            />
                                        </Form.Item>
                                    </div>
                                }
                                {(isVenlyConnected || !enable_venly) && (
                                    <>
                                        <label htmlFor='username' className='text-white'>
                                            Account Name
                                        </label>
                                        <Form.Item
                                            className='w-full'
                                            name='user_name'
                                            rules={[
                                                { required: true, message: "Please enter a username!" },
                                            ]}>
                                            <Input
                                                id='user_name'
                                                className='text-left h-12 rounded-md lg:rounded-l-md bg-white'
                                                placeholder='Enter a username'
                                                autoComplete='off'
                                            />
                                        </Form.Item>
                                    </>
                                )}
                                {(isVenlyConnected || !enable_venly) && (
                                    <>
                                        <label htmlFor='username' className='text-white'>
                                            UserName
                                        </label>
                                        <Form.Item
                                            className='w-full'
                                            name='insta_user_name'
                                            rules={[
                                                { required: true, message: "Please enter a username!" },
                                            ]}>
                                            <Input
                                                id='insta_user_name'
                                                className='text-left h-12 rounded-md lg:rounded-l-md bg-white'
                                                placeholder='Enter a Instagram user_name'
                                                autoComplete='off'

                                            />
                                        </Form.Item>
                                    </>
                                )}
                                {!enable_venly && !isVenlyConnected && (
                                    <>
                                        <label htmlFor='password' className='text-white'>
                                            Password
                                        </label>
                                        <Form.Item
                                            className='w-full'
                                            name='password'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please enter your Password!",
                                                },
                                            ]}>
                                            <Input.Password
                                                id='password'
                                                className='text-left h-12 rounded-md lg:rounded-l-md'
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

                                        <label htmlFor='cPassword' className='text-white'>
                                            Confirm Password
                                        </label>
                                        <Form.Item
                                            className='w-full'
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
                                                className='text-left h-12 rounded-md lg:rounded-l-md'
                                                placeholder='Confirm your password'
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            id='is_shop'
                                            name='is_shop'
                                            valuePropName='checked'
                                            className='w-full'
                                        >
                                            <Checkbox className='text-white'>Yes, this is a shop account</Checkbox>
                                        </Form.Item>
                                    </>
                                )}
                                {hasError && (
                                    <div className='lg:flex items-center my-4'>
                                        {/* <p className='text-red-500 h-5'>{hasError}</p> */}
                                        <Alert
                                            message={hasError}
                                            type='error'
                                            className='w-full rounded-full py-0 px-2'
                                        />
                                    </div>
                                )}
                                <Form.Item>
                                    <div className='flex flex-col items-center'>
                                        {/* //
											// hidden the custom email sign up options for now to let user continue with venly only when venly is enabled //
											// */}
                                        {(isVenlyConnected || !enable_venly) && (
                                            <Button
                                                htmlType='submit'
                                                size='large'
                                                className='loading-button w-24 md:w-40 text-xs md:text-sm z-10 mt-4 md:mt-0 bg-indigo-600 border-none rounded-md py-3 px-3.5 h-full font-bold -ml-2.5 text-white'>
                                                {isVenlyConnected ? "Continue" : "Sign Up"}
                                            </Button>
                                        )}
                                        {!isVenlyConnected && enable_venly && (
                                            <div className='flex flex-col items-center'>
                                                {/* <p className='text-white my-4 text-base'>Or</p> */}
                                                <div className='max-w-xs'>
                                                    {/* removed border and extra padding from above line */}
                                                    <div className='mb-4 flex'>
                                                        <h3 className='text-xl text-white'>
                                                            Sign Up with <b>Venly</b> and Earn Rewards
                                                        </h3>
                                                        &nbsp;
                                                        <Tooltip title='Sign Up with Venly and Earn Rewards'>
                                                            <InfoCircleOutlined className='text-xl text-blue-107' />
                                                        </Tooltip>
                                                    </div>
                                                    <Button
                                                        onClick={() => connectToVenly("google")}
                                                        size='large'
                                                        className='loading-button w-full whitespace-normal flex items-center text-xs md:text-sm z-10 bg-white border-none rounded-md py-2 px-3.5 h-full font-bold text-gray-600'>
                                                        <img
                                                            className='w-10 pr-3'
                                                            height={28}
                                                            width={28}
                                                            src={googleIcon}
                                                        />
                                                        Sign Up with Google
                                                    </Button>
                                                    {/* <Button
														onClick={() => connectToVenly("facebook")}
														size='large'
														className='loading-button w-full whitespace-normal flex items-center text-xs md:text-sm z-10 mt-4 bg-white border-none rounded-md py-2 px-3.5 h-full font-bold text-blue-109'>
														<img
															className='w-10 pr-3'
															height={28}
															width={28}
															src={facebookIcon}
														/>
														Sign Up with Facebook
													</Button> */}
                                                    {/* <Button
														onClick={() => connectToVenly("twitter")}
														size='large'
														className='loading-button w-full whitespace-normal flex items-center text-xs md:text-sm z-10 mt-4 bg-white border-none rounded-md py-2 px-3.5 h-full font-bold text-sky-101'>
														<img
															className='w-10 h-7 pr-3'
															height={28}
															width={28}
															src={twitterIcon}
														/>
														Sign Up with Twitter
													</Button> */}
                                                    <Button
                                                        onClick={() => connectToVenly("password")}
                                                        size='large'
                                                        className='loading-button w-full whitespace-normal flex items-center text-xs md:text-sm z-10 mt-4 bg-white border-none rounded-md py-2 px-3.5 h-full font-bold text-gray-600'>
                                                        <MailFilled
                                                            className='text-xl-2 pr-1'
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
                                <div className='text-center'>
                                    <Link className='text-white' href='/signin'>
                                        Already have an account?{" "}
                                        <span className='text-blue-107 whitespace-nowrap font-bold'>
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
                <div className='fixed z-30 top-0 left-0 flex justify-center items-center w-full h-full backdrop-filter backdrop-contrast-75'>
                    <Spin indicator={<LoadingOutlined className='text-3xl-1' spin />} />
                </div>
            )}
        </div>
    );
}
