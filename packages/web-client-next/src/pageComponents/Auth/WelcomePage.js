import React, { useEffect, useMemo } from "react";
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
		<div className='h-screen static_page_bg'>
			<div className='auth-header-container'>
				<AuthHeader hideProfile />
			</div>
			<div className='flex auth-container'>
				<div className='w-full p-6 lg:p-16 flex items-center flex-col'>
					{referrer === "signup" ? (
						<>
							<h1 className='text-5xl text-white tracking-widest_6'>
								{venlyRegistered ? "Congratulations!" : "Welcome!"}
							</h1>
							{venlyRegistered && (
								<h2 className='text-xl text-white mt-6'>
									You are all set to create collections now!
								</h2>
							)}
						</>
					) : (
						<h1 className='text-5xl text-white tracking-widest_6'>
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
									<div className='text-center text-white text-base mt-14'>
										<span>Let's create your profile</span>
										<span>
											<button
												className='text-lg bg-indigo-600 border-none rounded-md py-1 px-4 ml-3 h-full font-bold text-white'
												onClick={() => navigate(ROUTES.UPDATE_PROFILE)}
												type='primary'>
												Go
											</button>
										</span>
									</div>

									<div className='text-center text-white text-base mt-14'>
										<a
											className='hover:text-white cursor-default'
											href='mailto:info@unthink.ai?subject=Brand enquiry&body=I would like to know more about how can I create my own store.'>
											Want to create your own store?{" "}
											<span className='cursor-pointer hover:underline font-medium'>
												Contact us
											</span>
										</a>
									</div>
								</>
							) : (
								<>
									<div className='mt-14 max-w-xl-1 w-full flex justify-around'>
										<button
											className='text-lg bg-indigo-600 border-none rounded-md py-3 px-5 h-full font-bold text-white'
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
									<div className='text-center text-white text-base mt-14'>
										<div>
											<button
												className='underline mr-1'
												onClick={() => navigate("/profile")}>
												Update your profile
											</button>
											You can do this at any time.
										</div>
										<div className='mt-2'>
											<a
												className='hover:text-white cursor-default'
												href='mailto:info@unthink.ai?subject=Brand enquiry&body=I would like to know more about how can I create my own store.'>
												Want to create your own store?{" "}
												<span className='cursor-pointer hover:underline font-medium'>
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
				<div className='absolute top-0 left-0 flex justify-center items-center w-full h-full backdrop-filter backdrop-contrast-75'>
					<Spin indicator={<LoadingOutlined className='text-3xl-1' spin />} />
				</div>
			)}
		</div>
	);
};

export default WelcomePage;
