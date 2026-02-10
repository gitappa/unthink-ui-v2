import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import {
	Select,
	Tooltip,
	Checkbox,
	Input,
	Spin,
	Upload,
	notification,
} from "antd";
import {
	// InfoCircleOutlined,
	// EditOutlined,
	SettingFilled,
	RightOutlined,
	PlusOutlined,
	CloseOutlined,
	UploadOutlined,
	LoadingOutlined,
	InfoCircleOutlined,
	Loading3QuartersOutlined,
} from "@ant-design/icons";

import { updateWishlist } from "../wishlistActions/updateWishlist/redux/actions";
// import PublishingOptionsDropdown from "./PublishingOptionsDropdown";
import AuraChatSettingModal from "../auraChatSettingModal";
import ImproveContentModal from "./ImproveContentModal";
// import CustomProductModal from "../customProductModal/CustomProductModal";
import { checkIsFavoriteCollection, isEmpty } from "../../helper/utils";
import { collectionAPIs, collectionPageAPIs, profileAPIs } from "../../helper/serverAPIs";
import { AuraChatSettingModalModes } from "../auraChatSettingModal/AuraChatSettingModal";
import CollectionEditTags from "../collectionEditTags/CollectionEditTags";
import {
	COLLECTION_GENERATED_BY_BLOG_BASED,
	COLLECTION_GENERATED_BY_DESC_BASED,
	COLLECTION_GENERATED_BY_VIDEO_BASED,
	COLLECTION_GENERATED_BY_IMAGE_BASED,
	COLLECTION_GENERATED_BY_SEARCH_BASED,
	// COLLECTION_COVER_IMG_SIZES,
	IN_PROGRESS,
	PUBLISHED,
	TAGS_TITLE,
	favorites_collection_name,
	COLLECTION_GENERATED_BY_MY_PRODUCTS_BASED,
} from "../../constants/codes";

import AdditionalAttributes from "../productFilters/AdditionalAttributes";
import ProductFiltersTags from "../productFilters/ProductFiltersTags";
import { CustomFilter } from "../customFilter/CustomFilter";
import ReviewCollectionContainerWrapper from "./ReviewCollectionContainerWrapper";

import Image from "next/image";
import filterIcon from "../../images/filter_outline.svg";
import { current_store_name, is_store_instance } from "../../constants/config";
import { replaceAndUpdateUserCollectionData } from "../Auth/redux/actions";

const default_description_textarea_rows = 10;

// export const gendersList = ["male", "female", "unisex"];
// export const ageGroupList = ["adult", "kids", "toddler", "infant"];
// export const brandsList = [
// 	"Alexis Bittar",
// 	"Alloy Apparel",
// 	"Amanda Uprichard",
// 	"Apex Foot",
// 	"BABOR USA",
// 	"Bebe",
// 	"Betabrand",
// 	"BlankNYC",
// 	"Bollman Hat Co.",
// 	"BrandsMart USA",
// 	"Brook and York",
// 	"Brookstone",
// 	"BuddyLove",
// 	"CBAZAAR-World's Largest Online Indian Ethnic Wear",
// 	"Colorescience",
// 	"Design Essentials",
// 	"Dorothee Schumacher - INT",
// 	"Dr Vranjes Global",
// 	"Eastern Mountain Sports",
// 	"Fabletics - North America",
// 	"Frederick's of Hollywood",
// 	"GiGi New York / Graphic Image",
// 	"Happy Feet Plus: Shoes, Sandals and Clogs",
// 	"Hardtail Forever",
// 	"Harman",
// 	"Hip Hop Bling",
// 	"Hurley",
// 	"JCPenney Affiliate",
// 	"Justice",
// 	"KarenKane.com",
// 	"Kenneth Cole",
// 	"Maaji",
// 	"ModCloth",
// 	"Monoprice.com",
// 	"Muck Boot US",
// 	"NastyGal",
// 	"Netaya.com",
// 	"Perry Ellis",
// 	"Potpourri Group",
// 	"Rexing",
// 	"Rimowa US",
// 	"Robert Graham",
// 	"TVStoreOnline.com & UglyChristmasSweater.com",
// 	"Targus",
// 	"The Walking Company",
// 	"Trina Turk",
// 	"United Sports Brands",
// 	"UpWest",
// 	"Wolford",
// 	"Xtratuf",
// ];
// export const discountsList = [
// 	"above 20",
// 	"above 40",
// 	"above 60",
// 	"above 80",
// 	"no discount",
// ];

const { Option } = Select;
const { Dragger } = Upload;

const ReviewCollectionStepContent = ({
	onTryAgainClick,
	onFetchTagsWithAI,
	updatedData: updatedCollectionData,
	handleInputChange,
	currentCollection,
	errors,
	handleTagsChange,
	handleCategoryTagsChange,
	handleChangeView,
	handlePreviewCollectionPage,
	handleUploadedDataChange,
	handleDiscard,
	STEPS,
	handleConfirmRefetchProducts,
	isProductsFetchedForNewColl,
	isCategoryTagsEnabled,
	isNewCollection,
	handleSettingsInputChange,
	handleSettingsInputClear,
	handleSettingsTagsInputChange,
	handleSettingsStrictSelectChange,
	showSettings,
	availableFilters,
	displayableFilter,
	setUpdatedData,
	checkIsTagsChanged,
	filtersToShow,
	filters,
	setFilters,
	onFiltersChange,
	handleFiltersOptionalChange,
	selectedTags,
	setSelectedTags,
	showEditTagsInput,
	setShowEditTagsInput,
	editTagsError,
	setEditTagsError,
	isFiltersAvailable,
	customFilterStoreData,
	customFilter,
	setCustomFilter,
	handleCustomFilterChange,
	updateKeywordTagMap,
	isGeneratedByBlog,
	isGeneratedByImage,
	isGeneratedByDesc,
	isGeneratedByVideo,
	showCustomFilterInput,
	setShowCustomFilterInput,
	checkAndShowContainer,
	setIsLoading,
	isLoading,
	updatedKeywordTagMap,
	isGeneratedByMyProducts
	// isSamskaraInstance,
}) => {
	const [auraChatSetting, authUser] = useSelector((state) => [
		state.chatV2.auraChatSetting,
		state.auth.user.data,
	]);

	const textAreaRef = useRef(null);

	// const [settingsOpen, setSettingsOpen] = useState(false);
	const [settingModalOpen, setSettingModalOpen] = useState(false);
	const [showTags, setShowTags] = useState(false);
	// const [showAddIcon, setShowAddIcon] = useState(true);
	const [isUploading, setIsUploading] = useState(false);
	const [filterOptionsVisible, setFilterOptionsVisible] = useState(false);
	const [improveContentData, setImproveContentData] = useState({
		isOpen: false,
	});

	const [isFetchProductsInProgress, setFetchProductsInProgress] =
		useState(false);

	// for loading
	const showBackdropLoader = useMemo(
		() =>
			isFetchProductsInProgress ||
			isLoading ||
			!currentCollection._id,
		[
			isFetchProductsInProgress,
			isLoading,
			currentCollection._id,
		]
	);

	// const tagInputRef = useRef(null);

	const dispatch = useDispatch();

	const updatedData = useMemo(() => {
		const obj = {
			...updatedCollectionData,
			settings: {
				optional_filters: updatedCollectionData.settings.optional_filters,
			},
		};

		displayableFilter.forEach((v) => {
			obj.settings[v] = updatedCollectionData.settings[v];
		});

		return obj;
	}, [updatedCollectionData, displayableFilter]);

	let descriptionTextAreaResizeTimer;
	const handleDescriptionTextAreaResize = () => {
		clearTimeout(descriptionTextAreaResizeTimer);
		descriptionTextAreaResizeTimer = setTimeout(() => {
			if (textAreaRef.current && updatedData.description) {
				// We need to reset the height momentarily to get the correct scrollHeight for the textarea
				textAreaRef.current.style.height = "auto";
				const scrollHeight = textAreaRef.current.scrollHeight;

				// We then set the height directly, outside of the render loop
				// Trying to set this with state or a ref will product an incorrect value.
				textAreaRef.current.style.height =
					+scrollHeight +
					21 + // line height
					"px";
			}
		}, 100);
	};

	useEffect(() => {
		handleDescriptionTextAreaResize();
	}, [textAreaRef.current, updatedData.description]);

	const handleFetchProductsClick = useCallback(() => {
		const reFetchProductsRequired = isProductsFetchedForNewColl !== false;

		handleChangeView(STEPS.PRODUCTS, {
			reFetchProductsCalled: reFetchProductsRequired,
			checkReFetchProductsCalled: true,
		});

		if (reFetchProductsRequired) {
			// for new collection it will be auto handled in one of the useEffects
			if (isCategoryTagsEnabled) {
				handleConfirmRefetchProducts({
					newTags: updatedData.blog_filter,
					settings: updatedData.settings,
					category_tags: updatedData.category_tags,
				});
			} else {
				handleConfirmRefetchProducts({
					newTags: updatedData.blog_filter,
					settings: updatedData.settings,
				});
			}
		}
	}, [
		isProductsFetchedForNewColl,
		handleConfirmRefetchProducts,
		isCategoryTagsEnabled,
	]);

	const showSettingsMode = useMemo(() => {
		switch (currentCollection.generated_by) {
			case COLLECTION_GENERATED_BY_DESC_BASED:
				return AuraChatSettingModalModes.COLLECTION;
			case COLLECTION_GENERATED_BY_BLOG_BASED:
				return AuraChatSettingModalModes.BLOG_COLLECTION;
			case COLLECTION_GENERATED_BY_VIDEO_BASED:
				return AuraChatSettingModalModes.VIDEO_COLLECTION;
			case COLLECTION_GENERATED_BY_IMAGE_BASED:
				return AuraChatSettingModalModes.IMAGE_COLLECTION;
			default:
				return AuraChatSettingModalModes.COLLECTION;
		}
	}, [currentCollection.generated_by]);

	const handleSettingsClick = () => {
		setSettingModalOpen(true);
	};

	const closeSettingModal = () => {
		setSettingModalOpen(false);
	};

	// useEffect(() => {
	// 	if (
	// 		(showTags && isNewCollection && !isEmpty(updatedData.blog_filter)) ||
	// 		currentCollection.generated_by === COLLECTION_GENERATED_BY_BLOG_BASED
	// 	) {
	// 		setShowTags(false);
	// 	}
	// }, [showTags, updatedData.blog_filter, currentCollection.generated_by]);

	const tagSelectInputContainer = document.querySelector(
		".review_collection_content_tags_input .ant-select-selection-overflow"
	);

	// const handleShowAddIcon = (value) => {
	// 	setShowAddIcon(value);
	// };
	// const handleFocusTagInput = () => {
	// 	tagInputRef.current.focus();
	// };

	// const getPriceRangeText = (priceRange) => {
	// 	if (!isEmpty(priceRange?.min) && !isEmpty(priceRange?.max)) {
	// 		return priceRange.min + " - " + priceRange.max;
	// 	} else {
	// 		return "";
	// 	}
	// };

	const uploadImageProps = useMemo(
		() => ({
			accept: "image/*",
			multiple: false,
			customRequest: async (info) => {
				try {
					setIsUploading(true);
					if (info?.file) {
						const response = await profileAPIs.uploadImage({
							file: info.file,
							// custom_size: COLLECTION_COVER_IMG_SIZES, // no need to crop image when we generate content from this
						});
						if (response?.data?.data && response.data.data[0]) {
							handleUploadedDataChange(
								info.filename,
								response.data.data[0]?.other_dimensions?.["340X340"]?.[0]
									?.url || response.data.data[0]?.url
							); // API call and updating local state with updated value
						}
					}
				} catch (error) {
					notification["error"]({
						message: "Failed to upload image",
					});
				}
				setIsUploading(false);
			},
		}),
		[handleUploadedDataChange]
	);

	const uploadVideoProps = useMemo(
		() => ({
			accept: ".mp4",
			multiple: false,
			customRequest: async (info) => {
				try {
					setIsUploading(true);
					if (info?.file) {
						const response = await profileAPIs.uploadVideo({
							file: info.file,
						});
						if (response?.data?.data && response.data.data[0]) {
							handleUploadedDataChange(
								info.filename,
								response.data.data[0]?.url
							); // API call and updating local state with updated value
						}
					}
				} catch (error) {
					notification["error"]({
						message: "Failed to upload video",
					});
				}
				setIsUploading(false);
			},
		}),
		[handleUploadedDataChange]
	);

	// const selectedFiltersArr = useMemo(
	// 	() => [
	// 		{
	// 			title: "Gender",
	// 			value: updatedData.settings?.gender?.join(", "),
	// 			visible: !isEmpty(updatedData.settings?.gender),
	// 			name: "gender",
	// 			showClose: true,
	// 		},
	// 		{
	// 			title: "Age group",
	// 			value: updatedData.settings?.age_group?.join(", "),
	// 			visible: !isEmpty(updatedData.settings?.age_group),
	// 			name: "age_group",
	// 			showClose: true,
	// 		},
	// 		{
	// 			title: "Discount",
	// 			value: updatedData.settings?.discount?.join(", "),
	// 			visible: !isEmpty(updatedData.settings?.discount),
	// 			name: "discount",
	// 			showClose: true,
	// 		},
	// 		{
	// 			title: "Brand",
	// 			tooltipTitle: updatedData.settings?.brand
	// 				? updatedData.settings.brand.join(", ")
	// 				: "",
	// 			value: updatedData.settings?.brand
	// 				? updatedData.settings.brand.length > 4
	// 					? updatedData.settings.brand.slice(0, 4).join(", ") + ", ..."
	// 					: updatedData.settings.brand.join(", ")
	// 				: "",
	// 			visible: !isEmpty(updatedData.settings?.brand),
	// 			name: "brand",
	// 			showClose: true,
	// 		},
	// 		{
	// 			title: "Room",
	// 			value: updatedData.settings?.occasion?.join(", "),
	// 			visible: !isEmpty(updatedData.settings?.occasion),
	// 			name: "occasion",
	// 			showClose: true,
	// 		},
	// 		{
	// 			title: "Custom filter",
	// 			value: updatedData.settings?.custom_filter,
	// 			visible: !isEmpty(updatedData.settings?.custom_filter),
	// 			name: "custom_filter",
	// 			showClose: true,
	// 		},
	// 		{
	// 			title: "Color",
	// 			value: updatedData.settings?.color?.join(", "),
	// 			visible: !isEmpty(updatedData.settings?.color),
	// 			name: "color",
	// 			showClose: true,
	// 		},
	// 		{
	// 			title: "Price Range",
	// 			value: getPriceRangeText(updatedData?.settings?.price),
	// 			visible: !!getPriceRangeText(updatedData?.settings?.price),
	// 			name: "price",
	// 			showClose: true,
	// 		},
	// 		{
	// 			title: "Material",
	// 			value: updatedData.settings?.material?.join(", "),
	// 			visible: !isEmpty(updatedData.settings?.material),
	// 			name: "material",
	// 			showClose: true,
	// 		},
	// 		{
	// 			title: "Pattern",
	// 			value: updatedData.settings?.pattern?.join(", "),
	// 			visible: !isEmpty(updatedData.settings?.pattern),
	// 			name: "pattern",
	// 			showClose: true,
	// 		},
	// 		{
	// 			title: "Style",
	// 			value: updatedData.settings?.style?.join(", "),
	// 			visible: !isEmpty(updatedData.settings?.style),
	// 			name: "style",
	// 			showClose: true,
	// 		},
	// 	],
	// 	[JSON.stringify(updatedData.settings)]
	// );

	// const MultiSelectFilters = ({ key, label }) => {
	// 	return (
	// 		<>
	// 			<div>
	// 				<div className='flex justify-between mb-0.75'>
	// 					<label className='text-base text-gray-103 block'>{label}</label>
	// 					<div className='flex items-center'>
	// 						<label className='text-gray-103 block mr-1'>Optional</label>
	// 						<Checkbox
	// 							className='text-gray-103'
	// 							onChange={() => handleSettingsStrictSelectChange(key)}
	// 							checked={updatedData.settings?.optional_filters?.includes(
	// 								key
	// 							)}></Checkbox>
	// 					</div>
	// 				</div>
	// 				<Select
	// 					mode='multiple'
	// 					name={key}
	// 					className='w-full text-base tag-select-input'
	// 					placeholder={`select ${key}`}
	// 					value={updatedData.settings?.[key] || []}
	// 					size='large'
	// 					onChange={(values) =>
	// 						handleSettingsTagsInputChange(key, values)
	// 					}>
	// 					{availableFilters?.[key]?.map((v) => (
	// 						<Option value={v}>{v}</Option>
	// 					))}
	// 				</Select>
	// 			</div>
	// 		</>
	// 	);
	// };

	const handleEditTagsBtnClick = useCallback(() => {
		setShowEditTagsInput(true);
		setSelectedTags([]);
	}, []);

	const handleTagClick = useCallback(({ tag }) => {
		setSelectedTags(() => [tag]);
	}, []);

	const handleEditTagsCancel = useCallback(() => {
		setShowEditTagsInput(false);
		setEditTagsError("");
		setUpdatedData({
			...updatedData,
			blog_filter: currentCollection?.tags,
		});
	}, [currentCollection?.tags, updatedData]);

	const onUpdatedWishlist = useCallback(
		async ({
			newTags,
			collection_name = updatedData.collection_name,
			image_url = updatedData.image_url,
			blog_url = updatedData.blog_url,
			video_url = updatedData.video_url,
			description = updatedData.description,
			description_old = updatedData.description_old,
			tags = newTags || updatedData.blog_filter,
			keyword_tag_map,
			fetchUserCollection = true,
			// update Tag
			refetchFlag,
			added,
			deleted,
			latest,
			additionalTagsAdded,
			additionalTagsDeleted,
			additionalTagsLatest,
			filters,
			useUpdateTag

		}) => {
			console.log('keyword_tag_map', keyword_tag_map);

			const editPayload = {
				_id: currentCollection._id,
				collection_name,
				image_url,
				blog_url,
				video_url,
				description,
				description_old,
				tags,
				keyword_tag_map,
				fetchUserCollection,
				userbrand: authUser?.filters?.[current_store_name]?.strict?.brand || [],

			};

			const updateTagsAPIPayload = {
				collection_id: currentCollection._id,
				added_tags: added,
				deleted_main_tags: deleted,
				latest_main_tags: latest,
				added_addon_tags: additionalTagsAdded,
				delete_addon_tags: additionalTagsDeleted,
				tag_filters: filters,
				latest_addon_tags: additionalTagsLatest,
				user_query:
					currentCollection.generated_by ===
						COLLECTION_GENERATED_BY_DESC_BASED
						? updatedData.description_old
						: "",
				store: is_store_instance ? current_store_name : undefined,
				refetch: refetchFlag || undefined,
			};

			if ((currentCollection.description !== updatedData.description) || (currentCollection.keyword_tag_map !== updatedData.keyword_tag_map)) {
				dispatch(updateWishlist(editPayload));
			}

			if (useUpdateTag && !isGeneratedByMyProducts && (isProductsFetchedForNewColl === true || isProductsFetchedForNewColl === null)) {

				setFetchProductsInProgress(true)

				let updateTagsResponse = await collectionPageAPIs.updateTagsAPICall(
					updateTagsAPIPayload
				);

				if (
					updateTagsResponse.data &&
					updateTagsResponse.data.status_code === 200 &&
					updateTagsResponse.data.data &&
					updateTagsResponse.data.data._id
				) {
					dispatch(
						replaceAndUpdateUserCollectionData(updateTagsResponse.data.data)
					);
				}

				setFetchProductsInProgress(false)


			} else {

				dispatch(updateWishlist(editPayload));

			}

		},
		[
			currentCollection._id,
			updatedData.collection_name,
			updatedData.image_url,
			updatedData.blog_url,
			updatedData.video_url,
			updatedData.description,
			updatedData.description_old,
			updatedData.blog_filter,
			updatedData.keyword_tag_map,
		]
	);

	const handleEditTagsSaveClick = () => {
		if (updatedData?.blog_filter?.length) {
			let newTags = updatedData.blog_filter.filter(tag => !currentCollection.tags.includes(tag));
			const deletedTags = currentCollection.tags.filter(tag => !updatedData.blog_filter.includes(tag));

			currentCollection.tags.forEach(tag => {
				const currentMap = typeof currentCollection.keyword_tag_map?.[tag] === 'object'
					? currentCollection.keyword_tag_map[tag]
					: {};

				const updatedMap = typeof updatedData.keyword_tag_map?.[tag] === 'object'
					? updatedData.keyword_tag_map[tag]
					: {};

				const isTagStillPresent = updatedData.blog_filter.includes(tag);
				const isKeywordEdited = JSON.stringify(currentMap) !== JSON.stringify(updatedMap);

				if (isTagStillPresent && isKeywordEdited && !newTags.includes(tag)) {
					console.log(tag, "keyword changed");
					newTags.push(tag); // Add tag if its keyword data changed
				}
			});

			if (checkIsTagsChanged(updatedData.blog_filter, currentCollection.tags)) {
				const filteredKeywordTagMap = {};
				updatedData.blog_filter.forEach(tag => {
					if (updatedData?.keyword_tag_map?.[tag]) {
						filteredKeywordTagMap[tag] = updatedData.keyword_tag_map[tag];
					}
				});

				const updatePayload = {
					latest: updatedData.blog_filter,
					keyword_tag_map: updatedData?.keyword_tag_map,
					filters: filteredKeywordTagMap,
					refetchFlag: true,
					useUpdateTag: true,
				};

				//  Handle added / deleted / keyword-updated tags
				if (newTags.length > 0 && deletedTags.length === 0) {
					updatePayload.added = newTags;
				} else if (deletedTags.length > 0 && newTags.length === 0) {
					updatePayload.deleted = deletedTags;
				} else if (newTags.length > 0 && deletedTags.length > 0) {
					updatePayload.added = newTags;
					updatePayload.deleted = deletedTags;
				}

				onUpdatedWishlist(updatePayload);
			}

			setShowEditTagsInput(false);
			setEditTagsError("");
		} else {
			setEditTagsError(`Please enter some ${TAGS_TITLE} that indicate the type of products`);
		}
	};


	const handleDeleteTagClick = (e, tagToRemove) => {
		e.stopPropagation();
		if (!tagToRemove) return;
		const removedTag = typeof tagToRemove === "string" ? tagToRemove : tagToRemove[0]; // fix here

		const newTags = updatedData.blog_filter?.filter((t) => t !== removedTag) || [];
		console.log('newTags', newTags);

		// Check for keyword edits of remaining tags
		const updatedKeywordTagMap = updatedData.keyword_tag_map || {};
		const currentKeywordTagMap = currentCollection.keyword_tag_map || {};

		const modifiedTags = newTags.filter((tag) => {
			const updated = updatedKeywordTagMap?.[tag] || {};
			const current = currentKeywordTagMap?.[tag] || {};
			return JSON.stringify(updated) !== JSON.stringify(current);
		});
		console.log('modifiedTags', modifiedTags);

		const filteredKeywordTagMap = Object.fromEntries(
			Object.entries(updatedKeywordTagMap).filter(([key]) => key !== removedTag)
		);
		console.log('filteredKeywordTagMap', filteredKeywordTagMap);

		const updatePayload = {
			latest: newTags,
			deleted: [removedTag],
			added: modifiedTags,
			keyword_tag_map: filteredKeywordTagMap,
			filters: filteredKeywordTagMap,
			refetchFlag: true,
			useUpdateTag: true,
			newTags
		};
		onUpdatedWishlist(updatePayload);
	};



	const handleClearFiltersClick = async () => {
		setFilters({});
		updateKeywordTagMap({});
	};

	const handleFiltersInputClear = useCallback(
		(name, value) => {
			setFilters((data) => ({
				...data,
				[name]: value,
			}));
			updateKeywordTagMap({ ...filters, [name]: value });
		},
		[filters]
	);

	const handleSaveEditCustomFilter = ({ custom_filter }) => {
		const finalFilters = {
			...filters,
			custom_filter: custom_filter.toString() || undefined,
		};
		setFilters(finalFilters);
		updateKeywordTagMap(finalFilters);
	};

	//  open improve content modal
	const onImproveContentModalOpen = useCallback(({ regenerate_desc }) => {
		setImproveContentData({
			isOpen: true,
			regenerate_desc,
		});
	}, []);

	// close improve content modal
	const onImproveContentModalClose = useCallback(() => {
		setImproveContentData({});
	}, []);

	const onImproveContentModalContinue = useCallback(
		async (e, user_instruction) => {
			e.preventDefault();
			onImproveContentModalClose();
			setIsLoading(true);
			try {
				const improveContentAPIPayload = {
					user_instruction: user_instruction || undefined,
					previous_output: {
						description: updatedData.description,
						tags: updatedData.blog_filter,
						keyword_tag_map: updatedKeywordTagMap,
						template: auraChatSetting.cc_shortvideo,
					},
					regenerate_description: improveContentData.regenerate_desc,
					userMetadata: {
						brand: authUser?.filters?.[current_store_name]?.strict?.brand || [],
					},
					image_url: updatedData.image_url || undefined,
					blog_url: updatedData.blog_url || undefined,
					video_url: updatedData.video_url || undefined,
				};

				const res = await collectionAPIs.improveContentAPICall(
					improveContentAPIPayload
				);

				const { data: resData } = res;

				if (resData.status_code === 200) {
					const {
						description = "",
						keyword_tag_map = {},
						tags = [],
					} = resData.data;

					if (improveContentData.regenerate_desc) {
						onUpdatedWishlist({ description });
					} else {
						onUpdatedWishlist({ keyword_tag_map, tags });
					}
				}
			} catch (error) {
				console.error(error);
			}
			setIsLoading(false);
		},
		[
			improveContentData,
			currentCollection._id,
			updatedData.description,
			updatedData.blog_filter,
			updatedKeywordTagMap,
			auraChatSetting.cc_shortvideo,
			authUser?.filters?.[current_store_name]?.strict?.brand,
		]
	);

	// showing improve content and improve keywords for all type
	const isShowImproveContent = useMemo(() => true, []);

	return (
		<>
			<ReviewCollectionContainerWrapper>
				<div>
					{/* Title section START */}
					<div className='tablet:flex'>
						<div>
							{/* <p className='md:leading-none font-normal capitalize flex items-center mb-0 text-white'>
						<span className='text-2xl lg:text-3xl break-word-only ellipsis_1'>
							Content
						</span>
						<EditOutlined className='text-2xl flex ml-2 my-auto' />
					</p> */}
						</div>
						<div className='ml-auto flex h-fit-content gap-2'>
							<>
								<button
									type='button'
									onClick={handleDiscard}
									className='text-xs md:text-sm z-10 rounded-xl py-2.5 px-3.5 h-full font-bold text-indigo-103 border-2 border-indigo-103 ml-auto'>
									Cancel
								</button>

								{!isNewCollection && (
									<button
										onClick={handlePreviewCollectionPage}
										className='text-xs md:text-sm z-10 rounded-xl py-2.5 px-3.5 h-full font-bold bg-indigo-103 border-2 border-indigo-103 text-white'
									// isNewCollection ? "bg-indigo-400" : "bg-indigo-600"
									// disabled={isNewCollection}
									>
										{currentCollection.status === PUBLISHED
											? "View"
											: "Preview"}
									</button>
								)}

								<div>
									<button
										onClick={() =>
											handleChangeView(STEPS.PRODUCTS, {
												checkReFetchProductsCalled: true,
											})
										}
										className='hidden lg:inline-block text-xs md:text-sm z-10 rounded-xl py-2.5 px-3.5 h-full font-bold bg-indigo-103 text-white p-3 border-2 border-indigo-103'>
										Next
									</button>
								</div>

								{/* <div className='mt-4 sm:mt-0'>
							<PublishingOptionsDropdown
								handleSelectPublishingOption={handleSelectPublishingOption}
								selectedOption={publishingOption}
								hiddenPublishingOptions={hiddenPublishingOptions}
								isDisabled={isNewCollection}
							/>
						</div> */}
							</>
						</div>
					</div>
					{/* Title section END */}

					<div>
						<label className='text-xl block mb-2'>Title</label>
						{checkIsFavoriteCollection(currentCollection) ? (
							<input
								className='text-left placeholder-gray-101 outline-none px-3 h-10 bg-white rounded-xl w-full cursor-not-allowed text-gray-101 avoid_autofill_bg'
								name='collection_name'
								type='text'
								value={favorites_collection_name}
								disabled
							/>
						) : (
							<input
								className={`text-left placeholder-gray-101 outline-none px-3 h-10 bg-white rounded-xl w-full avoid_autofill_bg`}
								placeholder='Enter collection title'
								name='collection_name'
								type='text'
								value={updatedData.collection_name}
								onChange={handleInputChange}
							/>
						)}
					</div>

					{isGeneratedByBlog ? (
						<div>
							<div className='flex justify-between mt-4 mb-2'>
								<div>
									<p className='mb-0 text-xl'>Blog/Article URL</p>
								</div>
								{showSettings ? (
									<div className='text-base'>
										<span
											className='cursor-pointer flex items-center'
											onClick={handleSettingsClick}
											role='button'>
											<SettingFilled
												id='create_collection_setting_icon'
												className='flex mr-1'
											/>
											Settings
										</span>
									</div>
								) : null}
							</div>
							<div className='bg-slate-100 rounded-xl'>
								<input
									name='blog_url'
									value={updatedData.blog_url}
									placeholder='Enter Blog URL'
									className='text-left placeholder-gray-101 outline-none px-3 h-10 bg-white rounded-xl w-full avoid_autofill_bg'
									onChange={handleInputChange}
									disabled={currentCollection.status === IN_PROGRESS}
								/>
								{/* {currentCollection.generated_by ===
								COLLECTION_GENERATED_BY_BLOG_BASED ? (
									<div className='text-right'>
										<Tooltip
											title={`Regenerate the content and suggest more ${TAGS_TITLE} with AI.`}>
											<button
												className='text-base font-bold px-3 w-max ml-auto'
												onClick={onTryAgainClick}>
												Regenerate content & keywords
											</button>
										</Tooltip>
									</div>
								) : null} */}
							</div>
							{errors.blog_url && (
								<p className='text-red-500'>{errors.blog_url}</p>
							)}
						</div>
					) : (
						<>
							{isGeneratedByDesc ? (
								<div>
									<div className='flex justify-between mt-4 mb-2'>
										<div>
											<p className='mb-0 text-xl'>Your input</p>
										</div>

										{showSettings ? (
											<div className='text-base'>
												<span
													className='cursor-pointer flex items-center'
													onClick={handleSettingsClick}
													role='button'>
													<SettingFilled
														id='create_collection_setting_icon'
														className='flex mr-1'
													/>
													Settings
												</span>
											</div>
										) : null}
									</div>
									<textarea
										name='description_old'
										value={updatedData.description_old}
										rows={2}
										placeholder='Type two lines here..'
										className='text-left placeholder-gray-101 bg-white outline-none px-3 pt-3 rounded-xl w-full resize-none overflow-hidden'
										onChange={handleInputChange}
										disabled={currentCollection.status === IN_PROGRESS}
									/>
									{errors.description_old && (
										<p className='text-red-500'>{errors.description_old}</p>
									)}
								</div>
							) : null}
						</>
					)}

					{isGeneratedByImage ? (
						<div className='mt-4'>
							<label className='text-xl block mb-0.75'>Image</label>
							<div>
								{isUploading ? (
									<div className='h-36 flex items-center justify-center'>
										<Spin
											className='w-full mx-auto'
											indicator={
												<LoadingOutlined
													style={{ fontSize: 30 }}
													className='text-blue-700'
													spin
												/>
											}
											spinning={isUploading}
										/>
									</div>
								) : (
									<div className='flex flex-col items-center justify-center'>
										{updatedData.image_url ? (
											<>
												<img
													src={updatedData.image_url}
													width='100%'
													// loading='lazy'
													className='object-contain rounded-xl max-w-340'
												/>
												<div className='text-xl block mb-0.75 underline cursor-pointer'>
													<span
														onClick={() =>
															handleUploadedDataChange("image_url", "")
														}>
														Change Image
													</span>
												</div>
											</>
										) : (
											<Dragger
												className='bg-transparent h-56 w-56'
												{...uploadImageProps}
												name='image_url'
												showUploadList={false}>
												<p className='ant-upload-drag-icon'>
													<UploadOutlined />
												</p>
												<p className='w-4/6 mx-auto'>
													Click or drag file to this area to upload Image
												</p>
											</Dragger>
										)}
									</div>
								)}
							</div>

							{errors.image_url && (
								<p className='text-red-500 text-center'>{errors.image_url}</p>
							)}
						</div>
					) : null}

					{isGeneratedByVideo ? (
						<div className='mt-4'>
							<label className='text-xl block mb-0.75'>
								{currentCollection.uploaded_source ? "Video" : "Video URL"}
							</label>
							<div>
								{isUploading ? (
									<div className='h-36 flex items-center justify-center'>
										<Spin
											className='w-full mx-auto'
											indicator={
												<LoadingOutlined
													style={{ fontSize: 30 }}
													className='text-blue-700'
													spin
												/>
											}
											spinning={isUploading}
										/>
									</div>
								) : currentCollection.uploaded_source ? (
									<div className='flex flex-col items-center justify-center'>
										{updatedData.video_url ? (
											<>
												<video
													controls
													className='object-cover rounded-xl w-auto h-auto max-h-80'>
													<source
														src={updatedData.video_url}
														type='video/mp4'
													/>
												</video>
												<div className='text-xl block mb-0.75 underline cursor-pointer'>
													<span
														onClick={() =>
															handleUploadedDataChange("video_url", "")
														}>
														Change Video
													</span>
												</div>
											</>
										) : (
											<Dragger
												className='bg-transparent h-56 w-56'
												{...uploadVideoProps}
												name='video_url'
												showUploadList={false}>
												<p className='ant-upload-drag-icon'>
													<UploadOutlined />
												</p>
												<p className='w-4/6 mx-auto'>
													Click or drag file to this area to upload video
												</p>
											</Dragger>
										)}
									</div>
								) : (
									<div className='bg-slate-100 rounded-xl'>
										<input
											name='video_url'
											value={updatedData.video_url}
											placeholder='Enter Video URL'
											className='text-left placeholder-gray-101 outline-none px-3 h-10 bg-white rounded-xl w-full avoid_autofill_bg'
											onChange={handleInputChange}
											disabled={currentCollection.status === IN_PROGRESS}
										/>
									</div>
								)}
							</div>
						</div>
					) : null}

					{isGeneratedByImage || isGeneratedByBlog || isGeneratedByVideo || isGeneratedByDesc ? (
						<div className='flex justify-end h-fit-content gap-2 mt-2'>
							<Tooltip
								title={`Regenerate the content and suggest more ${TAGS_TITLE} with AI.`}>
								<button
									onClick={onTryAgainClick}
									className='px-2 py-0.75 sm:px-4 w-max text-black underline whitespace-nowrap'>
									Regenerate content & keywords
								</button>
							</Tooltip>
						</div>
					) : null}

					<div>
						<div className='flex justify-between mt-4 mb-2'>
							<p className='mb-0 text-xl'>
								I wrote some content for you. Please add your creative touch to
								it!
							</p>

							{/* {showSettings && (isGeneratedByImage || isGeneratedByVideo) ? (
								<div className='text-base'>
									<span
										className='cursor-pointer flex items-center justify-end'
										onClick={handleSettingsClick}
										role='button'>
										<SettingFilled
											id='create_collection_setting_icon'
											className='flex mr-1'
										/>
										Settings
									</span>
								</div>
							) : null} */}

							{/* {currentCollection.generated_by !==
					COLLECTION_GENERATED_BY_BLOG_BASED ? (
						<div className='flex items-center justify-end tablet:justify-start'>
							<Tooltip title='Regenerate the content and suggest more tags with AI.'>
								<InfoCircleOutlined className='pr-1.5 text-base flex' />
							</Tooltip>
							<p
								onClick={onTryAgainClick}
								className='underline font-medium cursor-pointer m-0'
								role='button'>
								Regenerate
							</p>
						</div>
					) : null} */}
						</div>
						<div className='bg-white rounded-xl'>
							<textarea
								name='description'
								value={updatedData.description}
								ref={textAreaRef}
								rows={default_description_textarea_rows}
								placeholder='Type two lines here..'
								className='text-left placeholder-gray-101 bg-white outline-none px-3 pt-3 rounded-xl w-full resize-none overflow-hidden'
								onChange={handleInputChange}
								disabled={currentCollection.status === IN_PROGRESS}
							/>
							{/* {isGeneratedByDesc ? (
								<div className='text-right'>
									<Tooltip
										title={
											"Update short description or update new description, if you satisfied with it you can add # to take prioritized to that word"
										}>
										<button
											className='text-base font-bold px-3 w-max ml-auto'
											title={`Regenerate the content and suggest more ${TAGS_TITLE} with AI.`}
											onClick={onTryAgainClick}>
											Regenerate content
										</button>
									</Tooltip>
								</div>
							) : null} */}
							{/* {isGeneratedByVideo ? (
								<div className='text-right'>
									<button
										className='text-base font-bold px-3 w-max ml-auto underline'
										onClick={() =>
											onImproveContentModalOpen({
												regenerate_desc: true,
											})
										}>
										Improve Content
									</button>
								</div>
							) : null} */}
						</div>
						{errors.description && (
							<p className='text-red-500'>{errors.description}</p>
						)}
					</div>
					{isShowImproveContent ? (
						<div className='flex ml-auto justify-end h-fit-content gap-2 mt-2'>
							<button
								onClick={() =>
									onImproveContentModalOpen({
										regenerate_desc: true,
									})
								}
								className='px-2 py-0.75 sm:px-4 w-max text-black underline whitespace-nowrap'>
								Improve content
							</button>
						</div>
					) : null}

					{showTags ? (
						<div className='flex justify-end mt-4'>
							<Tooltip
								title={`Fetch a new set of products with latest ${TAGS_TITLE}.`}>
								<button
									onClick={onFetchTagsWithAI}
									className='cursor-pointer bg-indigo-600 rounded text-white font-normal text-base py-1 px-2 '>
									Generate <span className='capitalize'>{TAGS_TITLE}</span>
								</button>
							</Tooltip>
						</div>
					) : currentCollection?._id ? (
						<div className='flex flex-col'>
							<div className='w-full'>
								<div className='mt-4 mb-2'>
									<p className='text-xl'>
										{currentCollection.status === IN_PROGRESS
											? `Fetching ${TAGS_TITLE}..`
											: "I'll look for these products. Please edit this list as needed!"}
									</p>
								</div>
								<div className="flex w-full">
									{/* {isGeneratedByDesc ? (
										<div className='text-right'>
											<Tooltip title={`Get ${TAGS_TITLE} with AI.`}>
												<InfoCircleOutlined className='pr-0.75 text-base flex' />
												<button
													onClick={onFetchTagsWithAI}
													className='text-base font-bold w-max ml-auto'>
													Regenerate{" "}
													<span className='capitalize'>{TAGS_TITLE}</span>
												</button>
											</Tooltip>
										</div>
									) : null} */}

									<CollectionEditTags
										currentCollectionTags={updatedData.blog_filter}
										selectedTags={selectedTags}
										editTagsValue={updatedData.blog_filter}
										editTagsError={editTagsError}
										showEditTagsInput={showEditTagsInput}
										handleTagClick={handleTagClick}
										handleDeleteTagClick={handleDeleteTagClick}
										handleEditTagsBtnClick={handleEditTagsBtnClick}
										handleEditTagsSaveClick={handleEditTagsSaveClick}
										handleEditTagsCancel={handleEditTagsCancel}
										handleEditTagsChange={handleTagsChange}
										handleAddKeywords={true}
									/>
									{/* <div className='bg-slate-100 rounded-xl'>
										<Select
											mode='tags'
											className='w-full text-base review_collection_content_tags_input'
											placeholder={`Enter ${TAGS_TITLE}`}
											value={updatedData.blog_filter || []}
											onChange={handleTagsChange}
											onBlur={() => handleShowAddIcon(true)}
											onFocus={() => handleShowAddIcon(false)}
											ref={tagInputRef}
											disabled={currentCollection.status === IN_PROGRESS}
											size='large'
											dropdownStyle={{ display: "none" }}></Select>
									</div> */}
								</div>
								{/* {showAddIcon &&
								!isEmpty(updatedData.blog_filter) &&
								tagSelectInputContainer
									? createPortal(
											<>
												<div className='flex justify-center items-center cursor-pointer'>
													<PlusOutlined
														className='text-base text-slat-103 flex justify-center items-center stroke-current stroke-13'
														onClick={handleFocusTagInput}
													/>
												</div>
											</>,
											tagSelectInputContainer
									  )
									: null} */}
							</div>
							<div className='flex flex-col-reverse md:flex-row justify-between md:gap-5 mt-2'>
								{!isEmpty(updatedData.blog_filter) &&
									isEmpty(selectedTags) &&
									!showEditTagsInput ? (
									<div className='flex flex-row gap-2'>
										<InfoCircleOutlined className='tablet:text-lg leading-5' />
										<p className='flex items-center leading-5 mb-0'>
											Click on the keywords above to see associated filters. You
											can edit them as needed!
										</p>
									</div>
								) : null}
								{/* {isGeneratedByVideo ? (
									<div className='ml-auto text-gray-103'>
										<button
											onClick={() =>
												onImproveContentModalOpen({
													regenerate_desc: false,
												})
											}
											className='text-base font-bold w-max underline'>
											Improve <span className='capitalize'>{TAGS_TITLE}</span>
										</button>
									</div>
								) : null} */}
								{isShowImproveContent ? (
									<div className='flex ml-auto justify-end h-fit-content gap-2'>
										<button
											onClick={() =>
												onImproveContentModalOpen({
													regenerate_desc: false,
												})
											}
											className='px-2 py-0.75 sm:px-4 w-max text-black underline whitespace-nowrap mt-2'>
											Improve <span className='lowercase'>{TAGS_TITLE}</span>
										</button>
									</div>
								) : null}
							</div>
						</div>
					) : null}

					{!isEmpty(selectedTags) ? (
						<div className='flex items-center justify-end mt-4 filter-options-popover-wrapper'>
							<Tooltip title='Click to see filter options'>
								<div
									className='flex items-center'
									onClick={() =>
										setFilterOptionsVisible(!filterOptionsVisible)
									}>
									<Image
										src={filterIcon}
										alt='Filters'
										width={28}
										height={28}
										className='mr-1'
									/>
									<p className='underline font-medium cursor-pointer lg:mt-0 whitespace-nowrap ml-1 text-base'>
										Filters
									</p>
								</div>
							</Tooltip>
						</div>
					) : null}

					{!isEmpty(selectedTags) ? (
						<div className='mt-4'>
							<ProductFiltersTags
								productFilters={filters}
								handleFiltersInputClear={handleFiltersInputClear}
								handleClearFiltersClick={handleClearFiltersClick}
								displayFilters={filtersToShow}
								isShowCustomFilter={true}
								handleSaveEditCustomFilter={handleSaveEditCustomFilter}
								selectedTag={selectedTags}
								clearFiltersThemeClassName='text-black-100'
								buttonThemeClassName='bg-indigo-103'
							/>
						</div>
					) : null}

					{/* {customFilterStoreData?.is_display && !isEmpty(selectedTags) ? (
						<>
							<div className='mt-4'>
								<CustomFilter
									customFilterStringData={filters.custom_filter}
									handleSaveEditCustomFilter={handleSaveEditCustomFilter}
									customFilter={customFilter}
									setCustomFilter={setCustomFilter}
									handleCustomFilterChange={handleCustomFilterChange}
									isButtonVisible={false}
									isCustomFilterInputVisible={true}
									showCustomFilterInput={showCustomFilterInput}
									setShowCustomFilterInput={setShowCustomFilterInput}
									checkAndShowContainer={checkAndShowContainer}
								/>
							</div>
						</>
					) : null} */}

					{filterOptionsVisible && !isEmpty(selectedTags) ? (
						<>
							<div className='flex flex-col gap-5 shadow-3xl p-5 mt-4 rounded-xl bg-slate-200'>
								<div className='flex items-center gap-4 ml-auto'>
									{isFiltersAvailable ? (
										<p
											className='text-lg text-black-100 cursor-pointer'
											role='button'
											onClick={handleClearFiltersClick}>
											Clear All
										</p>
									) : null}
									<CloseOutlined
										className='cursor-pointer text-2xl text-black-100 flex'
										role='button'
										title='close filters'
										onClick={() => setFilterOptionsVisible(false)}
									/>
								</div>
								<AdditionalAttributes
									additionalAttributesToShow={filtersToShow}
									attributesData={filters}
									handleAdditionalAttributesChange={onFiltersChange}
									handleFiltersOptionalChange={handleFiltersOptionalChange}
									fontColorTheme='text-black-100'
								/>
							</div>
						</>
					) : null}

					{isCategoryTagsEnabled && updatedData.category_tags && (
						<div className='grid grid-cols-1 tablet:grid-cols-2 gap-4 mt-5'>
							{Object.keys(updatedData.category_tags).map((tagsKey) => (
								<div className='w-full'>
									<div className='tablet:flex tablet:justify-between mb-2 text-gray-103'>
										<p>{tagsKey}</p>
									</div>
									<Select
										mode='tags'
										className='w-full desktop:max-w-480 text-base tag-select-input'
										placeholder={`Enter ${TAGS_TITLE}`}
										value={updatedData.category_tags[tagsKey] || []}
										onChange={(values) =>
											handleCategoryTagsChange(tagsKey, values)
										}
										disabled={currentCollection.status === IN_PROGRESS}
										size='large'
										dropdownStyle={{ display: "none" }}></Select>
								</div>
							))}
						</div>
					)}
					<div className='flex'>
						<div className='ml-auto flex h-fit-content gap-2 mt-4'>
							<Tooltip
								title={`Get a new set of products with latest ${TAGS_TITLE}.`}>
								<button
									onClick={handleFetchProductsClick}
									className='bg-indigo-103 rounded-md shadow px-2 py-0.75 sm:px-4 w-max text-white whitespace-nowrap'>
									Get products
								</button>
							</Tooltip>
						</div>
					</div>
				</div>
			</ReviewCollectionContainerWrapper>
			{/* {((is_store_instance && isStoreAdminLoggedIn) || isAdminLoggedIn) && */}
			{/* {!isMyProductsCollection ? (
				<div className='tablet:mx-4 desktop:mx-8 tablet:bg-slat-103 tablet:px-4 tablet:py-3 desktop:px-8 desktop:py-6 mt-6'>
					<div>
						<p
							className='flex items-center text-xl text-gray-103  cursor-pointer'
							role='button'
							onClick={() => setSettingsOpen((value) => !value)}>
							<RightOutlined rotate={settingsOpen ? 90 : 0} className='mr-2' />{" "}
							Filters
						</p>
						<hr className='my-3 border-gray-103' />
						<div>
							<div className='flex flex-wrap gap-2'>
								{selectedFiltersArr
									.filter((f) => f.visible)
									.map((f) => (
										<div
											className='py-1 px-2 rounded-xl bg-slate-200 flex items-center text-base'
											title={f.tooltipTitle}>
											{f.title}: {f.value}
											{f.showClose ? (
												<>
													{" "}
													<CloseOutlined
														className='ml-2 cursor-pointer'
														role='button'
														onClick={() => handleSettingsInputClear(f.name)}
													/>
												</>
											) : null}
										</div>
									))}
							</div>
						</div>
						{settingsOpen ? (
							<div className='grid grid-cols-1 tablet:grid-cols-2 mt-6 gap-4'>
								{displayableFilter.includes("gender") &&
								availableFilters?.gender?.length ? (
									<div>
										<div className='flex justify-between mb-0.75'>
											<label className='text-base text-gray-103 block'>
												Gender
											</label>
											<div className='flex items-center'>
												<label className='text-gray-103 block mr-1'>
													Optional
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() =>
														handleSettingsStrictSelectChange("gender")
													}
													checked={updatedData.settings?.optional_filters?.includes(
														"gender"
													)}></Checkbox>
											</div>
										</div>
										<Select
											mode='multiple'
											name='gender'
											className='w-full text-base tag-select-input'
											placeholder='Select gender'
											value={updatedData.settings?.gender || []}
											size='large'
											onChange={(values) =>
												handleSettingsTagsInputChange("gender", values)
											}>
											// <Option value=''>Select Gender</Option>
											{availableFilters?.gender.map((g) => (
												<Option value={g}>{g}</Option>
											))}
										</Select>
									</div>
								) : null}

								{displayableFilter.includes("age_group") &&
								availableFilters?.age_group?.length ? (
									<div>
										<div className='flex justify-between mb-0.75'>
											<label className='text-base text-gray-103 block'>
												Age group
											</label>
											<div className='flex items-center'>
												<label className='text-gray-103 block mr-1'>
													Optional
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() =>
														handleSettingsStrictSelectChange("age_group")
													}
													checked={updatedData.settings?.optional_filters?.includes(
														"age_group"
													)}></Checkbox>
											</div>
										</div>
										<Select
											mode='multiple'
											name='age_group'
											className='w-full text-base tag-select-input'
											placeholder='Select Age group'
											value={updatedData.settings?.age_group || []}
											size='large'
											onChange={(values) =>
												handleSettingsTagsInputChange("age_group", values)
											}>
										//	<Option value=''>Select Age group</Option>
											{availableFilters?.age_group.map((a) => (
												<Option value={a}>{a}</Option>
											))}
										</Select>
									</div>
								) : null}

								{displayableFilter.includes("discount") &&
								availableFilters?.discount?.length ? (
									<div>
										<div className='flex justify-between mb-0.75'>
											<label className='text-base text-gray-103 block'>
												Discount
											</label>
											<div className='flex items-center'>
												<label className='text-gray-103 block mr-1'>
													Optional
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() =>
														handleSettingsStrictSelectChange("discount")
													}
													checked={updatedData.settings?.optional_filters?.includes(
														"discount"
													)}></Checkbox>
											</div>
										</div>

										<Select
											mode='multiple'
											className='w-full text-base tag-select-input'
											placeholder={`Enter discount`}
											value={updatedData.settings?.discount || []}
											size='large'
											onChange={(values) =>
												handleSettingsTagsInputChange("discount", values)
											}
											disabled={currentCollection.status === IN_PROGRESS}>
											{availableFilters?.discount.map((filter) => (
												<Option value={filter} key={filter}>
													{filter}
												</Option>
											))}
										</Select>
									</div>
								) : null}

								{displayableFilter.includes("brand") &&
								availableFilters?.brand?.length ? (
									<div>
										<div className='flex justify-between mb-0.75'>
											<label className='text-base text-gray-103 block'>
												Brand
											</label>
											<div className='flex items-center'>
												<label className='text-gray-103 block mr-1'>
													Optional
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() =>
														handleSettingsStrictSelectChange("brand")
													}
													checked={updatedData.settings?.optional_filters?.includes(
														"brand"
													)}></Checkbox>
											</div>
										</div>

										<Select
											mode='multiple'
											className='w-full text-base tag-select-input'
											placeholder='Select brands'
											onChange={(values) =>
												handleSettingsTagsInputChange("brand", values)
											}
											value={updatedData.settings?.brand || []}
											size='large'>
											{availableFilters?.brand.map((filter) => (
												<Option value={filter} key={filter}>
													{filter}
												</Option>
											))}
										</Select>
									</div>
								) : null}

								{displayableFilter.includes("color") ? (
									<div>
										<div className='flex justify-between mb-0.75'>
											<label className='text-base text-gray-103 block'>
												Color
											</label>
											<div className='flex items-center'>
												<label className='text-gray-103 block mr-1'>
													Optional
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() =>
														handleSettingsStrictSelectChange("color")
													}
													checked={updatedData.settings?.optional_filters?.includes(
														"color"
													)}></Checkbox>
											</div>
										</div>

										<Select
											mode='tags'
											className='w-full text-base tag-select-input'
											placeholder={`Enter Color`}
											value={updatedData.settings?.color || []}
											size='large'
											onChange={(values) =>
												handleSettingsTagsInputChange("color", values)
											}
											disabled={
												currentCollection.status === IN_PROGRESS
											}></Select>
									</div>
								) : null}

								{displayableFilter.includes("occasion") &&
								availableFilters?.occasion?.length ? (
									<div>
										<div className='flex justify-between mb-0.75'>
											<label className='text-base text-gray-103 block'>
												Room
											</label>
											<div className='flex items-center'>
												<label className='text-gray-103 block mr-1'>
													Optional
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() =>
														handleSettingsStrictSelectChange("occasion")
													}
													checked={updatedData.settings?.optional_filters?.includes(
														"occasion"
													)}></Checkbox>
											</div>
										</div>

										<Select
											mode='multiple'
											className='w-full text-base tag-select-input'
											placeholder={`Enter room`}
											value={updatedData.settings?.occasion || []}
											size='large'
											onChange={(values) =>
												handleSettingsTagsInputChange("occasion", values)
											}
											disabled={currentCollection.status === IN_PROGRESS}>
											{availableFilters?.occasion?.map((filter) => (
												<Option value={filter} key={filter}>
													{filter}
												</Option>
											))}
										</Select>
									</div>
								) : null}

								{displayableFilter.includes("custom_filter") ? (
									<div>
										<div className='flex justify-between mb-0.75'>
											<label className='text-base text-gray-103 block'>
												Custom filter{" "}
												<span className='text-sm'>(max 25 characters)</span>
											</label>
											<div className='flex items-center'>
												<label className='text-gray-103 block mr-1'>
													Optional
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() =>
														handleSettingsStrictSelectChange("custom_filter")
													}
													checked={updatedData.settings?.optional_filters?.includes(
														"custom_filter"
													)}></Checkbox>
											</div>
										</div>
										<Input
											className='outline-none px-3 h-10 bg-slate-100 rounded-xl w-full'
											placeholder='Enter custom filter'
											name='custom_filter'
											value={updatedData.settings?.custom_filter || ""}
											onChange={(e) =>
												handleSettingsInputChange(
													"custom_filter",
													e.target.value
												)
											}
											maxLength={25}
										/>
									</div>
								) : null}

								{displayableFilter.includes("price") ? (
									<div>
										<div className='flex justify-between mb-0.75'>
											<label className='text-base text-gray-103 block'>
												Price range
											</label>
											<div className='flex items-center'>
												<label className='text-gray-103 block mr-1'>
													Optional
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() =>
														handleSettingsStrictSelectChange("price")
													}
													checked={updatedData.settings?.optional_filters?.includes(
														"price"
													)}></Checkbox>
											</div>
										</div>
										<div className='flex flex-row'>
											<Input
												type='text'
												className='outline-none px-3 h-10 bg-slate-100 rounded-xl w-full'
												placeholder='Minimum'
												value={updatedData.settings?.price?.min || ""}
												onChange={(e) =>
													handleSettingsInputChange("min", e.target.value)
												}
												name='priceRange-min'
											/>
											<span className='flex justify-center items-center  text-gray-103 text-base mx-5'>
												to
											</span>
											<Input
												type='text'
												className='outline-none px-3 h-10 bg-slate-100 rounded-xl w-full'
												placeholder='Maximum'
												value={updatedData.settings?.price?.max || ""}
												onChange={(e) =>
													handleSettingsInputChange("max", e.target.value)
												}
												name='priceRange-max'
											/>
										</div>
									</div>
								) : null}

								{displayableFilter.includes("material") ? (
									<div>
										<div className='flex justify-between mb-0.75'>
											<label className='text-base text-gray-103 block'>
												Material
											</label>
											<div className='flex items-center'>
												<label className='text-gray-103 block mr-1'>
													Optional
												</label>
												<Checkbox
													className='text-gray-103'
													onChange={() =>
														handleSettingsStrictSelectChange("material")
													}
													checked={updatedData.settings?.optional_filters?.includes(
														"material"
													)}></Checkbox>
											</div>
										</div>

										<Select
											mode='tags'
											className='w-full text-base tag-select-input'
											placeholder={`Enter material`}
											value={updatedData.settings?.material || []}
											size='large'
											onChange={(values) =>
												handleSettingsTagsInputChange("material", values)
											}
											disabled={
												currentCollection.status === IN_PROGRESS
											}></Select>
									</div>
								) : null}
								{displayableFilter.includes("pattern") &&
								availableFilters?.pattern?.length ? (
									<MultiSelectFilters key='pattern' label='Pattern' />
								) : null}
								{displayableFilter.includes("style") &&
								availableFilters?.style?.length ? (
									<MultiSelectFilters key='style' label='Style' />
								) : null}
							</div>
						) : null}
						<div className='flex'>
							<div className='ml-auto flex h-fit-content gap-2 mt-4'>
								{!isMyProductsCollection ? (
									<Tooltip
										title={`Fetch a new set of products with latest ${TAGS_TITLE}.`}>
										<button
											onClick={handleFetchProductsClick}
											className='bg-indigo-600 rounded text-white py-2 font-normal text-base px-5  whitespace-nowrap h-min'>
											Find products
										</button>
									</Tooltip>
								) : null}
							</div>
						</div>
					</div>
				</div>
			) : null} */}
			{showSettings ? (
				<AuraChatSettingModal
					isOpen={settingModalOpen}
					onClose={closeSettingModal}
					// showDescriptionTemplate={isGeneratedByDesc}
					mode={showSettingsMode}
				/>
			) : null}
			{isShowImproveContent ? (
				<ImproveContentModal
					isOpen={improveContentData?.isOpen}
					regenerate_desc={improveContentData?.regenerate_desc}
					description={updatedData.description}
					tags={updatedData.blog_filter}
					onClose={onImproveContentModalClose}
					onContinue={onImproveContentModalContinue}
				/>
			) : null}
			{
				showBackdropLoader && (
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
				)
			}
		</>
	);
};

export default React.memo(ReviewCollectionStepContent);
