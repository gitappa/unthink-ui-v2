import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Upload, notification, message, Select, Tooltip } from "antd";
import {
	UploadOutlined,
	LoadingOutlined,
	CopyOutlined,
	RightOutlined,
	Loading3QuartersOutlined,
	CloseCircleOutlined,
} from "@ant-design/icons";
import facebookIcon from "../../images/staticpageimages/facebookIcon.png";
import instagramIcon from "../../images/staticpageimages/instagramIcon.png";
import CopyToClipboard from "react-copy-to-clipboard";

import Modal from "../../components/modal/Modal";
import { getPercentage, isEmpty } from "../../helper/utils";
import { collectionPageAPIs, profileAPIs } from "../../helper/serverAPIs";
import {
	// COLLECTION_COVER_IMG_SIZES,
	CURRENCY_SYMBOLS,
	CURRENCY_USD,
	PRODUCT_DUMMY_URL,
} from "../../constants/codes";
import { pdp_page_enabled, current_store_name, payment_url } from "../../constants/config";
import {
	replaceAndUpdateUserCollectionData,
	saveUserInfo,
} from "../Auth/redux/actions";
import { updateCustomProducts } from "../customProducts/redux/actions";
import AdditionalAttributes from "../productFilters/AdditionalAttributes";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import Addmore from "../../images/addmore2.svg";
import SwiperCore, { FreeMode } from "swiper";
import axios from "axios";
import { useRouter } from "next/router";

// Initialize Swiper modules
SwiperCore.use([FreeMode]);

const { Dragger } = Upload;
const { Option } = Select;

const defaultProductData = {
	mfr_code: "",
	name: "",
	brand: "",
	url: "",
	image: "",
	price: "",
	listprice: "",
	product_brand: "",
	currency: "USD",
	currency_symbol: "&#36;",
	product_tag: [],
	tags: "",
	// discount: "above 20",
	avlble: 1,
	color: "",
	tagged_by: [],
	starred: true, //to be added by default for future use, neednot be shown on input page
	sponsored: true, //to be added by default for future use, neednot be shown on input page
	hide: false, //to be added by default for future use, neednot be shown on input page
};

export const attributesToAvoid = [
	"name",
	"description",
	"product_brand", // brand
	"image",
	"additional_image",
	"product_tag",
	"price",
	"listprice",
	// "category",
	"weight",
	"currency",
	// "availability",
	"finish",
	"fit",
	"scent",
	"sleeve",
	"fragrance",
	// "custom_filter",
];

const CustomProductModal = ({
	isModalOpen,
	data = {},
	onModalClose,
	sellerDetails,
	allowEdit = false,
	storeTemplates,
	catalog_attributes,
	filter_settings,
}) => {
	const { data: product, collectionId } = data;
	const [productData, setProductData] = useState({
		...defaultProductData,
	});
	const [authUserId,store_id] =
		useSelector((state) => [
			state.auth.user.data.user_id,
			state.store.data.store_id,
		]);
	const [storeData] = useSelector((state) => [state.store.data]);
	const [productFormError, setProductFormError] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [openContactDetails, setOpenContactDetails] = useState(true);
	const [isView, setIsView] = useState(data.isView ?? true);
	const [showLoader, setShowLoader] = useState(false);
	const [autoGenerateHelperText, setAutoGenerateHelperText] = useState({});

	const [authUser] = useSelector((state) => [state.auth.user.data]);
	const [uploadedImages, setUploadedImages] = useState(
		product?.additional_image || []
	);

	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
		if (isModalOpen) {
			if (product) {
				setProductData({
					...product,
					url: product.url === PRODUCT_DUMMY_URL ? "" : product.url,
				});
				setIsView(data.isView ?? true);
			}

			return () => {
				setProductData({
					...defaultProductData,
				});
				// setOpenContactDetails(false);
				setIsView(true);
			};
		}

		return () => { };
	}, [isModalOpen]);



	useEffect(() => {
		setAutoGenerateHelperText({
			...autoGenerateHelperText,
			guidelines: authUser.productCatalogGuidelines || "",
			brand_description:
				authUser.productCatalogInformation || authUser.description || "",
		});
	}, [isModalOpen]);

	const validateProductForm = useCallback((data) => {
		let errorMEssage = "";
		if (!isEmpty(data.price) && isEmpty(data.price)) {
			if (!(+data.price > 0 && +data.listprice > 0)) {
				errorMEssage = "price and list price should have the value above 0";
			} else if (+data.price > +data.listprice) {
				errorMEssage =
					"price should have the value less than or equal to list price";
			}
		}

		setProductFormError(() => errorMEssage);

		return !errorMEssage;
	}, []);

	const handleAutoGenerateHelperText = useCallback((e) => {
		const { name, value } = e.target;
		setAutoGenerateHelperText((data) => ({
			...data,
			[name]: value,
		}));
	}, []);

	const handleProductDataInputChange = useCallback(
		(e) => {
			if (e.target) {
				const { name, value } = e.target;

				setProductData((data) => {
					const newData = {
						...data,
						[name]: value,
					};
					productFormError && validateProductForm(newData);

					return newData;
				});
			}
		},
		[productFormError, validateProductForm]
	);

	const handleProductDataTagsChange = useCallback((name, value) => {
		setProductData((data) => {
			const newData = {
				...data,
				[name]: value,
			};

			return newData;
		});
	}, []);

	const handleAdditionalAttributesChange = useCallback((name, value) => {
		setProductData((data) => ({
			...data,
			additionalAttributes: {
				...data.additionalAttributes,
				[name]: value || [], // will need to check and set different default type for each key
			},
		}));
	}, []);

	const uploadProps = {
		accept: "image/*",
		multiple: false,
		customRequest: async (info) => {
			try {
				setIsUploading(true);
				if (info?.file) {
					const response = await profileAPIs.uploadImage({
						file: info.file,
						// custom_size: COLLECTION_COVER_IMG_SIZES,
					});

					if (response?.data?.data) {
						if (response.data.data[0]) {
							handleUploadImageChange(
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

	const handleUploadImageChange = useCallback(
		(value = "") => {
			setProductData((data) => {
				const newData = {
					...data,
					image: value,
				};

				return newData;
			});
		},
		[productFormError, validateProductForm]
	);

	const handleProductDataSubmit = async (e) => {
		e.preventDefault();

		if (validateProductForm(productData)) {
			// Remove custom_filter from payload and set tags correctly
			const { custom_filter, ...restProductData } = productData;
			let tagsValue = "";
			if (Array.isArray(custom_filter)) {
				tagsValue = custom_filter.filter(Boolean).join(",");
			} else if (typeof custom_filter === "string") {
				tagsValue = custom_filter.trim();
			}

			// Remove custom_filter from additionalAttributes if present
			const { custom_filter: _cf, ...additionalAttributesWithoutCustomFilter } =
				restProductData.additionalAttributes || {};

			const payload = {
				...additionalAttributesWithoutCustomFilter,
				mfr_code: restProductData.mfr_code,
				name: restProductData.name,
				description: restProductData.description,
				price: +restProductData.price,
				listprice: +restProductData.listprice,
				image: restProductData.image,
				product_tag: restProductData.product_tag,
				tags: Array.isArray(_cf) ? _cf.join(",") : _cf,
				currency: currencyEdit,
				additional_image: uploadedImages,
			};

			if (
				productData.additionalAttributes &&
				productData.additionalAttributes.availability
			) {
				payload.avlble =
					productData.additionalAttributes.availability === "in stock" ? 1 : 0;
			}

			console.log("payload", payload);

			dispatch(updateCustomProducts([payload], authUser.user_id));
			//  else {
			// 	const data = { ...productData };
			// 	const product_lists = [data];

			// 	const res = await collectionPageAPIs.updateHandpickedProductsAPICall(
			// 		collectionId,
			// 		product_lists
			// 	);

			// 	if (res.data?.status_code === 200) {
			// 		notification["success"]({
			// 			message: "Product changes saved",
			// 		});

			// 		if (res.data?.data?._id)
			// 			dispatch(replaceAndUpdateUserCollectionData(res.data.data, true));
			// 	}
			// }
 			if (storeData?.pdp_settings?.is_buy_popup || !pdp_page_enabled ) {
				onModalClose();
		 
				router.push(`/product/${product.mfr_code}`)	
			} else {	 
				setIsView(false);
				onModalClose();
			}
		}
	};

	// sending keyword, product description, profile description in imagetodescription API call for generate details
	const imageText = useMemo(() => {
		let aboutProduct = [];
		let finalDescription = [];

		if (!isEmpty(productData?.name)) {
			aboutProduct.push(productData?.name);
		}

		if (!isEmpty(productData?.product_tag)) {
			aboutProduct.push(productData?.product_tag?.toString());
		}

		if (!isEmpty(productData?.description)) {
			aboutProduct.push(productData?.description);
		}

		if (!isEmpty(aboutProduct)) {
			finalDescription.push(
				"the product given in the image is: " + aboutProduct.join(", ")
			);
		}

		if (!isEmpty(autoGenerateHelperText?.guidelines)) {
			finalDescription.push(
				"this is the guidelines from the seller of the products: " +
				autoGenerateHelperText.guidelines
			);
		}

		if (!isEmpty(autoGenerateHelperText?.brand_description)) {
			finalDescription.push(
				"this is sellers brand profile just for reference: " +
				autoGenerateHelperText.brand_description
			);
		}

		return finalDescription.join(" and ");
	}, [productData, autoGenerateHelperText]);

	const additionalAttributesToShow = useMemo(() => {
		// Filter catalog_attributes based on is_display : true
		// Remove attributes based on attributesToAvoid from displayedAttributes
		const displayedAttributes = catalog_attributes?.filter((value) => {
			return value.is_display && !attributesToAvoid.includes(value.key);
		});

		// Extract keys from remaining attributes
		// const remainingAttributeKeys = displayedAttributes.map(
		// 	(value) => value.key
		// );

		// Filter display_filters based on remainingAttributeKeys
		// const finalAttributes = filter_settings?.display_filters?.filter((value) =>
		// 	remainingAttributeKeys.includes(value.key)
		// );

		return displayedAttributes;
	}, [catalog_attributes]);
	// console.log("additionalAttributesToShow", additionalAttributesToShow);
	// additionalAttributesToShow.map((attr) => (
	// 	<div>

	// 	{attr.key === collection_type  ?

	// 						additionalAttributesToShow.push()


	// 							:''}
	// 							</div>
	// ))
	useEffect(() => {
		if (!isEmpty(product)) {
			const additionalAttributes = {};
			for (const key in product) {
				if (additionalAttributesToShow.some((value) => value.key === key)) {
					additionalAttributes[key] = !isEmpty(product[key])
						? product[key]
						: [];
				}
			}

			setProductData((data) => ({
				...data,
				additionalAttributes: {
					...data.additionalAttributes,
					...additionalAttributes,
				},
			}));
		}
	}, [isModalOpen, additionalAttributesToShow]);

	const fetchProductData = useCallback(
		async (e) => {
			e.preventDefault();
			e.stopPropagation();

			try {
				setShowLoader(true);
				// setOriginalDescription(product?.description || "");
				const payload = {
					image_url: productData?.image,
					catalog_description: storeTemplates.catalog_description,
					image_text: imageText || undefined,
				};

				const saveUserInfoPayload = {
					productCatalogGuidelines: autoGenerateHelperText.guidelines,
					productCatalogInformation: autoGenerateHelperText.brand_description,
					platform: current_store_name, // required
					user_id: authUser.user_id, // required
					is_influencer: authUser.is_influencer, // required
					_id: authUser._id, // required
				};

				dispatch(
					saveUserInfo({
						userInfo: saveUserInfoPayload,
						resetCollections: false,
					})
				); //saving guidelines and description

				let res = await collectionPageAPIs.getImageToDescriptionAPICall(
					payload
				);
				const { data, status } = res;

				if (status === 200 && data?.status_code === 200) {
					const preparedData = {
						description: data.data.description,
						name: data.data.title,
						image_url: data.data.image_url,
						product_tag: data.data.tags,
						additionalAttributes: {},
						listprice: data?.data?.keyword_tag_map?.listprice,
						price: data?.data?.keyword_tag_map?.price,
					};

					// check and save keyword_tag_map properties which is available in additionalAttributesToShow
					for (const key in data.data.keyword_tag_map) {
						if (additionalAttributesToShow.some((value) => value.key === key)) {
							preparedData.additionalAttributes[key] =
								data.data.keyword_tag_map[key];
						}
					}

					setProductData((value) => ({ ...value, ...preparedData }));
				}
			} catch (err) {
				console.log(err);
			} finally {
				setShowLoader(false);
			}
		},
		[product, showLoader, imageText, additionalAttributesToShow]
	);

	const handlePriceInputBlur = useCallback(() => {
		if (productData.price === "0" || !productData.price) {
			setProductData((data) => {
				const newData = {
					...data,
					price: productData.listprice,
				};
				productFormError && validateProductForm(newData);

				return newData;
			});
		}
	}, [productData.listprice, productData.price]);

	const discountPer = useMemo(
		() =>
			productData?.price &&
			productData?.listprice &&
			+productData?.listprice > +productData?.price &&
			getPercentage(productData.listprice, productData.price),
		[productData.listprice, productData.price]
	);

	const brandsDetails = useMemo(
		() => sellerDetails[productData.brand],
		[sellerDetails, productData.brand]
	);

	const isContactDetailsAvailable = useMemo(
		() =>
			!!(
				brandsDetails?.title ||
				brandsDetails?.email ||
				brandsDetails?.contact ||
				brandsDetails?.facebookUrl ||
				brandsDetails?.instagramUrl ||
				brandsDetails?.info ||
				brandsDetails?.couponCode
			),
		[brandsDetails]
	);

	const currency = useMemo(
		() =>
			productData?.currency
				? productData.currency
				: brandsDetails?.currency || CURRENCY_USD,
		[productData?.currency, brandsDetails?.currency]
	);

	const [currencyEdit, setCurrencyEdit] = useState(currency);

	const handleCurrencyChange = (value) => {
		setCurrencyEdit(value);
		console.log("Selected currency:", value);
	};

	const currencySymbol = useMemo(
		() =>
			productData?.currency_symbol
				? productData.currency_symbol
				: CURRENCY_SYMBOLS[currency],
		[productData?.currency_symbol, currency]
	);

	const isSubmitDisabled = useMemo(
		() => !productData?.image,
		[productData?.image]
	);

	// identify link from description and make it clickable
	const linkifyText = (description) => {
		const urlRegex = /(?<=\s|^)(https?:\/\/[^\s]+)/g;
		return description.split(urlRegex).map((text) => {
			if (urlRegex.test(text)) {
				return (
					<a href={text} target='_blank' className='px-0 text-indigo-600'>
						{text}
					</a>
				);
			} else {
				return <span>{text}</span>;
			}
		});
	};

	const handleUploadImage = async ({ file }) => {
		try {
			setShowLoader(true);

			const response = await profileAPIs.uploadImage({ file });
			const data = response?.data;

			if (data?.status_code === 400 || data?.status === "failure") {
				notification.error({
					message: "Image Upload Failed",
					description:
						data?.status_desc || "Something went wrong. Please try again.",
				});
				return;
			}

			const url = data?.data?.[0]?.url;
			if (url) {
				setUploadedImages((prev) => [...prev, url]);
				notification.success({
					message: "Image Uploaded Successfully",
				});
			}
		} catch (error) {
			console.error("Upload failed:", error);
			notification.error({
				message: "Image Upload Failed",
				description:
					error?.response?.data?.message || "Unexpected error occurred",
			});
		} finally {
			setShowLoader(false);
		}
	};

	const uploadImageDraggerProps = {
		accept: "image/*",
		multiple: true,
		showUploadList: false,
		customRequest: ({ file, onSuccess }) => {
			handleUploadImage({ file });
			setTimeout(() => onSuccess("ok"), 0);
		},
	};

	const fieldsToDisplay = [
		"age_group",
		"gemstone",
		"color",
		"gender",
		"material",
		"occasion",
		"pattern",
		"shape",
		"style",
		"room",
	];

	// scroll for tags

	const swiperRef = useRef(null); // To store Swiper instance
	const swiperRef2 = useRef(null); // To store Swiper instance

	const [isOverflowing, setIsOverflowing] = useState(false);
	const [isOverflowing2, setIsOverflowing2] = useState(false);

	const checkOverflow = () => {
		if (swiperRef.current && swiperRef.current.wrapperEl) {
			const { scrollWidth, clientWidth } = swiperRef.current.wrapperEl;
			setIsOverflowing(scrollWidth > clientWidth);
		}
	};

	const checkOverflow2 = () => {
		if (swiperRef2.current && swiperRef2.current.wrapperEl) {
			const { scrollWidth, clientWidth } = swiperRef2.current.wrapperEl;
			setIsOverflowing2(scrollWidth > clientWidth);
		}
	};

	useEffect(() => {
		// Initial check
		checkOverflow();
		// Recheck on resize
		if (typeof window !== "undefined") {
			window.addEventListener("resize", checkOverflow);
			return () => {
				window.removeEventListener("resize", checkOverflow);
			};
		}
	}, [handleProductDataSubmit]);

	useEffect(() => {
		// Initial check
		checkOverflow2();
		// Recheck on resize
		if (typeof window !== "undefined") {
			window.addEventListener("resize", checkOverflow2);
			return () => {
				window.removeEventListener("resize", checkOverflow2);
			};
		}
	}, [handleProductDataSubmit]);

	console.log("productDataq", productData);

	// console.log("productData" ,productData.listprice, productData.price);

	// useEffect(() => {
	// 	if (productData) {
	// 		setProductData((prev) => ({
	// 			...prev,
	// 			collection_type: [...(prev.collection_type || []), "box"],
	// 		}));
	// 		console.log("productDatachanged", productData)
	// 	}
	// }, [isModalOpen])
	const checkoutPayment = async (e) => {
e.stopPropagation()
e.preventDefault()
		const location = typeof window !== "undefined" ? window.location.origin : "";


		e.stopPropagation()
		const payload = {
			amount: product?.listprice || product?.price || 0, // MANDATORY
			currency: "USD", // MANDATORY
			thumbnail: product.image,
			user_id: authUserId,
			store_id: store_id,
			service_id: `Product_${product.mfr_code}`,
			emailId: authUser.emailId,
			successUrl: `${location}/successpayment`,
			failureUrl: `${location}/failedpayment`,
			additional_details: {
				// collection_id: collection_id,
				mfr_code: product.mfr_code,
				// order_id: "",
			},
			title: product.name,
			// type: "bank transfer",
			// successMessage: "download image now",
		};

		try {
			const res = await axios.post(
				`${payment_url}/api/payments/checkout`,
				payload,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			console.log("Checkout response:", res.data);
			// 🔁 If API returns payment URL
			if (res?.data?.redirectUrl) {
				if (typeof window !== "undefined") {
					window.location.href = res.data.redirectUrl;
				}
			}
		} catch (error) {
			console.error("Checkout error:", error);
			// alert("Payment initiation failed. Please try again.");
		}
	};

	return (
		<div onClick={onModalClose}>
			<Modal
				isOpen={isModalOpen}
				headerText={
					isView ? productData?.name || "Product Details" : "Update Product"
				}
				onClose={onModalClose}
				maskClosable={false}
				size='sm'
				zIndexClassName='z-50'
				contentWrapperSpacingClassName='p-4'>
				<div>
					<form>
						{isView ? (
							<div>
								{/* {brandsDetails?.brandName && brandsDetails.brandDescription ? (
								<div className='pb-4 justify-evenly'>
									<span className='text-base font-semibold'>
										About {brandsDetails.brandName}
									</span>
									<p className='text-justify'>
										{brandsDetails.brandDescription}
									</p>
								</div>
							) : null} */}

								<div className='grid grid-cols-1 tablet:grid-cols-2 gap-4'>
									<div className='box-content theme-unthink w-40 sm:w-180 desktop:w-80'>
										<div className='overflow-hidden relative cursor-pointer product_card_container shadow-3xl rounded-xl'>
											<div className='product-card h-full'>
												<div className='h-full product_card_image'>
													<img
														src={productData.image}
														className='h-180 desktop:h-340'
														// loading='lazy'
														width='100%'
													/>
												</div>
											</div>
										</div>
									</div>

									<div className='flex flex-col gap-3'>
										{!brandsDetails && productData?.brand ? (
											<div className='text-slat-103'>
												<span className='font-bold mr-1'>Brand : </span>
												<span>{productData?.brand}</span>
											</div>
										) : null}
										{productData.description && (
											<div className='text-slat-103'>
												<span title={productData.description}>
													{productData.description}
												</span>
											</div>
										)}
										<div>
									{(storeData?.pdp_settings?.is_buy_button ||
									storeData?.pdp_settings?.is_add_to_cart_button) && (
										<>
											{storeData?.pdp_settings?.is_buy_button ? (
												<button
													className="box-border border flex items-center border-white rounded-xl px-2 py-1 product_add_to_wishlist_container mt-3"
													onClick={checkoutPayment}
												>
													Buy Now
												</button>
											) : (
												<button
													className="box-border border whitespace-nowrap  text-white flex items-center border-white rounded-xl px-2 py-1 product_add_to_wishlist_container"
													style={{background:'#7c75ec'}}
												>
													Add to Cart
												</button>
											)}
										</>
									)}
								</div>
										<div>
											<div className='flex items-center'>
												<span className='font-semibold text-xl'>
													{productData?.price || productData?.listprice ? (
														<span
															dangerouslySetInnerHTML={{
																__html: `${currencySymbol}${productData.price || productData.listprice
																	}`,
															}}
														/>
													) : null}
												</span>

												{productData?.price &&
													+productData.listprice > +productData?.price ? (
													<span className='ml-1'>
														MRP:
														<span
															className='line-through'
															dangerouslySetInnerHTML={{
																__html: `${currencySymbol}${productData.listprice}`,
															}}
														/>
													</span>
												) : null}
												{productData?.additionalAttributes?.availability ? (
													<span
														className={`ml-3 font-medium uppercase ${productData.additionalAttributes.availability ===
															"out stock"
															? "text-red-600"
															: "text-green-600"
															}`}>
														{productData.additionalAttributes.availability}
													</span>
												) : null}
											</div>
											<div className='text-red-600'>
												{discountPer ? `-${discountPer}%` : null}
											</div>
											{brandsDetails?.paymentMethod ? (
												<div className='mt-2'>
													<p className='text-base '>Payment Link:</p>
													<div className='grid gap-2'>
														{brandsDetails.paymentMethod
															.split(",")
															.map((item) => {
																const link = item.trim();
																return (
																	<div className='p-2 border-2 border-indigo-600 bg-indigo-200 rounded-xl flex items-center justify-center'>
																		<a
																			className='text-base break-all'
																			target='_blank'
																			href={link}>
																			{link}
																		</a>
																	</div>
																);
															})}
													</div>
												</div>
											) : null}
										</div>
										{isContactDetailsAvailable ? (
											<div>
												<h3
													className='flex items-center  text-xl font-semibold cursor-pointer'
													onClick={() =>
														setOpenContactDetails((value) => !value)
													}>
													<RightOutlined
														rotate={openContactDetails ? 90 : 0}
														className='mr-2'
													/>{" "}
													Contact Details
												</h3>
												<hr className='my-1' />
												{openContactDetails ? (
													<div>
														{brandsDetails?.title && (
															<p className='text-lg font-semibold'>
																{brandsDetails.title}
															</p>
														)}

														{brandsDetails?.email && (
															<p
																title={brandsDetails.email}
																className='text-base overflow-hidden whitespace-nowrap overflow-ellipsis'>
																Email:{" "}
																<a
																	className='p-0'
																	href={`mailto:${brandsDetails.email}`}>
																	{brandsDetails.email}
																</a>
															</p>
														)}

														{brandsDetails?.contact && (
															<p className='text-base'>
																Contact:{" "}
																<a
																	className='p-0'
																	href={`tel:${brandsDetails.contact}`}>
																	{brandsDetails.contact}
																</a>
															</p>
														)}

														{brandsDetails?.instagramUrl ||
															brandsDetails?.facebookUrl ? (
															<div className='flex mt-2'>
																{brandsDetails?.instagramUrl && (
																	<a
																		href={brandsDetails?.instagramUrl}
																		target='_blank'>
																		<img src={instagramIcon} width='28px' />
																	</a>
																)}
																{brandsDetails?.facebookUrl && (
																	<a
																		href={brandsDetails?.facebookUrl}
																		target='_blank'>
																		<img src={facebookIcon} width='28px' />
																	</a>
																)}
															</div>
														) : null}
														{/* coupon info  */}
														{brandsDetails?.info ? (
															<p className='text-base font-semibold mt-2'>
																{brandsDetails.info}
															</p>
														) : null}
														{brandsDetails?.couponCode ? (
															<div className='mt-2'>
																<p className='text-base '>coupon code:</p>
																<div className='p-2 border-2 border-indigo-600 bg-indigo-200 rounded-xl flex items-center justify-center'>
																	<p className='text-base'>
																		{brandsDetails.couponCode}
																	</p>{" "}
																	<CopyToClipboard
																		text={brandsDetails.couponCode}
																		onCopy={() => message.success("Copied", 1)}>
																		<CopyOutlined
																			onClick={(e) => {
																				e.preventDefault();
																				e.stopPropagation();
																			}}
																			className='text-xl flex ml-2'
																		/>
																	</CopyToClipboard>
																</div>
															</div>
														) : null}
														{brandsDetails?.paymentDetails ? (
															<div className='mt-2'>
																<p className='text-base '>
																	<b> Payment details: </b>
																	{linkifyText(brandsDetails.paymentDetails)}
																</p>
															</div>
														) : null}
														{brandsDetails?.shippingDetails ? (
															<div className='mt-2'>
																<p className='text-base '>
																	<b> Shipping details: </b>
																	{linkifyText(brandsDetails.shippingDetails)}
																</p>
															</div>
														) : null}
													</div>
												) : null}
											</div>
										) : null}
									</div>

									<div style={{ width: "200%" }}>
										<div className='relative w-full mb-4'>
											<Swiper
												slidesPerView='auto'
												spaceBetween={10}
												freeMode={true}
												onSwiper={(swiper) => (swiperRef2.current = swiper)}
												className='pb-1 pr-10 mr-5'>
												{productData.product_tag &&
													productData.product_tag.length > 0 &&
													productData.product_tag.map((tag, index) => (
														<SwiperSlide key={index} style={{ width: "auto" }}>
															<div className='rounded-22 flex items-center whitespace-nowrap shadow h-30 px-2 sm:px-4 font-normal text-xs md:text-sm leading-none text-slat-104 bg-white py-0.5'>
																{tag}
															</div>
														</SwiperSlide>
													))}
											</Swiper>
											{isOverflowing2 && (
												<div
													className='absolute right-0 addmore_image_edit top-0'
													style={{ cursor: "pointer", zIndex: 10 }}
													onClick={() => {
														if (swiperRef2.current) {
															swiperRef2.current.slideNext();
														}
													}}>
													<img src={Addmore} alt='Scroll Right' />
												</div>
											)}
										</div>

										<div className='relative w-full'>
											<Swiper
												slidesPerView='auto'
												spaceBetween={10}
												freeMode={true}
												onSwiper={(swiper) => (swiperRef.current = swiper)}
												className='pb-1 pr-10 mr-5'>
												{fieldsToDisplay.map((field) =>
													productData?.additionalAttributes?.[field]?.length >
														0 ? (
														<SwiperSlide key={field} style={{ width: "auto" }}>
															<div
																className='rounded-22 flex items-center whitespace-nowrap shadow h-30 px-2 sm:px-4 font-normal text-xs md:text-sm leading-none text-slate-600 bg-white py-0.5'
																title={field}>
																<span className='font-semibold'>
																	{field} :{" "}
																</span>{" "}
																{productData?.additionalAttributes?.[
																	field
																].join(", ")}
															</div>
														</SwiperSlide>
													) : null
												)}
											</Swiper>
											{isOverflowing && (
												<div
													className='absolute right-0 addmore_image_edit top-0'
													style={{ cursor: "pointer", zIndex: 10 }}
													onClick={() => {
														if (swiperRef.current) {
															swiperRef.current.slideNext();
														}
													}}>
													<img src={Addmore} alt='Scroll Right' />
												</div>
											)}
										</div>
									</div>

									{allowEdit ? (
										<div className='tablet:col-span-2 '>
											<div className='text-right'>
												<button
													type='submit'
													className='bg-indigo-600 rounded-xl text-indigo-100 font-bold text-sm p-3 min-w-38'
													onClick={() => setIsView(false)}>
													Edit
												</button>
											</div>
										</div>
									) : null}
								</div>
							</div>
						) : (
							<div>
								<div className='mb-4 flex flex-col gap-2'>
									<div className='flex flex-col text-left text-sm md:text-base'>
										<span>
											Hello! Let's start creating your product catalog.
										</span>
										<span>Enter some guidelines for your descriptions.</span>
									</div>
									<textarea
										className='text-left placeholder-gray-101 outline-none rounded-xl w-full px-3 py-2 resize-none'
										placeholder='For example: Describe the print and material in detail.'
										name='guidelines'
										type='text'
										value={autoGenerateHelperText.guidelines}
										onChange={handleAutoGenerateHelperText}
										rows={3}
									/>
									<div className='flex flex-col text-left text-sm md:text-base mt-2'>
										<span>
											Do you want to include any information in all
											descriptions,
										</span>
										<span>
											"For example, Our products are animal cruelty free."
										</span>
										<span>We picked up some text from your brand profile.</span>
										<span>Edit as needed.</span>
									</div>
									<textarea
										className='text-left placeholder-gray-101 outline-none rounded-xl w-full px-3 py-2 resize-none'
										placeholder='For example: Our products are animal cruelty free.'
										name='brand_description'
										type='text'
										value={autoGenerateHelperText.brand_description}
										onChange={handleAutoGenerateHelperText}
										rows={3}
									/>
									<div className='flex flex-col'>
										<label
											htmlFor='currencySelect'
											className='mb-1 text-sm font-medium text-gray-700'>
											Currency
										</label>
										<Select
											id='currencySelect'
											value={currencyEdit}
											onChange={handleCurrencyChange}
											placeholder='Select currency'>
											<Option value='INR'>INR</Option>
											<Option value='USD'>USD</Option>
										</Select>
									</div>
								</div>
								<hr />
								<div className='grid grid-cols-1 tablet:grid-cols-2 gap-4 tablet:gap-8 mt-4'>
									<div className='flex flex-col gap-4'>
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
											) : productData.image ? (
												<div className='flex flex-col items-center justify-center'>
													<div className='box-content theme-unthink w-40 sm:w-180 desktop:w-80'>
														<div className='overflow-hidden relative cursor-pointer product_card_container shadow-3xl rounded-xl'>
															<div className='product-card h-full'>
																<div className='h-full product_card_image'>
																	<img
																		src={productData.image}
																		className='h-180 desktop:h-340'
																		// loading='lazy'
																		width='100%'
																	/>
																</div>
															</div>
														</div>
													</div>
													<div className='text-center text-primary underline tablet:text-lg text-sm cursor-pointer '>
														<span onClick={() => handleUploadImageChange("")}>
															remove or change Image
														</span>
													</div>
												</div>
											) : (
												<div className='flex flex-col items-center justify-center'>
													<Dragger
														className='bg-transparent h-80 tablet:h-52 desktop:h-80'
														{...uploadProps}
														name='upload_image'
														showUploadList={false}
														required={!productData.image}>
														<p className='ant-upload-drag-icon'>
															<UploadOutlined />
														</p>
														<p className='w-4/6 mx-auto'>
															Click or drag file to this area to upload Image
														</p>
													</Dragger>
												</div>
											)}
										</div>
									</div>

									<div className='flex flex-col gap-4'>
										<input
											className='text-left placeholder-gray-101 outline-none px-3 h-8.5 rounded-xl w-full'
											placeholder='Enter product title / name'
											name='name'
											type='text'
											value={productData.name}
											onChange={handleProductDataInputChange}
										/>

										<textarea
											className='text-left placeholder-gray-101 outline-none rounded-xl w-full px-3 py-2 h-32 desktop:h-60'
											placeholder='Enter description...'
											name='description'
											type='text'
											value={productData.description}
											onChange={handleProductDataInputChange}
										// rows={5}
										/>

										<input
											className='text-left placeholder-gray-101 outline-none px-3 h-8.5 rounded-xl w-full bg-slate-100 cursor-not-allowed'
											placeholder='Enter seller brand name'
											name='brand'
											type='text'
											value={`Brand : ${productData.brand || authUser.user_name // if brand not present taking value of user name
												}`}
											disabled
										/>
									</div>
								</div>

								{additionalAttributesToShow.some(
									(attr) => attr?.is_display === true
								) && (
										<div className='flex flex-wrap gap-2 mt-2 relative'>
											{showLoader && (
												<div className='relative group h-14 w-14 flex items-center justify-center rounded-xl overflow-hidden'>
													<Spin size='small' tip='Uploading...' />
												</div>
											)}
											{uploadedImages?.map((url, index) => (
												<div
													key={index}
													className='relative group h-14 w-14 rounded-xl overflow-hidden'>
													<img
														src={url}
														alt={`uploaded-${index}`}
														className='h-full w-full object-cover rounded-xl transition-transform duration-200 group-hover:opacity-60'
													/>
													<button
														type='button'
														onClick={() =>
															setUploadedImages((prev) =>
																prev.filter((_, i) => i !== index)
															)
														}
														className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
														<CloseCircleOutlined className='text-white text-xl' />
													</button>
												</div>
											))}
											{/* // upload.             img  */}
											<div className='flex flex-col items-center justify-center'>
												<Dragger
													className='bg-transparent h-14 w-14 border border-dashed border-gray-400 rounded-xl hover:border-brown-100 transition-all'
													{...uploadImageDraggerProps}
													name='upload_image'>
													<p className='text-gray-600'>+</p>
												</Dragger>
											</div>
										</div>
									)}

								<div className='grid grid-cols-2 gap-4 mt-3'>
									<div className='col-span-2'>
										<p
											dangerouslySetInnerHTML={{
												__html: `Currency: ${currencySymbol} ${currencyEdit}`,
											}}
										/>
									</div>
									<div>
										<label className='text-sm'>List price</label>
										<input
											className='text-left placeholder-gray-101 outline-none px-3 h-8.5 rounded-xl w-full'
											placeholder='Enter product list price'
											name='listprice'
											type='number'
											value={
												productData?.keyword_tag_map?.listprice ||
												productData.listprice ||
												""
											}
											onChange={handleProductDataInputChange}
											onBlur={handlePriceInputBlur}
											onWheel={(e) => e.target.blur()}
										/>
									</div>

									<div>
										<label className='text-sm'>
											Selling price (discounted)
										</label>
										<input
											className='text-left placeholder-gray-101 outline-none px-3 h-8.5 rounded-xl w-full'
											placeholder='Enter product final price'
											name='price'
											type='number'
											value={productData?.price || ""}
											onChange={handleProductDataInputChange}
											onWheel={(e) => e.target.blur()}
										/>
									</div>
									<div className='bg-white rounded-xl col-span-2'>
										<Select
											mode='tags'
											className='w-full text-sm p-1 add_product_tags_input'
											placeholder='Enter keywords'
											value={productData.product_tag || []}
											onChange={(value) =>
												handleProductDataTagsChange("product_tag", value)
											}
											dropdownStyle={{ display: "none" }}></Select>
									</div>
								</div>
								<div className='grid gap-4 mt-4'>
									<div>
										<div className='text-lg'>Aditional attributes</div>
										<div className='flex flex-col gap-5 mt-2'>
											<AdditionalAttributes
												additionalAttributesToShow={additionalAttributesToShow}
												attributesData={productData.additionalAttributes}
												productData={productData}
												setProductData={setProductData}
												attributesDataTags={productData.tags}
												availableFilters={filter_settings.available_filters}
												handleAdditionalAttributesChange={
													handleAdditionalAttributesChange
												}
												isShowOptional={false}
												selectBoxSize='middle'
												fontColorTheme='text-black-100'
												fontSizeTheme='text-sm'
												isModalOpen={true}
											/>
										</div>
									</div>

									<div className='flex justify-end items-center gap-2'>
										{showLoader ? (
											<Spin
												indicator={
													<Loading3QuartersOutlined
														className='flex text-lg text-indigo-600'
														spin
													/>
												}
											/>
										) : null}
										<Tooltip title='Try adding a short description and keywords describing your products and click to Auto generate details using it.'>
											<button
												onClick={fetchProductData}
												type='button'
												size='small'
												className={`text-xs md:text-sm z-10 rounded-xl py-1.5 px-4 h-full font-bold text-indigo-600 border-2 border-indigo-600`}
												disabled={showLoader}>
												Auto generate details
											</button>
										</Tooltip>
									</div>
									<div className='text-right'>
										<button
											type='button'
											onClick={handleProductDataSubmit}
											className={`text-indigo-100 text-xs md:text-sm rounded-xl py-2.5 px-7 h-full font-bold ${isSubmitDisabled
												? "cursor-not-allowed bg-indigo-400"
												: "bg-indigo-600"
												}`}
											disabled={isSubmitDisabled}>
											Save & View
										</button>
									</div>
								</div>
							</div>
						)}
					</form>
				</div>
			</Modal>
		</div>
	);
};

export default React.memo(CustomProductModal);
