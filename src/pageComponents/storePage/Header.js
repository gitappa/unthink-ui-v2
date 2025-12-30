import React, { useEffect, useMemo, useState } from "react";
import { Image, Dropdown, Menu, Typography } from "antd";
import {
	// MenuOutlined,
	CloseOutlined,
	HomeOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "../../helper/useNavigate";

import unthink_favicon from "../../images/staticpageimages/unthink_favicon.png";
import bagIcon from "../../images/chat/header_bag_icon.svg";
import peopleIcon from "../../images/chat/header_people_icon.svg";
import rewardIcon from "../../images/chat/header_reward_icon.svg";
import wishlistIcon from "../../images/chat/header_wishlist_icon.svg";
import menuIcon from "../../images/menu_icon_filled.svg";
// import header_darktheme_toggle from "../../images/chat/header_darktheme_toggle.svg";
// import header_lightTheme_toggle from "../../images/chat/header_lighttheme_toggle.svg";
import avatarImg from "../../images/avatar-black.svg";
import ChatContainer from "./ChatContainer";
import MobileChat from "./MobileChat";
import { setShowChatModal } from "../../hooks/chat/redux/actions";
import { openWishlistModal } from "../wishlist/redux/actions";
import {
	fetchCategoriesReset,
	openMenuItem,
} from "../categories/redux/actions";
// import trackApi from "../../track/api";
import {
	btHeaderOptions,
	CATEGORIES,
	CREATE_STORE,
	EARN_REWARDS,
	MY_PROFILE,
	PATH_CREATE_COLLECTION,
	PEOPLE,
	PROFILE,
	ROUTES,
	STORE_USER_NAME_BUDGETTRAVEL,
	STORE_USER_NAME_HOMECENTRE,
	STORE_USER_NAME_SANTHAY,
	STORE_USER_NAME_FASHIONDEMO,
	WISHLIST_TITLE,
	WISHLISTS_TITLE,
	STORE_USER_NAME_SAMSKARA,
	PATH_ROOT,
	PATH_STORE,
	STORE_USER_NAME_HEROESVILLAINS,
	STORE_USER_NAME_SWIFTLYSTYLED,
	SIGN_IN_EXPIRE_DAYS,
	STORE_USER_NAME_DOTHELOOK,
} from "../../constants/codes";
import Link from 'next/link'; import { useRouter } from 'next/router'; const navigate = (path) => useRouter().push(path);
import {
	checkAndGenerateUserId,
	clearStorages,
	generateSessionId,
	// getBlogCollectionPagePath,
	makeBodyOverflowHidden,
	makeBodyOverflowUnset,
	getIsSellerLoggedIn,
	AdminCheck,
} from "../../helper/utils";
import AttributionModal from "../shared/AttributionModal";
import {
	adminUserId,
	// aura_header_theme,
	enable_venly,
	is_store_instance,
	isStagingEnv,
	super_admin,
	current_store_name,
} from "../../constants/config";
import BudgetTravelHeader from "./BudgetTravelHeader";
import SamskaraHeader from "./SamskaraHeader";
import SamskaraMobileHeader from "./SamskaraMobileHeader";
import HeroesVillainsHeader from "./HeroesVillainsHeader";
import HeroesVillainsMobileHeader from "./HeroesVillainsMobileHeader";
import SwiftlyHeader from "../swiftlyStyled/SwiftlyHeader";
import SwiftlyMobileHeader from "../swiftlyStyled/SwiftlyMobileHeader";
import { UserProfileMenu } from "./UserProfileMenu";
import Leaderboard from "../leaderboard";
import { logoutVenlyUser, openVenlyWallet } from "../../helper/venlyUtils";
// import PageLoader from "../../components/Loader/PageLoader";
import { getUserCollectionsReset, getUserInfo } from "../Auth/redux/actions";
import { connectVenlyWallet } from "../earnedRewardModal/redux/actions";
import Cookies from "js-cookie";
import { FaRegHeart } from "react-icons/fa";

const { Text } = Typography;

// flag to show UI specific to BT store
const isBTInstance =
	is_store_instance && current_store_name === STORE_USER_NAME_BUDGETTRAVEL;

const isSamskaraInstance =
	is_store_instance && current_store_name === STORE_USER_NAME_SAMSKARA;

const isHeroesVillainsInstance =
	is_store_instance && current_store_name === STORE_USER_NAME_HEROESVILLAINS;

const isSwiftlyStyledInstance =
	is_store_instance && current_store_name === STORE_USER_NAME_SWIFTLYSTYLED;

const isDoTheLookInstance =
	is_store_instance && current_store_name === STORE_USER_NAME_DOTHELOOK;

const Header = ({
	disabledOutSideClick,
	showCategories = true,
	showPeople = false, // REMOVE people tab code is not required
	showRewards = true,
	showCreate = true,
	enableBackToAllCollections,
	createCollectionPathState = {},
	config,
	trackCollectionData,
	pageUser,
	isRootPage,
}) => {
	const navigate = useNavigate();
	const [
		showChatModal,
		showWishlistModal,
		currentUser,
		enablePlist,
		isUserLogin,
		isUserFetching,
		isInfluencerFetching,
		// allCollectionsList,
		// associate_seller,
		storeData,
	] = useSelector((state) => [
		state.chatV2.showChatModal,
		state.appState.wishlist.showWishlistModal,
		state?.auth?.user?.data ?? {},
		state?.auth?.user?.enablePlist,
		state?.auth?.user?.isUserLogin,
		state?.auth?.user?.fetching,
		state?.influencer?.fetching,
		// state.auth.user.collections.data,
		// state.store.data.associate_seller,
		state.store.data,
	]);

	const {
		my_products_enable: isMyProductsEnable,
		seller_list: storeSellerList,
		admin_list: admin_list,
	} = storeData;

	const [showAttributions, setShowAttributions] = useState(false);
	const [showLeaderboard, setShowLeaderboard] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	// const [isPageLoading, setIsPageLoading] = useState(false);

	// const userEmail = currentUser?.emailId;

	const dispatch = useDispatch();

	const onChatClick = () => {
		dispatch(setShowChatModal(true));
	};

	useEffect(() => {
		if (showChatModal || showWishlistModal) {
			makeBodyOverflowHidden();
		} else {
			makeBodyOverflowUnset();
		}
	}, [showChatModal, showWishlistModal]);

	const onWishlistClick = () => {
		dispatch(openWishlistModal());
	};

	const onCategoriesClick = () => {
		dispatch(openMenuItem(CATEGORIES));
		if (typeof window !== "undefined") {
			window.scrollTo(0, 0);
		}
	};

	const onPeopleClick = () => {
		dispatch(openMenuItem(PEOPLE));
		if (typeof window !== "undefined") {
			window.scrollTo(0, 0);
		}
	};

	const onEarnRewardsClick = () => {
		dispatch(openMenuItem(EARN_REWARDS));
		if (typeof window !== "undefined") {
			window.scrollTo(0, 0);
		}
	};

	const onSignOut = () => {
		Cookies.set("isGuestLoggedIn", false, { expires: SIGN_IN_EXPIRE_DAYS });
		localStorage.removeItem("adminRolePopupShown", "false");
		// Cookies.set('isGuestSkip', false, { expires: SIGN_IN_EXPIRE_DAYS });
		clearStorages();
		checkAndGenerateUserId(); // generating user id again for guest user after sign out
		generateSessionId(); // generating new session id for guest user after sign out
		// trackApi(); // generate the new user_id for the guest user and add it in the cookie/storage as tid
		showMenu && setShowMenu(false);
		try {
			logoutVenlyUser();
		} catch {
			console.log("wallet error");
		}

		dispatch(getUserCollectionsReset());

		setTimeout(() => {
			dispatch(getUserInfo());
			navigate(is_store_instance ? "/" : "/store");
			dispatch(fetchCategoriesReset()); // clearing fetched categories
		}, 0);
	};

	const aura_header_theme = config.aura_header_theme;

	useEffect(() => {
		if (aura_header_theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [aura_header_theme]);

	const onMyWalletClick = async () => {
		if (!!currentUser.venlyUser?.wallets?.length) {
			openVenlyWallet();
		} else {
			dispatch(
				connectVenlyWallet(function onSuccess() {
					openVenlyWallet();
				})
			);
		}
	};

	const headerCreateMenu = [
		{
			key: 'create_collection',
			className: 'py-2',
			label: (
				<Link
					className='text-white lg:text-black-200'
					href={PATH_CREATE_COLLECTION}>
					COLLECTION
				</Link>
			),
		}
	];

	const isAdminLoggedIn = AdminCheck(
		currentUser,
		current_store_name,
		adminUserId,
		admin_list
	);

	const isSellerLoggedIn = useMemo(
		() =>
			(isAdminLoggedIn ||
				getIsSellerLoggedIn(storeSellerList, currentUser.emailId)) &&
			isMyProductsEnable,
		[isAdminLoggedIn, isMyProductsEnable, storeSellerList, currentUser.emailId]
	);

	const isStoreAdminLoggedIn = useMemo(
		() =>
			is_store_instance &&
			currentUser.user_name &&
			currentUser.user_name === super_admin,
		[currentUser.user_name]
	);

	const showProfileIcon = useMemo(
		() =>
			!is_store_instance ||
			current_store_name === STORE_USER_NAME_SANTHAY ||
			current_store_name === STORE_USER_NAME_HOMECENTRE ||
			current_store_name === STORE_USER_NAME_FASHIONDEMO ||
			current_store_name === STORE_USER_NAME_SWIFTLYSTYLED ||
			current_store_name === STORE_USER_NAME_DOTHELOOK ||
			isUserLogin,
		[isUserLogin]
	);
	console.log(showProfileIcon);

	const viewLeaderboardEnabled = useMemo(
		() =>
			(isStoreAdminLoggedIn || isAdminLoggedIn || isStagingEnv) &&
			!(
				is_store_instance &&
				(current_store_name === STORE_USER_NAME_SANTHAY ||
					current_store_name === STORE_USER_NAME_HOMECENTRE ||
					current_store_name === STORE_USER_NAME_FASHIONDEMO)
			),
		[isStoreAdminLoggedIn, isAdminLoggedIn, isStagingEnv]
	);

	// const isAssociateSeller = useMemo(
	// 	() => associate_seller?.includes(currentUser.emailId),
	// 	[associate_seller, currentUser.emailId]
	// );

	const getHeaderProfileMenuItems = () => {
		const items = [];
		
		if (!isUserLogin) {
			items.push({
				key: 'signin',
				className: 'py-2',
				label: (
					<Link
						className='text-white lg:text-black-200'
						href={
							is_store_instance
								? ROUTES.SIGN_IN_PAGE
								: ROUTES.TRY_FOR_FREE_PAGE
						}>
						Sign In
					</Link>
				),
			});
		} else {
			items.push(
				{
					key: 'createcollections',
					className: 'py-2',
					label: (
						<Link
							className='text-base px-3 text-white lg:text-black-200'
							href={PATH_CREATE_COLLECTION}>
							Create {WISHLIST_TITLE}
						</Link>
					),
				},
				{
					key: 'myprofile',
					className: 'py-2',
					label: MY_PROFILE && (
						<Link className='text-white lg:text-black-200' href={MY_PROFILE}>
							My Public Profile
						</Link>
					),
					onClick: () => {
						MY_PROFILE && navigate(MY_PROFILE);
						showMenu && setShowMenu(false);
					},
				}
			);

			if (is_store_instance && isSellerLoggedIn) {
				items.push({
					key: 'myproducts',
					className: 'py-2',
					onClick: () => navigate(ROUTES.MY_PRODUCTS),
					label: (
						<span className='text-base px-3 text-white lg:text-black-200'>
							My Products
						</span>
					),
				});
			}

			if (isAdminLoggedIn) {
				items.push({
					key: 'community',
					className: 'py-2',
					onClick: onCategoriesClick,
					label: (
						<span className='text-base px-3 text-white lg:text-black-200'>
							Community
						</span>
					),
				});
			}

			items.push({
				key: 'editprofile',
				className: 'py-2',
				label: PROFILE && (
					<Link className='text-white lg:text-black-200' href={PROFILE}>
						Edit Profile
					</Link>
				),
			});

			if (enablePlist && !currentUser.trial_user) {
				items.push({
					key: 'store_settings',
					className: 'py-2',
					label: (
						<Link
							className='text-white lg:text-black-200'
							href={CREATE_STORE}>
							Store Settings
						</Link>
					),
				});
			}

			if (viewLeaderboardEnabled) {
				items.push({
					key: 'view_leaderboard',
					className: 'py-2',
					onClick: () => setShowLeaderboard(true),
					label: (
						<span className='text-base px-3 text-white lg:text-black-200'>
							View Leaderboard
						</span>
					),
				});
			}

			if (isAdminLoggedIn) {
				items.push({
					key: 'stats',
					className: 'py-2',
					onClick: () => setShowAttributions(true),
					label: (
						<span className='text-base px-3 text-white lg:text-black-200'>
							Stats
						</span>
					),
				});
			}

			if (enable_venly) {
				items.push({
					key: 'wallet',
					className: 'py-2',
					onClick: onMyWalletClick,
					label: (
						<span className='text-base px-3 text-white lg:text-black-200'>
							My Wallet
						</span>
					),
				});
			}

			items.push({
				key: 'signout',
				className: 'py-2',
				onClick: onSignOut,
				label: (
					<span className='text-base px-3 text-white lg:text-black-200'>
						Sign Out
					</span>
				),
			});
		}

		return items;
	};

	const headerProfileMenu = {
		items: getHeaderProfileMenuItems(),
		className: 'bg-transparent lg:bg-white border-none flex lg:block flex-col items-center'
	};

	return (
		<>
			{/* ----mobile ui start ---- */}
			{!isSwiftlyStyledInstance || !isDoTheLookInstance ? ( // hide for swiftly styled store
				<div
					className={`h-72 bg-lightgray-101 dark:bg-black-200 dark:text-lightgray-101 z-40 fixed w-full bottom-0 shadow-md flex lg:hidden justify-between md:justify-around 
				items-center px-8 py-2 transform transition-transform duration-300 text-black-103 ${showChatModal ? "translate-y-full" : "-translate-y-0"
						}`}>
					{/* this div must have 3 child only to keep the aura center aligned */}
					{showCategories || showPeople ? (
						<>
							{showCategories ? (
								<div
									className='flex flex-col items-center'
									onClick={onCategoriesClick}>
									<div className='flex'>
										<Image src={bagIcon} alt="Bag" width={20} height={20} />
									</div>
									<span className='text-xs sm:text-sm font-semibold leading-6'>
										Discover
									</span>
								</div>
							) : null}
							{showPeople && ( // REMOVE people tab code is not required
								<div
									className='flex flex-col items-center'
									onClick={onPeopleClick}>
									<div className='flex'>
										<Image src={peopleIcon} alt="People" width={20} height={20} />
									</div>
									<span className='text-xs sm:text-sm font-semibold leading-6 pt-1'>
										People
									</span>
								</div>
							)}
						</>
					) : (
						<div></div>
					)}

					{pageUser.user_name !== "RaniZaver" ? (
						<MobileChat onChatClick={onChatClick} />
					) : null}

					{showRewards || isUserLogin ? (
						<>
							{" "}
							{showRewards && (
								<div
									className='flex flex-col items-center'
									onClick={onEarnRewardsClick}>
									<div className='flex'>
										<Image src={rewardIcon} alt="Reward" width={20} height={20} />
									</div>
									<span className='text-xs sm:text-sm font-semibold leading-6'>
										Rewards
									</span>
								</div>
							)}
							{isUserLogin ? (
								<div
									className='flex flex-col items-center cursor-pointer'
									onClick={onWishlistClick}>
									<div className='flex'>
										<Image src={wishlistIcon} alt="Wishlist" width={20} height={20} />
									</div>
									<span className='text-xs sm:text-sm font-semibold leading-6 capitalize'>
										{WISHLISTS_TITLE}
									</span>
								</div>
							) : null}
						</>
					) : (
						<div></div>
					)}
				</div>
			) : null}

			{/* samskara mobile UI */}
			{isSamskaraInstance ? (
				<div className='z-40 sticky w-full top-0 border-b border-gray-107 text-black-103 lg:hidden'>
					<SamskaraMobileHeader
						showProfileIcon={showProfileIcon}
						setShowMenu={setShowMenu}
					/>
				</div>
			) : null}

			{/* heroesVillains mobile UI */}
			{isHeroesVillainsInstance ? (
				<div className='z-40 sticky w-full top-0 border-b border-gray-107 text-black-103 lg:hidden'>
					<HeroesVillainsMobileHeader
						showProfileIcon={showProfileIcon}
						setShowMenu={setShowMenu}
					/>
				</div>
			) : null}

			{/* swiftlyStyled mobile UI */}
			{isSwiftlyStyledInstance || isDoTheLookInstance ? (
				<div className='z-40 sticky w-full top-0 border-b border-gray-107 text-black-103 lg:hidden'>
					<SwiftlyMobileHeader
						showProfileIcon={showProfileIcon && isUserLogin}
						setShowMenu={setShowMenu}
					/>
				</div>
			) : null}

			{/* ----mobile ui end ---- */}

			<div className='z-40 sticky w-full top-0 lg:shadow-md text-black-103'>
				{/* budgettravel header */}
				{isBTInstance && <BudgetTravelHeader />}

				{isSamskaraInstance ||
					isHeroesVillainsInstance ||
					isSwiftlyStyledInstance ||
					isDoTheLookInstance ? (
					<>
						{isSamskaraInstance && (
							<SamskaraHeader
								disabledOutSideClick={disabledOutSideClick}
								config={config}
								trackCollectionData={trackCollectionData}
								isBTInstance={isBTInstance}
								showProfileIcon={showProfileIcon}
								isUserFetching={isUserFetching}
								headerProfileMenu={headerProfileMenu}
								currentUser={currentUser}
								showChatModal={showChatModal}
							/>
						)}
						{isHeroesVillainsInstance && (
							<HeroesVillainsHeader
								disabledOutSideClick={disabledOutSideClick}
								config={config}
								trackCollectionData={trackCollectionData}
								isBTInstance={isBTInstance}
								showProfileIcon={showProfileIcon}
								isUserFetching={isUserFetching}
								headerProfileMenu={headerProfileMenu}
								currentUser={currentUser}
								showChatModal={showChatModal}
							/>
						)}
						{(isSwiftlyStyledInstance || isDoTheLookInstance) && (
							<SwiftlyHeader
								isRootPage={isRootPage}
								disabledOutSideClick={disabledOutSideClick}
								config={config}
								trackCollectionData={trackCollectionData}
								isBTInstance={isBTInstance}
								showProfileIcon={showProfileIcon && isUserLogin}
								isUserFetching={isUserFetching}
								headerProfileMenu={headerProfileMenu}
								currentUser={currentUser}
								isSwiftlyStyledInstance={isSwiftlyStyledInstance}
								isDoTheLookInstance={isDoTheLookInstance}
							/>
						)}
					</>
				) : (
					<div className='flex justify-between md:justify-around items-center lg:h-72 lg:px-8 lg:py-2 bg-lightgray-101 dark:bg-lightgray-101'>
						{/* this div must have 3 child only to keep the aura center aligned */}
						<div className='hidden lg:flex items-center lg:mr-12 2xl:mr-16'>
							{!is_store_instance && (
								<Link href={ROUTES.STORE_PAGE} className='pr-14 xl:pr-20'>
									<Image src={unthink_favicon} width={29} preview={false} />
								</Link>
							)}
							{/* <HomeOutlined
								className='flex text-2xl cursor-pointer'
								onClick={() =>
									navigate(is_store_instance ? PATH_ROOT : PATH_STORE)
								}
							/> */}
						</div>

						<ChatContainer
							disabledOutSideClick={disabledOutSideClick}
							config={config}
							trackCollectionData={trackCollectionData}
							isBTInstance={isBTInstance}
						/>

						{showCategories ||
							showPeople ||
							showRewards ||
							showCreate ||
							showProfileIcon ? (
							<>
								{/* {showCategories && (
									<div
										className='pl-3 xl:pl-6 lg:flex hidden cursor-pointer'
										onClick={onCategoriesClick}>
										<span className='xl:text-base font-semibold leading-6'>
											DISCOVER
										</span>
									</div>
								)} */}
								{showPeople && ( // REMOVE people tab code is not required
									<div
										className='pl-3 xl:pl-6 lg:flex hidden items-center cursor-pointer'
										onClick={onPeopleClick}>
										<span className='xl:text-base font-semibold leading-6'>
											PEOPLE
										</span>
									</div>
								)}

								{showRewards && (
									<div
										className='pl-3 xl:pl-6 lg:flex hidden items-center cursor-pointer'
										onClick={onEarnRewardsClick}>
										<span className='xl:text-base font-semibold leading-6 whitespace-nowrap'>
											REWARDS
										</span>
									</div>
								)}
								{showCreate ? (
									<Dropdown
										overlayClassName='fixed'
										// disabled={isUserFetching}
										menu={{ items: headerCreateMenu }}
										trigger={["click"]}
										destroyOnHidden>
										<div className='pl-3 xl:pl-6 lg:flex hidden items-center cursor-pointer'>
											<span className='xl:text-base font-semibold leading-6 uppercase'>
												CREATE
											</span>
										</div>
									</Dropdown>
								) : null}

								{showProfileIcon ? (
									// <Dropdown
									// 	overlayClassName='fixed'
									// 	disabled={isUserFetching}
									// 	overlay={headerProfileMenu}
									// 	trigger={["click"]}
									// 	destroyPopupOnHide>
									// 	<div className='pl-3 xl:pl-6 lg:flex items-center hidden cursor-pointer'>
									// 		{currentUser?.user_name && (
									// 			<Text
									// 				title={currentUser?.user_name}
									// 				ellipsis={true}
									// 				className={`m-0 xl:text-base font-semibold leading-6 max-w-102 overflow-hidden overflow-ellipsis whitespace-nowrap product_name tracking-tighter-0.2`}>
									// 				{currentUser?.user_name}
									// 			</Text>
									// 		)}
									// 		<Image
									// 			src={avatarImg}
									// 			preview={false}
									// 			className='pr-1 pl-2'
									// 		/>
									// 	</div>
									// </Dropdown>
									<div className='flex justify-between gap-2 items-center '>
										<FaRegHeart
											onClick={onWishlistClick}
											className='text-black cursor-pointer h-6 w-6 lg:block hidden '
										/>
										<UserProfileMenu
											isUserFetching={isUserFetching}
											headerProfileMenu={headerProfileMenu}
											currentUser={currentUser}
										/>
									</div>
								) : null}
							</>
						) : (
							<UserProfileMenu
								isUserFetching={isUserFetching}
								headerProfileMenu={headerProfileMenu}
								currentUser={currentUser}
							/>
						)}
					</div>
				)}
			</div>

			{/* for profile menu in mobile */}
			{!(isUserFetching || isInfluencerFetching) && (
				<div className='absolute top-3 px-3 flex lg:hidden z-10 w-full justify-end text-black-103'>
					{/* <div
						className='text-lg text-black flex min-h-7 w-7 cursor-pointer bg-** radius- '
						style={{
							borderRadius: "6px",
							background: "rgba(255, 255, 255, 0.5)",
						}}
						onClick={() =>
							navigate(is_store_instance ? PATH_ROOT : PATH_STORE)
						}>
						<HomeOutlined className='m-auto' />
					</div> */}
					<Image
						src={menuIcon}
						alt="Menu"
						className='text-lg text-black flex h-7 w-7 cursor-pointer'
						onClick={() => setShowMenu(true)}
						width={28}
						height={28}
					/>
				</div>
			)}

			{showMenu && (
				<div className='fixed z-50 top-0 left-0 w-full h-full bg-blue-105 overflow-auto'>
					<div className='flex justify-end p-4'>
						<CloseOutlined
							className='text-white text-xl'
							onClick={() => setShowMenu(false)}
						/>
					</div>
					<div className='flex justify-center items-center w-full mt-4 mobile-profile-menu'>
						{showProfileIcon ? (
							<UserProfileMenu
								isUserFetching={isUserFetching}
								headerProfileMenu={headerProfileMenu}
								currentUser={currentUser}
								isSwiftlyStyledInstance={isSwiftlyStyledInstance}
								isDoTheLookInstance={isDoTheLookInstance}
							/>
						) : null}
					</div>
				</div>
			)}

			<AttributionModal
				attribution={currentUser?.attribution}
				statsModalTitle={
					(currentUser.first_name || currentUser.last_name) &&
					`Audience stats for ${currentUser.first_name || ""} ${
						currentUser.last_name || ""
					}:`
				}
				showAttributionModal={showAttributions}
				handleCloseAttributionModal={() => setShowAttributions(false)}
			/>

			{viewLeaderboardEnabled && (
				<Leaderboard
					isOpen={showLeaderboard}
					handleClose={() => setShowLeaderboard(false)}
				/>
			)}

			{/* <PageLoader isLoading={isPageLoading} /> */}
		</>
	);
};

export default Header;
