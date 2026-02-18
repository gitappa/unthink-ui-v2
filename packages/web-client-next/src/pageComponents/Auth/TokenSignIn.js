import React, { useEffect } from "react";
import { useNavigate } from "../../helper/useNavigate";
import { useDispatch } from "react-redux";
import { Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import AuthHeader from "../AuthHeader";
import { getUserInfo } from "./redux/actions";
import { authAPIs } from "../../helper/serverAPIs";
import {
	setIsRegistered,
	setTTid,
	setUserEmail,
} from "../../helper/getTrackerInfo";
import {
	PATH_ROOT,
	PATH_SIGN_IN,
	PATH_STORE,
	SIGN_IN_EXPIRE_DAYS,
} from "../../constants/codes";
import { is_store_instance } from "../../constants/config";
import styles from "./authPage.module.scss";

const TokenSignIn = ({ token, location }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const params = typeof window !== 'undefined' && location?.search ? new URLSearchParams(location.search) : null;
	const redirectPage = params?.get("page");

	useEffect(() => {
		if (token) verifyToken(token);
	}, [token]);

	const redirectBackToHome = () => {
		notification["success"]({
			message: "Sign In Success!",
			duration: 3,
		});
		if (is_store_instance) {
			navigate(PATH_ROOT);
		} else {
			navigate(PATH_STORE);
		}
	};

	const handleVerificationError = () => {
		notification.error({
			message: "Token is invalid/expired. Please sign in again",
		});
		navigate(PATH_SIGN_IN);
	};

	const verifyToken = async (signInToken) => {
console.log('hwlloworls');

		try {
			const res = await authAPIs.verifyTokenAPICall(signInToken);
console.log(res.data.data);

			if (
				res.data.status_code === 200 &&
				res.data.data.user_id &&
				res.data.data.user_name &&
				res.data.data.emailId
			) {
				// START
				setTTid(res.data.data.user_id);
				setIsRegistered(true);
				setUserEmail(res.data.data.emailId);
				// END
				dispatch(getUserInfo());
				if (redirectPage === "my-products") {
					navigate("/my-products");
					return;
				}
				if (redirectPage === "create-collection") {
					navigate("/create-collection");
					return;
				}

				redirectBackToHome();
			} else {
				handleVerificationError();
			}
		} catch {
			handleVerificationError();
		}
	};

	return (
		<div className={`static_page_bg ${styles.tokenSignInRoot}`}>
			<div className={styles.authHeaderContainer}>
				<AuthHeader
					userTextLink={{
						text: "Sign In",
						to: "/signin",
					}}
				/>
			</div>
			<div className={styles.tokenSignInLoader}>
				<Spin indicator={<LoadingOutlined className={styles.loaderIcon} spin />} />
			</div>
		</div>
	);
};

export default TokenSignIn;
