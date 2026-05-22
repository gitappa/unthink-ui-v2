import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Select, Spin, Input, Checkbox, Button, Modal, message, Tooltip } from "antd";
import {
	Loading3QuartersOutlined,
	CloseOutlined,
	CloseCircleOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import {
	clearSuggestionsSelectedAdditionalTag,
	removeSuggestionDataTag,
	setSuggestionsProductsFilters,
	setSuggestionsProductsIsLoading,
	setSuggestionsSelectedAdditionalTag,
} from "../../hooks/chat/redux/actions";
import {
	openWishlistModal,
	setIsCreateWishlist,
	setProductsToAddInWishlist,
} from "../wishlist/redux/actions";
import { handleRecProductClick } from "../recommendations/redux/actions";
import { openAutoCreateCollectionModal } from "../autoCreateCollectionModal/redux/actions";
import { useChat } from "../../hooks/chat/useChat";
import ProductCard from "../../components/singleCollection/ProductCard";
import ProductFiltersTags from "../productFilters/ProductFiltersTags";
import AdditionalAttributes from "../productFilters/AdditionalAttributes";
import { current_store_name, is_store_instance } from "../../constants/config";
import {
	filterAvailableProductList,
	isEmpty,
	removeEmptyItems,
	setCookie,
} from "../../helper/utils";
import {
	CHAT_TYPES_KEYS,
	COLLECTION_GENERATED_BY_IMAGE_BASED,
	COLLECTION_GENERATED_BY_SEARCH_BASED,
	COLLECTION_TYPE_CUSTOM_PLIST,
	COOKIE_TT_ID,
	FETCH_COLLECTIONS_PRODUCT_LIMIT,
	GUESTSKIP_EXPIRE_HOURS,
	SIGN_IN_EXPIRE_DAYS,
	WISHLIST_TITLE,
} from "../../constants/codes";
import filterIcon from "../../images/filter_outline.svg";
import Cookies from "js-cookie";
import { authAPIs } from "../../helper/serverAPIs";
import {
	getUserCollections,
	getUserInfo,
	getUserInfoSuccess,
	GuestPopUpShow,
} from "../Auth/redux/actions";
import GuestPopUp from "../Auth/GuestPopUp";
import {
	FaRegArrowAltCircleRight,
	FaRegArrowAltCircleLeft,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { FreeMode, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import WishListModal from "../wishlist/WishListModal";
import { useUserData } from "../../context/UserDataContext";

SwiperCore.use([FreeMode, Navigation]);

const getPriceRangeText = (price) => {
	if (!isEmpty(price?.min) && !isEmpty(price?.max)) {
		return price.min + " - " + price.max;
	} else {
		return "";
	}
};

const AuraResponseProducts = ({
	products = {},
	recommendationsProducts = {},
	moreProducts = {},
	RecomTag,
	tag,
	suggestionsProducts,
	isTagEnabled = false,
	enableClickFetchRec,
	enableClickTracking,
	trackCollectionCampCode,
	trackCollectionId,
	trackCollectionName,
	trackCollectionICode,
	elementId,
	chatTypeKey,
	widgetHeader,
	widgetImage,
	allProductList,
	isAuraChatPage,
	localChatMessage,
	layoutMode,
	isMobile,
	registerSelectActions
}) => {
	const [
		authUser,
		isUserLogin,
		chatMessage,
		chatImageUrl,
		storeData,
		widgetHeaderRequest,
		chatHistory,
		selectedSearchOption,
		isGuestPopUpShow,
		showWishlistModal,
		suggestionsTags,
		showChatLoader,
	] = useSelector((state) => [
		state.auth.user.data,
		state.auth.user.isUserLogin,
		state.chatV2.chatMessage,
		state.chatV2[CHAT_TYPES_KEYS[chatTypeKey].chatImageUrl],
		state.store.data,
		state.chatV2.widgetHeaderRequest,
		state.chatV2.chatHistory,
		state.chatV2.activeSearchOption || {},
		state.GuestPopUpReducer.isGuestPopUpShow,
		state.appState.wishlist.showWishlistModal,
		state.chatV2.suggestions?.selectedTag,
		state.chatV2[CHAT_TYPES_KEYS[chatTypeKey].showChatLoader],
	]);
  const {setUserData ,userData } = useUserData()
  
	const [filterOptionsVisible, setFilterOptionsVisible] = useState(false);
	const [enableSelectProduct, setEnableSelectProduct] = useState(false);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [customFilter, setCustomFilter] = useState([]);
	const [isSkipPopUpShow, setIsSkipPopUpShow] = useState(false);
	const [loadingStates, setLoadingStates] = useState({
		loading: false,
		loadingMore: false,
	});
	const [productsCache, setProductsCache] = useState({});
	const [pagination, setPagination] = useState({
		currentPages: {}, // Track page numbers per tag
		hasMore: {}, // Track hasMore per tag
	});
	const [guestData, setGuestData] = useState({ email: "" });
	const [errors, setErrors] = useState({ email: "" });
	const [isPopupShow, setIsPopupShow] = useState(false);

	const dispatch = useDispatch();
	const { sendMessage } = useChat();
	const guestActionRef = useRef(null);

	const currentTag = tag === "" ? "all" : tag;
	const currentPage = pagination.currentPages[currentTag] || 0;
	const hasMore = pagination.hasMore[currentTag] !== false; // Default to true if not set

	const {
		show_filters = {},
		filters: productsFilters = {},
		isLoading = false,
	} = products;

	const { text: requestedText, image_url: requestedImageUrl } =
		widgetHeaderRequest;
	const { filter_settings = {}, catalog_attributes = [] } = storeData;
	const availableFilters = filter_settings.available_filters;
	const displayFilters = filter_settings.display_filters;
	const displayableFilter = displayFilters.map((v) => v.key);

	const filters = useMemo(() => {
		const obj = { optional_filters: productsFilters.optional_filters };
		displayableFilter.forEach((v) => {
			obj[v] = productsFilters[v];
		});
		return obj;
	}, [productsFilters, displayableFilter]);

	useEffect(() => {
		if (Object.keys(productsFilters).length === 0) return;
		let hasChanges = false;
		let newOptionalFilters = [...(productsFilters.optional_filters || [])];

		displayableFilter.forEach((key) => {
			const value = productsFilters[key];
			const isNowEmpty = key === "price"
				? (!value || (!value.min && !value.max))
				: (!value || value.length === 0 || value === "");

			if (isNowEmpty) {
				if (!newOptionalFilters.includes(key)) {
					newOptionalFilters.push(key);
					hasChanges = true;
				}
			} else {
				if (newOptionalFilters.includes(key)) {
					newOptionalFilters = newOptionalFilters.filter((n) => n !== key);
					hasChanges = true;
				}
			}
		});

		if (hasChanges) {
			dispatch(setSuggestionsProductsFilters(tag, {
				...productsFilters,
				optional_filters: newOptionalFilters,
			}));
		}
	}, [productsFilters, displayableFilter, dispatch, tag]);
 
	const isFiltersAvailable = useMemo(() => {
		const finalFilters = removeEmptyItems(filters);
		for (const key in finalFilters) {
			if (key !== "custom_filter") {
				return true;
			}
		}
		return false;
	}, [filters]);

	const hasVisibleFilters = useMemo(() => {
		const hasCustomFilter = !!filters.custom_filter;
		return currentTag !== 'all' || isFiltersAvailable || hasCustomFilter;
	}, [currentTag, isFiltersAvailable, filters.custom_filter]);

	const customFilterStoreData = useMemo(
		() => catalog_attributes.find((c) => c.key === "custom_filter"),
		[catalog_attributes]
	);

	const sendSocketMessage = (newFilters = {}, page = currentPage) => {
		const filtersToSubmit = { ...newFilters };
		if (Array.isArray(filtersToSubmit.custom_filter)) {
			filtersToSubmit.custom_filter = filtersToSubmit.custom_filter.join(",");
		}
		const finalFilters = removeEmptyItems(filtersToSubmit);
		sendMessage(requestedText || undefined, requestedImageUrl || undefined, {
			tags: currentTag === "all" ? [] : [tag],
			filters: !isEmpty(finalFilters) ? finalFilters : undefined,
			tag_map: show_filters.tag_map,
			show_filters,
			search_template: "",
			searchOptionId: "product_search",
			next_page: true,
			ipp: 15,
			current_page: page - 1,
			moreSearch_next_page: false,
			recommendationSearch_next_page: false,
		});
		dispatch(removeSuggestionDataTag({ tag, isRemoveTag: false }));
		handleResetSelectProduct();
	};

	const handleLoadMoreSubmit = (newFilters = {}) => {
		if (!currentTag || !hasMore || loadingStates.loadingMore) return;

		setLoadingStates((prev) => ({ ...prev, loadingMore: true }));

		const nextPage = currentPage + 1;
		setPagination((prev) => ({
			...prev,
			currentPages: {
				...prev.currentPages,
				[currentTag]: nextPage,
			},
		}));

		sendSocketMessage(newFilters, nextPage);
	};

	const handleSaveEditCustomFilter = (hashTags) => {
		const actualHashTags = hashTags && hashTags.custom_filter !== undefined ? hashTags.custom_filter : hashTags;
		const customFilterArrayToString = actualHashTags ? actualHashTags.toString() : "";
		dispatch(setSuggestionsProductsIsLoading(tag, true));
		handleChangeFilters({
			...filters,
			custom_filter: customFilterArrayToString || undefined,
		});

		setPagination(prev => ({
			...prev,
			currentPages: {
				...prev.currentPages,
				[currentTag]: 1,
			},
			hasMore: {
				...prev.hasMore,
				[currentTag]: true,
			},
		}));
		sendSocketMessage({
			...filters,
			custom_filter: customFilterArrayToString || undefined,
		}, 1);
	};

	const handleChangeFilters = (newFilters) => {
		dispatch(setSuggestionsProductsFilters(tag, newFilters));
	};


	const filtersToShow = useMemo(() => {
		const filters = displayFilters.map((filter) => {
			if (
				filter.key in availableFilters &&
				(filter.input_type === "multi_select" ||
					filter.input_type === "single_select")
			) {
				filter.display_value = availableFilters[filter.key];
			}
			return filter;
		});

		const hasCustomFilter = filters.some((f) => f.key === "custom_filter");
		if (!hasCustomFilter && customFilterStoreData?.is_display) {
			filters.push({
				key: "custom_filter",
				label: customFilterStoreData.label || "Hashtags",
				input_type: "multi_custom_input",
			});
		}

		return filters;
	}, [displayFilters, availableFilters, customFilterStoreData]);

	const onProductClick = () => {
		if (enableClickFetchRec && !enableSelectProduct) dispatch(handleRecProductClick());
	};

	const handleSuggestionAdditionalTagClick = (tag, additionalTag) => {
		dispatch(setSuggestionsSelectedAdditionalTag(tag, additionalTag));
	};

	const handleClearSuggestionAdditionalTagClick = (tag) => {
		dispatch(clearSuggestionsSelectedAdditionalTag(tag));
	};

	const chatProductsDataToShow = useMemo(() => {
		const product_lists = filterAvailableProductList(
			products.product_lists || []
		);
		return products.selectedAdditionalTag
			? product_lists.filter((p) =>
				p.tagged_by.includes(products.selectedAdditionalTag)
			)
			: product_lists;
	}, [
		products.product_lists,
		products.selectedAdditionalTag,
		authUser.user_name,
	]);

	const RecomChatProductsDataToShow = useMemo(() => {
		const product_lists = filterAvailableProductList(
			recommendationsProducts.product_lists || []
		);
		return recommendationsProducts.selectedAdditionalTag
			? product_lists.filter((p) =>
				p.tagged_by.includes(recommendationsProducts.selectedAdditionalTag)
			)
			: product_lists;
	}, [
		recommendationsProducts.product_lists,
		recommendationsProducts.selectedAdditionalTag,
		authUser.user_name,
	]);

	const moreProductsDataToShow = useMemo(() => {
		const product_lists = filterAvailableProductList(
			moreProducts.product_lists || []
		);
		return moreProducts.selectedAdditionalTag
			? product_lists.filter((p) =>
				p.tagged_by.includes(moreProducts.selectedAdditionalTag)
			)
			: product_lists;
	}, [
		moreProducts.product_lists,
		moreProducts.selectedAdditionalTag,
		authUser.user_name,
	]);
 

	const enableFilters = useMemo(
		() =>
			(chatProductsDataToShow.length > 0 || !isEmpty(filters)) &&
			availableFilters &&
			!products.selectedAdditionalTag &&
			isTagEnabled,
		[
			chatProductsDataToShow.length,
			filters,
			availableFilters,
			products.selectedAdditionalTag,
			isTagEnabled,
		]
	);
 
	const enableCustomFilter = useMemo(
		() => customFilterStoreData?.is_display && enableFilters,
		[customFilterStoreData?.is_display, enableFilters]
	);

	const isTagProductsAllSelected = useMemo(() => {
		if (chatProductsDataToShow) {
			return chatProductsDataToShow.every((item) =>
				selectedProducts.includes(item.mfr_code)
			);
		}
	}, [chatProductsDataToShow, selectedProducts]);

	const isTagProductSelected = useMemo(() => {
		if (chatProductsDataToShow) {
			return chatProductsDataToShow.some((item) =>
				selectedProducts.includes(item.mfr_code)
			);
		}
		return false;
	}, [chatProductsDataToShow, selectedProducts]);

	const handleResetSelectProduct = useCallback(() => {
		setEnableSelectProduct(false);
		setSelectedProducts([]);
	}, []);

	const handleSetSelectedProducts = useCallback(
		({ add = [], remove = [] }) => {
			const products = selectedProducts;
			const allProducts = allProductList?.map((p) => p.mfr_code);
			products.push(...add);
			const filteredRemoveProducts = products.filter(
				(p) => !remove.includes(p)
			);
			const uniqueSelectedProducts = filteredRemoveProducts.filter(
				(p, index) => filteredRemoveProducts.indexOf(p) === index
			);
			setSelectedProducts(
				uniqueSelectedProducts.filter((p) => allProducts.includes(p))
			);
		},
		[selectedProducts, allProductList]
	);

	useEffect(() => {
		if (selectedProducts) {
			handleSetSelectedProducts({});
		}
	}, [allProductList]);

	// Update the useEffect that handles cache updates:
	useEffect(() => {
		if (currentTag && chatProductsDataToShow.length > 0) {
			setProductsCache((prev) => {
				const existingProducts = prev[currentTag] || [];
				let mergedProducts = [];

				// For first page or tag change, replace existing products
				if (currentPage === 1 || !prev[currentTag]) {
					mergedProducts = [...chatProductsDataToShow];
				} else {
					// For subsequent pages, merge and avoid duplicates
					const productMap = new Map(
						existingProducts.map((p) => [p.mfr_code, p])
					);
					chatProductsDataToShow.forEach((p) => productMap.set(p.mfr_code, p));
					mergedProducts = Array.from(productMap.values());
				}

				return {
					...prev,
					[currentTag]: mergedProducts,
					hasMore: {
						...prev.hasMore,
						[currentTag]: chatProductsDataToShow.length >= 15,
					},
				};
			});

			// Preserve selected products when new products are loaded
			setSelectedProducts((prevSelected) => {
				const newSelected = [...prevSelected];
				// Add any new products that were previously selected
				chatProductsDataToShow.forEach((product) => {
					if (
						prevSelected.includes(product.mfr_code) &&
						!newSelected.includes(product.mfr_code)
					) {
						newSelected.push(product.mfr_code);
					}
				});
				return newSelected;
			});

			setLoadingStates((prev) => ({ loading: false, loadingMore: false }));
		}
	}, [chatProductsDataToShow, currentTag, currentPage]);

	useEffect(() => {
		if (currentTag && !pagination.currentPages[currentTag]) {
			setPagination((prev) => ({
				...prev,
				currentPages: {
					...prev.currentPages,
					[currentTag]: 1,
				},
				hasMore: {
					...prev.hasMore,
					[currentTag]: true,
				},
			}));
		}
	}, [currentTag]);

	const onSelectProductClick = (mfr_code) => {
		setEnableSelectProduct(true);
		setSelectedProducts((prev) => {
			if (prev.includes(mfr_code)) {
				return prev.filter((code) => code !== mfr_code);
			} else {
				return [...prev, mfr_code];
			}
		});
	};

	const onSelectAllChange = () => {
		if (selectedProducts.length < chatProductsDataToShow.length) {
			setSelectedProducts(chatProductsDataToShow.map((i) => i.mfr_code));
			setEnableSelectProduct(true);
		} else {
			setSelectedProducts([]);
		}
	};

	const handleSaveOrShareClick = () => {
		onSelectAllChange();
		setEnableSelectProduct(true);
	};

	const onAddSelectedProductsToCollection = useCallback(
		(e =null,options ={}) => {
			const { isSave = false, isShare = false, isSkip = false, isGuestSubmit = false,userId = null } = options;

    if (e?.preventDefault) {
      e?.preventDefault();
      e?.stopPropagation();
    }
	 
			const isUserLoginCokkies = Cookies.get("isGuestLoggedIn") === "true";
			guestActionRef.current = isSave ? "save" : "share";

			const isSkipPopUp = isSkip && guestActionRef.current === "share";

			if ( isShare && !isSkipPopUp && !isGuestSubmit) {
				dispatch(GuestPopUpShow(true));
				return;
			}
			else if (isSave && !isUserLogin && !isUserLoginCokkies && !isGuestSubmit) {
				dispatch(GuestPopUpShow(true));
				return;
			}

			const SelectedProductsData = allProductList.filter((p) =>
				selectedProducts.includes(p.mfr_code)
			);

			let data = { tags: [], tagged_show_filters: {}, keyword_tag_map: {} };

			SelectedProductsData?.forEach((prod) => {
				const tag = prod?.tagged_by[0];
				if (!data.tags.includes(tag)) {
					data.tags.push(tag);
				}
			});

			data.tags.map((t) => {
				data.keyword_tag_map[t] = suggestionsProducts[t]?.filters;
				data.tagged_show_filters[t] = suggestionsProducts[t]?.show_filters;
			});

			const createWishlistData = {
				collection_name: chatMessage || "",
				description: widgetHeader || "",
				cover_image: widgetImage || chatImageUrl || "",
				image_url: widgetImage || chatImageUrl || "",
				product_lists: SelectedProductsData || [],
				generated_by: widgetImage
					? COLLECTION_GENERATED_BY_IMAGE_BASED
					: COLLECTION_GENERATED_BY_SEARCH_BASED,
				...data,
				user_id:userId || userData?.user_id || authUser?.user_id
			};

			if (isSave) {
				dispatch(
					setProductsToAddInWishlist(SelectedProductsData, {
						...createWishlistData,
					})
				);
				dispatch(openWishlistModal());
				// if (isUserLoginCokkies) {
				// 	dispatch(setIsCreateWishlist(true));
				// }
			} else if (isShare) {
				
				dispatch(
					openAutoCreateCollectionModal({
						...createWishlistData,
						isShareCollectionEnable: true,
					})
				);
			}

			handleResetSelectProduct();
		},
		[
			isUserLogin,
			selectedProducts,
			allProductList,
			suggestionsProducts,
			chatMessage,
			widgetHeader,
			widgetImage,
			authUser.status,
			chatImageUrl
		]
	);

	const onFiltersChange = (name, value) => {
		const newFilters = { ...filters, [name]: value };
		let newOptionalFilters = newFilters.optional_filters || [];
		const isNowEmpty = name === "price"
			? (!value || (!value.min && !value.max))
			: (!value || value.length === 0 || value === "");

		if (isNowEmpty) {
			if (!newOptionalFilters.includes(name)) {
				newOptionalFilters = [...newOptionalFilters, name];
			}
		} else {
			if (newOptionalFilters.includes(name)) {
				newOptionalFilters = newOptionalFilters.filter((n) => n !== name);
			}
		}

		newFilters.optional_filters = newOptionalFilters;
		handleChangeFilters(newFilters);
	};

	const handleFiltersSubmit = (
		newFilters = {},
		filterOptionsVisible = false
	) => {


		handleChangeFilters(newFilters);
		dispatch(setSuggestionsProductsIsLoading(tag, true));
		setFilterOptionsVisible(filterOptionsVisible);
		setPagination(prev => ({
			...prev,
			currentPages: {
				...prev.currentPages,
				[currentTag]: 1,
			},
			hasMore: {
				...prev.hasMore,
				[currentTag]: true,
			},
		}));
		sendSocketMessage(newFilters, 1); // Always reset to page 1 when applying new filters
	};

	const handleFiltersInputClear = (name, value) => {
		handleFiltersSubmit({ ...filters, [name]: value }, filterOptionsVisible);
	};

	const handleFiltersOptionalChange = (name) => {
		const optional_filters = filters.optional_filters || [];
		const values = optional_filters.includes(name)
			? optional_filters.filter((s) => s !== name)
			: [...optional_filters, name];

		handleChangeFilters({
			...filters,
			optional_filters: values,
		});
	};

	const handleClearFiltersClick = async () => {
		handleFiltersSubmit({}, false);
	};

	const handleCustomFilterChange = (customFilter) => {
		const removedHash = customFilter.map((item) => item.replaceAll("#", ""));
		setCustomFilter(removedHash);
	};

	const checkAndShowContainer = useCallback(
		() => {
			// setShowCustomFilterInput(isShowCustomFilterInput);
		},
		[]
	);

	const guestChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setGuestData((data) => ({ ...data, [name]: value }));
			if (errors.email) setErrors({ ...errors, email: "" });
		},
		[errors]
	);

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleGuestSkip = async () => {

		if (guestActionRef.current === "share") {
			onAddSelectedProductsToCollection(null,{ isShare: true, isSkip: true });
		}
		dispatch(GuestPopUpShow(false));
	};



	const handleGuestSubmit = useCallback(
		async (e) => {
			e.preventDefault();

			if (!guestData.email) {
				setErrors({ email: "Email is required" });
				return;
			}

			if (!validateEmail(guestData.email)) {
				setErrors({ email: "Please enter a valid email address" });
				return;
			}

			const tid = Cookies.get("tid");
			const store = current_store_name;

			if (!Cookies.get("isGuestLoggedIn")) {
				Cookies.set("isGuestLoggedIn", false, { expires: SIGN_IN_EXPIRE_DAYS });
			}

			if (validateEmail(guestData.email)) {
				try {
					const res = await authAPIs.GuestRegisterAPICall({
						emailId: guestData.email,
						user_id: tid,
						store,
					});

					const { data } = res;
					const user_id = data.data.user_id;

					if (res.data.status_code === 200) {
						dispatch(GuestPopUpShow(false));
						if(guestActionRef.current === "share"){ 
						try {
  let { data, status } = await authAPIs.getUserInfoAPICall({ user_id });

  if (status === 200 && data?.status_code === 200 && data?.data?.user_id) {
    // dispatch(getUserInfoSuccess(data.data));
	setUserData(data?.data)
  }
} catch (e) {
  console.error(e);
}
						}
					else if (guestActionRef.current === "save") {
						dispatch(GuestPopUpShow(false));

							setCookie(COOKIE_TT_ID, user_id, SIGN_IN_EXPIRE_DAYS);
						dispatch(getUserInfo());
						} 

// setCookie(COOKIE_TT_ID, user_id, SIGN_IN_EXPIRE_DAYS);
						// dispatch(getUserInfo());
						// Cookies.set("isGuestLoggedIn", true, {
						// 	expires: SIGN_IN_EXPIRE_DAYS,
						// });
						if (guestActionRef.current === "save") {
							onAddSelectedProductsToCollection(null, { isSave: true, isGuestSubmit: true });
						} else if (guestActionRef.current === "share") {
							onAddSelectedProductsToCollection(null, { isShare: true, isGuestSubmit: true ,userId:data?.data?.user_id});
						}
					}
				} catch (error) {
					console.log(error);
				}
			}
		},
		[guestData.email, onAddSelectedProductsToCollection]
	);

	useEffect(() => {
		if (isAuraChatPage) {
			if (showWishlistModal) {
				// Always call API when wishlist popup opens
				dispatch(
					getUserCollections({
						product_limits: FETCH_COLLECTIONS_PRODUCT_LIMIT,
						summary: true,
					})
				);
			}
		}
	}, [showWishlistModal, isAuraChatPage]);

	useEffect(() => {
		if (registerSelectActions) {
			registerSelectActions({
				enableSelectProduct,
				selectedProducts,
				chatProductsDataToShow,
				is_store_instance,
				handleResetSelectProduct,
				setEnableSelectProduct,
				onSelectAllChange,
				onAddSelectedProductsToCollection,
			});
		}
		return () => {
			if (registerSelectActions) {
				registerSelectActions(null);
			}
		};
	}, [
		enableSelectProduct,
		selectedProducts,
		chatProductsDataToShow,
		is_store_instance,
		handleResetSelectProduct,
		onSelectAllChange,
		onAddSelectedProductsToCollection,
		registerSelectActions,
	]);

	const isCurrentTagLoading = (tag && !suggestionsProducts?.[tag]) || isLoading || showChatLoader;

	return (
		<>
			<div id={elementId}>
				<div className="flex-1 min-w-0">
					{!isCurrentTagLoading ? (
					<>
						{enableFilters ? (
							<div className={hasVisibleFilters ? "mb-4 md:mb-5" : ""}>
								<ProductFiltersTags
									productFilters={filters}
									handleFiltersInputClear={handleFiltersInputClear}
									handleClearFiltersClick={handleClearFiltersClick}
									displayFilters={filtersToShow.filter(f => f.key !== 'custom_filter')}
									isShowCustomFilter={true}
									isShowHashtagButton={false}
									handleSaveEditCustomFilter={handleSaveEditCustomFilter}
									tagThemeClassName={"border border-[#334155] text-[#334155] text-base py-0.5 px-3 rounded-full shadow-sm"}
									clearFiltersThemeClassName={"text-[#334155]"}
									handleFilterOptionsVisibleChange={currentTag === 'all' ? undefined : setFilterOptionsVisible}
									filterOptionsVisible={filterOptionsVisible}
								/>
							</div>
						) : null}


						{chatProductsDataToShow.length && !isMobile ? (
							<div className="flex flex-row items-center gap-4 mb-6 w-full box-border transition-all">
								<div className="flex items-center flex-wrap gap-2 leading-[2.75rem]">
									<div className="flex items-center gap-2">
										<div
											className="border border-gray-400 rounded-md px-2 py-1 flex items-center gap-2 cursor-pointer select-none"
											onClick={() => {
												if (enableSelectProduct) handleResetSelectProduct();
												else setEnableSelectProduct(true);
											}}
										>
											<span className="text-xs md:text-base">
												{enableSelectProduct ? `${selectedProducts.length} selected` : "Select"}
											</span>
											<Checkbox
												className="text-xs md:text-base"
												onChange={(e) => {
													e.stopPropagation();
													onSelectAllChange();
												}}
												onClick={(e) => {
													e.stopPropagation();
												}}
												checked={
													selectedProducts.length > 0 &&
													selectedProducts.length === chatProductsDataToShow.length
												}
											/>
										</div>
									</div>
									{enableSelectProduct && (
										<p
											onClick={() => handleResetSelectProduct()}
											className="text-brand font-medium ml-2 underline cursor-pointer"
											role='button'>
											Clear
										</p>
									)}
								</div>
								<div className="flex flex-wrap gap-2">
									{is_store_instance && (
										<div className="flex items-center justify-center">
											<button
												className="rounded-md shadow-md px-4 py-1 text-white font-medium bg-secondary hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
												onClick={(e) =>
													onAddSelectedProductsToCollection(e, { isSave: true })
												}
												title='Select and add products to collection'>
												Save
											</button>
										</div>
									)}
									<div className="flex items-center justify-between">
										<button
											className="rounded-md shadow-md px-4 py-1 text-white font-medium bg-secondary hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
											onClick={(e) =>
												onAddSelectedProductsToCollection(e, { isShare: true })
											}
											title='Select products and share published collection'>
											Share
										</button>
									</div>
								</div>
							</div>
						) : null}
					</>
				) : null}
				{isLoading || showChatLoader ? (
					<div className="flex flex-col items-center justify-center w-full py-20 gap-4 animate-pulse">
						<Spin
							indicator={
								<Loading3QuartersOutlined
									style={{ fontSize: 36, color: 'var(--color-aura-purple)' }}
									spin
								/>
							}
						/>
						<span className="text-aura-purple font-semibold text-sm tracking-wide">
							Searching products...
						</span>
					</div>
				) : (
					<>
						<div
							id='chat_products_inner_content'
							className={`grid grid-cols-2 gap-2 sm:gap-3 ${
								selectedSearchOption?.id === "product_search"
									? "md:grid-cols-3 lg:grid-cols-4"
									: layoutMode === "both"
										? 'md:grid-cols-3'
										: 'md:grid-cols-3 lg:grid-cols-4'
							}`}>
							{productsCache[currentTag]?.map((product) => (
								<ProductCard
									key={product.mfr_code}
									product={product}
									onProductClick={onProductClick}
									selectedSearchOption={selectedSearchOption}
									enableClickTracking={enableClickTracking}
									productClickParam={{
										iCode: authUser.influencer_code,
										campCode: trackCollectionCampCode,
										collectionId: trackCollectionId,
										collectionName: trackCollectionName,
										collectionICode: trackCollectionICode,
									}}
									// hideAddToWishlist={
									// 	(is_store_instance && !isUserLogin) || isAuraChatPage
									// }
									hideAddToWishlist={is_store_instance && !isUserLogin}
									enableSelect={enableSelectProduct}
									isSelected={selectedProducts.includes(product.mfr_code)}
									setSelectValue={() => onSelectProductClick(product.mfr_code)}
									wishlistGeneratedBy={
										widgetImage
											? COLLECTION_GENERATED_BY_IMAGE_BASED
											: COLLECTION_GENERATED_BY_SEARCH_BASED
									}
									localChatMessage={localChatMessage}
									onAddSelectedProductsToCollection={onAddSelectedProductsToCollection}
								/>
							))}
						</div>

						{RecomChatProductsDataToShow.length ? (
							<>
								<div className="flex justify-between items-center mt-8 mb-8">
									<div className="font-bold text-xl md:text-2xl leading-8">
										Recommendations
									</div>
									<div className="flex gap-2">
										<button id='custom-prev' className="text-2xl p-1 rounded-md cursor-pointer bg-transparent hover:opacity-70 md:text-3xl">
											<FaRegArrowAltCircleLeft />
										</button>
										<button id='custom-next' className="text-2xl p-1 rounded-md cursor-pointer bg-transparent hover:opacity-70 md:text-3xl">
											<FaRegArrowAltCircleRight />
										</button>
									</div>
								</div>

								<Swiper
									slidesPerView={"auto"}
									spaceBetween={window.innerWidth <= 1024 ? 10 : 16}
									freeMode={true}
									modules={[FreeMode, Navigation]}
									navigation={{
										nextEl: "#custom-next",
										prevEl: "#custom-prev",
									}}
									className='mySwiper' style={{ padding: 0 }}>
									{RecomChatProductsDataToShow.map((product) => (
										<SwiperSlide
											key={product.mfr_code}
											style={{ width: "auto" }}>
											<ProductCard
												key={product.mfr_code}
												product={product}
												onProductClick={onProductClick}
												selectedSearchOption={selectedSearchOption}
												enableClickTracking={enableClickTracking}
												productClickParam={{
													iCode: authUser.influencer_code,
													campCode: trackCollectionCampCode,
													collectionId: trackCollectionId,
													collectionName: trackCollectionName,
													collectionICode: trackCollectionICode,
												}}
												// hideAddToWishlist={
												// 	(is_store_instance && !isUserLogin) || isAuraChatPage
												// }
												hideAddToWishlist={is_store_instance && !isUserLogin}
												enableSelect={enableSelectProduct}
												isSelected={selectedProducts.includes(product.mfr_code)}
												setSelectValue={() =>
													onSelectProductClick(product.mfr_code)
												}
												wishlistGeneratedBy={
													widgetImage
														? COLLECTION_GENERATED_BY_IMAGE_BASED
														: COLLECTION_GENERATED_BY_SEARCH_BASED
												}
												localChatMessage={localChatMessage}
												onAddSelectedProductsToCollection={onAddSelectedProductsToCollection}
											/>
										</SwiperSlide>
									))}
								</Swiper>
							</>
						) : (
							""
						)}

						{moreProductsDataToShow.length ? (
							<>
								<div className="flex justify-between items-center mt-8 mb-8">
									<div className="font-bold text-xl md:text-2xl leading-8">More Results</div>
									<div className="flex gap-2">
										<button id='more-prev' className="text-2xl p-1 rounded-md cursor-pointer bg-transparent hover:opacity-70 md:text-3xl">
											<FaRegArrowAltCircleLeft />
										</button>
										<button id='more-next' className="text-2xl p-1 rounded-md cursor-pointer bg-transparent hover:opacity-70 md:text-3xl">
											<FaRegArrowAltCircleRight />
										</button>
									</div>
								</div>

								<Swiper
									slidesPerView={"auto"}
									spaceBetween={window.innerWidth <= 1024 ? 10 : 16}
									freeMode={true}
									modules={[FreeMode, Navigation]}
									navigation={{
										nextEl: "#more-next",
										prevEl: "#more-prev",
									}}
									className='mySwiper' style={{ padding: 0 }}>
									{moreProductsDataToShow.map((product) => (
										<SwiperSlide
											key={product.mfr_code}
											style={{ width: "auto" }}>
											<ProductCard
												key={product.mfr_code}
												product={product}
												onProductClick={onProductClick}
												selectedSearchOption={selectedSearchOption}
												enableClickTracking={enableClickTracking}
												productClickParam={{
													iCode: authUser.influencer_code,
													campCode: trackCollectionCampCode,
													collectionId: trackCollectionId,
													collectionName: trackCollectionName,
													collectionICode: trackCollectionICode,
												}}
												// hideAddToWishlist={
												// 	(is_store_instance && !isUserLogin) || isAuraChatPage
												// }
												hideAddToWishlist={is_store_instance && !isUserLogin}
												enableSelect={enableSelectProduct}
												isSelected={selectedProducts.includes(product.mfr_code)}
												setSelectValue={() =>
													onSelectProductClick(product.mfr_code)
												}
												wishlistGeneratedBy={
													widgetImage
														? COLLECTION_GENERATED_BY_IMAGE_BASED
														: COLLECTION_GENERATED_BY_SEARCH_BASED
												}
												localChatMessage={localChatMessage}
												onAddSelectedProductsToCollection={onAddSelectedProductsToCollection}
												
											/>
										</SwiperSlide>
									))}
								</Swiper>
							</>
						) : (
							""
						)}

						{chatProductsDataToShow.length >= 15 && (
							<div className="flex justify-center mt-8">
								<button
									className="bg-gradient-to-r from-brand to-secondary text-white px-5 py-2 rounded-md shadow-md font-medium hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
									onClick={() => {
										setLoadingStates((prev) => ({
											...prev,
											loadingMore: true,
										}));

										setTimeout(() => {
											handleLoadMoreSubmit(filters); // Actual data fetch
										}, 1000);
									}}
									disabled={loadingStates.loadingMore}>
									{loadingStates.loadingMore ? "Loading..." : "Load More"}
								</button>
							</div>
						)}
					</>
				)}
				</div>

				{enableFilters && (
					<Modal
						className="[&_.ant-modal-content]:!bg-[#f1f5f9] [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-footer]:!bg-transparent"
						title={
							<div className="flex justify-between items-center w-full pr-8">
								<h4 className="text-gray-800 text-lg font-bold">Filter Products</h4>
								{isFiltersAvailable ? (
									<p
										className="text-brand text-sm font-medium cursor-pointer opacity-90 hover:opacity-100 hover:underline"
										role='button'
										onClick={handleClearFiltersClick}>
										Clear All
									</p>
								) : null}
							</div>
						}
						open={filterOptionsVisible}
						onCancel={() => setFilterOptionsVisible(false)}
						footer={[
							<button
								key="submit"
								className="bg-gradient-to-r from-brand to-secondary text-white rounded-md px-4 py-1 shadow-sm font-medium"
								onClick={() => handleFiltersSubmit(filters, false)}>
								Apply Filters
							</button>
						]}
						width={550}
						centered
						destroyOnClose
					>
						<div className="max-h-[60vh] overflow-y-auto pr-2">
							<AdditionalAttributes
								additionalAttributesToShow={filtersToShow}
								attributesData={filters}
								handleAdditionalAttributesChange={onFiltersChange}
								handleFiltersOptionalChange={handleFiltersOptionalChange}
								gridClassName="grid-cols-1 md:grid-cols-2 gap-4 pb-2"
								fontSizeTheme="text-sm"
								fontColorTheme="text-[#4c5672] font-medium"
								selectBoxSize="default"
							/>
						</div>
					</Modal>
				)}
			</div>
			{isGuestPopUpShow ? (
				<GuestPopUp
					handleGuestSubmit={handleGuestSubmit}
					errors={errors}
					handleGuestSkip={handleGuestSkip}
					guestChange={guestChange}
					guestData={guestData}
					setIsPopupShow={setIsPopupShow}
				/>
			) : (
				""
			)}

			{isAuraChatPage && <WishListModal />}
		</>
	);
};

export default AuraResponseProducts;



