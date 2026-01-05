import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";

import CategoryCard from "./CategoryCard";
import PeopleCard from "./PeopleCard";
import useWindowSize from "../../helper/useWindowSize";
import { clearStorages, AdminCheck } from "../../helper/utils";
import {
	setIsRegistered,
	setTTid,
	setUserId,
} from "../../helper/getTrackerInfo";
import { adminUserId, current_store_name, is_store_instance } from "../../constants/config";
import {
	category_widget_type_influencer_widget,
	category_widget_type_suggestion_chip,
	category_widget_type_super_admin_seller_widget,
	MY_PROFILE,
} from "../../constants/codes";
import { authAPIs, profileAPIs } from "../../helper/serverAPIs";
import {
	deregisterAppLoader,
	registerAppLoader,
} from "../appLoader/redux/actions";
import { updateCategoriesDataInfluencerWidgetStarred } from "./redux/actions";
import { getStoreData, setStoreData } from "../store/redux/actions";

const CategoriesList = ({
	category,
	onCategoryClick,
	title,
	fnFetchCategories,
}) => {
	const [showMoreOpen, setShowMoreOpen] = useState(false);
	const [
		authUser,
		store_id,
		seller_list,
		admin_list,
		creators,
		sellerDetails,
		associate_seller,
		community_properties,
	] = useSelector((state) => [
		state.auth.user.data,
		state.store.data.store_id,
		state.store.data.seller_list || [],
		state.store.data.admin_list || [],
		state.store.data.creators || [],
		state.store.data.sellerDetails || {},
		state.store.data.associate_seller || [],
		state.store.data.community_properties || {},
	]);
	const { width } = useWindowSize();

	const dispatch = useDispatch();

	const tagsCountToShow = useMemo(() => 20, []);

	// flag for show peopleCard specific view
	const showPeopleCardView = useMemo(
		() =>
			[
				category_widget_type_influencer_widget,
				category_widget_type_super_admin_seller_widget,
			].includes(category.widget_type),
		[category.widget_type]
	);

	const productsCountToShow = useMemo(() => {
		// 1536 - 6
		// 1280 - 5
		// 768 - 4
		// 640 - 6

		if (width) {
			if (width >= 1536) {
				return showPeopleCardView ? 7 : 6;
			} else if (width >= 1280) {
				return showPeopleCardView ? 6 : 5;
			} else if (width >= 768) {
				return 4;
			} else if (width >= 640) {
				return 6;
			} else {
				return 4;
			}
		}

		return null;
	}, [width, showPeopleCardView]);


	const isAdminLoggedIn = AdminCheck(authUser, current_store_name, adminUserId, admin_list);


	// FOR ADMIN USE ONLY
	// SHOULD BE REMOVED LATER WITH BETTER AUTHENTICATION
	// ALLOWING ADMIN TO LOGIN AS ANY USER
	// START
	const handleSignInAsInfluencer = useCallback(
		(e, infUserId) => {
			if (isAdminLoggedIn) {
				e.stopPropagation();

				clearStorages(); // logout current user

				setTTid(infUserId); // set influencer user id to login with as that user
				setIsRegistered(true); // setting is registered browser storage
				setUserId(infUserId); // set influencer user id to login with as that user
				localStorage.removeItem('adminRolePopupShown')
				if (window && window.location) {
					// redirecting user to store page and refreshing page to reload everything with new user
					window.location.href = MY_PROFILE;
				}
			}
		},
		[isAdminLoggedIn]
	);
	// END

	// FOR ADMIN USE ONLY
	// ALLOWING ADMIN TO STAR/UNSTAR ANY USER
	// START
	const handleStarInfluencer = useCallback(
		async (e, infUser) => {
			if (isAdminLoggedIn) {
				e.stopPropagation();

				try {
					dispatch(registerAppLoader("handleStarInfluencerUnderCategories"));

					if (is_store_instance && infUser.emailId && infUser.user_name) {
						const starred = !seller_list.includes(infUser.emailId);

						let sellerList;
						let associateSeller;
						// let newSellerDetails = { ...sellerDetails };
						if (starred) {
							sellerList = seller_list.concat(infUser.emailId);
							associateSeller = associate_seller.concat(infUser.emailId);
							// newSellerDetails[infUser.user_name] = infUser.sellerDetails;
						} else {
							sellerList = seller_list.filter((s) => s !== infUser.emailId);
							associateSeller = associate_seller.filter(
								(a) => a !== infUser.emailId
							);
							// newSellerDetails[infUser.user_name] = undefined;
						}

						const payload = {
							seller_list: sellerList,
							associate_seller: associateSeller,
							// sellerDetails: newSellerDetails,
						};
						const response = await authAPIs.updateStoreDetailsAPICall(
							store_id,
							payload
						);
						if (response.data.status_code === 200 && response.data.data) {
							message.success(
								starred
									? "User has been marked as seller"
									: "Seller status removed from user"
							);
							dispatch(setStoreData(response.data.data)); // updating latest store details from API response
							fnFetchCategories();
						} else {
							message.error("Unable to update. Please try again later");
						}
					} else {
						const starred = !infUser.starred;
						const payload = {
							query: {
								user_id: [infUser.key],
							},
							starred,
						};
						const response = await profileAPIs.starUserAPICall({ payload });
						if (response.data.status_code === 200) {
							message.success(
								starred
									? "User has been marked as starred"
									: "User has been un-starred"
							);
							dispatch(
								updateCategoriesDataInfluencerWidgetStarred(
									infUser.key,
									starred
								)
							);
							fnFetchCategories();
						} else {
							message.error("Unable to update. Please try again later");
						}
					}
				} catch (error) {
					message.error("Unable to update. Please try again later");
				} finally {
					dispatch(deregisterAppLoader("handleStarInfluencerUnderCategories"));
				}
			}
		},
		[isAdminLoggedIn, seller_list, associate_seller]
	);
	// END

	const handleFeatureCreatorInfluencer = useCallback(
		async (e, infUser) => {
			if (isAdminLoggedIn) {
				e.stopPropagation();

				try {
					dispatch(
						registerAppLoader("handleFeatureCreatorInfluencerUnderCategories")
					);

					const isCreator = !creators.includes(infUser.emailId);

					let creatorList;

					if (isCreator) {
						creatorList = creators.concat(infUser.emailId);
					} else {
						creatorList = creators.filter((s) => s !== infUser.emailId);
					}

					const payload = {
						creators: creatorList,
					};

					const response = await authAPIs.updateStoreDetailsAPICall(
						store_id,
						payload
					);
					if (response.data.status_code === 200 && response.data.data) {
						message.success(
							isCreator
								? "User has been marked as creator"
								: "User removed from creators"
						);
						dispatch(setStoreData(response.data.data)); // updating latest store details from API response
						fnFetchCategories();
					} else {
						message.error("Unable to update. Please try again later");
					}
				} catch (error) {
					message.error("Unable to update. Please try again later");
				} finally {
					dispatch(
						deregisterAppLoader("handleFeatureCreatorInfluencerUnderCategories")
					);
				}
			}
		},
		[isAdminLoggedIn, creators, fnFetchCategories]
	);

	return (
		<div className='bg-gray-50 rounded-xl'>
			{title && (
				<div className='p-4 flex justify-between items-center'>
					<h2 className='text-xl lg:text-xl-2 font-bold capitalize'>{title}</h2>
					{/* <button className='h-10 px-4 bg-indigo-600 text-white rounded-xl flex items-center font-bold'>
						<PlusOutlined className='mr-2.5' />
						Create New
					</button> */}
				</div>
			)}
			{category?.next_level?.length ? (
				<div className='pt-8 pb-6'>
					{/* show UI in chip format if widget type=suggestion_chip otherwise show in card and title format */}
					{category.widget_type === category_widget_type_suggestion_chip ? (
						<>
							<div className='flex flex-wrap justify-center'>
								{category.next_level
									.slice(
										0,
										category.next_level.length > tagsCountToShow &&
											!showMoreOpen
											? tagsCountToShow
											: category.next_level.length
									)
									.map((data) => {
										if (data.title) {
											return (
												<div
													key={data.title}
													className='cursor-pointer rounded-full shadow-m mx-4 my-5 w-max bg-slate-200'
													onClick={() => onCategoryClick(data)}>
													<h3
														level={5}
														className='m-0 px-3 py-0.75 font-medium text-base md:text-xl text-black-103'>
														{data.title}
													</h3>
												</div>
											);
										}
									})}
							</div>
							<div>
								{category.next_level.length > tagsCountToShow ? (
									<ShowMoreSection
										showMoreOpen={showMoreOpen}
										setShowMoreOpen={setShowMoreOpen}
									/>
								) : null}
							</div>
						</>
					) : (
						<>
							<div
								className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${showPeopleCardView
									? "xl:grid-cols-6 2xl:grid-cols-7"
									: "xl:grid-cols-5 2xl:grid-cols-6"
									} gap-4 lg:gap-6 px-4 lg:px-6 transition-all ease-in duration-300`}>
								{productsCountToShow
									? category.next_level
										.slice(
											0,
											category.next_level.length > productsCountToShow &&
												!showMoreOpen
												? productsCountToShow
												: category.next_level.length
										)
										.map((data) => {
											if (data.title) {
												if (showPeopleCardView) {
													return (
														<PeopleCard
															key={data.title}
															categoryData={data}
															starred={
																is_store_instance
																	? seller_list.includes(data.emailId)
																	: data.starred
															}
															isCreator={creators.includes(data.emailId)}
															handleCategoryClick={() =>
																onCategoryClick(data)
															}
															isAdminLoggedIn={isAdminLoggedIn}
															handleSignInAsInfluencer={
																handleSignInAsInfluencer
															}
															handleStarInfluencer={handleStarInfluencer}
															handleFeatureCreatorInfluencer={
																handleFeatureCreatorInfluencer
															}
															communityProperties={community_properties}
														/>
													);
												} else {
													return (
														<CategoryCard
															key={data.title}
															categoryData={data}
															handleCategoryClick={() =>
																onCategoryClick(data)
															}
														/>
													);
												}
											}
											return null;
										})
									: null}
							</div>
							<div>
								{category.next_level.length > productsCountToShow ? (
									<ShowMoreSection
										showMoreOpen={showMoreOpen}
										setShowMoreOpen={setShowMoreOpen}
									/>
								) : null}
							</div>
						</>
					)}
				</div>
			) : (
				<h2 className='text-center mt-16 text-xl'>Categories not found</h2>
			)}
		</div>
	);
};

export default React.memo(CategoriesList);

const ShowMoreSection = ({ showMoreOpen, setShowMoreOpen }) => (
	<div className='mt-12 text-center'>
		{showMoreOpen ? (
			<button
				className='text-indigo-600 text-xl font-medium'
				onClick={() => setShowMoreOpen(false)}>
				Show less
			</button>
		) : (
			<button
				className='text-indigo-600 text-xl font-medium'
				onClick={() => setShowMoreOpen(true)}>
				View more
			</button>
		)}
	</div>
);
