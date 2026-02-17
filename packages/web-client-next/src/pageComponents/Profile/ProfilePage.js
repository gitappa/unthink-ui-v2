import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { Steps, Result, notification } from "antd";

import AuthHeader from "../AuthHeader";
import ProfileName from "./Steps/ProfileName";
import ProfileDescription from "./Steps/ProfileDescription";
import { useDispatch, useSelector } from "react-redux";
import useWindowSize from "../../helper/useWindowSize";
import { AdminCheck, checkIsShopifyStore, getIsSellerLoggedIn } from "../../helper/utils";
import { authAPIs } from "../../helper/serverAPIs";
import { getUserCollections, saveUserInfo } from "../Auth/redux/actions";
import {
	adminUserId,
	is_store_instance,
	current_store_name,
} from "../../constants/config";
import {
	CURRENCY_USD,
	FETCH_COLLECTIONS_PRODUCT_LIMIT,
	ROUTES,
} from "../../constants/codes";
import { getCreatoStoreData, getStoreData, setStoreData } from "../store/redux/actions";

import styles from './profilePage.module.scss';
import FeatureSelection from "./Steps/FeatureSelection";

const { Step } = Steps;

const initialProfileData = {
	first_name: "",
	last_name: "",
	profile_image: "",
	cover_image: "",
	description: "Take a look at my collections",
};

const initialSellerDetails = {
	brandDescription: "",
	brandName: "",
	contact: "",
	couponCode: "",
	email: "",
	title: "",
	info: "",
	blogUrl: "",
	videoUrl: "",
	platform: "",
	currency: "",
	vendor_url: "",
	instagramUrl: "",
	facebookUrl: "",
};

const ProfilePage = () => {
	const router = useRouter();
	const { width } = useWindowSize();
	const isMobile = width <= 550;
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state?.auth);
	const [
		authUserCollections,
		authUserCollectionsIsFetching,
		store_id,
		seller_details,
		associate_seller,
		storeData,
	] = useSelector((state) => [
		state.auth.user.collections.data,
		state.auth.user.collections.isFetching,
		state.store.data.store_id,
		state.store.data.sellerDetails,
		state.store.data.associate_seller,
		state.store.data,
	]);

	const {
		my_products_enable: isMyProductsEnable,
		seller_list: storeSellerList,
		admin_list: admin_list,
	} = storeData;

	const [currentStep, setCurrentStep] = useState(0);
	const [profileData, setProfileData] = useState({ ...initialProfileData });
	const [sellerDetails, setSellerDetails] = useState({
		...initialSellerDetails,
	});
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState({
		first_name: "",
		brand_name: "",
		instagramUrl: "",
		facebookUrl: "",
	});

	const isAdminLoggedIn = AdminCheck(user?.data, current_store_name, adminUserId, admin_list);

	useEffect(() => {
		if (user.data.user_id) {
			if (!authUserCollections.length && !authUserCollectionsIsFetching) {
				dispatch(
					getUserCollections({
						product_limits: FETCH_COLLECTIONS_PRODUCT_LIMIT,
					})
				);
			}
		}
	}, [user.data.user_id]);

	const isCreaterAccount = useMemo(() => {
		return !!user?.data?.super_admin === 'super_admin'; // returns true if shop exists, else false
	}, [user?.data]);

	useEffect(() => {
		if (user.data.user_id) {
			if (user.data.emailId) {
				const {
					first_name = "",
					last_name = "",
					profile_image = "",
					cover_image = "",
					description = "",
				} = user.data;
				setProfileData(() => ({
					first_name,
					last_name,
					profile_image,
					cover_image,
					description,
				}));
			} else {
				router.push("/store/");
			}
		}
	}, [user.data.emailId, user.data.user_id]);

	useEffect(() => {
		if (seller_details && user?.data?.user_name) {
			const {
				brandDescription = "",
				brandName = "",
				contact = "",
				couponCode = "",
				email = "",
				title = "",
				info = "",
				blogUrl = "",
				videoUrl = "",
				vendor_url = "",
				instagramUrl = "",
				facebookUrl = "",
				paymentMethod = "",
				paymentDetails = "",
				shippingDetails = "",
			} = seller_details[user.data.user_name] || {};

			let { platform = "", currency = "" } =
				seller_details[user.data.user_name] || {};

			if (!platform && current_store_name) {
				platform = current_store_name;
			}
			if (!currency) {
				currency = CURRENCY_USD;
			}

			setSellerDetails((data) => ({
				...data,
				brandDescription,
				brandName,
				contact,
				couponCode,
				email,
				title,
				info,
				blogUrl,
				videoUrl,
				platform,
				currency,
				vendor_url,
				instagramUrl,
				facebookUrl,
				paymentMethod,
				paymentDetails,
				shippingDetails,
			}));
		}
	}, [seller_details, user?.data?.user_name]);

	const prevStep = () => {
		setCurrentStep(currentStep - 1);
	};

	const nextStep = () => {
		setCurrentStep(currentStep + 1);
	};

	const handleChange = (name, value) => {
		setProfileData((currentValue) => ({ ...currentValue, [name]: value }));
	};

	const handleSellerDetailsChange = (name, value) => {
		setSellerDetails((currentValue) => ({ ...currentValue, [name]: value }));
	};

	const vendorUrl = useMemo(
		() =>
			checkIsShopifyStore(sellerDetails) ? sellerDetails.vendor_url : undefined,
		[sellerDetails]
	);

	// removed call update store API
	// const handleSaveStoreDetails = useCallback(
	// 	async (showMessage) => {
	// 		const data = {
	// 			...sellerDetails,
	// 			brandDescription: profileData.description,
	// 			vendor_url: vendorUrl,
	// 		};

	// 		const payload = {
	// 			sellerDetails: {
	// 				...seller_details,
	// 				[user.data.user_name]: data,
	// 			},
	// 		};
	// 		const response = await authAPIs.updateStoreDetailsAPICall(
	// 			store_id,
	// 			payload
	// 		);

	// 		if (response.data.status_code === 200 && response.data.data) {
	// 			dispatch(setStoreData(response.data.data)); // updating latest store details from API response
	// 			{
	// 				showMessage && setIsSuccess(true);
	// 			}
	// 		} else {
	// 			showMessage &&
	// 				notification["error"]({ message: "Unable to save profile" });
	// 		}
	// 	},
	// 	[
	// 		sellerDetails,
	// 		seller_details,
	// 		user.data.user_name,
	// 		authAPIs,
	// 		profileData.description,
	// 		vendorUrl,
	// 	]
	// );

	// isCreaterAccount 
	useEffect(() => {
		if (isCreaterAccount || isAdminLoggedIn) {
			dispatch(getCreatoStoreData(user?.data?.shop[0]));
		}
	}, [isCreaterAccount, isAdminLoggedIn])


	const saveUserInfoData = async () => {
		const { first_name, last_name, profile_image, cover_image, description } =
			profileData;

		const payload = {
			first_name,
			last_name,
			profile_image,
			cover_image,
			description,
			user_id: user.data.user_id, // required
			is_influencer: user.data.is_influencer, // required
			_id: user.data._id, // required
		};

		if (isSellerLoggedIn || isCreaterAccount || isAdminLoggedIn) {
			payload.platform = sellerDetails.platform;
			payload.currency = sellerDetails.currency;
			payload.vendor_url = vendorUrl;

			payload.sellerDetails = {
				...sellerDetails,
				brandDescription: profileData.description,
				vendor_url: vendorUrl,
			};
		}

		dispatch(
			saveUserInfo({
				userInfo: payload,
				onSuccess: () => {
					isLastStep && setIsSuccess(true);
				},
				onFailure: !isSellerLoggedIn
					? () => {
						notification["error"]({ message: "Unable to save user info" });
					}
					: undefined,
				resetCollections: false,
			})
		);

		if ((isSellerLoggedIn || isCreaterAccount || isAdminLoggedIn) && isLastStep) {
			dispatch(getStoreData()); // fetching store data
		}

		// if (isSellerLoggedIn) {
		// 	handleSaveStoreDetails();
		// }
	};

	// continue click of profile description call save user info
	const saveStoreDetails = useCallback(() => {
		// handleSaveStoreDetails({ showMessage: true });
		saveUserInfoData();
	}, [saveUserInfoData]);

	const isSellerLoggedIn = useMemo(
		() =>
			(isAdminLoggedIn ||
				getIsSellerLoggedIn(storeSellerList, user?.data.emailId)) &&
			isMyProductsEnable,
		[isAdminLoggedIn, isMyProductsEnable, storeSellerList, user?.data.emailId]
	);

	// const isAssociateSeller = useMemo(
	// 	() => associate_seller?.includes(user?.data.emailId),
	// 	[associate_seller, user?.data.emailId]
	// );

	const steps = useMemo(() => {
		let step = ["Profile"];
		// if (isSellerLoggedIn) {
		// 	step.push("Contact Details");
		// }
		if (isCreaterAccount || isSellerLoggedIn || isAdminLoggedIn) {
			step.push("Feature Selection");
		}
		return step;
	}, [isSellerLoggedIn, isCreaterAccount, isAdminLoggedIn]);

	const isLastStep = useMemo(
		() => steps.length - 1 === currentStep,
		[steps, currentStep]
	);

	const isUserInfoValid = () => {
		let isValid = true;
		let errorList = {
			first_name: "",
			brand_name: "",
			instagramUrl: "",
			facebookUrl: "",
		};

		if (isSellerLoggedIn || isCreaterAccount || isAdminLoggedIn) {
			if (!sellerDetails.brandName) {
				errorList.brand_name = "Please enter your brand name";
				isValid = false;
			}
		} else {
			if (!profileData?.first_name) {
				errorList.first_name = "Please enter your first name";
				isValid = false;
			}
		}

		if (sellerDetails.instagramUrl) {
			try {
				const isValidInstagramUrl = new URL(sellerDetails.instagramUrl);

				if (
					!(
						isValidInstagramUrl &&
						(isValidInstagramUrl.protocol === "https:" ||
							isValidInstagramUrl.protocol === "http:")
					)
				) {
					errorList.instagramUrl = "Please enter valid instagram url";
					isValid = false;
				}
			} catch {
				errorList.instagramUrl = "Please enter valid instagram url";
				isValid = false;
			}
		}

		if (sellerDetails.facebookUrl) {
			try {
				const isValidFacebookUrl = new URL(sellerDetails.facebookUrl);

				if (
					!(
						isValidFacebookUrl &&
						(isValidFacebookUrl.protocol === "https:" ||
							isValidFacebookUrl.protocol === "http:")
					)
				) {
					errorList.facebookUrl = "Please enter valid facebook url";
					isValid = false;
				}
			} catch {
				errorList.facebookUrl = "Please enter valid facebook url";
				isValid = false;
			}
		}

		setError(errorList);
		return isValid;
	};

	const onContinue = () => {
		if (isUserInfoValid()) {
			!isLastStep && nextStep();
			console.log("Saving user info data on continue click");
			saveUserInfoData();
		}
	};

	const onStepChange = (current) => {
		if (isUserInfoValid()) {
			if (current > currentStep) {
				nextStep();
				saveUserInfoData();
			} else if (current !== currentStep) {
				prevStep();
			}
		}
	};

	console.log(storeData, "user data in profile page");


	const getStepContent = () => {
		switch (currentStep) {
			case 0:
				return (
					<ProfileName
						// nextStep={nextStep}
						// prevStep={prevStep}
						profileData={profileData}
						sellerDetails={sellerDetails}
						handleChange={handleChange}
						handleSellerDetailsChange={handleSellerDetailsChange}
						user={user?.data}
						saveUserInfoData={saveUserInfoData}
						isSellerLoggedIn={isSellerLoggedIn}
						error={error}
						admin_list={admin_list}
						isUserInfoValid={isUserInfoValid}
						onContinue={onContinue}
						isCreaterAccount={isCreaterAccount}
					/>
				);
			case 1:
				return (
					(isCreaterAccount || isSellerLoggedIn || isAdminLoggedIn) && (
						// <ProfileDescription
						// 	nextStep={saveStoreDetails}
						// 	prevStep={prevStep}
						// 	sellerDetails={sellerDetails}
						// 	handleChange={handleSellerDetailsChange}
						// 	isSaving={user?.isSavingUserInfo}
						// />
						<FeatureSelection
							nextStep={saveStoreDetails}
							prevStep={prevStep}
							sellerDetails={sellerDetails}
							handleChange={handleSellerDetailsChange}
							isSaving={user?.isSavingUserInfo}
							storeData={storeData}
						/>
					));

			default:
				break;
		}
	};

	return (
		<div className={`${styles.profilePageWrapper} static_page_bg`}>
			<div className='profile-header-container'>
				<AuthHeader hideProfile showBackToStore />
			</div>
			<div className={`profile-container ${styles.profileContainerPadding}`}>
				{!isSuccess ? (
					<>
						<div className={styles.stepsWrapper}>
							{!isMobile ? (
								<>
							<Steps
  responsive={false}
  type='navigation'
  size='small'
  current={currentStep}
  onChange={onStepChange}
  className={styles.siteNavigationSteps}
>
  {steps.map((step, i) => (
    <Step key={i} title={step} />
  ))}
</Steps>
								</>
							) : (
								<div className={styles.mobileStepIndicator}>
									<div className={styles.mobileStepNumber}>
										<span>{currentStep + 1}</span>
									</div>
									<div className={styles.mobileStepTitle}>
										<span>{steps[currentStep]}</span>
									</div>
								</div>
							)}
						</div>
						<div className={styles.stepContentWrapper}>{getStepContent()}</div>
					</>
				) : (
					<div>
						{isAdminLoggedIn ? (
							<Result
								className={styles.resultContainer}
								status='success'
								title={<span className={styles.resultTitle}>Success!</span>}
								subTitle={
									<span className={styles.resultSubtitle}>
										Your Profile/Brand details has been updated successfully!
									</span>
								}
								extra={[
									isMyProductsEnable ? (
										<button
											className={styles.resultButton}
											onClick={() => router.push(ROUTES.MY_PRODUCTS)}>
											Add products
										</button>
									) : (
										<button
											className={styles.resultButton}
											onClick={() =>
												user?.enablePlist && is_store_instance
													? router.push("/")
													: router.push("/store/")
											}>
											Go to store
										</button>
									),
								]}
							/>
						) : (
							<Result
								className={styles.resultContainer}
								status='success'
								title={<span className={styles.resultTitle}>Success!</span>}
								subTitle={
									<span className={styles.resultSubtitle}>
										Your profile has been updated successfully!
									</span>
								}
								extra={[
									<button
										className={styles.resultButton}
										onClick={() =>
											user?.enablePlist && is_store_instance
												? router.push("/")
												: router.push("/store/")
										}>
										Go to store
									</button>,
								]}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;
