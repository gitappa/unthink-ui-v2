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
import styles from "./storePage.module.scss";

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
	setisDropDown
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
console.log('isUserLogin',currentUser);

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
			className: styles.headerMenuItemPy2,
			label: (
				<Link
					className={styles.headerMenuLinkText}
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
console.log('isStoreAdminLoggedIn',isStoreAdminLoggedIn );
console.log('isAdminLoggedIn',isAdminLoggedIn);
console.log('isStagingEnv',isStagingEnv);

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
				className: styles.headerMenuItemPy2,
				label: (
					<Link
						className={styles.headerMenuLinkText}
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
					className: styles.headerMenuItemPy2,
					label: (
						<Link
							className={styles.headerMenuLinkTextBase}
							href={PATH_CREATE_COLLECTION}>
							Create {WISHLIST_TITLE}
						</Link>
					),
				},
				{
					key: 'myprofile',
					className: styles.headerMenuItemPy2,
					label: MY_PROFILE && (
						<Link className={styles.headerMenuLinkTextBase} href={MY_PROFILE}>
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
					className: styles.headerMenuItemPy2,
					onClick: () => navigate(ROUTES.MY_PRODUCTS),
					label: (
						<span className={styles.headerMenuSpanTextBase}>
							My Products
						</span>
					),
				});
			}

			if (isAdminLoggedIn) {
				items.push({
					key: 'community',
					className: styles.headerMenuItemPy2,
					onClick: onCategoriesClick,
					label: (
						<span className={styles.headerMenuSpanTextBase}>
							Community
						</span>
					),
				});
			}

			items.push({
				key: 'editprofile',
				className: styles.headerMenuItemPy2,
				label: PROFILE && (
					<Link className={styles.headerMenuLinkTextBase} href={PROFILE}>
						Edit Profile
					</Link>
				),
				onClick: () => {
					PROFILE && navigate(PROFILE);
					showMenu && setShowMenu(false);
				},
			});

			if (enablePlist && !currentUser.trial_user) {
				items.push({
					key: 'store_settings',
					className: styles.headerMenuItemPy2,
					label: (
						<Link
							className={styles.headerMenuLinkTextBase}
							href={CREATE_STORE}>
							Store Settings
						</Link>
					),
					onClick: () => {
						CREATE_STORE && navigate(CREATE_STORE);
						showMenu && setShowMenu(false);
					},
				});
			}

			if (viewLeaderboardEnabled) {
				items.push({
					key: 'view_leaderboard',
					className: styles.headerMenuItemPy2,
					onClick: () => setShowLeaderboard(true),
					label: (
						<span className={styles.headerMenuSpanTextBase}>
							View Leaderboard
						</span>
					),
				});
			}

			if (isAdminLoggedIn) {
				items.push({
					key: 'stats',
					className: styles.headerMenuItemPy2,
					onClick: () => setShowAttributions(true),
					label: (
						<span className={styles.headerMenuSpanTextBase}>
							Stats
						</span>
					),
				});
			}

			if (enable_venly) {
				items.push({
					key: 'wallet',
					className: styles.headerMenuItemPy2,
					onClick: onMyWalletClick,
					label: (
						<span className={styles.headerMenuSpanTextBase}>
							My Wallet
						</span>
					),
				});
			}

			items.push({
				key: 'signout',
				className: styles.headerMenuItemPy2,
				onClick: onSignOut,
				label: (
					<span className={styles.headerMenuSpanTextBase}>
						Sign Out
					</span>
				),
			});
		}

		return items;
	};

	const headerProfileMenu = {
		items: getHeaderProfileMenuItems(),
		className: styles.headerProfileMenuContainer
	};

	return (
		<>
			{/* ----mobile ui start ---- */}
			{!isSwiftlyStyledInstance || !isDoTheLookInstance ? ( // hide for swiftly styled store
				<div
					className={`${styles.mobileBottomNav} ${showChatModal ? styles.mobileBottomNavHidden :showCategories || showPeople || pageUser.user_name !== "RaniZaver" && storeData?.is_searchOptions_enabled  || showRewards || isUserLogin ? styles.mobileBottomNavVisible : 'hidden'}`}>
					{/* this div must have 3 child only to keep the aura center aligned */}
					{showCategories || showPeople ? (
						<>
							{showCategories ? (
								<div
									className={styles.mobileNavItem}
									onClick={onCategoriesClick}>
									<div className={styles.mobileNavIconWrapper}>
										<Image src={bagIcon} alt="Bag" width={20} height={20} />
									</div>
									<span className={styles.mobileNavText}>
										Discover
									</span>
								</div>
							) : null}
							{showPeople && ( // REMOVE people tab code is not required
								<div
									className={styles.mobileNavItem}
									onClick={onPeopleClick}>
									<div className={styles.mobileNavIconWrapper}>
										<Image src={peopleIcon} alt="People" width={20} height={20} />
									</div>
									<span className={styles.mobileNavTextWithPt}>
										People
									</span>
								</div>
							)}
						</>
					) : (
						<div></div>
					)}

					{pageUser.user_name !== "RaniZaver" && storeData?.is_searchOptions_enabled ? (
						<MobileChat onChatClick={onChatClick} />
					) : null}

					{showRewards || isUserLogin ? (
						<>
							{" "}
							{showRewards && (
								<div
									className={styles.mobileNavItem}
									onClick={onEarnRewardsClick}>
									<div className={styles.mobileNavIconWrapper}>
										<Image src={rewardIcon} alt="Reward" width={20} height={20} />
									</div>
									<span className={styles.mobileNavText}>
										Rewards
									</span>
								</div>
							)}
							{isUserLogin ? (
								<div
									className={styles.mobileNavItemCursor}
									onClick={onWishlistClick}>
									<div className={styles.mobileNavIconWrapper}>
										<Image src={wishlistIcon} alt="Wishlist" width={20} height={20} />
									</div>
									<span className={styles.mobileNavTextCapitalize}>
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
				<div className={styles.mobileHeaderSticky}>
					<SamskaraMobileHeader
						showProfileIcon={showProfileIcon}
						setShowMenu={setShowMenu}
					/>
				</div>
			) : null}

			{/* heroesVillains mobile UI */}
			{isHeroesVillainsInstance ? (
				<div className={styles.mobileHeaderSticky}>
					<HeroesVillainsMobileHeader
						showProfileIcon={showProfileIcon}
						setShowMenu={setShowMenu}
					/>
				</div>
			) : null}

			{/* swiftlyStyled mobile UI */}
			{isSwiftlyStyledInstance || isDoTheLookInstance ? (
				<div className={styles.mobileHeaderSticky}>
					<SwiftlyMobileHeader
						showProfileIcon={showProfileIcon && isUserLogin}
						setShowMenu={setShowMenu}
						headerProfileMenu={headerProfileMenu}
					/>
				</div>
			) : null}

			{/* ----mobile ui end ---- */}

			<div className={styles.desktopHeaderSticky}>
				{/* budgettravel header */}
				{isBTInstance && <BudgetTravelHeader />}

				{isSamskaraInstance ||
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
								setisDropDown={setisDropDown}
							/>
						)}
					</>
				) : (
					<div className={styles.desktopHeaderContainer}>
						{/* this div must have 3 child only to keep the aura center aligned */}
						<div className={styles.desktopHeaderLeft}>
							{!is_store_instance && (
								<Link href={ROUTES.STORE_PAGE} className={styles.desktopHeaderLogoLink}>
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
										className={styles.desktopNavItem}
										onClick={onPeopleClick}>
										<span className={styles.desktopNavText}>
											PEOPLE
										</span>
									</div>
								)}

								{showRewards && (
									<div
										className={styles.desktopNavItem}
										onClick={onEarnRewardsClick}>
										<span className={styles.desktopNavTextNoWrap}>
											REWARDS
										</span>
									</div>
								)}
								{showCreate ? (
									<Dropdown
										overlayClassName={styles.dropdownOverlayFixed}
										// disabled={isUserFetching}
										menu={{ items: headerCreateMenu }}
										trigger={["click"]}
										destroyOnHidden>
										<div className={styles.desktopNavItem}>
											<span className={styles.desktopNavTextUppercase}>
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
									<div className={styles.desktopProfileSection}>
										<FaRegHeart
											onClick={onWishlistClick}
											className={styles.desktopWishlistIcon}
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
				<div className={styles.mobileMenuIconContainer}>
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
						className={styles.mobileMenuIcon}
						onClick={() => setShowMenu(true)}
						width={28}
						height={28}
					/>
				</div>
			)}

			{showMenu && (
				<div className={styles.mobileMenuOverlay}>
					<div className={styles.mobileMenuCloseContainer}>
						<CloseOutlined
							className={styles.mobileMenuCloseIcon}
							onClick={() => setShowMenu(false)}
						/>
					</div>
					<div className={styles.mobileMenuContent}>
						{showProfileIcon ? (
							<UserProfileMenu
								isUserFetching={isUserFetching}
								headerProfileMenu={headerProfileMenu}
								currentUser={currentUser}
								isSwiftlyStyledInstance={isSwiftlyStyledInstance}
								isDoTheLookInstance={isDoTheLookInstance}
								isMobileMenu={true}
								onClose={() => setShowMenu(false)}
							/>
						) : null}
					</div>
				</div>
			)}

			<AttributionModal
				attribution={currentUser?.attribution}
				statsModalTitle={
					(currentUser.first_name || currentUser.last_name) &&
					`Audience stats for ${currentUser.first_name || ""} ${currentUser.last_name || ""
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
