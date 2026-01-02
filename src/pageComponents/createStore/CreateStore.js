import React, { useState, useEffect, useMemo } from "react";
import { Steps, Result, notification } from "antd";

import AuthHeader from "../AuthHeader";

import ProfileFavoriteBrands from "./Steps/ProfileFavoriteBrands";
import { authAPIs, profileAPIs } from "../../helper/serverAPIs";

import styles from '../Profile/profilePage.module.scss';
import { useDispatch, useSelector } from "react-redux";
import useWindowSize from "../../helper/useWindowSize";
import { saveUserInfo } from "../Auth/redux/actions";
import { useNavigate } from "../../helper/useNavigate";
import ProfileAdditionalBrands from "./Steps/ProfileAdditionalBrands";
import { adminUserId, current_store_name } from "../../constants/config";
import { AdminCheck, isEmpty } from "../../helper/utils";
import { setStoreData } from "../store/redux/actions";
import { STORE_USER_NAME_FASHIONDEMO, STORE_USER_NAME_GOLDSURA, templatesLabelToShow } from "../../constants/codes";
import { getStoredAttributes, updateStoredAttributePool } from "./redux/action";
import ProfileAttributes from "./Steps/ProfileAttributes";

const { Step } = Steps;

const initialProfileData = {
	wishlist_brands: [],
	brands: [],
};

const CreateStore = () => {
	const navigate = useNavigate();
	const { width } = useWindowSize();
	const isMobile = width <= 550;
	const dispatch = useDispatch();
	const [{ user }, store_id, storeData, attributePool, attributePoolTypes, admin_list] = useSelector((state) => [
		state.auth,
		state.store.data.store_id,
		state.store.data,
		state.attributePool?.attributePool?.data,
		state.attributePool?.attributePool,
		state.store.data.admin_list,
	]);



	const catalog_feed_settings =
		storeData?.filter_settings?.store_level_settings?.catalog_feed_settings;

	const [currentStep, setCurrentStep] = useState(0);
	const [profileData, setProfileData] = useState(initialProfileData);
	const [brandList, setBrandList] = useState([]);
	const [successMessage, setSuccessMessage] = useState("");
	const [updatedTemplates, setUpdatedTemplates] = useState({});

	const fetchBrandsList = async () => {
		try {
			const res = await profileAPIs.fetchBrandsAPICall(catalog_feed_settings);

			if (res?.data?.data) {
				const brandsData = res.data.data;
				setBrandList(brandsData);
				const defaultSelectedBrand = brandsData.filter(
					(brand) => brand.active && brand.available
				);
				if (!user.data.emailId) {
					setProfileData((value) => ({
						...value,
						brands: defaultSelectedBrand.map((brand) => brand.brand),
					}));
				}
			}
		} catch (error) {
			console.log(error);
		}
	};


	const isAdminLoggedIn = AdminCheck(user.data, current_store_name, adminUserId, admin_list);


	const templatesKey = useMemo(() => {
		// combine all key of templatesLabelToShow and updatedTemplate
		const allTemplateKeys = [
			...Object.keys(templatesLabelToShow),
			...Object.keys(updatedTemplates),
		];
		return [...new Set(allTemplateKeys)]; // remove duplicate key and sorting
	}, [updatedTemplates, templatesLabelToShow]);

	useEffect(() => {
		if (!isEmpty(storeData.templates)) setUpdatedTemplates(storeData.templates);
	}, [storeData.templates]);

	useEffect(() => {
		if (!isEmpty(storeData)) fetchBrandsList();
	}, [storeData]);

	useEffect(() => {
		if (user.data.user_id) {
			if (user.data.emailId) {
				const {
					wishlist_brands = [],
					requested_brands = [],
					filters = { strict: {} },
				} = user.data;
				setProfileData(() => ({
					wishlist_brands,
					brands: filters?.[current_store_name]?.strict?.brand
						? [...requested_brands, ...(filters?.[current_store_name]?.strict?.brand || [])]
						: brandList.map((brand) => brand.brand),
				}));
			} else {
				navigate("/store/");
			}
		}
	}, [user.data.emailId, user.data.user_id, brandList]);

	const onStepChange = (current) => {
		if (current < 1) setCurrentStep(current);
	};

	const prevStep = () => {
		setCurrentStep(currentStep - 1);
	};

	const nextStep = () => {
		setCurrentStep(currentStep + 1);
	};

	const handleChange = (name, value) => {
		setProfileData((currentValue) => ({ ...currentValue, [name]: value }));
	};

	const handleTemplatesChange = (e) => {
		const { name, value } = e.target;
		setUpdatedTemplates({
			...updatedTemplates,
			[name]: value,
		});
	};

	const steps = useMemo(() => {
		let step = ["Favorite Brands"];
		if (isAdminLoggedIn) {
			// step.push("Templates");
			if (isAdminLoggedIn) {
				step.push("Attributes");
			}
		}
		return step;
	}, [isAdminLoggedIn]);

	const isLastStep = useMemo(
		() => steps.length - 1 === currentStep,
		[steps, currentStep]
	);

	const message = useMemo(() => {
		let successMessage = "";
		const totalSelectedBrands = [
			...profileData.brands,
			...profileData.wishlist_brands,
		];
		const existingTotalBrands = [
			...(user?.data?.filters?.[current_store_name]?.strict?.brand || []),
			...(user?.data?.requested_brands || []),
			...(user?.data?.wishlist_brands || []),
		];
		if (
			totalSelectedBrands.length === existingTotalBrands.length &&
			totalSelectedBrands.every((brand) => existingTotalBrands.includes(brand))
		) {
			successMessage = "Your store has been updated successfully!";
		} else {
			successMessage =
				"We are preparing your product feed. We will notify you when the selected brands are imported.";
		}
		return successMessage;
	}, [profileData, user?.data]);

	const saveTemplatesData = async () => {
		if (
			store_id &&
			isAdminLoggedIn &&
			!isEmpty(updatedTemplates) &&
			!isEmpty(storeData.templates)
		) {
			const updateStorePayload = {
				templates: updatedTemplates,
			};

			const response = await authAPIs.updateStoreDetailsAPICall(
				store_id,
				updateStorePayload
			);
			if (response.data.status_code === 200 && response.data.data) {
				dispatch(setStoreData(response.data.data)); // updating latest store details from API response
			} else {
				notification["error"]({ message: "Unable to update templates" });
			}
		}
	};

	const saveUserInfoData = async () => {
		const storeName = current_store_name;

		const existingFilters = user.data.filters || {};

		// Create or update filters for the current store
		const updatedFilters = {
			...existingFilters,
			[storeName]: {
				strict: {}
			}
		};

		const payload = {
			...profileData,
			emailId: user.data.emailId,
			user_name: user.data.user_name,
			user_id: user.data.user_id,
			is_influencer: user.data.is_influencer,
			_id: user.data._id,
			filters: updatedFilters
		};

		delete payload.brands;
		const requested_brands = [];
		const strictBrands = profileData.brands || [];

		payload.requested_brands = requested_brands;

		// Update strict.brand only if not all brands are selected
		if (profileData.brands.length !== brandList.length) {
			payload.filters[current_store_name].strict.brand = strictBrands;
		} else {
			// If all brands are selected, ensure strict is empty
			payload.filters[current_store_name].strict = {};
		}

		dispatch(
			saveUserInfo({
				userInfo: payload,
				onSuccess: () => {
					if (isLastStep) {
						setSuccessMessage(message); // Show success message UI at the last step
					}
				},
				onFailure: () => {
					notification["error"]({ message: "Unable to save user info" });
				},
			})
		);
	};


	const favoriteBrandsNextStep = () => {
		saveUserInfoData();
		isAdminLoggedIn && nextStep();
	};
	const additionalBrandsNextStep = () => {
		saveTemplatesData();
		if (isAdminLoggedIn) {
			isAdminLoggedIn && nextStep();
		} else {
			isLastStep && setSuccessMessage(message);
		}
	};

	const skipApiCall = () => {
		isLastStep && setSuccessMessage(message);
	};

	const storeReferenceOption = storeData?.plan_settings?.attribute_pool_settings[0]?.store_reference
	const is_editable = storeData?.plan_settings?.attribute_pool_settings[0]?.store_reference[0]?.is_editable;


	const [selectedPool1, setSelectedPool1] = useState(storeData?.store_type?.[0] ?? attributePoolTypes?.store_type);
	const [selectedPool2, setSelectedPool2] = useState(attributePoolTypes?.store_reference);

	const getStepContent = () => {
		switch (currentStep) {
			case 0:
				return (
					<ProfileFavoriteBrands
						nextStep={favoriteBrandsNextStep}
						prevStep={prevStep}
						brandList={brandList}
						profileData={profileData}
						handleChange={handleChange}
					/>
				);
			// case 1:
			// 	return (
			// 		<ProfileAdditionalBrands
			// 			nextStep={additionalBrandsNextStep}
			// 			prevStep={prevStep}
			// 			profileData={profileData}
			// 			handleChange={handleChange}
			// 			isSaving={user.isSavingUserInfo}
			// 			templatesKey={templatesKey}
			// 			updatedTemplates={updatedTemplates}
			// 			handleTemplatesChange={handleTemplatesChange}
			// 			isAdminLoggedIn={isAdminLoggedIn}
			// 		/>
			// 	);
			case 1:
				if (isAdminLoggedIn) {
					return (
						<ProfileAttributes
							nextStep={skipApiCall}
							prevStep={prevStep}
							profileData={profileData}
							handleChange={handleChange}
							isSaving={user.isSavingUserInfo}
							templatesKey={templatesKey}
							updatedTemplates={updatedTemplates}
							handleTemplatesChange={handleTemplatesChange}
							isAdminLoggedIn={isAdminLoggedIn}
							attributePoolData={attributePool}
							attributePoolTypes={attributePoolTypes}
							is_editable={is_editable}
							storeReferenceOption={storeReferenceOption}
							selectedPool1={selectedPool1}
							selectedPool2={selectedPool2}
							setSelectedPool1={setSelectedPool1}
							setSelectedPool2={setSelectedPool2}
							storeData={storeData}
						/>
					);
				}
			default:
				break;
		}
	};


	return (
		<div className='h-full min-h-screen static_page_bg'>
			<div className={styles['profile-header-container']}>
				<AuthHeader hideProfile showBackToStore={user?.data?.filters} />
			</div>
			<div className={`${styles['profile-container']} px-8 lg:px-0`}>
				{!successMessage ? (
					<>
						<div className='w-full mt-4 md:mt-0'>
							{!isMobile ? (
								<Steps
									responsive={false}
									type='navigation'
									size='small'
									current={currentStep}
									onChange={onStepChange}
									className={styles['site-navigation-steps']}>
									{steps.map((step) => (
										<Step title={step} />
									))}
								</Steps>
							) : (
								<div className='border-white border-b flex justify-center pb-2'>
									<div className='text-white bg-blue-500 w-6 h-6 rounded-full text-center'>
										<span className="text-white">{currentStep + 1}</span>
									</div>
									<div className='text-white pl-4'>
										<span className="text-white">{steps[currentStep]}</span>
									</div>
								</div>
							)}
						</div>
						<div className='lg:w-3/5 mx-auto py-14'>{getStepContent()}</div>
					</>
				) : (
					<div>
						<Result
							className='lg:w-2/4 mx-auto'
							status='success'
							title={<span className='text-white'>Success!</span>}
							subTitle={<span className='text-white'>{successMessage}</span>}
							extra={[
								<button
									className='bg-primary rounded text-white py-1 px-6 font-normal text-lg'
									onClick={() =>
										user?.enablePlist
											? navigate("/")
											: navigate("/store/")
									}>
									Go to store
								</button>,
							]}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default CreateStore;
