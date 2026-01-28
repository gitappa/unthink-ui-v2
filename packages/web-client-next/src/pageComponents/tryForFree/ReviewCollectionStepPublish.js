import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Upload, Tooltip, Spin, notification, Image, Select, Checkbox, Button } from "antd";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { PictureOutlined, InfoCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import PublishingOptionsDropdown from "./PublishingOptionsDropdown";
import { updateWishlist } from "../wishlistActions/updateWishlist/redux/actions";
import { openCollectionShareModal } from "../collectionShareModal/redux/actions";
import ShareOptions from "../shared/shareOptions";
import {
	checkIsFavoriteCollection,
	getBlogCollectionPageSlugPath,
} from "../../helper/utils";
import {
	collectionAPIs,
	profileAPIs,
	collectionProductsExportCsvURL,
} from "../../helper/serverAPIs";
import {
	// COLLECTION_COVER_IMG_SIZES,
	COLLECTION_COVER_IMG_SIZE_900_900,
	DONE,
	PUBLISHED,
	PUBLISHING_OPTION_EXPORT_PRODUCTS_CSV,
	PUBLISHING_OPTION_PAGE,
	favorites_collection_name,
} from "../../constants/codes";
import { auraYfretUserCollBaseUrl } from "../../constants/config";

import { ShareAltOutlined, SendOutlined } from "@ant-design/icons";
import aura_assistant from "../../images/chat/aura_assistant_image.png";
import star_ai_icon from "../../images/unthink_star_ai_icon.svg";

import CropAndResizeImageModal from "../cropAndResizeImageModal/CropAndResizeImageModal";
import ReviewCollectionContainerWrapper from "./ReviewCollectionContainerWrapper";
import ReactPlayer from "react-player";
import { getUserCollection } from "../Auth/redux/actions";
// import listening_avatar from "../../images/videos/listening_avatar.gif";
import Cookies from "js-cookie";
import { SocketContext } from "../../context/socketV2";

const { Dragger } = Upload;

const { Option } = Select;

const defaultPostPageFormData = {
	collection_name: "",
	path: "",
};

const ReviewCollectionStepPublish = ({
	handlePreviewCollectionPage,
	handleDiscard,
	updatedData,
	setUpdatedData,
	handleUploadedDataChange,
	currentCollection,
	authUser,
	currentView,
	// onPublishButtonClick,
	STEPS,
	handleSelectPublishingOption,
	publishingOption,
	hiddenPublishingOptions,
	handleChangeView,
	collection_properties,
	authUserCollections,
	DefaultCoverImage,
	starredProducts,
	publishOverlay,
	storeData
}) => {
	const dispatch = useDispatch();
	const [isUploading, setIsUploading] = useState(false);
	const [postPageFormData, setPostPageFormData] = useState({
		...defaultPostPageFormData,
	});
	const [postPageFormErrors, setPostPageFormErrors] = useState({});
	const [cropAndResizeImageData, setCropAndResizeImageData] = useState({
		isOpen: false,
		selectedImage: "",
	});
	const { sendSocketClientimageGenarate } = useContext(SocketContext);
	const { createCollectionTypes } = storeData;
	const [aiGenerate, setAiGenerate] = useState(false);
	// Ref for the image container to get actual rendered dimensions
	const imageContainerRef = useRef(null);
	const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });


	const cover_image_coordinates = useMemo(
		() =>
			publishOverlay || currentCollection?.cover_image_coordinates,
		[currentCollection?.cover_image_coordinates, publishOverlay]
	);


	console.log("cover_image_coordinates", cover_image_coordinates);

	// Get actual container dimensions
	useEffect(() => {
		const updateDimensions = () => {
			if (imageContainerRef.current) {
				const { width, height } = imageContainerRef.current.getBoundingClientRect();
				setContainerDimensions({ width, height });
			}
		};

		updateDimensions();
		window.addEventListener('resize', updateDimensions);

		return () => {
			window.removeEventListener('resize', updateDimensions);
		};
	}, [updatedData.cover_image, cover_image_coordinates]);

	const setShowShareOptions = useCallback(() => {
		dispatch(openCollectionShareModal(currentCollection, authUser));
	}, [currentCollection, authUser]);

	useEffect(() => {
		if (currentCollection._id && currentView === STEPS.PUBLISH) {
			setPostPageFormData({
				collection_name: currentCollection.collection_name || "",
				path: currentCollection.path || "",
			});

			return () => {
				setPostPageFormData({
					...defaultPostPageFormData,
				});
			};
		}

		return () => { };
	}, [currentCollection, currentView]);

	const uploadProps = useMemo(
		() => ({
			accept: "image/*",
			multiple: false,
			customRequest: async (info) => {
				if (info?.file) {
					// convert image to data URL
					const reader = new FileReader();
					reader.addEventListener("load", () =>
						setCropAndResizeImageData({
							isOpen: true,
							selectedImage: reader.result?.toString() || "",
							ImageFileName: info?.file?.name
						})
					);
					reader.readAsDataURL(info.file);
				}
			},
		}),
		[handleUploadedDataChange]
	);

	const handlePostPageInputChange = (e) => {
		const { name, value } = e.target;

		if (name) {
			setPostPageFormData((data) => ({
				...data,
				[name]: value,
			}));
		}
	};

	const collectionPageSlugPath = useMemo(
		() =>
			(currentCollection._id &&
				getBlogCollectionPageSlugPath(authUser.user_name)) ||
			"",
		[currentCollection._id && authUser.user_name]
	);



	const matchedCollection = useMemo(() => {
		if (!currentCollection?.generated_by) return null;

		console.log("currentCollection?.generated_by", currentCollection?.generated_by)

		return createCollectionTypes.find(
			(item) => item.generated_by === currentCollection.generated_by
		) || null;
	}, []);


	const finalCollectionPagePath1 = useMemo(
		() =>
			((typeof window !== "undefined" && window.location?.origin) || "") +
			(collectionPageSlugPath.replace("{collectionPath}", "") || ""),
		[collectionPageSlugPath, postPageFormData.path]
	);

	const finalCollectionPagePath2 = useMemo(
		() => postPageFormData.path || "[page_slug]",
		[collectionPageSlugPath, postPageFormData.path]
	);

	const isPostPageFormTouched = useMemo(
		() =>
			currentCollection._id &&
			(postPageFormData.collection_name !== currentCollection.collection_name ||
				postPageFormData.path !== currentCollection.path),
		[
			currentCollection._id,
			currentCollection.collection_name,
			currentCollection.path,
			postPageFormData,
		]
	);

	const handlePostPageFormReset = useCallback(() => {
		setPostPageFormData({
			collection_name: currentCollection.collection_name || "",
			path: currentCollection.path || "",
		});
	}, [currentCollection.collection_name, currentCollection.path]);

	const validatePostPageForm = useCallback(() => {
		const errors = {
			collection_name: "",
			path: "",
		};

		if (!postPageFormData.collection_name) {
			errors.collection_name = "collection page title (name) is required";
		}

		if (!postPageFormData.path) {
			errors.path = "collection page url slug is required";
		} else if (
			postPageFormData.path.includes(" ") ||
			postPageFormData.path.includes("@") ||
			postPageFormData.path.includes("/") ||
			postPageFormData.path.includes("\\")
		) {
			errors.path = "collection page url slug must be valid";
		}

		setPostPageFormErrors(errors);

		return Object.values(errors).every((v) => !v); // return true if there is no error
	}, [postPageFormData]);

	const handleInvalidPostPagePath = useCallback(() => {
		setPostPageFormErrors((err) => ({
			...err,
			path: "Collection page url slug is already exists. Please update",
		}));
	}, []);

	const inpurRef = useRef(null);

	const handlePostPageFormSave = useCallback(async () => {
		if (validatePostPageForm()) {
			const editPayload = {
				_id: currentCollection._id,
				collection_name: postPageFormData.collection_name,
				fetchUserCollection: true,
			};

			if (postPageFormData.path !== currentCollection.path) {
				try {
					const res = await collectionAPIs.verifyCollectionPathAPICall(
						postPageFormData.path
					);

					if (res.data.status_code === 200) {
						editPayload.path = postPageFormData.path;
					} else {
						handleInvalidPostPagePath();
						return;
					}
				} catch (error) {
					handleInvalidPostPagePath();
					return;
				}
			}

			dispatch(updateWishlist(editPayload));
		} else if (!postPageFormData.path) {
			inpurRef.current.focus();
		}
	}, [
		validatePostPageForm,
		handleInvalidPostPagePath,
		currentCollection._id,
		postPageFormData,
	]);

	const CollectionDetectApi = async () => {
		const payload = {
			keyword_tag_map: currentCollection.keyword_tag_map,
			collection_name: currentCollection.collection_name,
			user_id: currentCollection.collection_id,
			collection_path: currentCollection.path,
		};

		try {
			const res = await collectionAPIs.collectionDetectKeyApi(payload);

			if (res.statusCode === 200) {
				console.log("Success", res);
			} else {
				console.log("Error:", res);
			}
		} catch (error) {
			console.error("API Call Failed:", error);
		}
	};

	// pulish function
	const onPublishButtonClick = useCallback(() => {

		const payload = {
			_id: currentCollection._id,
			status: currentCollection.status === DONE ? PUBLISHED : DONE,
			fetchUserCollection: true, // add this if latest collection detains form API is required after success update status
			checkForNFTReward: true, // flag to check for NFT, if user has published the first collection
			checkForNFTRewardShowNotification: true, // flag to show notification only for NFT
			cover_image_coordinates: cover_image_coordinates,
		};
		dispatch(updateWishlist(payload));

		// Collection detect function 
		if (currentCollection.status === "done") {
			CollectionDetectApi()
		}
	}, [currentCollection._id, currentCollection.status]);


	// close crop and resize modal
	const onCropAndResizeImageModalClose = useCallback(() => {
		setCropAndResizeImageData({});
	}, []);

	const onCropAndResizeImageModalSubmit = useCallback(
		async ({ blobData }) => {
			try {
				setCropAndResizeImageData({});
				setIsUploading(true);
				if (blobData) {
					const response = await profileAPIs.uploadImage({
						file: blobData,
						custom_size: COLLECTION_COVER_IMG_SIZE_900_900,
					});
					if (response?.data?.data && response.data.data[0]) {
						handleUploadedDataChange("cover_image", response.data.data[0]?.url); // API call and updating local state with updated value
					}
				}
			} catch (error) {
				notification["error"]({
					message: "Failed to upload cover image",
				});
			} finally {
				setIsUploading(false);
				setIsDragAndDropVisible(false);
			}
		},
		[handleUploadedDataChange]
	);


	const [isVideoHovered, setIsVideoHovered] = useState(false);
	const [isDragAndDropVisible, setIsDragAndDropVisible] = useState(!updatedData.cover_image && !updatedData.video_url);

	// Handle file upload for cover image
	const handleCoverImageUpload = (info) => {
		if (info.file.status === "done") {
			const file = info.file.originFileObj;
			console.log("filehandleCoverImageUpload", file);

			handleUploadedDataChange("cover_image", URL.createObjectURL(file));
		}
	};

	useEffect(() => {
		if (
			currentView === STEPS.PUBLISH &&
			updatedData.cover_image !== null &&
			!updatedData.cover_image
		) {
			handleUploadedDataChange("cover_image", DefaultCoverImage);
			setIsDragAndDropVisible(false);
		}
	}, [currentView, updatedData.cover_image]);

	const handleRemoveImage = () => {
		handleUploadedDataChange("cover_image", null);
		setIsDragAndDropVisible(true);
	};

	const handleDataAiImageRequest = () => {
		sendSocketClientimageGenarate({
			imageGenerate: {
				text: "",
			},
			metadata: {
				keyword_tag_map: currentCollection?.keyword_tag_map,
				store: currentCollection?.domain_store || "",
				search_type: currentCollection?.generated_by === "image_based" ? "shop_the_look" : "smart_search",
				description: currentCollection?.description || "",
				image_url: currentCollection?.cover_image || "",
				generate_overlay_enable: matchedCollection?.enable_overlay
			}
		});
	};

	// Add this debug effect
	useEffect(() => {
		if (cover_image_coordinates && containerDimensions.width > 0) {
			console.log("=== DEBUG: Overlay Positioning ===");
			console.log("Container Dimensions:", containerDimensions);
			console.log("Original Image Size: 1024x1027");

			const scaleX = containerDimensions.width / 1024;
			const scaleY = containerDimensions.height / 1027;
			const scale = Math.min(scaleX, scaleY);
			const scaledWidth = 1024 * scale;
			const scaledHeight = 1027 * scale;
			const offsetX = (containerDimensions.width - scaledWidth) / 2;
			const offsetY = (containerDimensions.height - scaledHeight) / 2;

			console.log("Scale:", scale);
			console.log("Scaled Image Size:", scaledWidth, "x", scaledHeight);
			console.log("Offset X:", offsetX, "Offset Y:", offsetY);

			cover_image_coordinates.forEach((item, index) => {
				const originalX = item.point[0];
				const originalY = item.point[1];
				const adjustedX = (originalX * scale) + offsetX;
				const adjustedY = (originalY * scale) + offsetY;

				console.log(`Point ${index} (${item.attributes?.label}):`, {
					original: `(${originalX}, ${originalY})`,
					scaled: `(${adjustedX.toFixed(1)}, ${adjustedY.toFixed(1)})`,
					visible: adjustedX >= 0 && adjustedX <= containerDimensions.width &&
						adjustedY >= 0 && adjustedY <= containerDimensions.height
				});
			});
		}
	}, [containerDimensions, cover_image_coordinates]);


	// Fixed renderPublishOverlay function
	const renderPublishOverlay = (cover_image_coordinates, containerWidth, containerHeight) => {
		if (!cover_image_coordinates || !containerWidth || !containerHeight) return null;

		// Use the actual original image dimensions from your data
		const originalWidth = 1024;  // From your console logs
		const originalHeight = 1027; // From your console logs

		return cover_image_coordinates.map((item, index) => {
			if (!item.point || item.point.length < 2) return null;

			// Get the original coordinates
			const originalX = item.point[0];
			const originalY = item.point[1];

			// Calculate scaling factors
			const scaleX = containerWidth / originalWidth;
			const scaleY = containerHeight / originalHeight;

			// Use the smaller scale to maintain aspect ratio (object-cover behavior)
			const scale = Math.min(scaleX, scaleY);

			// Calculate scaled dimensions
			const scaledWidth = originalWidth * scale;
			const scaledHeight = originalHeight * scale;

			// Calculate offsets for centering
			const offsetX = (containerWidth - scaledWidth) / 2;
			const offsetY = (containerHeight - scaledHeight) / 2;

			// Apply scaling and centering
			const adjustedX = (originalX * scale) + offsetX;
			const adjustedY = (originalY * scale) + offsetY;

			// Check if the point is within the visible area
			if (adjustedX < 0 || adjustedX > containerWidth || adjustedY < 0 || adjustedY > containerHeight) {
				return null;
			}

			return (
				<Tooltip key={index} title={item.attributes?.label || "Product"} color="blue">
					<div
						className="absolute w-6 h-6 bg-blue-500 rounded-full cursor-pointer animate-pulse"
						style={{
							left: `${adjustedX}px`,
							top: `${adjustedY}px`,
							transform: 'translate(-50%, -50%)',
							boxShadow: "0 0 12px rgba(59, 130, 246, 0.9)",
							zIndex: 20,
						}}
					/>
				</Tooltip>
			);
		});
	};

	return (
		<div className='publish-step-container'>
			<ReviewCollectionContainerWrapper>
				{/* Title section START */}
				<div className='flex md:items-center justify-between flex-col-reverse md:flex-row flex-wrap gap-5 md:gap-0'>
					<div>
						<p className='md:leading-none font-normal flex items-center mb-0 text-slat-104'>
							{publishingOption === PUBLISHING_OPTION_PAGE ? (
								<>
									<span className='text-xl-1 md:text-2xl desktop:text-display-l font-semibold break-word-only ellipsis_1'>
										Almost there!
									</span>
								</>
							) : null}
							{publishingOption === PUBLISHING_OPTION_EXPORT_PRODUCTS_CSV ? (
								<>
									<span className='text-xl-1 md:text-2xl desktop:text-display-l font-semibold break-word-only ellipsis_1'>
										Export products as a CSV file
									</span>
								</>
							) : null}
						</p>
					</div>
					<div className='ml-auto flex flex-wrap gap-2 h-fit-content'>
						{publishingOption === PUBLISHING_OPTION_PAGE &&
							isPostPageFormTouched ? (
							<>
								<button
									onClick={handlePostPageFormReset}
									className='text-xs md:text-sm z-10 rounded-xl py-2.5 px-3.5 h-full font-bold bg-indigo-103 text-white p-3 border-2 border-indigo-103 ml-auto'>
									Discard
								</button>
								<button
									onClick={handlePostPageFormSave}
									className='text-xs md:text-sm z-10 rounded-xl py-2.5 px-3.5 h-full font-bold bg-indigo-103 text-white p-3 border-2 border-indigo-103 min-w-40'>
									Save Changes
								</button>
							</>
						) : (
							<>
								<button
									type='button'
									onClick={handleDiscard}
									className='text-xs md:text-sm z-10 rounded-xl py-2.5 px-3.5 h-full font-bold text-indigo-103 border-2 border-indigo-103 md:ml-auto'>
									Cancel
								</button>

								<button
									onClick={() => handleChangeView(STEPS.PRODUCTS)}
									className='hidden lg:inline-block text-xs md:text-sm z-10 rounded-xl py-2.5 px-3.5 h-full font-bold bg-indigo-103 text-white p-3 border-2 border-indigo-103'>
									Previous
								</button>
								<div>
									<PublishingOptionsDropdown
										handleSelectPublishingOption={handleSelectPublishingOption}
										selectedOption={publishingOption}
										showSelectedMark
										hiddenPublishingOptions={hiddenPublishingOptions}
									/>
								</div>

								<button
									onClick={handlePreviewCollectionPage}
									className='text-xs md:text-sm z-10 rounded-xl py-2.5 px-3.5 h-full font-bold bg-indigo-103 text-white p-3 border-2 border-indigo-103'>
									{currentCollection.status === PUBLISHED ? "View" : "Preview"}
								</button>
								{currentCollection.status === DONE ? (
									<button
										onClick={onPublishButtonClick}
										className='bg-indigo-103 rounded-xl text-white font-bold text-xs md:text-sm p-3 max-w-s-1'
										title='click to publish the collection'>
										Publish
									</button>
								) : currentCollection.status === PUBLISHED ?
									<button
										onClick={onPublishButtonClick}
										className='bg-indigo-103 rounded-xl text-white font-bold text-xs md:text-sm p-3 max-w-s-1'
										title='click to publish the collection'>
										UnPublish
									</button>
									: null
								}
							</>
						)}
					</div>
				</div>
				{/* Title section END */}

				<div className='my-10 post-as-page-content'>
					{publishingOption === PUBLISHING_OPTION_PAGE ? (
						<div className={`grid grid-cols-1 tablet:grid-cols-2 gap-10 tablet:gap-8 ${authUserCollections.length === 0 ? "" : "items-center"}`}>
							<div className='flex flex-col gap-10'>
								<div>
									<label className='text-xl font-normal block mb-0.75'>
										Title*
									</label>
									{checkIsFavoriteCollection(currentCollection) ? (
										<input
											className='text-left placeholder-gray-101 outline-none px-3 h-12 rounded-xl w-full max-w-366 cursor-not-allowed text-gray-101'
											name='collection_name'
											type='text'
											value={favorites_collection_name}
											disabled
										/>
									) : (
										<input
											className='text-left placeholder-gray-101 outline-none px-3 h-12 rounded-xl w-full max-w-366'
											placeholder='Enter collection title'
											name='collection_name'
											type='text'
											value={postPageFormData.collection_name}
											onChange={handlePostPageInputChange}
											onBlur={validatePostPageForm}
										/>
									)}
									{postPageFormErrors.collection_name && (
										<p className='text-red-400 text-xs mt-2'>
											{postPageFormErrors.collection_name}
										</p>
									)}
								</div>

								<div>
									<div className="flex items-center justify-between desktop:justify-start desktop:gap-56">
										<label className='text-xl font-normal block mb-0.75 whitespace-nowrap'>Cover Image</label>
										{
											updatedData?.cover_image && (
												<div className="p-2 cursor-pointer" onClick={handleRemoveImage}>
													<CloseCircleOutlined className="text-xl" />
												</div>
											)
										}
									</div>
									<div>
										{!isDragAndDropVisible ? (
											<>
												{!updatedData.cover_image ? (
													<div className="relative w-full max-w-366 aspect-square rounded-2xl">
														{updatedData.video_url && (
															<ReactPlayer
																url={updatedData.video_url}
																playing={isVideoHovered}
																muted
																loop
																width="100%"
																height="100%"
																playsinline
																className="rounded-2xl Video_player"
																onMouseEnter={() => setIsVideoHovered(true)}
																onMouseLeave={() => setIsVideoHovered(false)}
															/>
														)}
													</div>
												) : (
													<div
														ref={imageContainerRef}
														className="relative w-full max-w-366 aspect-square rounded-2xl overflow-hidden"
														onMouseEnter={() => setIsVideoHovered(true)}
														onMouseLeave={() => setIsVideoHovered(false)}
													>
														<LazyLoadImage
															src={updatedData.cover_image}
															height='100%'
															width='100%'
															style={{
																height: "100%",
																width: "100%",
																objectFit: "cover"
															}}
															// effect="blur"
															className="rounded-2xl"
															onLoad={() => {
																if (imageContainerRef.current) {
																	const { width, height } = imageContainerRef.current.getBoundingClientRect();
																	setContainerDimensions({ width, height });
																}
															}}
														/>

														{/* Properly scaled overlay points */}
														{cover_image_coordinates && containerDimensions.width > 0 && containerDimensions.height > 0 && (
															<div className="absolute inset-0">
																{renderPublishOverlay(
																	cover_image_coordinates,
																	containerDimensions.width,
																	containerDimensions.height
																)}
															</div>
														)}
													</div>
												)}
												<button
													onClick={() => setIsDragAndDropVisible(true)}
													className='hidden lg:inline-block text-xs md:text-sm z-10 rounded-xl py-2.5 px-3.5 h-full font-bold bg-indigo-103 text-white p-3 border-2 border-indigo-103 mt-4 mr-4'>
													Update cover image
												</button>
												{matchedCollection?.enable_ai_cover_image === true &&
													(
														<button
															onClick={handleDataAiImageRequest}
															className='hidden lg:inline-block text-xs md:text-sm z-10 rounded-xl py-2.5 px-3.5 h-full font-bold bg-indigo-103 text-white p-3 border-2 border-indigo-103 mt-4 mr-4'>
															Generate AI Image
														</button>
													)}
											</>
										) : (
											<div className="w-full max-w-366 aspect-square mt-4">
												{isUploading ? (
													<Spin className='flex items-center justify-center h-32' />
												) : (
													<>
														<Dragger
															className='w-full px-4 rounded-2xl'
															{...uploadProps}
															name='cover_image'
															showUploadList={false}
															onChange={handleCoverImageUpload}
														>
															<p className='ant-upload-drag-icon'>
																<PictureOutlined />
															</p>
															<p className='ant-upload-text'>
																Click or drag a file to this area to add a cover image (Optional)
															</p>
															<p className='ant-upload-text text-sm'>
																(Recommended size : 600 x 600)
															</p>
														</Dragger>

														<Dragger
															className='w-52 h-52 px-4 rounded-2xl no_background_change_image'
															{...uploadProps}
															name='cover_image'
															showUploadList={false}
															onChange={handleCoverImageUpload}
														>
															<button
																className='hidden lg:inline-block text-xs md:text-sm z-10 rounded-xl py-2.5 px-3.5 h-full font-bold bg-indigo-103 text-white p-3 border-2 border-indigo-103 mt-4 mr-4'>
																Upload cover image
															</button>
														</Dragger>
													</>
												)}
											</div>
										)}
									</div>
								</div>

								{/* Show collection theme for swiftly styled store collection. */}
								{collection_properties?.collection_theme?.is_display &&
									collection_properties?.collection_theme?.display_value
										.length ? (
									<div>
										<div className='flex mb-0.75 w-full max-w-366'>
											<label className='text-sm font-normal block'>
												Organize your collection under a campaign or theme if
												you like
											</label>
											<Tooltip title='Map this collection into one of these campaign or themes set up by your administrator (optional)'>
												<InfoCircleOutlined className='text-base flex ml-2 mt-0.5' />
											</Tooltip>
										</div>
										<Select
											name={"collection_theme"}
											className={`w-full max-w-366 text-base collection_theme_select_input publish_dropdown_select`}
											placeholder={`Select theme`}
											value={updatedData?.collection_theme}
											size='large'
											onChange={(values) =>
												handleUploadedDataChange("collection_theme", values)
											}>
											{collection_properties.collection_theme.display_value?.map(
												(theme) => (
													<Option key={theme.key} value={theme.key}>
														{theme.label}
													</Option>
												)
											)}
										</Select>
									</div>
								) : null}
							</div>
							<div className='flex flex-col gap-10 max-w-439'>
								{
									authUserCollections.length === 0 && (
										<div className='max-w-439 flex justify-center flex-col items-center'>
											<div className='relative w-full'>
												<div className='bubble bubble-bottom-left ml-auto md:ml-24 w-full-50 md:w-full-100 md:max-w-439 text-left'>
													Congratulations!
													<br /> Your page is ready to publish!
												</div>
												<img
													src={star_ai_icon}
													className='w-24 md:w-36 cursor-pointer mt-6'
												/>
											</div>
										</div>
									)
								}
								<div>
									<div className='flex justify-between'>
										<label className='text-xl font-normal block mb-0.75'>
											Collection Page URL
										</label>
										{currentCollection.status === PUBLISHED ? (
											<div className='relative'>
												<Tooltip
													title={
														isPostPageFormTouched
															? "Please save or discard the changes, to see the sharing options"
															: "Click to see the sharing options"
													}>
													<ShareAltOutlined
														className={`${isPostPageFormTouched
															? "cursor-not-allowed"
															: "cursor-pointer"
															}`}
														role='button'
														onClick={() =>
															!isPostPageFormTouched && setShowShareOptions()
														}
													/>
												</Tooltip>
											</div>
										) : null}
									</div>
									<div className='p-3 bg-lightgray-110 rounded-xl w-full max-w-439'>
										<p className='text-xl-3 break-all'>
											<span className='font-medium'>
												{finalCollectionPagePath1}
											</span>
											<span className='font-bold'>
												{finalCollectionPagePath2}
											</span>
										</p>
									</div>
									<p className='text-sm font-normal block mt-0.75'>
										You can change the URL if you like
									</p>
								</div>

								<div>
									<div className='flex flex-col lg:flex-row items-center'>
										<div className='w-full'>
											<div className='flex items-center mb-0.75'>
												<label
													className='text-xl font-normal block'
													htmlFor='path-input'>
													Page Slug*
												</label>
												<Tooltip title='You can edit this part of the URL as you wish. Having a good slug URL can help SEO.'>
													<InfoCircleOutlined className='text-base flex mt-2 mb-1 ml-2' />
												</Tooltip>
											</div>
											<p className='text-xs max-w-439 mb-2'>
												Spaces and special characters are not allowed except for
												hyphens(-) and underscores(_)
											</p>
											<input
												ref={inpurRef}
												className='text-left placeholder-gray-101 outline-none px-3 h-10 bg-white rounded-xl w-full max-w-439'
												placeholder='Enter your page URL slug'
												id='path-input'
												name='path'
												type='text'
												value={postPageFormData.path}
												onChange={handlePostPageInputChange}
												onBlur={validatePostPageForm}
											/>
										</div>
									</div>
									{postPageFormErrors.path && (
										<p className='text-red-400 text-xs mt-2'>
											{postPageFormErrors.path}
										</p>
									)}
								</div>
							</div>
						</div>
					) : null}
					{publishingOption === PUBLISHING_OPTION_EXPORT_PRODUCTS_CSV ? (
						<>
							<div>
								{currentCollection.product_lists?.length ? (
									<p className='text-lg text-white block'>
										{/* Click on the button below to export the products in CSV file. */}
									</p>
								) : (
									<p className='text-lg block'>
										No products found.
										<br />
										Please add or get products to export it in CSV file.
									</p>
								)}
							</div>
							<div className='mt-5'>
								{currentCollection.product_lists?.length && currentCollection._id ? (
									<a
										className='bg-indigo-103 rounded text-white py-2 font-normal text-base px-5'
										role='button'
										href={`${auraYfretUserCollBaseUrl}${collectionProductsExportCsvURL}?collection_id=${currentCollection._id}`}
										download
										target='_blank'>
										Export
									</a>
								) : (
									<p
										className='text-lg block underline'
										onClick={() => handleChangeView(STEPS.PRODUCTS)}
										role='button'
										title='Click here, to go to products section'>
										Go to products
									</p>
								)}
							</div>
						</>
					) : null}
				</div>
			</ReviewCollectionContainerWrapper>

			<CropAndResizeImageModal
				headerText='Crop and upload'
				isOpen={cropAndResizeImageData?.isOpen}
				onClose={onCropAndResizeImageModalClose}
				onSubmit={onCropAndResizeImageModalSubmit}
				aspect={1 / 1}
				selectedImg={cropAndResizeImageData?.selectedImage}
				ImageFileName={cropAndResizeImageData?.ImageFileName}
			/>
		</div>
	);
};

export default React.memo(ReviewCollectionStepPublish);