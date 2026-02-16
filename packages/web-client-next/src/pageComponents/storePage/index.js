import React, {
	useEffect,
	useMemo,
	useState,
	useCallback,
	useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "../../helper/useNavigate.js";
import { useRouter } from "next/router";
import { Spin } from "antd";
import { ArrowLeftOutlined, Loading3QuartersOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

import Header from "./Header.js";
// import ProfileCollection from "../Influencer/ProfileCollection";
// import ChatProducts from "./ChatProducts";
import useWindowSize from "../../helper/useWindowSize.js";
import useTheme from "../../hooks/chat/useTheme.js";
import Recommendations from "../recommendations/Recommendations.js";
import WishListModal from "../wishlist/WishListModal.js";
import SimilarProducts from "../similarProducts/SimilarProducts.js";
import {
	CHAT_TYPE_CHAT,
	FETCH_COLLECTIONS_PRODUCT_LIMIT,
	MY_PROFILE,
	PATH_SIGN_IN,
	STORE_USER_NAME_BUDGETTRAVEL,
	STORE_USER_NAME_SAMSKARA,
	STORE_USER_NAME_SANTHAY,
	PRODUCT_SORT_OPTIONS,
	STORE_USER_NAME_HEROESVILLAINS,
	STORE_USER_NAME_SWIFTLYSTYLED,
	PRODUCT_SORT_OPTIONS_MY_PRODUCTS,
	STORE_USER_NAME_DOTHELOOK,
	STORE_USER_NAME_FASHIONDEMO,

	// STORE_USER_NAME_TAKEWALKS,
} from "../../constants/codes.js";
import { THEME_ALL } from "../../constants/themeCodes.js";

import {
	clearInfluencerCollections,
	getInfluencerCollection,
	getInfluencerCollections,
	getInfluencerCollectionsSuccess,
	getInfluencerInfo,
} from "../Influencer/redux/actions.js";
import { getCreatorCollection, getSingleUserCollection, getUserCollection, getUserCollections, getUserInfo } from "../Auth/redux/actions.js";
// import CollectionPageContent from "../collectionPage/CollectionPageContent";
import {
	shared_profile_on_root,
	enable_recommendations,
	is_store_instance,
	isStagingEnv,
	adminUserId,
	super_admin,
	current_store_name,
	current_store_id,
} from "../../constants/config.js";
import AllBlogPages from "../collectionPage/AllBlogPages.js";
import PageDetailsComponent from "./PageDetails.js";
import ProductDetails from "./ProductDetails.js";
import QAndAComponent from "../../components/QAndAComponent/QAndAComponent.js";
import CollectionCarouselContainer from "../Influencer/CollectionCarouselContainer.js";
import { fetchCategories, openMenuItem } from "../categories/redux/actions.js";
import SingleCollectionProductList from "../collectionPage/SingleCollectionProductList.js";
import CreatorsListView from "../creatorsListView/CreatorsListView.jsx";
import MaintenancePage from "../MaintenancePage.jsx";
import Breadcrumbs from "./Breadcrumbs.js";
import {
	checkIsFavoriteCollection,
	checkIsPublishedCollection,
	generateShareV2Url,
	getCurrentPath,
	getIsSellerLoggedIn,
	getIsCollectionPage,
	getIsRootPage,
	getIsSharedPage,
	getIsStorePage,
	AdminCheck,
	setCookie,
} from "../../helper/utils.js";
import { gTagCollectionPageView } from "../../helper/webTracker/gtag.js";

import {
	getTTid,
	isEnableAICookie,
	isEnableAICookieFalse,
	setTTid,
} from "../../helper/getTrackerInfo.js";

import styles from './storePage.module.scss';
import SwiftlyStyledIndex from "../swiftlyStyled/index.js";
import { fetchCustomProducts } from "../customProducts/redux/actions.js";
import AdminInfluencerPopup from "../../components/AdminInfluencerPopup/AdminInfluencerPopup.js";
import Cookies from "js-cookie";
import DeliveryDetails from "../DeliveryDetails/DeliveryDetails.js";
import FailureUrl from "../../components/singleCollection/FailureUrl.js";
import SuccessUrl from "../../components/singleCollection/SuccessUrl.js";
import HomePageNew from "../../components/singleCollection/HomePageNew.js";
import DroppWallet from "../../components/DroppWallet.js";

const PeopleList = dynamic(() => import("../people/PeopleList.js"), {
	ssr: false,
	loading: () => (
		<div className={styles.loadingIndicator}>
			<Spin />
		</div>
	),
});
const Categories = dynamic(() => import("../categories/Categories.js"), {
	ssr: false,
	loading: () => (
		<div className={styles.loadingIndicator}>
			<Spin />
		</div>
	),
});
const EarnRewards = dynamic(() => import("../rewards/EarnRewards.js"), {
	ssr: false,
	loading: () => (
		<div className={styles.loadingIndicator}>
			<Spin />
		</div>
	),
});
const ReviewCollection = dynamic(() => import("../tryForFree/ReviewCollection.js"), {
	ssr: false,
	loading: () => (
		<div className={styles.loadingIndicator}>
			<Spin />
		</div>
	),
});

const CreateFreeCollection = dynamic(
	() => import("../tryForFree/CreateFreeCollection.js"),
	{
		ssr: false,
		loading: () => (
			<div className={styles.loadingIndicator}>
				<Spin />
			</div>
		),
	}
);

const CustomProducts = dynamic(
	() => import("../customProducts/CustomProducts.js"),
	{
		ssr: false,
		loading: () => (
			<div className={styles.loadingIndicator}>
				<Spin />
			</div>
		),
	}
);

const LoadingIndicator = () => {
	return (
		<div className={styles.loadingIndicator}>
			<Spin />
		</div>
	);
};

const getBackToProfileTitle = (firstName = "", lastName = "") => {
	if (firstName || lastName) {
		return `to ${firstName} ${lastName}`;
	}

	return "to Profile";
};

// filter the collection // collection should have some products and should have published status
const filterCollToShowPublic = ({
	collections,
	checkMinProductsCount = true,
	showStoreCollection = false,
	authUserName,
	isAssociateSeller = false,
	profile_noProducts_collection = false,
}) =>
	collections.filter((cl) =>
		// If profile_noProducts_collection is true → always allow
		profile_noProducts_collection
			? true
			: (
				!checkMinProductsCount ||
				!!cl.product_lists?.length ||
				!!cl.sponsor_details?.product_list?.length
			)
	);

const StorePageWrapper = (props) => {
	const navigate = useNavigate();
	const router = useRouter();
	const [
		chatProductsData,
		showChatModal,
		authUser,
		isUserLogin,
		authUserIsFetching,
		userNotFound,
		influencerUser,
		influencerUserIsFetching,
		influencerUserError,
		authUserCollections,
		authUserCollectionsParams,
		authUserCollectionsIsFetching,
		influencerUserCollections,
		influencerUserCollectionsIsFetching,
		influencerUserCollectionsParams,
		showCategories,
		showPeople,
		showEarnRewards,
		storeData,
		showWishlistModal,
		authUserCollectionsCount,
		influencerUserCollectionsCount,
		singleCollections
	] = useSelector((state) => [
		state.chatV2.chatProductsData,
		state.chatV2.showChatModal,
		state.auth.user.data,
		state.auth.user.isUserLogin,
		state.auth.user.isFetching,
		state.auth.user.userNotFound,
		state.influencer.data,
		state.influencer.isFetching,
		state.influencer.error,
		state.auth.user.collections.data,
		state.auth.user.collections.params,
		state.auth.user.collections.isFetching,
		state.influencer.collections.data,
		state.influencer.collections.isFetching,
		state.influencer.collections.params,
		state.categories.showCategories,
		state.appState.people.showPeople,
		state.appState.rewards.showEarnRewards,
		state.store.data,
		state.appState.wishlist.showWishlistModal,
		state.auth.user.collections.count,
		state.influencer.collections.count,
		state.auth.user.singleCollections.data
	]);

	const [selectedSortOption, setSelectedSortOption] = useState();
	const [selectedSortOptionProduct, setSelectedSortOptionProduct] = useState();

	// console.log("authUserCollections", authUser);
	// console.log("singleCollections", singleCollections);


	const dispatch = useDispatch();
	const { theme, setTheme, themeCodes, resetTheme } = useTheme();

	const overlay = true; // used to switch overlay for aura search result

	// const isMyProfilePage = getCurrentPath().startsWith(MY_PROFILE); // REMOVE

	// const isSharedPage = getIsSharedPage(); // REMOVE

	// const isStorePage = getIsStorePage(); // REMOVE

	// const isCollectionPage = getIsCollectionPage(); // REMOVE

	// const isRootPage = getIsRootPage(); // REMOVE



	const {
		user_id = router.query.user_id,
		collection_id = router.query.collection_id,
		isCollectionReviewPage = false,
		isCreateFreeCollectionPage = false,
		isMyProfilePage = false,
		isSharedPage = false,
		isStorePage = false,
		isCollectionPage = false,
		isRootPage = false,
		isCustomProductsPage = false,
		isProductDetailPage = false,
		isThemePage = false,
		isCartPage = false,
		serverData,
		isFailedPage,
		isSuccessPage,
		isHomepage,
	} = props;
	console.log(collection_id);
	const [isDropDown, setisDropDown] = useState(false)
	const {
		my_products_enable: isMyProductsEnable,
		seller_list: storeSellerList,
		associate_seller,
		admin_list: admin_list,
		profile_noProducts_collection
	} = storeData;

	const config = serverData.config;

	const showProfileView =
		isMyProfilePage || isSharedPage || isCollectionPage || isThemePage;

	const isSignInRequired = useMemo(() => isStorePage, [isStorePage]); // redirecting user to sign in page if user is not logged in

	const { collection_name: collection_path = router.query.collection_name, params: page_params } = props;

	const isSingleCollectionSharedPage = useMemo(
		() => !!(collection_id || collection_path),
		[collection_id, collection_path]
	);
	console.log(collection_path);

	const isStoreHomePage = useMemo(
		() => is_store_instance && isRootPage && !!shared_profile_on_root,
		[is_store_instance, isRootPage, shared_profile_on_root]
	);


	const user_name = useMemo(
		() =>
			props.user_name ||
			router.query.user_name ||
			(is_store_instance &&
				(isThemePage || isRootPage || (isSingleCollectionSharedPage && !user_id)) // to take the influencer from the store env
				? shared_profile_on_root
				: ""),
		[
			props.user_name,
			router.query.user_name,
			isRootPage,
			isSingleCollectionSharedPage,
			user_id,
			isThemePage,
		]
	);

	const isPageOwner = useMemo(
		() =>
			(user_id && authUser.user_id === user_id) ||
			(authUser.user_id === singleCollections.user_id) ||
			(user_name && authUser.user_name === user_name) ||
			isMyProfilePage,
		[user_id, user_name, authUser.user_id, authUser.user_name, isMyProfilePage, singleCollections.user_id]
	);




	const pageUser = useMemo(() => {
		// if (isPageOwner) {
		if (isMyProfilePage || (isPageOwner && isSingleCollectionSharedPage)) {
			return authUser;
		} else if (
			(user_id && influencerUser.user_id === user_id) ||
			(user_name && influencerUser.user_name === user_name)
		) {
			return influencerUser;
		} else {
			return {};
		}
	}, [
		isPageOwner,
		authUser,
		influencerUser,
		user_id,
		user_name,
		influencerUser.user_id,
		influencerUser.user_name,
	]);



	const { data: pageUserCollections, params } = useMemo(() => {
		if (
			// isPageOwner ||
			// (is_store_instance &&
			// 	(isRootPage ||
			// 		(isSingleCollectionSharedPage &&
			// 			user_name === shared_profile_on_root &&
			// 			!user_id)) &&
			// 	authUser.user_name === shared_profile_on_root)
			isMyProfilePage ||
			(isPageOwner && isSingleCollectionSharedPage)
		) {
			if (
				(isRootPage || isSharedPage || isMyProfilePage || isHomepage) &&
				!isSingleCollectionSharedPage
			) {
				return {

					data: filterCollToShowPublic({
						collections: authUserCollections,
						checkMinProductsCount: !isSingleCollectionSharedPage,
						authUserName: authUser.user_name,
						// showStoreCollection: is_store_instance && !isStoreHomePage,
						isAssociateSeller: !!associate_seller?.includes(authUser.emailId),
						profile_noProducts_collection
					}),
					params: authUserCollectionsParams,
				};
			} else {
				return {
					data: authUserCollections,
					params: authUserCollectionsParams,
				};
			}
		} else {
			return {
				data: filterCollToShowPublic({
					collections: influencerUserCollections,
					checkMinProductsCount: !isSingleCollectionSharedPage,
					// showStoreCollection: is_store_instance && !isStoreHomePage,
					authUserName: authUser.user_name,
					isAssociateSeller: !!associate_seller?.includes(
						influencerUser.emailId
					),
					profile_noProducts_collection
				}),
				params: influencerUserCollectionsParams,
			};
		}
	}, [
		isPageOwner,
		authUser.user_name,
		isRootPage,
		isMyProfilePage,
		user_id,
		user_name,
		isSingleCollectionSharedPage,
		authUserCollections,
		authUserCollections.length,
		influencerUserCollections,
		influencerUserCollections.length,
		isHomepage
	]);

	console.log("pageUserCollections", pageUserCollections);


	const [currentPage, setCurrentPage] = useState(0)
	const [ipp, setIpp] = useState(10)
	const [allCollectionData, setAllCollectionData] = useState(pageUserCollections); // working 
	const [isLoading, setIsLoading] = useState(false);

	console.log('allCollectionData', allCollectionData);

	const currentSingleCollection = useMemo(
		() =>
			allCollectionData.find(
				(collection) =>
					(collection_id && collection._id === collection_id) ||
					(collection_path && collection.path === collection_path)
			) || {},
		[pageUserCollections, collection_id, collection_path, allCollectionData]
	);
	console.log('currentSingleCollection', currentSingleCollection);


	const [sharePageUrl, setSharePageUrl] = useState('');
	console.log('sharepageUrls', sharePageUrl);


	// set collection theme from params
	useEffect(() => {
		// Set share URL on client side only
		if (typeof window !== 'undefined') {
			const url = isMyProfilePage
				? generateShareV2Url(authUser?.user_id, authUser?.user_name)
				: `${window.location?.origin}${getCurrentPath()}`;
			setSharePageUrl(url);
		}
	}, [authUser?.user_id, authUser?.user_name, isMyProfilePage]);

	useEffect(() => {
		if (page_params?.collection_theme) {
			if (theme !== page_params?.collection_theme) {
				setTheme(page_params.collection_theme);
			}
		} else if (theme) {
			resetTheme();
		}
	}, [page_params?.collection_theme]);

	useEffect(() => {
		if (isSignInRequired && userNotFound && !authUserIsFetching) {
			navigate(PATH_SIGN_IN);
		}
	}, [isSignInRequired, userNotFound, authUserIsFetching]);

	useEffect(() => {
		if (
			user_name ||
			user_id
			// && !(authUser.user_name && user_name && authUser.user_name === user_name)
		) {
			if (
				!influencerUserIsFetching &&
				!influencerUserError &&
				((user_name && influencerUser.user_name !== user_name) ||
					(user_id && user_id !== influencerUser.user_id))
			) {
				dispatch(clearInfluencerCollections());
				dispatch(getInfluencerInfo({ user_name, user_id }));
			}
		}
	}, [
		user_name,
		user_id,
		authUser.user_name,
		influencerUser,
		influencerUserIsFetching,
		influencerUserError,
	]);

	// console.log(isSingleCollectionSharedPage);
	// console.log(authUser.user_id);
	// console.log(authUserCollections.length);
	// console.log(collection_id);
	// console.log("collection_path", collection_path);


	const fetchCollection = useCallback(
		(selectedOption) => {
			if (isSingleCollectionSharedPage && !showWishlistModal) {
				if (
					authUser.user_id &&
					authUserCollections.length &&
					currentSingleCollection._id
				) {
					console.log('hello worldss');

					dispatch(
						getSingleUserCollection({
							_id: currentSingleCollection._id,
							product_sort_by: selectedOption?.product_sort_by || undefined,
							product_sort_order:
								selectedOption?.product_sort_order || undefined,
						})

					);
				} else {

					console.log("collection_path", collection_path);

					dispatch(
						getInfluencerCollection({
							collection_id,
							path: collection_path,
							isStoreHomePage,
							product_sort_by: selectedOption?.product_sort_by || undefined,
							product_sort_order:
								selectedOption?.product_sort_order || undefined,
						})
					);
				}
			}
		},
		[
			authUser.user_id,
			authUserCollections.length,
			currentSingleCollection._id,
			showWishlistModal,
			collection_path
		]
	);
	// const isFirstRender = useRef(true);

	// useEffect(() => {
	// 	if (isFirstRender.current) {
	// 		console.log("First Render");
	// 		isFirstRender.current = false;
	// 	} else if (!showWishlistModal && isSingleCollectionSharedPage) {
	// 		fetchCollection();
	// 	}
	// }, [showWishlistModal]);

	// my product section sorting function
	const fetchCollectionProduct = useCallback((selectedOption) => {
		if (is_store_instance) {
			dispatch(fetchCustomProducts({
				product_sort_by: selectedOption?.product_sort_by || undefined,
				product_sort_order: selectedOption?.product_sort_order || undefined,
			}));
		}
	}, [fetchCustomProducts]);

	// influencer collections
	// const isFirstRender = useRef(true);

	useEffect(() => {
		// Prevent the first render from dispatching incorrect user_id
		// if (isFirstRender.current) {
		// 	isFirstRender.current = false;
		// 	return;
		// }
		console.log('dfdcdgd', isSharedPage);

		if (
			(isSharedPage) &&
			(influencerUser.user_name || influencerUser.user_id) &&
			!isSingleCollectionSharedPage
		) {
			// Clear previous collection data before fetching new data
			dispatch(clearInfluencerCollections());

			dispatch(
				getInfluencerCollections({
					user_id:
						!page_params?.collection_theme && influencerUser.user_id
							? influencerUser.user_id
							: undefined,
					isStoreHomePage,
					collection_theme:
						page_params?.collection_theme &&
							page_params?.collection_theme !== THEME_ALL
							? page_params.collection_theme
							: undefined,
					product_limits: 8,
					ipp: ipp,
					current_page: currentPage
				})
			);
		}
	}, [
		influencerUser,
		isSharedPage,
		influencerUser.user_id,
		page_params?.collection_theme,
		currentPage,
		isRootPage
	]);


	useEffect(() => {
		if (
			(!isRootPage && (isThemePage || isHomepage || isCollectionReviewPage))
		) {
			// Clear previous collection data before fetching new data
			dispatch(clearInfluencerCollections());
			dispatch(
				getInfluencerCollections({
					user_id:
						influencerUser.user_id && !page_params?.collection_theme && !authUser
							? influencerUser.user_id
							: undefined,
					isStoreHomePage,
					collection_theme:
						page_params?.collection_theme &&
							page_params?.collection_theme !== THEME_ALL
							? page_params.collection_theme
							: undefined,
					product_limits: 10,
					ipp: ipp,
					current_page: currentPage
				})
			)
		}
	}, [
		currentPage,
		isThemePage,
		isRootPage,
		isHomepage,
		isCollectionReviewPage,
	]);

	useEffect(() => {
		if (!currentSingleCollection.detailed) {
			fetchCollection();
		}
	}, [currentSingleCollection.detailed, currentSingleCollection._id, collection_path]);





	useEffect(() => {
		if (isRootPage) {
			sessionStorage.removeItem("widgetHeader");
		}
	}, [isRootPage]);


	useEffect(() => {
		if (authUser.user_id) {
			if (showWishlistModal) {
				// Always call API when wishlist popup opens
				dispatch(
					getUserCollections({
						product_limits: FETCH_COLLECTIONS_PRODUCT_LIMIT,
						summary: true
					})
				);
			}
			// If popup is closed & in My Profile Page, call My Profile API
			if (isMyProfilePage && !showWishlistModal) {
				dispatch(
					getUserCollections({
						product_limits: FETCH_COLLECTIONS_PRODUCT_LIMIT,
						Mystatus: "published",
						ipp: ipp,
						current_page: currentPage
					})
				);
			}
		}
	}, [authUser.user_id, showWishlistModal, isMyProfilePage, currentPage]);


	useEffect(() => {
		if (currentPage === 0) {
			setAllCollectionData(pageUserCollections);
		} else {
			setAllCollectionData(prevCollections => {
				const newData = pageUserCollections.filter(newItem =>
					!prevCollections.some(oldItem => oldItem._id === newItem._id)
				);
				return [...prevCollections, ...newData];
			});
		}
		setIsLoading(false);
	}, [pageUserCollections]);

	const onShowMoreClick = () => {
		if (authUserCollectionsCount !== 10 && influencerUserCollectionsCount !== 10) {
			console.log("Stopping Show More, as last fetched data is less than 10.");
			return;
		}
		setIsLoading(true);
		// Dummy API fetch simulation (Replace with your actual API call)
		setTimeout(() => {
			setCurrentPage(prevPage => prevPage + 1);
		}, 0);
	};


	// set Recommended product_sort_option when change collection:
	useEffect(() => {
		setSelectedSortOption(PRODUCT_SORT_OPTIONS[0]);
	}, [currentSingleCollection._id]);

	// set Recommended product_sort_option when change products for MY PRODUCTS
	useEffect(() => {
		setSelectedSortOptionProduct(PRODUCT_SORT_OPTIONS_MY_PRODUCTS[0]);
	}, [currentSingleCollection._id]);


	// onchange function of product sort in single collection page
	const handleSortOptionChange = useCallback(
		(value) => {
			const selectedOption = PRODUCT_SORT_OPTIONS?.find(
				(item) => item.id === value
			);
			setSelectedSortOption(selectedOption);
			fetchCollection(selectedOption);
		},
		[selectedSortOption, fetchCollection]
	);


	// onchange function of product sort in single collection page in MY PRODUCTS
	const handleSortOptionChangeProduct = useCallback(
		(value) => {
			const selectedOption = PRODUCT_SORT_OPTIONS_MY_PRODUCTS?.find(
				(item) => item.id === value
			);
			setSelectedSortOptionProduct(selectedOption);
			fetchCollectionProduct(selectedOption);
		},
		[selectedSortOptionProduct, fetchCollectionProduct]
	);

	useEffect(() => {
		// close any opened menu item on page change
		dispatch(openMenuItem(""));
	}, [props.location?.pathname]);

	console.log("currentSingleCollection", currentSingleCollection);


	// GTAG CONFIGURATION
	// START

	useEffect(() => {
		if (isRootPage || isMyProfilePage || isThemePage || isSharedPage) {
			const page = (isRootPage || isThemePage)
				? "unthink_collection_home"
				: "unthink_collection_influencer";
			sessionStorage.setItem("clickPage", page);
		}
	}, [isRootPage, isMyProfilePage, isThemePage, isSharedPage]);

	useEffect(() => {
		if (showWishlistModal) {
			sessionStorage.setItem("clickPage", "unthink_collection");
		}
	}, [showWishlistModal]);

	console.log('authUser', authUser);


	useEffect(() => {
		if (isSingleCollectionSharedPage && currentSingleCollection._id) {
			const storedClickPage = sessionStorage.getItem("clickPage");

			gTagCollectionPageView({
				collection_path: currentSingleCollection.path,
				collection_status: currentSingleCollection.status,
				user_id: authUser.user_id || getTTid(),
				user_name: authUser.user_name,
				collection_id: currentSingleCollection._id,
				Clickpage: storedClickPage || "unthink_collection", // fallback only if null
			});
		}
	}, [isSingleCollectionSharedPage, currentSingleCollection._id]);


	// END

	// const isInfluencerInfoRequired = useMemo(
	// 	() => (isSharedPage || isCollectionPage) && (user_name || user_id),
	// 	[isSharedPage, isCollectionPage, user_name, user_id]
	// );

	// const isInfluencerInfoFetched = useMemo(
	// 	() => influencerIsFetching || !isEmpty(influencerUser),
	// 	[influencerIsFetching, influencerUser]
	// );

	// useEffect(() => { // ADDED NEW
	// 	if (isInfluencerInfoRequired && !isInfluencerInfoFetched) {
	// 		dispatch(getInfluencerInfo({ user_name, user_id }));
	// 	}
	// }, [isInfluencerInfoRequired, isInfluencerInfoFetched]);

	const getBackToText = () => {
		if (showCategories) {
			return "to Categories";
		} else if (showPeople) {
			return "to People";
		} else if (showEarnRewards) {
			return "to Rewards";
		} else if (isCreateFreeCollectionPage || isCollectionReviewPage) {
			return "";
		}

		return getBackToProfileTitle(pageUser.first_name, pageUser.last_name);
	};

	const { width } = useWindowSize();
	const isMobile = width < 1024;
	const height = isMobile ? 176 : 208;

	// show profile and collections (page content) if any menu item is not open
	const showPageContent = useMemo(
		() => !(showPeople || showCategories || showEarnRewards),
		[showPeople, showCategories, showEarnRewards]
	);
	const showIndividualPageContent = useMemo(
		() =>
			showPageContent &&
			(isCollectionReviewPage ||
				isCreateFreeCollectionPage ||
				isCustomProductsPage ||
				isProductDetailPage),
		[
			showPageContent,
			isCollectionReviewPage,
			isCreateFreeCollectionPage,
			isCustomProductsPage,
			isProductDetailPage,
		]
	);

	const enableBackToAllCollections = useMemo(
		() =>
			is_store_instance &&
			(isSingleCollectionSharedPage || isSharedPage) &&
			!isRootPage &&
			!isMyProfilePage,
		[
			is_store_instance,
			isSingleCollectionSharedPage,
			isSharedPage,
			isRootPage,
			isMyProfilePage,
		]
	);

	const [
		authUserFetching,
		shareUserFetching,
		authUserCollectionsFetching,
		influencerCollectionsFetching,
		updateWishlistReducer,
		addToWishlistReducer,
	] = useSelector((state) => [
		state.auth.user.isFetching,
		state.influencer.isFetching,
		state.auth.user.collections.isFetching,
		state.influencer.collections.isFetching,
		state.wishlistActions.updateWishlist,
		state.wishlistActions.addToWishlist,
	]);

	const { isFetching: updateWishlistInProgress } = updateWishlistReducer;

	const { isFetching: addToWishlistInProgress } = addToWishlistReducer;

	const isPageLoading = useMemo(
		() =>
			shareUserFetching ||
			(authUserCollectionsFetching && !authUserCollections.length) ||
			(influencerCollectionsFetching && !influencerUserCollections.length),
		[
			authUser?.user_id,
			authUserFetching,
			shareUserFetching,
			authUserCollectionsFetching,
			influencerCollectionsFetching,
			authUserCollections,
			influencerUserCollections,
		]
	);

	const showBackdropLoader = useMemo(
		() =>
			!!(
				updateWishlistInProgress ||
				addToWishlistInProgress ||
				(authUserCollectionsFetching && authUserCollections.length) ||
				(influencerCollectionsFetching && influencerUserCollections.length)
			),
		[
			updateWishlistInProgress,
			addToWishlistInProgress,
			authUserCollectionsFetching,
			influencerCollectionsFetching,
		]
	);

	const showChatResponseOverlayContent =
		chatProductsData.length ||
		(!isEnableAICookieFalse() && (isStagingEnv || isEnableAICookie())) ||
		true; // keeping enable ai always true

	const isBTInstance = useMemo(
		() =>
			is_store_instance && current_store_name === STORE_USER_NAME_BUDGETTRAVEL,
		[]
	);

	const isSamskaraInstance = useMemo(
		() => is_store_instance && current_store_name === STORE_USER_NAME_SAMSKARA,
		[]
	);

	const isHeroesVillainsInstance = useMemo(
		() =>
			is_store_instance &&
			current_store_name === STORE_USER_NAME_HEROESVILLAINS,
		[]
	);

	const isSwiftlyStyledInstance = useMemo(
		() =>
			is_store_instance && current_store_name === STORE_USER_NAME_SWIFTLYSTYLED,
		[]
	);

	const isDothelookInstance = useMemo(
		() =>
			is_store_instance && current_store_name === STORE_USER_NAME_DOTHELOOK,
		[]
	);

	// const isStoreAdminLoggedIn = useMemo(
	// 	() =>
	// 		is_store_instance &&
	// 		authUser.user_name &&
	// 		authUser.user_name === super_admin,
	// 	[authUser.user_name]
	// );

	const showCategoriesMenu = useMemo(() => showCategories, [showCategories]);
	const showCategoriesOnStorePage = useMemo(
		() => !showCategoriesMenu && isStorePage,
		[showCategoriesMenu, isStorePage]
	);

	const trackCollectionData = useMemo(
		() => ({
			trackCollectionId: currentSingleCollection._id,
			trackCollectionName: currentSingleCollection.collection_name,
			trackCollectionCampCode: currentSingleCollection.campaign_code,
			trackCollectionICode: pageUser.influencer_code,
		}),
		[
			currentSingleCollection._id,
			currentSingleCollection.collection_name,
			currentSingleCollection.campaign_code,
			pageUser.influencer_code,
		]
	);

	const isInfluencerPage = useMemo(
		() => isSharedPage && !isRootPage,
		[isSharedPage, isRootPage]
	);

	const isAdminLoggedIn = AdminCheck(pageUser, current_store_name, adminUserId, admin_list);

	const isSellerLoggedIn = useMemo(
		() =>
			(isAdminLoggedIn ||
				getIsSellerLoggedIn(storeSellerList, pageUser.emailId)) &&
			isMyProductsEnable,
		[isAdminLoggedIn, isMyProductsEnable, storeSellerList, pageUser.emailId]
	);

	const collectionsBy = useMemo(
		() =>
			pageUser.user_id
				? "" +
				(isSellerLoggedIn
					? pageUser.sellerDetails?.brandName
						? pageUser.sellerDetails.brandName
						: ""
					: (pageUser.first_name ? `${pageUser.first_name} ` : "") +
					(pageUser.last_name ? pageUser.last_name : "")) ||
				"Unthink Shopping Expert"
				: "",
		[isSellerLoggedIn, pageUser]
	);

	const handleCheck = () => {

		const isGuestLoggedIn = Cookies.get("isGuestLoggedIn")
		console.log("isGuestLoggedIn", isGuestLoggedIn);

		if (isGuestLoggedIn == "true") {
			dispatch(getUserInfo());
		}
	};

	// Set window.unthink and handleAuraClose only on client side
	useEffect(() => {
		if (typeof window !== "undefined") {
			window.unthink = {
				store: current_store_name,
				storeId: current_store_id,
				shop: window.location.hostname,
			};
			window.handleAuraClose = handleCheck;
		}
	}, [current_store_name, current_store_id, handleCheck]);

	return (
		<div className={styles.storePageContainer}>
			<AdminInfluencerPopup />
			{/* only two div should be used here */}
			<Header
				isRootPage={isRootPage}
				disabledOutSideClick={overlay}
				showCategories={
					!isStorePage &&
					!(is_store_instance && super_admin !== authUser.user_name)
				}
				showRewards={!is_store_instance}
				showCreate={!is_store_instance || isUserLogin}
				// showPeople={!isCollectionPage && !is_store_instance} // REMOVE people tab code is not required
				enableBackToAllCollections={enableBackToAllCollections}
				createCollectionPathState={{
					referrerInfluencerCode: pageUser.influencer_code,
				}}
				config={config}
				trackCollectionData={trackCollectionData}
				pageUser={pageUser}
				setisDropDown={setisDropDown}
				isDropDown={isDropDown}
			/>

			{showPageContent &&
				!(isSwiftlyStyledInstance && isRootPage) &&
				!(isDothelookInstance && isRootPage) &&// not showing breadcrumb on swiftly styled home page
				(isRootPage ||
					isCreateFreeCollectionPage ||
					isCollectionReviewPage ||
					isCollectionPage ||
					isInfluencerPage ||
					isMyProfilePage ||
					isCustomProductsPage ||
					isStorePage ||

					page_params?.collection_theme) ? (
				<Breadcrumbs
					isRootPage={isRootPage}
					isCollectionPage={isCollectionPage}
					isCollectionReviewPage={isCollectionReviewPage}
					isCreateFreeCollectionPage={isCreateFreeCollectionPage}
					isMyProfilePage={isMyProfilePage}
					isCustomProductsPage={isCustomProductsPage}
					is_store_instance={is_store_instance}
					currentCollectionName={currentSingleCollection?.collection_name}
					currentCollectionId={currentSingleCollection?.collection_id}
					collectionsBy={collectionsBy}
					theme={page_params?.collection_theme} // Retrieve the theme from params to display coll_theme in the breadcrumbs.
					userName={props.user_name} // Retrieve the user name from params to display influencer name in the breadcrumbs.
					user_id={pageUser.user_id}
				/>
			) : null}

			{/* collection review/edit page new flow and custom products page for seller*/}
			{showIndividualPageContent ? (
				<>
					{isCollectionReviewPage && <ReviewCollection {...props} />}
					{isCreateFreeCollectionPage && <CreateFreeCollection {...props} isCreateFreeCollectionPage={isCreateFreeCollectionPage} />}
					{isCustomProductsPage && <CustomProducts isCustomProductsPage={isCustomProductsPage} selectedSortOptionProduct={selectedSortOptionProduct} handleSortOptionChangeProduct={handleSortOptionChangeProduct}  {...props} />}
					{isProductDetailPage && <ProductDetails {...props} />}
				</>
			) : null}
			{isCartPage && <DeliveryDetails />}
			{isFailedPage && <FailureUrl />}
			{isSuccessPage && <SuccessUrl />}
			{isHomepage && <HomePageNew blogCollectionPage={currentSingleCollection} />}

			{isDropDown && <DroppWallet setisDropDown={setisDropDown} isDropDown={isDropDown} />}

			{!showIndividualPageContent && (
				<div
					className={`${styles.mainContentGrid} ${isRootPage && (isSwiftlyStyledInstance || isDothelookInstance) ? styles.mainContentGridNoPadding : styles.mainContentGridWithPadding}`}>
					{/* // */}
					{/* setting background as body color when any theme is selected */}
					{/* // START //  */}
					<style>{` body { background: ${themeCodes.page_container_bg}; } `}</style>
					{/* // END //  */}

					{showCategoriesMenu && <Categories />}
					{showPeople && <PeopleList />}
					{showEarnRewards && <EarnRewards />}

					{isSwiftlyStyledInstance && isRootPage && showPageContent ? (
						<SwiftlyStyledIndex
							authUser={authUser}
							pageUser={pageUser}
							pageUserCollections={allCollectionData}
						/>
					) : isDothelookInstance && isRootPage && showPageContent ? (
						<SwiftlyStyledIndex
							authUser={authUser}
							pageUser={pageUser}
							pageUserCollections={allCollectionData}
						/>
					) : (
						showPageContent && (
							<>
								{/* categories list with show all option */}
								{showCategoriesOnStorePage && <Categories hideBack />}

								{/* profile details view [influencer details] [profile image, description]   */}
								{showProfileView && (
									<>
										{!isThemePage && ( // not showing page details for theme page
											<PageDetailsComponent
												isCollectionPage={isCollectionPage}
												isSingleCollectionSharedPage={
													isSingleCollectionSharedPage
												}
												enablePageViewTracking={
													isSharedPage || isCollectionPage
												}
												user_name={user_name} // used for fetching influencer details only
												user_id={user_id} // used for fetching influencer details only
												sharePageUrl={sharePageUrl}
												collection_path={collection_path}
												collection_id={collection_id}
												pageUser={pageUser}
												authUser={authUser}
												pageUserCollections={allCollectionData}
												currentSingleCollection={currentSingleCollection}
												isPageLoading={isPageLoading}
												updateWishlistInProgress={updateWishlistInProgress}
												isStoreHomePage={isStoreHomePage}
												isPageOwner={isPageOwner}
												isMyProfilePage={isMyProfilePage}
												isSamskaraInstance={isSamskaraInstance}
												isHeroesVillainsInstance={isHeroesVillainsInstance}
												collectionsBy={collectionsBy}
											/>
										)}
										{/* hidden for now temporarily */}
										{isStoreHomePage && (
											<CreatorsListView pageUser={pageUser} />
										)}

										{isStoreHomePage &&
											current_store_name && ( // PENDING // UPDATE
												<CollectionCarouselContainer
													pageUser={pageUser}
													authUser={authUser}
													pageUserCollections={allCollectionData}
												/>
											)}
										{/* single collection shared component */}
										{/* <ProfileCollection
									showInfluencerCollection={isSharedPage || isCollectionPage}
									enableClickTracking={isSharedPage || isCollectionPage}
									user_name={user_name}
									user_id={user_id}
									collection_id={collection_id}
									isSingleCollectionSharedPage={isSingleCollectionSharedPage}
								/> */}
										{(isStoreHomePage && current_store_name) ||
											(!isSingleCollectionSharedPage && !isRootPage) ? (
											<AllBlogPages
												onShowMoreClick={onShowMoreClick}
												enableClickTracking={!isMyProfilePage}
												pageUserCollections={allCollectionData} //data from state
												dataEmpty={pageUserCollections}
												authUserCollections={authUserCollections}
												influencerUserCollections={influencerUserCollections}
												ipp={ipp}
												isLoading={isLoading}
												setIsLoading={setIsLoading}
												currentPage={currentPage}
												pageUser={pageUser}
												authUser={authUser}
												isUserLogin={isUserLogin}
												isPageLoading={isPageLoading}
												isStoreHomePage={isStoreHomePage}
												isBTInstance={isBTInstance}
												isSamskaraInstance={isSamskaraInstance}
												selectedSortOption={selectedSortOption}
												handleSortOptionChange={handleSortOptionChange}
												authUserCollectionsIsFetching={authUserCollectionsIsFetching}
												influencerUserCollectionsIsFetching={influencerUserCollectionsIsFetching}
												showWishlistModal={showWishlistModal}

											/>
										) : null}
									</>
								)}

								{/* collection page content [collection details and product list]   */}
								{isSingleCollectionSharedPage && currentSingleCollection && (
									// <CollectionPageContent collection_name={collection_name} />
									<SingleCollectionProductList
										sharePageUrl={sharePageUrl}
										key={currentSingleCollection.path}
										isRootPage={isRootPage}
										isMyProfilePage={isMyProfilePage}
										blogCollectionPage={currentSingleCollection}
										enableClickTracking
										pageUser={pageUser}
										isPageLoading={isPageLoading}
										showTagsSelection // show tags above products and alow select and filter on click on single collection page
										showCoverImage={false} // hide the cover image as first tile for single collection page
										authUser={authUser}
										isUserLogin={isUserLogin}
										showAuraTile
										isSingleCollectionSharedPage={isSingleCollectionSharedPage}
										enableSelectTags // allow tag selection on single collection page
										selectedSortOption={selectedSortOption}
										handleSortOptionChange={handleSortOptionChange}
										isPageOwner={isPageOwner}
									/>
								)}
							</>
						)
					)}

					{/* recommendations list display on all pages */}
					{/* not to show recommendations if user not found on shared page */}
					{enable_recommendations && ( // UPDATE // ADD USER/PAGE NOT FOUND CHECK
						<Recommendations
							enableClickTracking={isSharedPage || isCollectionPage}
							trackCollectionData={trackCollectionData}
						/>
					)}
				</div>
			)
			}

			{/* overlay chat response base on overlay state */}
			{/* moved this to chat modal single component to avoid spacing issue */}
			{/* <div
				id='chat_products_container'
				className={
					((overlay &&
						`fixed bottom-0 z-40 h-full-${height}px transition duration-500 transform ${
							showChatResponseOverlayContent && showChatModal
								? "translate-y-0 ease-in opacity-100 chat_products_overlay_open"
								: "translate-y-full ease-out opacity-0 chat_products_overlay_close"
						} `) ||
						"") + " w-full bg-white overflow-auto chat-product-data-container"
				}>
				{showChatResponseOverlayContent ? (
					<>
						<ChatProducts
							// enableClickFetchRec={isSharedPage || isCollectionPage}
							enableClickTracking
							// enableClickTracking={isSharedPage || isCollectionPage}
							backToText={getBackToText()}
							pageUser={pageUser}
							trackCollectionId={currentSingleCollection._id}
							trackCollectionName={currentSingleCollection.collection_name}
							trackCollectionCampCode={currentSingleCollection.campaign_code}
							trackCollectionICode={pageUser.influencer_code}
							chatTypeKey={CHAT_TYPE_CHAT}
						/>
						{enable_recommendations && <Recommendations pageUser={pageUser} />}
					</>
				) : null}
			</div> */}

			<WishListModal
				isMyProfilePage={isMyProfilePage}
				createCollectionPreDefinedPayload={{
					referrerInfluencerCode: pageUser.influencer_code,
				}}
				trackCollectionId={currentSingleCollection._id}
				trackCollectionName={currentSingleCollection.collection_name}
				trackCollectionCampCode={currentSingleCollection.campaign_code}
				trackCollectionICode={pageUser.influencer_code}
			/>
			<SimilarProducts
				enableClickTracking={isSharedPage || isCollectionPage}
				pageUser={pageUser}
				trackCollectionId={currentSingleCollection._id}
				trackCollectionName={currentSingleCollection.collection_name}
				trackCollectionCampCode={currentSingleCollection.campaign_code}
				trackCollectionICode={pageUser.influencer_code}
			/>

			{/* to create new tailwind classes in build */}
			<span className={styles.hiddenUtilityClasses} />
			<span className={styles.hiddenTabletGrid} />

			{/* {authUser.user_name === "takewalks" &&
			!(isCreateFreeCollectionPage || isCollectionReviewPage) ? (
				<QAndAComponent id='q_and_a_widget' config={config} />
			) : null} */}

			{/* show backdrop loader */}
				{showBackdropLoader && (
				<div className='fixed top-0 left-0 flex justify-center items-center w-full min-h-screen h-full backdrop-filter bg-gray-102 z-20'>
					<Spin
						// indicator={<LoadingOutlined className='text-3xl-1' spin />}
						indicator={
							<Loading3QuartersOutlined
								className='flex text-6xl-1 text-indigo-100'
								spin
							/>
						}
					/>
				</div>
			)}

		</div >
	);
};

export default StorePageWrapper;
