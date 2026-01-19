import React, {
	Suspense,
	startTransition,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link';
import Image from "next/image";
import { useNavigate } from "../../helper/useNavigate";
import styles from "./tryForFree.module.scss";
import {
	Spin,
	notification,
	Popover,
	Upload,
	// Select
	Tooltip,
	InputNumber,
	Checkbox,
} from "antd";
import {
	Loading3QuartersOutlined,
	SettingFilled,
	ArrowLeftOutlined,
	UploadOutlined,
	LoadingOutlined,
	InfoCircleOutlined,
} from "@ant-design/icons";

import AuthHeader from "../AuthHeader";
import ReviewCollectionStepsUI from "./ReviewCollectionStepsUI";
import ReviewCollectionContainerWrapper from "./ReviewCollectionContainerWrapper";
import AuraChatSettingModal from "../auraChatSettingModal";
import AskQuestionComponent from "../../components/AskQuestionComponent/AskQuestionComponent";
import { getCurrentUserStore } from "../Auth/redux/selector";
import {
	getSingleUserCollection,
	getUserCollection,
	getUserCollections,
	getUserInfo,
} from "../Auth/redux/actions";
import {
	createWishlist,
	createWishlistReset,
} from "../wishlistActions/createWishlist/redux/actions";
import {
	setAiExtractionData,
	setAuraChatSetting,
	setShowChatModal,
} from "../../hooks/chat/redux/actions";
import { authAPIs, profileAPIs } from "../../helper/serverAPIs";
import {
	adminUserId,
	isStagingEnv,
	is_store_instance,
	super_admin,
	current_store_name,
} from "../../constants/config";
import { AdminCheck, getParams, setCookie } from "../../helper/utils";
import {
	isEnableAICookie,
	isEnableAICookieFalse,
	userSignInSetLocal,
} from "../../helper/getTrackerInfo";
import { STEPS } from "./ReviewCollection";
import { socket, SocketContext } from "../../context/socketV2";
import { AuraChatSettingModalModes } from "../auraChatSettingModal/AuraChatSettingModal";
import {
	COLLECTION_GENERATED_BY_BLOG_BASED,
	COLLECTION_GENERATED_BY_DESC_BASED,
	COLLECTION_GENERATED_BY_VIDEO_BASED,
	COLLECTION_GENERATED_BY_IMAGE_BASED,
	COLLECTION_TYPE_AUTO_PLIST,
	COOKIE_TT_ID,
	FETCH_COLLECTIONS_PRODUCT_LIMIT,
	LOCAL_STORAGE_USER_VISITED_CREATE_COLLECTION,
	PATH_ROOT,
	PATH_STORE,
	SIGN_IN_EXPIRE_DAYS,
	STORE_USER_NAME_BUDGETTRAVEL,
	// COLLECTION_COVER_IMG_SIZES,
	STORE_USER_NAME_SAMSKARA,
	CREATE_ACTION,
} from "../../constants/codes";

import aura_assistant from "../../images/chat/aura_assistant_image.png";
// import listening_avatar from "../../images/videos/listening_avatar.gif";
// import star_ai_icon from "../../images/unthink_star_ai_icon.svg";
import star_ai_icon from "../../images/unthink_star_ai_icon_new.svg";
import IconImage1 from "../../images/createCollectionImage/an-idea.svg";
import IconImage2 from "../../images/createCollectionImage/an-articale.svg";
import IconImage3 from "../../images/createCollectionImage/a-photo.svg";
import IconImage4 from "../../images/createCollectionImage/a-video.svg";

const ReviewCollectionStepHelp = React.lazy(() =>
	import("./ReviewCollectionStepHelp")
);

const { Dragger } = Upload;

const createCollectionOptionsKeys = {
	blog_url: "blog_url",
	video_url: "video_url",
	from_scratch: "from_scratch",
	image_url: "image_url",
};

const createCollectionOptions = [
	{
		key: createCollectionOptionsKeys.from_scratch,
		id: createCollectionOptionsKeys.from_scratch,
		title: "An idea",
		value: createCollectionOptionsKeys.from_scratch,
		isDisplay: true,
		icon: IconImage1,
	},
	{
		key: createCollectionOptionsKeys.blog_url,
		id: createCollectionOptionsKeys.blog_url,
		title: "An article",
		value: createCollectionOptionsKeys.blog_url,
		isDisplay: true,
		icon: IconImage2,
	},
	{
		key: createCollectionOptionsKeys.video_url,
		id: createCollectionOptionsKeys.video_url,
		title: "A video",
		value: createCollectionOptionsKeys.video_url,
		isDisplay: true,
		icon: IconImage4,
		// hidden: isEnableAICookieFalse() || !(isStagingEnv || isEnableAICookie()),
	},
	{
		id: createCollectionOptionsKeys.image_url,
		key: createCollectionOptionsKeys.image_url,
		title: "A photo",
		value: createCollectionOptionsKeys.image_url,
		isDisplay: true,
		icon: IconImage3,
	},
];

const LoadingIndicator = () => {
	return (
		<div className='flex justify-center'>
			<Spin />
		</div>
	);
};

const CreateFreeCollection = ({ location: propLocation }) => {
	const navigate = useNavigate();
	const locationState = propLocation?.state || {};
	const [openCreateCollection, setOpenCreateCollection] = useState(true);
	const [settingModalOpen, setSettingModalOpen] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [showUploadImage, setShowUploadImage] = useState(true);
	const [showUploadVideo, setShowUploadVideo] = useState(false);
	const [isVideoDataExtractionStarted, setIsVideoDataExtractionStarted] =
		useState(false);

	const [error, setError] = useState({
		name: "",
		description: "",
	});
	const [currentView, setCurrentView] = useState(null);

	const importTemplatePopoverRef = useRef(null);

	const { sendSocketClientDataExtractionRequest } = useContext(SocketContext);

	// const currentStore = useSelector(getCurrentUserStore);
	const { data: authUser } = useSelector((state) => state.auth.user);
	const [
		createWishlistReducer,
		extractionData,
		auraChatSetting,
		admin_list,
		createCollectionTypes,
	] = useSelector((state) => [
		state.wishlistActions.createWishlist,
		state.chatV2.aiExtractionData,
		state.chatV2.auraChatSetting,
		state.store.data.admin_list,
		state.store.data.createCollectionTypes || [],
	]);



	const defaultCollectionData = {
		name: "",
		description: "",
		template:
			"Create comma separated keywords strictly related to products, items, objects which are most likely available on my ecommerce website.",
		detailedBlogChecked: false,
		blog_filter: [],
		createCollectionWay: "",
		blog_url: "",
		video_url: "",
		image_url: "",
	};
	const [count, setCount] = useState(3);

	const [collectionData, setCollectionData] = useState({
		...defaultCollectionData,
	});
	

	const dispatch = useDispatch();
	const [showFaqCount, setShowFaqCount] = useState(false);

	console.log("collectionData", collectionData);

	useEffect(() => {
		socket.on("server", (data) => {
			const videoUrl = data?.dataExtractionRequest?.data?.video_url;

			if (videoUrl) {
				startTransition(() => {
					dispatch(setAiExtractionData(data?.dataExtractionRequest));
				});
			}
		});

		// Cleanup socket listener
		return () => {
			socket.off("server");
		};
	}, []);

	const [token, setToken] = useState("");

	const {
		isFetching: createWishlistInProgress,
		data: createWishlistData,
		success: createWishlistSuccess,
		error: createWishlistError,
	} = createWishlistReducer;

	const [scratchAIPromptOpen, setScratchAIPromptOpen] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			startTransition(() => {
				setToken(getParams("token") || "");
			});
		}

		if (typeof window !== "undefined" && window.localStorage) {
			if (localStorage.getItem(LOCAL_STORAGE_USER_VISITED_CREATE_COLLECTION)) {
				startTransition(() => {
					setCurrentView(STEPS.CONTENT);
				});
			} else {
				startTransition(() => {
					setCurrentView(STEPS.HELP);
				});
				localStorage.setItem(
					LOCAL_STORAGE_USER_VISITED_CREATE_COLLECTION,
					"true"
				);
			}
		}

		return () => setIsVideoDataExtractionStarted(false);
	}, []);

	useEffect(() => {
		if (createWishlistSuccess) {
			const _id = createWishlistData.data?._id;
			if (_id) {
				dispatch(getUserCollection(createWishlistData.data));
				// dispatch(getSingleUserCollection(createWishlistData.data));

				// navigate(`/collection/${_id}/review`, {
				// 	state: {
				// 		isNewCollection: true,
				// 	},
				// });
			}

			dispatch(createWishlistReset());
		}
	}, [createWishlistSuccess]);

	useEffect(() => {
		if (createWishlistError) {
			// notification["error"]({
			// 	message:
			// 		createWishlistData?.error_message ||
			// 		(collectionData.createCollectionWay ===
			// 		createCollectionOptionsKeys.image_url
			// 			? "Unable to create, please check image url"
			// 			: "Unable to create"),
			// });

			dispatch(createWishlistReset());
		}
	}, [createWishlistError]);

	const handleChangeView = useCallback(
		async (view) => {
			if (view === currentView) {
				// not doing anything when the current view is same as requested view
				return;
			}

			switch (view) {
				case STEPS.HELP:
					setCurrentView(STEPS.HELP);
					break;

				case STEPS.CONTENT:
					setCurrentView(STEPS.CONTENT);
					break;

				default:
					break;
			}
		},
		[currentView]
	);

	const verifyToken = async () => {
		try {
			const res = await authAPIs.verifyTokenAPICall(token);
			if (res.data.status_code === 200 && res.data.data) {
				userSignInSetLocal(res.data.data.user_id, res.data.data.emailId);
				dispatch(getUserInfo());
			} else {
				navigate(PATH_ROOT);
			}
		} catch {
			navigate(PATH_ROOT);
		}
	};

	useEffect(() => {
		if (authUser.user_id && !token && !authUser.emailId) {
			navigate(PATH_ROOT);
		}
	}, [authUser]);

	useEffect(() => {
		if (token) {
			verifyToken();
		}
	}, [token]);

	useEffect(() => {
		if (collectionData.createCollectionWay) {
			setCollectionData({
				...defaultCollectionData,
				createCollectionWay: collectionData.createCollectionWay,
			});
		}
	}, [collectionData.createCollectionWay]);

	const isFormValid = useCallback(
		(data = {}) => {
			let isValid = true;
			const errorList = {
				createCollectionWay: "",
				name: "",
				description: "",
				blog_url: "",
				image_url: "",
			};

			if (data.createCollectionWay === "") {
				errorList.createCollectionWay =
					"Please select an option to create the collection";
				isValid = false;
			} else {
				if (
					data.createCollectionWay !== createCollectionOptionsKeys.video_url &&
					data.createCollectionWay !== createCollectionOptionsKeys.image_url &&
					!data.name
				) {
					// collection name must entered
					errorList.name = `Please enter collection name`;
					isValid = false;
				}

				if (
					data.createCollectionWay === createCollectionOptionsKeys.from_scratch
				) {
					if (!data.description) {
						// collection description must entered
						errorList.description = `Please enter description`;
						isValid = false;
					}
				} else if (
					data.createCollectionWay === createCollectionOptionsKeys.blog_url
				) {
					if (!data.blog_url) {
						// collection blog URL must entered
						errorList.blog_url = `Please enter blog/article URL`;
						isValid = false;
					}
				} else if (
					data.createCollectionWay === createCollectionOptionsKeys.video_url
				) {
					if (!data.video_url) {
						// video URL must entered
						errorList.video_url = `${
							showUploadVideo ? "Please upload video" : "Please enter video URL"
						}`;
						isValid = false;
					}
				} else if (
					data.createCollectionWay === createCollectionOptionsKeys.image_url
				) {
					if (!data.image_url) {
						// image URL must entered
						errorList.image_url = `${
							showUploadImage ? "Please upload image" : "Please enter image URL"
						}`;
						isValid = false;
					}
				}
			}

			setError(errorList);
			return isValid;
		},
		[showUploadImage, showUploadVideo]
	);

	const uploadImageProps = {
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

					if (response?.data?.data) {
						if (response.data.data[0]) {
							handleUploadDataChange(
								response?.data?.data[0].url,
								info?.filename
							);
						}
					}
				}
			} catch (error) {
				notification["error"]({
					message: "Failed to upload image",
				});
			}
			setIsUploading(false);
		},
	};

	const uploadVideoProps = {
		accept: ".mp4",
		multiple: false,
		customRequest: async (info) => {
			try {
				setIsUploading(true);
				if (info?.file) {
					const response = await profileAPIs.uploadVideo({
						file: info.file,
					});

					if (response?.data?.data) {
						if (response.data.data[0]) {
							handleUploadDataChange(
								response?.data?.data[0].url,
								info?.filename
							);
						}
					}
				}
			} catch (error) {
				notification["error"]({
					message: "Failed to upload video",
				});
			}
			setIsUploading(false);
		},
	};

	const handleUploadDataChange = useCallback(
		(value = "", name) => {
			setCollectionData((data) => {
				const newData = {
					...data,
					[name]: value,
				};

				if (error[name]) {
					isFormValid(newData);
				}

				return newData;
			});
		},
		[isFormValid, setCollectionData, error]
	);

	const handleInputChange = (e) => {
		const { name, value, checked } = e.target;

		let data;

		if (name === "detailedBlogChecked") {
			data = {
				...collectionData,
				[name]: checked,
				blog_filter: [],
			};
		} else {
			data = {
				...collectionData,
				[name]: value,
			};
		}

		setCollectionData(data);

		// to revalidate the field validation if there any error present
		if (error[name]) {
			isFormValid(data);
		}
	};

	const handleSettingsClick = () => {
		setSettingModalOpen(true);
	};

	const closeSettingModal = () => {
		setSettingModalOpen(false);
	};

	const handleImportTemplateOptionClick = (text) => {
		importTemplatePopoverRef.current?.close();
		handleInputChange({
			target: {
				name: "template",
				value: text,
			},
		});
	};

	// const handleTagsChange = (values) => {
	// 	setCollectionData({
	// 		...collectionData,
	// 		blog_filter: values,
	// 	});
	// };

	const handleCancel = (e) => {
		e?.preventDefault();
		if (is_store_instance) {
			navigate(PATH_ROOT);
		} else {
			navigate(PATH_STORE);
		}
	};

	useEffect(() => {
		if (
			extractionData &&
			(extractionData.successVideoUrlExtraction ||
				extractionData?.data?.status_code !== 200) &&
			isVideoDataExtractionStarted
		) {
			setIsVideoDataExtractionStarted(false);
			// handleCancel();
		}
	}, [extractionData]);

	const handleDataExtractionRequest = ({
		video_url,
		uploaded_source,
		metadata,
		user_action,
		userMetadata,
	}) => {
		setIsVideoDataExtractionStarted(true);
		// sending data extraction request to socket
		sendSocketClientDataExtractionRequest({
			video_url,
			uploaded_source,
			metadata,
			user_action,
			userMetadata,
		});
	};

	const isAdminLoggedIn = AdminCheck(
		authUser,
		current_store_name,
		adminUserId,
		admin_list
	);

	const isStoreAdminLoggedIn = useMemo(
		() =>
			is_store_instance &&
			authUser.user_name &&
			authUser.user_name === super_admin,
		[authUser.user_name]
	);

	const showScratchAIPrompt = useMemo(
		() =>
			isAdminLoggedIn &&
			collectionData.createCollectionWay ===
				createCollectionOptionsKeys.from_scratch,
		[isAdminLoggedIn, collectionData.createCollectionWay]
	);

	const showSettings = useMemo(
		() =>
			((is_store_instance && isStoreAdminLoggedIn) || isAdminLoggedIn) &&
			collectionData.createCollectionWay,
		[isAdminLoggedIn, collectionData.createCollectionWay]
	);

	const showSettingsMode = useMemo(() => {
		switch (collectionData.createCollectionWay) {
			case createCollectionOptionsKeys.from_scratch:
				return AuraChatSettingModalModes.COLLECTION;
			case createCollectionOptionsKeys.blog_url:
				return AuraChatSettingModalModes.BLOG_COLLECTION;
			case createCollectionOptionsKeys.video_url:
				return AuraChatSettingModalModes.VIDEO_COLLECTION;
			case createCollectionOptionsKeys.image_url:
				return AuraChatSettingModalModes.IMAGE_COLLECTION;
			default:
				return AuraChatSettingModalModes.COLLECTION;
		}
	}, [collectionData.createCollectionWay]);

	// const showDescriptionTemplate =
	// 	collectionData.createCollectionWay ===
	// 	createCollectionOptionsKeys.from_scratch;

	// const showShortVideoTemplate =
	// 	collectionData.createCollectionWay ===
	// 	createCollectionOptionsKeys.video_url;

	// const showTagTemplate =
	// 	collectionData.createCollectionWay === createCollectionOptionsKeys.blog_url;

	console.log("collectionData", collectionData);

	const selectedType = createCollectionTypes.find(
		(item) => item.id === createCollectionOptionsKeys.video_url
	);

	console.log("selectedType", selectedType);

	const createPlistCollection = async (e) => {
		e.preventDefault();

		if (isFormValid(collectionData)) {
			if (
				collectionData.createCollectionWay ===
				createCollectionOptionsKeys.video_url
			) {
				const selectedType = createCollectionTypes.find(
					(item) => item.id === createCollectionOptionsKeys.video_url
				);

				console.log("selectedType", selectedType);

				handleDataExtractionRequest({
					video_url: collectionData.video_url,
					uploaded_source: showUploadVideo,
					metadata: {
						cc_video: showSettings ? auraChatSetting.cc_video : undefined,
						cc_shortvideo: showSettings
							? auraChatSetting.cc_shortvideo
							: undefined,
						more_instruction: collectionData.description,
						...(selectedType?.is_faq_enabled
							? { faq_enabled: showFaqCount }
							: {}),

						...(selectedType?.is_faq_count_display ? { faq_count: count } : {}),
					},
					user_action: CREATE_ACTION,
					userMetadata: {
						brand: authUser?.filters?.[current_store_name]?.strict?.brand || [],
					},
				});
				return;
			}

			const payload = {
				collection_name: collectionData.name,
				type: COLLECTION_TYPE_AUTO_PLIST,
				tags: collectionData.blog_filter,
				// fetch_products: true, // now fetching the products on products tab
				fetchAttributesForAutoPlist: true,
				referrerInfluencerCode: locationState.referrerInfluencerCode,
				redirectToEditCollectionPage: true,
			}

			if (
				collectionData.createCollectionWay ===
				createCollectionOptionsKeys.from_scratch
			) {
				payload.short_desc = collectionData.description;
				payload.generated_by = COLLECTION_GENERATED_BY_DESC_BASED;

				if (showSettings) {
					payload.cc_text = auraChatSetting.cc_text || undefined;
				}
			} else if (
				collectionData.createCollectionWay ===
				createCollectionOptionsKeys.blog_url
			) {
				payload.blog_url = collectionData.blog_url;
				payload.generated_by = COLLECTION_GENERATED_BY_BLOG_BASED;

				if (showSettings) {
					payload.cc_blog = auraChatSetting.cc_blog || undefined;
				}
			} else if (
				collectionData.createCollectionWay ===
				createCollectionOptionsKeys.video_url
			) {
				payload.video_url = collectionData.video_url;
				payload.generated_by = COLLECTION_GENERATED_BY_VIDEO_BASED;
			} else if (
				collectionData.createCollectionWay ===
				createCollectionOptionsKeys.image_url
			) {
				payload.image_url = collectionData.image_url;
				payload.generated_by = COLLECTION_GENERATED_BY_IMAGE_BASED;
				payload.cover_image = collectionData.image_url; // if collection created by image , using that same uploaded image as cover image
				payload.image_text = collectionData.description;
				if (showSettings) {
					payload.cc_image = auraChatSetting.cc_image || undefined;
				}
			}

			if (collectionData.detailedBlogChecked) {
				payload.long_blog = true;
			}

			// Add FAQ settings to payload
			const selectedType = createCollectionTypes.find(
				(item) => item.id === collectionData.createCollectionWay
			);


			if (selectedType?.is_faq_enabled) {
				payload.faq_enabled = showFaqCount;
			}

			if (selectedType?.is_faq_count_display) {
				payload.faq_count = count;
			}

			dispatch(createWishlist(payload));
		}
	};

	// flag to show UI specific to BT store
	// const isBTInstance = useMemo(
	// 	() =>
	// 		is_store_instance && current_store_name === STORE_USER_NAME_BUDGETTRAVEL,
	// 	[]
	// );

	const isSamskaraInstance = useMemo(
		() => is_store_instance && current_store_name === STORE_USER_NAME_SAMSKARA,
		[]
	);

	const systemText = useMemo(() => {
		{
			if (currentView === STEPS.HELP) {
				return "Hello, I will help you create a collection!";
			} else if (createWishlistInProgress) {
				return "Its hard work writing a paragraph for you from scratch! Wait with us while we generate something fun for you...";
			} else if (openCreateCollection && !collectionData.createCollectionWay) {
				return (
					<div>
						I can help you create a collection!
						<br />
						Choose a starting point for inspiration.
					</div>
				);
			} else if (collectionData.createCollectionWay) {
				return (
					<div>
						Share some context on what you envision for your collection.
						<br />
						Let me pull together
						<br />a starting point for you to work from.
					</div>
				);
			}

			return "Hello, I will help you create a collection!";
		}
	}, [
		createWishlistInProgress,
		openCreateCollection,
		collectionData.createCollectionWay,
	]);

	const AuraGuideUI = ({ message }) => (
		<div className={`${styles.bubbleScope} max-w-s-3 tablet:max-w-lg desktop:max-w-964 mx-auto flex justify-center flex-col items-center`}>
			<div className='relative mb-6 w-full'>
				<div className='bubble bubble-bottom-left ml-auto md:ml-24 w-full-50 md:w-full-100 md:max-w-748'>
					{message || systemText}
				</div>
				<img
					src={star_ai_icon?.src || star_ai_icon}
					className='w-28 md:w-36 cursor-pointer mt-6'
					// className='w-24 md:w-32 rounded-full bg-orange-100 cursor-pointer mt-6'
				/>
			</div>
		</div>
	);

	const askQuestionComponentMemo = useMemo(
		() => (
			<AskQuestionComponent
				id='create_collection_ask_question'
				email={authUser.emailId}
			/>
		),
		[authUser.emailId]
	);

	const showAIPrompt = useMemo(
		() =>
			isAdminLoggedIn &&
			collectionData.createCollectionWay ===
				createCollectionOptionsKeys.video_url,
		[isAdminLoggedIn, collectionData.createCollectionWay]
	);

	const handleAskAuraClick = useCallback(() => {
		// perform chat click on header // open chat on header
		dispatch(setShowChatModal(true));
	}, []);

	const importTemplatePopoverContent = (
		<div>
			<li>
				{[
					"Create comma separated keywords strictly related to products, items, objects which are most likely available on my ecommerce website",
					"make sure the keywords are proper noun.",
					"Try to avoid giving same keywords or response",
					"Do not give vague keywords.",
				].map((item, index) => (
					<React.Fragment key={item}>
						{index === 0 ? null : <hr />}
						<ul onClick={() => handleImportTemplateOptionClick(item)}>
							{item}
						</ul>
					</React.Fragment>
				))}
			</li>
		</div>
	);

	const handleUploadImageModeChange = () => {
		setError({});
		setCollectionData((data) => ({
			...data,
			image_url: "",
		}));
		setShowUploadImage((value) => !value);
	};

	const handleUploadVideoModeChange = () => {
		setError({});
		setCollectionData((data) => ({
			...data,
			video_url: "",
		}));
		setShowUploadVideo((value) => !value);
	};

	return (
		<div className='min-h-screen bg-lightgray-109 tablet:bg-white font-firaSans'>
			{/* removed header because, now we are showing the review collection page with aura header with store page component */}
			{/* <AuthHeader hideProfile /> */}

			<div className='pt-12 pb-40 md:pb-20 lg:pb-16 flex'>
				<div className='w-full tablet:max-w-screen-tablet desktop:max-w-screen-desktop tablet:mx-auto'>
					{/* steps UI */}
					<ReviewCollectionStepsUI
						STEPS={STEPS}
						currentView={currentView}
						disabledSteps={[STEPS.PRODUCTS, STEPS.PUBLISH]}
						enableHelpStep
						handleChangeView={handleChangeView}
						isSamskaraInstance={isSamskaraInstance}
					/>

					<ReviewCollectionContainerWrapper>
						{currentView === STEPS.CONTENT && (
							<div className='mb-6 leading-none'>
								<p className='font-normal flex items-center mb-0 text-slat-104'>
									<span className='text-xl-1 md:text-2xl desktop:text-display-l font-semibold break-word-only ellipsis_1'>
										Create a Collection
									</span>
								</p>
							</div>
						)}

						<Suspense fallback={<LoadingIndicator />}>
							{currentView === STEPS.HELP && ( // help step
								<>
									<div className='flex flex-col md:flex-row justify-between gap-2 md:gap-0 mb-6'>
										<p className='md:leading-none font-normal capitalize flex items-center mb-0 text-slat-104'>
											<span className='text-2xl desktop:text-display-l font-semibold break-word-only'>
												How to create your first collection
											</span>
										</p>
										<button
											onClick={() => handleChangeView(STEPS.CONTENT)}
											className='min-w-24 md:min-w-40 w-full max-w-max text-xs md:text-sm z-10 rounded-md py-2.5 px-3.5 h-full font-bold text-indigo-103 border-2 border-indigo-103 ml-auto md:ml-0'>
											Skip Tutorial
										</button>
									</div>
									<AuraGuideUI message='Hello, I will help you create a collection!' />
									<ReviewCollectionStepHelp
										className='mt-5'
										onGetStarted={() => handleChangeView(STEPS.CONTENT)}
									/>
								</>
							)}
						</Suspense>

						{currentView === STEPS.CONTENT && (
							<>
								<div className='grid grid-cols-1 tablet:grid-cols-5 gap-4'>
									<div className='tablet:col-span-2'>
										<AuraGuideUI />
										{/* {showAIPrompt ? (
											<div className='text-base'>
												<div className='flex'>
													<label className='text-white mb-1 block'>
														AI Prompt
													</label>
													<Popover
														placement='bottomRight'
														overlayClassName='import-template-popover-overlay'
														content={importTemplatePopoverContent}
														trigger='click'
														id='import-template-popover'
														ref={importTemplatePopoverRef}>
														<p className='text-white underline ml-auto'>
															Import template
														</p>
													</Popover>
												</div>
												<textarea
													name='template'
													value={collectionData.template}
													rows={5}
													placeholder={
														"Type two lines here..\nFor eg.\nCreate comma separated keywords strictly related to products, items, objects which are most likely available on my ecommerce website.."
													}
													className='text-left placeholder-gray-101 outline-none p-3 bg-slate-100 rounded-xl w-full'
													onChange={handleInputChange}
												/>
												<p className='text-red-500 my-1 h-3.5 leading-none'>
													{error.template}
												</p>
											</div>
										) : null} */}
										{/* {showScratchAIPrompt && !scratchAIPromptOpen ? (
											<div className='text-base'>
												<div className='flex'>
													<label
														className='text-white mb-1 block underline cursor-pointer'
														onClick={() => setScratchAIPromptOpen(() => true)}>
														AI Prompt
													</label>
												</div>
											</div>
										) : null} */}
										{/* {showSettings ? (
											<div className='flex justify-start text-base'>
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
										) : null} */}
									</div>
									<div className={`tablet:col-span-3 text-base ${styles.input_shadow_div}`}>
										{openCreateCollection ? (
											<form className='w-full h-full flex flex-col'>
												<label className='mb-3 block'>
													You can create an ecommerce collection in the
													following ways
												</label>
												{/* <select
													className='text-left placeholder-gray-101 outline-none px-3 h-12 bg-white rounded-xl w-full'
													placeholder='Select one'
													name='createCollectionWay'
													value={collectionData.createCollectionWay}
													onChange={handleInputChange}>
													<option value='' hidden>
														Select one
													</option>
													{createCollectionTypes
														.filter((c) => c.isDisplay)
														.map((i) => (
															<option key={i.id} value={i.id}>
																{i.title}
															</option>
														))}
												</select> */}
												{/* radio select button */}
												{/* {createCollectionTypes
													.filter((c) => c.isDisplay)
													.map((i) => (
														<label key={i.id} className='flex items-center space-x-2 cursor-pointer mb-2'>
															<input
																type='radio'
																name='createCollectionWay'
																value={i.id}
																checked={collectionData.createCollectionWay === i.id}
																onChange={handleInputChange}
																className='hidden'
															/>
															<div
																className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${collectionData.createCollectionWay === i.id ? 'border-indigo-103 ' : 'border-black-100 '
																	}`}
															>
																{collectionData.createCollectionWay === i.id && (
																	<div className='w-3 h-3 bg-indigo-103 rounded-full'></div>
																)}
															</div>
															<span>{i.title}</span>
														</label>
													))} */}

												<div className={`grid grid-cols-2 ${styles.createCollection_card_div}`}>
													{createCollectionTypes
														.filter((c) => c.isDisplay)
														.map((i) => (
															<label
																key={i.id}
																className={`flex flex-col items-center justify-center w-full h-32 cursor-pointer p-3 ${styles.hovercard_div} ${
																	collectionData.createCollectionWay === i.id
																		? "bg-indigo-103 text-white"
																		: "bg-white"
																}`}>
																<input
																	type='radio'
																	name='createCollectionWay'
																	value={i.id}
																	checked={
																		collectionData.createCollectionWay === i.id
																	}
																	onChange={handleInputChange}
																	className='hidden'
																/>
																<div
																	className={`w-full h-full flex items-center justify-center text-lg font-semibold ${
																		createCollectionOptionsKeys.video_url ===
																			i.id &&
																		collectionData.createCollectionWay ===
																			i.id
																			? "text-white font-bold"
																			: createCollectionOptionsKeys.video_url ===
																			  i.id
																			? "gap-0"
																			: collectionData.createCollectionWay ===
																			  i.id
																			? "text-white font-bold gap-9"
																			: "text-black-100 gap-9"
																	}`}>
																	<span>{i.title}</span>
																	<Image
																		className={`${styles.createCollection_image} ${
																			createCollectionOptionsKeys.video_url ===
																				i.id &&
																			collectionData.createCollectionWay ===
																				i.id
																				? styles.createCollection_image_Active2
																				: createCollectionOptionsKeys.video_url ===
																				  i.id
																				? styles.createCollection_image_video
																				: collectionData.createCollectionWay ===
																				  i.id
																				? styles.createCollection_image_Active
																				: ""
																		}`}
																		src={i.icon}
																		alt={i.title}
																		width={28}
																		height={28}
																	/>
																</div>
															</label>
														))}
												</div>

												<p className='text-red-500 my-1 h-3.5 leading-none'>
													{error.createCollectionWay}
												</p>

												{collectionData.createCollectionWay ? (
													<div>
														{collectionData.createCollectionWay ===
														createCollectionOptionsKeys.blog_url ? (
															<>
																<label className='mb-1 block'>
																	Blog/Article URL
																</label>
																<input
																	className='text-left placeholder-gray-101 outline-none px-3 h-12 bg-white rounded-xl w-full avoid_autofill_bg shadow-2xl'
																	placeholder='Enter URL'
																	name='blog_url'
																	type='text'
																	value={collectionData.blog_url}
																	onChange={handleInputChange}
																/>
																<p className='text-red-500 my-1 h-3.5 leading-none'>
																	{error.blog_url}
																</p>
															</>
														) : null}

														{collectionData.createCollectionWay ===
														createCollectionOptionsKeys.video_url ? (
															<>
																{showUploadVideo ? (
																	<>
																		<label className='mb-1 block'>
																			Upload video
																		</label>

																		<div className='mb-4'>
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
																			) : collectionData.video_url ? (
																				<div className='flex flex-col items-center justify-center my-4'>
																					<video
																						controls
																						className='object-cover rounded-xl w-auto h-auto max-h-80'>
																						<source
																							src={collectionData.video_url}
																							type='video/mp4'
																						/>
																					</video>

																					<div className='text-center underline lg:text-lg text-base cursor-pointer'>
																						<span
																							onClick={() =>
																								handleUploadDataChange(
																									"",
																									"video_url"
																								)
																							}>
																							Change Video
																						</span>
																					</div>
																				</div>
																			) : (
																				<div className='flex flex-col items-center justify-center my-4'>
																					<Dragger
																						className='bg-transparent h-56 w-56'
																						{...uploadVideoProps}
																						name='video_url'
																						showUploadList={false}
																						required={
																							!collectionData.video_url
																						}>
																						<p className='ant-upload-drag-icon'>
																							<UploadOutlined />
																						</p>
																						<p className='w-4/6 mx-auto'>
																							Click or drag file to this area to
																							upload Video
																						</p>
																					</Dragger>
																				</div>
																			)}
																		</div>
																	</>
																) : (
																	<>
																		<div className='flex gap-2 mb-1'>
																			<label className='block'>Video URL</label>
																			<Tooltip title='Only the first 3 minutes of video data will be captured. Contact the admin to process longer videos.'>
																				<InfoCircleOutlined className='flex items-center cursor-pointer mb-1' />
																			</Tooltip>
																		</div>

																		<input
																			className='text-left placeholder-gray-101 outline-none px-3 h-12 bg-white rounded-xl w-full avoid_autofill_bg shadow-2xl'
																			placeholder='Enter URL'
																			name='video_url'
																			type='text'
																			value={collectionData.video_url}
																			onChange={handleInputChange}
																		/>
																	</>
																)}

																{error.video_url && (
																	<p
																		className={`text-red-500 my-1 h-3.5 leading-none ${
																			showUploadVideo
																				? "flex justify-center items-center"
																				: ""
																		}`}>
																		{error.video_url}
																	</p>
																)}

																<label className='mb-1 block mt-4'>
																	Additional Information
																</label>
																<textarea
																	name='description'
																	value={collectionData.description}
																	rows={5}
																	placeholder={"Type two lines here.."}
																	className='text-left placeholder-gray-101 outline-none p-3 bg-white rounded-xl w-full'
																	onChange={handleInputChange}
																/>
																<div className='text-center font-medium text-lg my-3'>
																	Or
																</div>
																<div className='flex justify-center items-center'>
																	<div
																		className='underline cursor-pointer flex justify-center items-center mb-3'
																		role='button'
																		title={
																			showUploadVideo
																				? "Click here to enter video URL"
																				: "Click here to upload video"
																		}
																		onClick={handleUploadVideoModeChange}>
																		{showUploadVideo
																			? "Video URL"
																			: "Upload video"}
																	</div>
																</div>
															</>
														) : null}
														{/* {createCollectionOptionsKeys.video_url && 
														<div>
															{createCollectionTypes[2].is_faq_count_display && <input type="number"  min="0" 	  max="20" />}
															{createCollectionTypes[2].is_faq_enabled &&  <input type="checkbox" />} 
															<p>perterer</p>
														</div>
													 } */}

														{collectionData.createCollectionWay ===
														createCollectionOptionsKeys.image_url ? (
															<>
																{showUploadImage ? (
																	<>
																		<label className='mb-1 block'>
																			Upload image
																		</label>

																		<div className='mb-4'>
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
																			) : collectionData.image_url ? (
																				<div className='flex flex-col items-center justify-center my-4'>
																					<img
																						src={collectionData.image_url}
																						// height='100%'
																						width='100%'
																						// loading='lazy'
																						className='object-cover rounded-xl max-w-340'
																					/>

																					<div className='text-center underline lg:text-lg text-base cursor-pointer'>
																						<span
																							onClick={() =>
																								handleUploadDataChange(
																									"",
																									"image_url"
																								)
																							}>
																							Change Image
																						</span>
																					</div>
																				</div>
																			) : (
																				<div className='flex flex-col items-center justify-center my-4'>
																					<Dragger
																						className='bg-transparent h-56 w-56'
																						{...uploadImageProps}
																						name='image_url'
																						showUploadList={false}
																						required={
																							!collectionData.image_url
																						}>
																						<p className='ant-upload-drag-icon'>
																							<UploadOutlined />
																						</p>
																						<p className='w-4/6 mx-auto'>
																							Click or drag file to this area to
																							upload Image
																						</p>
																					</Dragger>
																				</div>
																			)}
																		</div>
																	</>
																) : (
																	<>
																		<label className='mb-1 block'>
																			Image URL
																		</label>
																		<input
																			className='text-left placeholder-gray-101 outline-none px-3 h-12 bg-white rounded-xl w-full avoid_autofill_bg shadow-2xl'
																			placeholder='Enter URL'
																			name='image_url'
																			type='text'
																			value={collectionData.image_url}
																			onChange={handleInputChange}
																		/>
																	</>
																)}

																{error.image_url && (
																	<p
																		className={`text-red-500 my-1 h-3.5 leading-none ${
																			showUploadImage
																				? "flex justify-center items-center"
																				: ""
																		}`}>
																		{error.image_url}
																	</p>
																)}

																<label className='mb-1 block mt-4'>
																	Additional Information
																</label>
																<textarea
																	name='description'
																	value={collectionData.description}
																	rows={5}
																	placeholder={"Type two lines here.."}
																	className='text-left placeholder-gray-101 outline-none p-3 bg-white rounded-xl w-full'
																	onChange={handleInputChange}
																/>
																<div className='text-center font-medium text-lg my-3'>
																	Or
																</div>
																<div className='flex justify-center items-center'>
																	<div
																		className='underline cursor-pointer mb-3'
																		role='button'
																		title={
																			showUploadImage
																				? "Click here to enter image URL"
																				: "Click here to upload image"
																		}
																		onClick={handleUploadImageModeChange}>
																		{showUploadImage
																			? "Image URL"
																			: "Upload image"}
																	</div>
																</div>
															</>
														) : null}

														{collectionData.createCollectionWay !==
															createCollectionOptionsKeys.video_url &&
														collectionData.createCollectionWay !==
															createCollectionOptionsKeys.image_url ? (
															<>
																<label className='mb-1 block'>
																	Give a name for your Collection
																</label>
																<input
																	className='text-left placeholder-gray-101 outline-none px-3 h-12 bg-white rounded-xl w-full avoid_autofill_bg shadow-2xl'
																	placeholder='Give a name for your collection. Do not sweat it - you can change it later!'
																	name='name'
																	type='text'
																	value={collectionData.name}
																	onChange={handleInputChange}
																/>
																<p className='text-red-500 my-1 h-3.5 leading-none'>
																	{error.name}
																</p>
															</>
														) : null}

														{collectionData.createCollectionWay ===
														createCollectionOptionsKeys.from_scratch ? (
															<>
																<label className='mb-1 block'>
																	Tell us what you want to write about, AI will
																	generate something for you
																</label>
																<textarea
																	name='description'
																	value={collectionData.description}
																	rows={5}
																	placeholder={
																		"Type two lines here..\nFor eg.\nWhen you go on a #hiking trip in the #fall season, don't forget to carry a warm full sleeve shirt.."
																	}
																	className='text-left placeholder-gray-101 outline-none p-3 bg-white rounded-xl w-full'
																	onChange={handleInputChange}
																/>
																<p className='text-red-500 my-1 h-3.5 leading-none'>
																	{error.description}
																</p>

																{/* // HIDDEN detailed Blog feature from create collection flow */}
																{/* <div className='flex'>
											<input
												type='checkbox'
												name='detailedBlogChecked'
												id='detailedBlogChecked'
												checked={collectionData.detailedBlogChecked}
												className='text-left placeholder-gray-101 outline-none p-3 rounded-md w-5 mr-2'
												onChange={handleInputChange}
											/>
											<label
												className='text-white'
												htmlFor='detailedBlogChecked'>
												Check if you want to create a detailed blog
											</label>
										</div>
										<p className='text-red-500 h-3'>
											{error.detailedBlogChecked}
										</p> */}
																{/* {collectionData.detailedBlogChecked ? (
											<>
												<Select
													mode='tags'
													className='w-full text-base'
													placeholder='Enter tags'
													value={collectionData.blog_filter}
													onChange={handleTagsChange}
													size='large'
												/>
												<p className='text-red-500 h-3'>{error.blog_filter}</p>
											</>
										) : null} */}
															</>
														) : null}
													</div>
												) : null}

												{collectionData.createCollectionWay && (
													<div className='mb-5 '>
														{createCollectionTypes
															.filter(
																(item) =>
																	item.id === collectionData.createCollectionWay
															)
															.map((item) => (
																<div key={item.id}>
																	{item.is_faq_enabled === true && (
																		<Checkbox
																			checked={showFaqCount}
																			onChange={(e) =>
																				setShowFaqCount(e.target.checked)
																			}>
																			Enable FAQ
																		</Checkbox>
																	)}

																	{item.is_faq_count_display === true &&
																		showFaqCount && (
																			<div className='flex gap-2 items-center mt-1'>
																				<p className='text-sm'>FAQ Count</p>
																				<InputNumber
																					min={0}
																					max={20}
																					value={count}
																					onChange={(value) => setCount(value)}
																					className='  rounded-10  w-14'
																				/>
																			</div>
																		)}
																</div>
															))}
													</div>
												)}

												<div className='flex justify-end mt-auto gap-4'>
													<button
														type='button'
														onClick={handleCancel}
														className='min-w-24 md:min-w-40 text-xs md:text-sm z-10 rounded-md py-1 md:py-2.5 px-3.5 h-11 font-bold text-indigo-400 border-2 border-indigo-400'>
														Cancel
													</button>
													<button
														onClick={createPlistCollection}
														type='submit'
														disabled={isUploading}
														className={`min-w-24 md:min-w-40 text-xs md:text-sm z-10 ${
															isUploading
																? "bg-indigo-400 cursor-not-allowed"
																: "bg-indigo-103"
														} border-none rounded-md py-1 md:py-3 px-3.5 h-11 font-bold text-white`}>
														Next
													</button>
												</div>
											</form>
										) : (
											// not using now, set openCreateCollection default true
											<div className='flex justify-end items-end h-full'>
												<button
													onClick={handleCancel}
													type='button'
													className='min-w-24 md:min-w-40 text-xs md:text-sm z-10 rounded-md py-2.5 px-7 font-bold text-indigo-400 border-2 border-indigo-400'>
													I'll come back later
												</button>
												<button
													type='submit'
													onClick={() => setOpenCreateCollection(true)}
													className='bg-indigo-600 rounded text-white py-2.5 w-full font-normal text-base max-w-s-1'>
													Ok, lets go!
												</button>
											</div>
										)}
									</div>
								</div>
							</>
						)}
					</ReviewCollectionContainerWrapper>
					{/* // AskQuestion Component memorized  */}
					{askQuestionComponentMemo}
				</div>
			</div>

			{(isVideoDataExtractionStarted || createWishlistInProgress) && (
				<div className='fixed top-0 left-0 flex flex-col justify-center items-center w-full min-h-screen h-full backdrop-filter bg-gray-112 z-20'>
					<Spin
						// indicator={<LoadingOutlined className='text-3xl-1' spin />}
						indicator={
							<Loading3QuartersOutlined
								className='flex text-6xl-1 text-indigo-100'
								spin
							/>
						}
					/>

					{createWishlistInProgress ? (
						<p className='text-lg text-indigo-100 mt-4'>
							<b>Generating Content</b>
						</p>
					) : null}
					{isVideoDataExtractionStarted ? (
						<p className='text-lg text-indigo-100 mt-4 text-center max-w-640'>
							<b>Preparing the content from the video.</b>
							<br />
							<b>
								We will notify you once it is ready.
								<br />
								Meanwhile feel free to{" "}
								<span
									onClick={handleAskAuraClick}
									role='button'
									className='underline cursor-pointer'>
									search for products
								</span>{" "}
								or{" "}
								<span
									onClick={handleCancel}
									role='button'
									className='underline cursor-pointer'>
									visit the store
								</span>
								.
							</b>
						</p>
					) : null}
				</div>
			)}
			{showSettings ? (
				<AuraChatSettingModal
					isOpen={settingModalOpen}
					onClose={closeSettingModal}
					// showDescriptionTemplate={showDescriptionTemplate}
					// showTagTemplate={showTagTemplate}
					mode={showSettingsMode}
				/>
			) : null}
		</div>
	);
};

export default CreateFreeCollection;
