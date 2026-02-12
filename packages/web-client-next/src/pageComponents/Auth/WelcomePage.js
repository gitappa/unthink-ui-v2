import React, { useEffect, useMemo } from "react";
import styles from "./authPage.module.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "../../helper/useNavigate";
import { Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import AuthHeader from "../AuthHeader";
import { adminUserId, current_store_name, is_store_instance } from "../../constants/config";
import { getCurrentUserStore } from "./redux/selector";
import { getIsSellerLoggedIn, isEmpty, AdminCheck } from "../../helper/utils";
import { ROUTES } from "../../constants/codes";

const WelcomePage = (props) => {
	const navigate = useNavigate();
	const referrer = props.location?.state?.referrer;
	const venlyRegistered = !!props.location?.state?.venlyRegistered;
	const venlyWalletConnected = !!props.location?.state?.venlyWalletConnected;

	const [authUser, storeData] = useSelector((state) => [
		state?.auth?.user,
		state?.store?.data,
	]);

	const currentStore = useSelector(getCurrentUserStore);

	const {
		my_products_enable: isMyProductsEnable,
		seller_list: storeSellerList,
		admin_list: admin_list
	} = storeData || {};


	const isAdminLoggedIn = AdminCheck(authUser?.data, current_store_name, adminUserId, admin_list);

	console.log(authUser);


	const isSellerLoggedIn = useMemo(
		() =>
			(isAdminLoggedIn ||
				getIsSellerLoggedIn(storeSellerList, authUser?.data.emailId)) &&
			isMyProductsEnable,
		[
			isAdminLoggedIn,
			isMyProductsEnable,
			storeSellerList,
			authUser?.data.emailId,
		]
	);

	console.log(isSellerLoggedIn);


	const isPageLoading = useMemo(
		() => authUser.fetching || isEmpty(storeData),
		[authUser.fetching, storeData]
	);

	useEffect(() => {
		if (Object.keys(authUser.data).length) {
			if (!authUser.data.emailId) {
				is_store_instance ? navigate("/") : navigate("/store/");
			}
		}
	}, [authUser.data]);

	return (
		<div className={`static_page_bg ${styles.welcomeRoot}`}>
			<div className={styles.authHeaderContainer}>
				<AuthHeader hideProfile />
			</div>
			<div className={`${styles.welcomeContainer} ${styles.authContainer}`}>
				<div className={styles.welcomeContent}>
					{referrer === "signup" ? (
						<>
							<h1 className={styles.welcomeTitle}>
								{venlyRegistered ? "Congratulations!" : "Welcome!"}
							</h1>
							{venlyRegistered && (
								<h2 className={styles.welcomeSubtitle}>
									You are all set to create collections now!
								</h2>
							)}
						</>
					) : (
						<h1 className={styles.welcomeTitle}>
							Welcome Back!
						</h1>
					)}
					{/* <h1 className='text-xl text-white text-center max-w-xl-1 opacity-80 mt-6'>
						Create your profile now or continue to create your first collection.
						You can always come back later and update your profile.
					</h1> */}
					{!isPageLoading && (
						<>
							{isSellerLoggedIn ? (
								<>
									<div className={styles.welcomeActions}>
										<span>Let's create your profile</span>
										<span>
											<button
												className={styles.welcomeGoButton}
												onClick={() => navigate(ROUTES.UPDATE_PROFILE)}
												type='primary'>
												Go
											</button>
										</span>
									</div>

									<div className={styles.welcomeActions}>
										<a
											className={styles.welcomeContactLink}
											href='mailto:info@unthink.ai?subject=Brand enquiry&body=I would like to know more about how can I create my own store.'>
											Want to create your own store?{" "}
											<span className={styles.welcomeContactSpan}>
												Contact us
											</span>
										</a>
									</div>
								</>
							) : (
								<>
									<div className={styles.welcomeMainActions}>
										<button
											className={styles.welcomeMainButton}
											onClick={() =>
												authUser.data.store?.[currentStore]?.pages.length
													? navigate("/store")
													: navigate("/create-collection", {
														state: {
															isAuthUser: true,
														},
													})
											}
											type='primary'>
											{authUser.data.store?.[currentStore]?.pages.length
												? "Skip and continue"
												: "Create my first collection"}
										</button>
									</div>
									<div className={styles.welcomeActions}>
										<div>
											<button
												className={styles.welcomeLink}
												onClick={() => navigate("/profile")}>
												Update your profile
											</button>
											You can do this at any time.
										</div>
										<div className={styles.welcomeMt2}>
											<a
												className={styles.welcomeContactLink}
												href='mailto:info@unthink.ai?subject=Brand enquiry&body=I would like to know more about how can I create my own store.'>
												Want to create your own store?{" "}
												<span className={styles.welcomeContactSpan}>
													Contact us
												</span>
											</a>
										</div>
									</div>
								</>
							)}
						</>
					)}
				</div>
			</div>
			{isPageLoading && (
				<div className={styles.welcomeLoader}>
					<Spin indicator={<LoadingOutlined className={styles.loaderIcon} spin />} />
				</div>
			)}
		</div>
	);
};

export default WelcomePage;
