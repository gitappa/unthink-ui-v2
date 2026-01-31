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
import { CustomFilter } from "../customFilter/CustomFilter";
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
	]);

	const [filterOptionsVisible, setFilterOptionsVisible] = useState(false);
	const [enableSelectProduct, setEnableSelectProduct] = useState(false);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [customFilter, setCustomFilter] = useState([]);
	const [showCustomFilterInput, setShowCustomFilterInput] = useState(false);
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
		const finalFilters = removeEmptyItems(newFilters);
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
		const customFilterArrayToString = hashTags.toString();
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
		},1);
	};

	const handleChangeFilters = (newFilters) => {
		dispatch(setSuggestionsProductsFilters(tag, newFilters));
	};


	const filtersToShow = useMemo(() => {
		return displayFilters
			.filter((filter) => filter.key !== "custom_filter")
			.map((filter) => {
				if (
					filter.key in availableFilters &&
					(filter.input_type === "multi_select" ||
						filter.input_type === "single_select")
				) {
					filter.display_value = availableFilters[filter.key];
				}
				return filter;
			});
	}, [displayFilters, availableFilters]);

	const onProductClick = () => {
		if (enableClickFetchRec) dispatch(handleRecProductClick());
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
		setSelectedProducts((prev) => {
			if (prev.includes(mfr_code)) {
				return prev.filter((code) => code !== mfr_code);
			} else {
				return [...prev, mfr_code];
			}
		});
	};

	const onSelectAllChange = () => {
		const currentProducts = productsCache[currentTag] || [];
		const currentProductCodes = currentProducts.map((p) => p.mfr_code);

		setSelectedProducts((prev) => {
			// If all are already selected, deselect all
			if (currentProductCodes.every((code) => prev.includes(code))) {
				return prev.filter((code) => !currentProductCodes.includes(code));
			}
			// Otherwise select all (including any previously selected from other tags)
			else {
				const newSelected = [...prev];
				currentProductCodes.forEach((code) => {
					if (!newSelected.includes(code)) {
						newSelected.push(code);
					}
				});
				return newSelected;
			}
		});
	};

	const handleSaveOrShareClick = () => {
		onSelectAllChange();
		setEnableSelectProduct(true);
	};

	const onSaveOrShareProductsClick = useCallback(
		({ isSave = false, isShare = false, isSkip = false }) => {
			const isUserLoginCokkies = Cookies.get("isGuestLoggedIn") === "true";
			guestActionRef.current = isSave ? "save" : "share";

			const isSkipPopUp = isSkip && guestActionRef.current === "share";

			if (!isUserLogin && !isUserLoginCokkies && !isSkipPopUp) {
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
			};

			if (isSave) {
				dispatch(
					setProductsToAddInWishlist(SelectedProductsData, {
						...createWishlistData,
					})
				);
				dispatch(openWishlistModal());
				if (isUserLoginCokkies) {
					dispatch(setIsCreateWishlist(true));
				}
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
		({ isShowCustomFilterInput = false }) => {
			setShowCustomFilterInput(isShowCustomFilterInput);
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
			onSaveOrShareProductsClick({ isShare: true, isSkip: true });
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
						setCookie(COOKIE_TT_ID, user_id, SIGN_IN_EXPIRE_DAYS);
						dispatch(getUserInfo());
						Cookies.set("isGuestLoggedIn", true, {
							expires: SIGN_IN_EXPIRE_DAYS,
						});
						if (guestActionRef.current === "save") {
							onSaveOrShareProductsClick({ isSave: true });
						} else if (guestActionRef.current === "share") {
							onSaveOrShareProductsClick({ isShare: true });
						}
					}
				} catch (error) {
					console.log(error);
				}
			}
		},
		[guestData.email, onSaveOrShareProductsClick]
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

	return (
		<>
			<div id={elementId}>
				{!isLoading ? (
					<>
						{enableCustomFilter || enableFilters ? (
							<div className={styles['aura-products-filter-header']}>
								{enableCustomFilter ? (
									<CustomFilter
										customFilterStringData={filters.custom_filter}
										handleSaveEditCustomFilter={handleSaveEditCustomFilter}
										hashtagsThemeClassName='text-black-102'
										customFilter={customFilter}
										setCustomFilter={setCustomFilter}
										handleCustomFilterChange={handleCustomFilterChange}
										showCustomFilterInput={showCustomFilterInput}
										setShowCustomFilterInput={setShowCustomFilterInput}
										checkAndShowContainer={checkAndShowContainer}
									/>
								) : null}
								{enableFilters ? (
									<div
										className={styles['aura-products-filter-toggle']}
										onClick={() =>
											setFilterOptionsVisible(!filterOptionsVisible)
										}>
										<Image
											src={filterIcon}
											alt='Filters'
											width={28}
											height={28}
											className={styles['aura-products-filter-icon']}
										/>
										<p className={styles['aura-products-filter-text']}>
											Filters
										</p>
									</div>
								) : null}
							</div>
						) : null}

						{isFiltersAvailable ? (
							<div className={styles['aura-products-filters-tags-container']}>
								<ProductFiltersTags
									productFilters={filters}
									handleFiltersInputClear={handleFiltersInputClear}
									handleClearFiltersClick={handleClearFiltersClick}
									displayFilters={filtersToShow}
									tagThemeClassName='border border-slat-103 text-slat-103 text-base py-0.5 px-2'
									clearFiltersThemeClassName='text-slat-103'
								/>
							</div>
						) : null}

						{enableFilters && filterOptionsVisible ? (
							<>
								<div className={styles['aura-products-filter-panel']}>
									<div className={styles['aura-products-filter-panel-header']}>
										<h4 className={styles['aura-products-filter-panel-title']}>Filter Products</h4>
										<div className={styles['aura-products-filter-panel-controls']}>
											{isFiltersAvailable ? (
												<p
													className={styles['aura-products-filter-clear-all']}
													role='button'
													onClick={handleClearFiltersClick}>
													Clear All
												</p>
											) : null}
											<button
												className={styles['aura-products-filter-go-button']}
												onClick={() => handleFiltersSubmit(filters, false)}
												role='button'>
												Go
											</button>
											<CloseOutlined
												className={styles['aura-products-filter-close']}
												role='button'
												title='close filters'
												onClick={() => setFilterOptionsVisible(false)}
											/>
										</div>
									</div>

									<AdditionalAttributes
										additionalAttributesToShow={filtersToShow}
										attributesData={filters}
										handleAdditionalAttributesChange={onFiltersChange}
										handleFiltersOptionalChange={handleFiltersOptionalChange}
									/>
								</div>
							</>
						) : null}

						{chatProductsDataToShow.length ? (
							<div className={styles['aura-products-selection-controls']}>
								{enableSelectProduct ? (
									<div className={styles['aura-products-selected-items']}>
										<div className={styles['aura-products-checkbox-group']}>
											<Checkbox
												className={styles['aura-products-checkbox-text-xs']}
												indeterminate={
													isTagProductSelected && !isTagProductsAllSelected
												}
												onChange={onSelectAllChange}
												checked={isTagProductsAllSelected}>
												{selectedProducts.length} Selected
											</Checkbox>
										</div>
										<p
											onClick={() => handleResetSelectProduct()}
											className={styles['aura-products-action-link']}
											role='button'>
											Cancel
										</p>
									</div>
								) : (
									<p
										className={styles['aura-products-select-prompt']}
										role='link'
										onClick={() => setEnableSelectProduct(true)}
										title='Click and select multiple products to build your own collection'>
										Select products to build your own collection
									</p>
								)}
								{enableSelectProduct ? (
									<div className={styles['aura-products-action-buttons-container']}>
										{is_store_instance && (
											<div className={styles['aura-products-button-save-container']}>
												<button
												className={styles['aura-products-action-button']}
													onClick={() =>
														onSaveOrShareProductsClick({ isSave: true })
													}
													title='Select and add products to collection'>
													Save
												</button>
											</div>
										)}
										<div className={styles['aura-products-button-share-container']}>
											<button
												className={styles['aura-products-action-button']}
												onClick={() =>
													onSaveOrShareProductsClick({ isShare: true })
												}
												title='Select products and share published collection'>
												Share
											</button>
										</div>
									</div>
								) : (
									<div className={styles['aura-products-action-links']}>
										{is_store_instance && (
											<>
												<p
													className={styles['aura-products-action-text-link']}
													role='link'
													onClick={handleSaveOrShareClick}
													title='Click and select multiple products to save to collection'>
													Save
												</p>
												<span className={styles['aura-products-action-divider']}>
													|
												</span>
											</>
										)}
										<p
											className={styles['aura-products-action-text-link']}
											role='link'
											onClick={handleSaveOrShareClick}
											title='Click and select multiple products to share'>
											Share
										</p>
									</div>
								)}
							</div>
						) : null}
					</>
				) : null}
				{isLoading ? (
					<div className={styles['aura-products-loading-container']}>
						<Spin
							indicator={
								<Loading3QuartersOutlined
									className={styles['aura-products-loading-icon']}
									spin
								/>
							}
						/>
					</div>
				) : (
					<>
						<div
							id='chat_products_inner_content'
							className={styles['aura-products-grid']}>
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
\t\t\t\t</div>
\t\t\t\t<div className={styles['aura-products-carousel-controls']}>
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
											/>
										</SwiperSlide>
									))}
								</Swiper>
							</>
						) : (
							""
						)}

						{chatProductsDataToShow.length >= 15 && !isEmpty(tag) && (
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




