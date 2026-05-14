import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AuraResponseProducts.module.css";
import { Select, Spin, Input, Checkbox, Button, Modal } from "antd";
import {
	Loading3QuartersOutlined,
	CloseOutlined,
	CloseCircleOutlined,
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
import filterStyles from "../productFilters/productFilters.module.scss";
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
	layoutMode
}) => {
	const [
		authUser,
		isUserLogin,
		chatMessage,
		chatImageUrl,
		storeData,
		widgetHeaderRequest,
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
 
	const isFiltersAvailable = useMemo(() => {
		const finalFilters = removeEmptyItems(filters);
		for (const key in finalFilters) {
			if (key !== "custom_filter") {
				return true;
			}
		}
		return false;
	}, [filters]);

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
		if (enableSelectProduct) {
			handleResetSelectProduct();
		} else {
			setEnableSelectProduct(true);
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
		handleChangeFilters({ ...filters, [name]: value });
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

	const isCurrentTagLoading = (tag && !suggestionsProducts?.[tag]) || isLoading || showChatLoader;

	return (
		<>
			<div id={elementId}>
				<div className={styles['aura-products-main-content']}>
					{!isCurrentTagLoading ? (
					<>
						{enableFilters ? (
							<div className={styles['aura-products-filters-tags-container']}>
								<ProductFiltersTags
									productFilters={filters}
									handleFiltersInputClear={handleFiltersInputClear}
									handleClearFiltersClick={handleClearFiltersClick}
									displayFilters={filtersToShow.filter(f => f.key !== 'custom_filter')}
									isShowCustomFilter={true}
									isShowHashtagButton={false}
									handleSaveEditCustomFilter={handleSaveEditCustomFilter}
									tagThemeClassName={filterStyles.tagPillAura}
									clearFiltersThemeClassName={filterStyles.clearFiltersAura}
									handleFilterOptionsVisibleChange={currentTag === 'all' ? undefined : setFilterOptionsVisible}
									filterOptionsVisible={filterOptionsVisible}
								/>
							</div>
						) : null}


						{chatProductsDataToShow.length ? (
							<div className={styles['aura-products-selection-controls']}>
								<div className={styles['aura-products-selected-items']}>
									<div className={styles['aura-products-checkbox-group']}>
										<Checkbox
											className={styles['aura-products-checkbox-text-xs']}
											onChange={onSelectAllChange}
											checked={enableSelectProduct}>
											{selectedProducts.length} Selected
										</Checkbox>
									</div>
									{selectedProducts.length > 0 && (
										<p
											onClick={() => handleResetSelectProduct()}
											className={styles['aura-products-action-link']}
											role='button'>
											Clear
										</p>
									)}
								</div>
								<div className={styles['aura-products-action-buttons-container']}>
									{is_store_instance && (
										<div className={styles['aura-products-button-save-container']}>
											<button
												className={styles['aura-products-action-button']}
												onClick={(e) =>
													onAddSelectedProductsToCollection(e, { isSave: true })
												}
												title='Select and add products to collection'>
												Save
											</button>
										</div>
									)}
									<div className={styles['aura-products-button-share-container']}>
										<button
											className={styles['aura-products-action-button']}
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
									style={{ fontSize: 36, color: '#7268ec' }}
									spin
								/>
							}
						/>
						<span className="text-[#7268ec] font-semibold text-sm tracking-wide">
							Searching products...
						</span>
					</div>
				) : (
					<>
						<div
							id='chat_products_inner_content'
							className={`${styles['aura-products-grid-custom']} ${layoutMode === "both" ? styles["aura-products-grid-split"] : ""}`}
						>
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
								<div className={styles['aura-products-section-header']}>
									<div className={styles['aura-products-section-title']}>
										Recommendations
									</div>
									<div className={styles['aura-products-carousel-controls']}>
										<button
											id='custom-prev'
											className={styles['aura-products-carousel-button']}>
											<FaRegArrowAltCircleLeft />
										</button>
										<button
											id='custom-next'
											className={styles['aura-products-carousel-button']}>
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
								<div className={styles['aura-products-section-header']}>
									<div className={styles['aura-products-section-title']}>
										More Results
									</div>
									<div className={styles['aura-products-carousel-controls']}>
										<button
											id='more-prev'
											className={styles['aura-products-carousel-button']}>
											<FaRegArrowAltCircleLeft />
										</button>
										<button
											id='more-next'
											className={styles['aura-products-carousel-button']}>
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
							<div className={styles['aura-products-load-more-container']}>
								<button
									className={styles['aura-products-load-more-button']}
									onClick={() => {
										setLoadingStates((prev) => ({
											...prev,
											loadingMore: true,
										}));

										setTimeout(() => {
											handleLoadMoreSubmit(filters); // Actual data fetch
										}, 1000); // 3 seconds delay
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
						title={
							<div className={styles['aura-products-filter-modal-header']}>
								<h4 className={styles['aura-products-filter-panel-title']}>Filter Products</h4>
								{isFiltersAvailable ? (
									<p
										className={styles['aura-products-filter-clear-all']}
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
								className={styles['aura-products-filter-go-button']}
								onClick={() => handleFiltersSubmit(filters, false)}>
								Apply Filters
							</button>
						]}
						width={550}
						centered
						className={styles['aura-products-filter-modal']}
						destroyOnClose
					>
						<div className={styles['aura-products-filter-modal-content']}>
							<AdditionalAttributes
								additionalAttributesToShow={filtersToShow}
								attributesData={filters}
								handleAdditionalAttributesChange={onFiltersChange}
								handleFiltersOptionalChange={handleFiltersOptionalChange}
								gridClassName="grid-cols-1 md:grid-cols-2 gap-4"
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




