import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { message, Image } from "antd";
import {
	CopyOutlined,
	EditOutlined,
	ArrowLeftOutlined,
} from "@ant-design/icons";
import CopyToClipboard from "react-copy-to-clipboard";
import Link from 'next/link';
import { useRouter } from "next/router";
import { useNavigate } from "../../helper/useNavigate";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { openProductModal } from "../customProductModal/redux/actions";
import {
	getPercentage,
	collectionQRCodeGenerator,
	getProductDetailsPagePath,
	isEmpty,
} from "../../helper/utils";
import { customProductsAPIs } from "../../helper/serverAPIs";

import ShareOptions from "../shared/shareOptions";

import facebookIcon from "../../images/staticpageimages/facebookIcon.png";
import instagramIcon from "../../images/staticpageimages/instagramIcon.png";
import share_icon from "../../images/profilePage/share_icon.svg";
import {
	CURRENCY_SYMBOLS,
	CURRENCY_USD,
	PATH_ROOT,
	STORE_USER_NAME_SAMSKARA,
} from "../../constants/codes";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import Addmore from "../../images/addmore2.svg";
import SwiperCore, { FreeMode } from "swiper";
import { addToCart, fetchCart } from "../DeliveryDetails/redux/action";
import { getTTid } from "../../helper/getTrackerInfo";
import axios from "axios";
import { payment_url } from "../../constants/config";
import { PDPPageSkeleton } from "./ProductDetailsSkeleton";
import { PDPloader } from "./redux/action";

const ProductDetails = ({ params, ...props }) => {
	const router = useRouter();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const mfr_code = params?.mfr_code || router?.query?.mfr_code;
	const { collection, loading } = useSelector((state) => state.cart);
	// console.log('collectionsuii', collection);
	const [isloading, setIsLoading] = useState(true)


	const [sellerDetails, customProductsData, authUser, pdploader] = useSelector((state) => [
		state.store.data.sellerDetails || {},
		state.auth.customProducts.data.data || [],
		state.auth.user.data,
		state.PDP_LoaderReducer.pdpLoader
	]);
	console.log('pdploader', pdploader);

	const [store_id] =
		useSelector((state) => [

			state.store.data.store_id,
		]);

	// console.log('customProductsData', customProductsData);
	const [storeData] = useSelector((state) => [state.store.data]);
	// console.log('storeData',storeData.pdp_settings.is_add_to_cart_button);
	const [authUserId] = useSelector((state) => [
		state.auth.user.data.user_id,
	]);
	const mycartcollectionpath = `my_cart_${authUserId || getTTid()}`;
	const [fetchedProductDetails, setFetchedProductDetails] = useState();
	const [showShareProductDetails, setShowShareProductDetails] = useState(false);

	const fetchProductDetails = async () => {
		try {
			const products = await customProductsAPIs.fetchProductDetailsAPICall(
				mfr_code
			);
			if (products && products.status === 200 && products.data) {
				setFetchedProductDetails(products.data.data[0]);
			}

		} catch {
			setFetchedProductDetails({});
		}
		finally {
			dispatch(PDPloader(false));
		}
	};


	const savedProductDetails = useMemo(
		() => customProductsData?.find((item) => item.mfr_code === mfr_code), // find selected product details from redux
		[customProductsData]
	);


	useEffect(() => {
		if (!mfr_code) return;
		if (!savedProductDetails) {
			fetchProductDetails(); // fetch product details if not available in redux
		}
	}, [mfr_code, savedProductDetails]);



	const productDetails = useMemo(() => {
		if (savedProductDetails) {
			return savedProductDetails;
		} else {
			return fetchedProductDetails;
		}
	}, [savedProductDetails, fetchedProductDetails]);

	const cardItem = useMemo(() => {
		return collection?.product_lists?.find(
			item => item.mfr_code === productDetails?.mfr_code
		)
	}, [collection, productDetails]);
	// console.log('cardItem',cardItem);

	useEffect(() => {
		if (mycartcollectionpath) {
			dispatch(fetchCart(mycartcollectionpath));
		}
	}, [dispatch, mycartcollectionpath]);


	const updateCartQuantity = (newQty) => {
		const payload = {
			products: [
				{
					mfr_code: productDetails.mfr_code,
					tagged_by: productDetails?.tagged_by || [],
					qty: newQty,
				},
			],
			product_lists: [],
			collection_name: "my cart",
			type: "system",
			user_id: authUserId || getTTid(),
			path: mycartcollectionpath,
		};
		dispatch(addToCart(payload));
	};


	useEffect(() => {
		if (cardItem) {
			console.log('cart updated');
		}
	}, []);

	const brandsDetails = useMemo(
		() => sellerDetails[productDetails?.brand],
		[sellerDetails, productDetails?.brand]
	);

	const discountPer = useMemo(
		() =>
			productDetails?.price &&
			productDetails?.listprice &&
			+productDetails?.listprice > +productDetails?.price &&
			getPercentage(productDetails.listprice, productDetails.price),
		[productDetails?.listprice, productDetails?.price]
	);

	const currency = useMemo(
		() =>
			productDetails?.currency
				? productDetails.currency
				: brandsDetails?.currency || CURRENCY_USD,
		[productDetails?.currency, brandsDetails?.currency]
	);

	const currencySymbol = useMemo(
		() =>
			productDetails?.currency_symbol
				? productDetails.currency_symbol
				: CURRENCY_SYMBOLS[currency],
		[productDetails?.currency_symbol, currency]
	);

	const linkifyText = (description) => {
		const urlRegex = /(?<=\s|^)(https?:\/\/[^\s]+)/g;
		return description.split(urlRegex).map((text) => {
			if (urlRegex.test(text)) {
				return (
					<a href={text} target='_blank' className='px-0 text-blue-109'>
						{text}
					</a>
				);
			} else {
				return <span>{text}</span>;
			}
		});
	};

	const handleOpenProductModal = useCallback(
		(allowEdit) => {
			dispatch(
				openProductModal({
					payload: productDetails,
					allowEdit: allowEdit,
				})
			);
		},
		[productDetails]
	);

	const handleGoBack = () => {
		if (typeof window !== "undefined" && window?.history?.length > 2) {
			window.history.back();
		} else {
			navigate(PATH_ROOT);
		}
	};

	const productDetailsPagePath = useMemo(
		() => getProductDetailsPagePath(productDetails?.mfr_code),
		[productDetails?.mfr_code]
	);

	const qrCodeGeneratorURL = useMemo(
		() => collectionQRCodeGenerator(productDetailsPagePath),
		[productDetailsPagePath]
	);

	const [sharePageUrl, setSharePageUrl] = useState("");

	useEffect(() => {
		if (typeof window !== "undefined") {
			setSharePageUrl(`${window.location?.origin}${productDetailsPagePath}`);
		}
	}, [productDetailsPagePath]);

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
		"size",
		"sleeve",
		"fit",
	];

	// scroll for tags

	const swiperRef = useRef(null); // To store Swiper instance

	const [isOverflowing, setIsOverflowing] = useState(false);

	const checkOverflow = () => {
		if (swiperRef.current && swiperRef.current.wrapperEl) {
			const { scrollWidth, clientWidth } = swiperRef.current.wrapperEl;
			setIsOverflowing(scrollWidth > clientWidth);
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
	}, [productDetails]);

	// console.log('productDetails',productDetails);

	const handleAddToCart = () => {
		// e.stopPropagation();
		if (!productDetails?.mfr_code) return;

		const payload = {
			products: [
				{
					mfr_code: productDetails.mfr_code,
					tagged_by: productDetails.tagged_by || [],
					qty: 1,
				},
			],
			product_lists: [],
			collection_name: "my cart",
			type: "system",
			user_id: authUserId,
			// collection_id: mycartcollectionid,
			// path: mycartcollectionpath,
		};
		dispatch(addToCart(payload));
	};


	const checkoutPayment = async (e) => {

		e.preventDefault()
		const location = typeof window !== "undefined" ? window.location.origin : "";


		e.stopPropagation()
		const payload = {
			amount: product?.price || product?.listprice || 0, // MANDATORY
			currency: "USD", // MANDATORY
			thumbnail: product.image,
			user_id: authUserId || getTTid(),
			store_id: store_id,
			service_id: `Product_${product.mfr_code}`,
			emailId: authUser.emailId || null,
			successUrl: `${location}/successpayment`,
			failureUrl: `${location}/failedpayment`,
			additional_details: {
				mfr_code: product.mfr_code,
			},
			title: product.name,
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

	if (pdploader === true) {

		return <PDPPageSkeleton />
	}

	return (
		<>
			<div
				className={`w-full max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto lg:pb-12 pb-20`}>
				<div className='flex flex-col w-full self-center my-12 gap-5'>
					<div
						className='flex items-center cursor-pointer px-0'
						onClick={handleGoBack}>
						<span className='text-xl leading-none flex mr-2'>
							<ArrowLeftOutlined />
						</span>
						<span className='text-xl font-medium capitalize'>Go back</span>
					</div>

					<div className='flex flex-col lg:flex-row gap-5'>
						<div
							className='w-full lg:max-w-439 h-auto lg:h-456 mx-auto border border-solid border-gray-107 rounded-xl'
							style={{ height: "480px" }}>
							{!isEmpty(productDetails?.image) ? (
								<img
									className='w-full h-full object-contain rounded-xl'
									src={productDetails.image}
									alt='Product Image'
								/>
							) : null}
						</div>
						<div className='flex flex-col gap-4 w-full lg:w-65%'>
							<div className='text-xl-1 font-semibold'>
								{productDetails?.name}
							</div>

							<div className='flex gap-4 justify-end items-start'>
								{productDetails?.user_id === authUser?.user_id ||
									productDetails?.brand === authUser?.user_name ? (
									<EditOutlined
										title='Edit product details'
										className='flex text-2xl lg:text-xl-2 cursor-pointer'
										onClick={() => handleOpenProductModal(true)}
									/>
								) : null}
								<div className='relative flex justify-between w-6 lg:w-7'>
									{showShareProductDetails && (
										<ShareOptions
											url={sharePageUrl}
											setShow={setShowShareProductDetails}
										/>
									)}
									{sharePageUrl && (
										<div className='flex w-auto'>
											<Image
												className='cursor-pointer'
												src={share_icon}
												preview={false}
												onClick={() =>
													setShowShareProductDetails(!showShareProductDetails)
												}
											/>
										</div>
									)}
								</div>
								{qrCodeGeneratorURL ? (
									<img
										className='w-20 lg:w-25 h-20 lg:h-25 object-cover'
										src={qrCodeGeneratorURL}
									/>
								) : null}
							</div>

							{brandsDetails?.brandName && brandsDetails.brandDescription ? (
								<div>
									<span className='text-lg font-medium leading-loose'>
										About {brandsDetails.brandName}
									</span>
									<p>{brandsDetails.brandDescription}</p>
								</div>
							) : null}

							{!brandsDetails && productDetails?.brand ? (
								<div>
									<span className='text-lg font-medium leading-loose'>
										Brand :{" "}
									</span>
									<span className='text-slat-103'>{productDetails?.brand}</span>
								</div>
							) : null}

							<div className='flex flex-col'>
								<div className='flex gap-3 items-center'>
									{productDetails?.price || productDetails?.listprice ? (
										<span
											dangerouslySetInnerHTML={{
												__html: `${currencySymbol}${productDetails.price || productDetails.listprice
													}`,
											}}
											className='text-2xl font-semibold'
										/>
									) : null}
									{productDetails?.price &&
										+productDetails.listprice > +productDetails?.price ? (
										<span className='text-lg text-gray-101'>
											MRP{" "}
											<span
												className='line-through'
												dangerouslySetInnerHTML={{
													__html: `${currencySymbol}${productDetails.listprice}`,
												}}
											/>
										</span>
									) : null}
									{discountPer ? (
										<span className='text-lg text-red-600'>
											( {discountPer}% OFF )
										</span>
									) : null}
								</div>

								{productDetails?.availability ? (
									<span
										className={`font-medium uppercase ${productDetails.availability === "out stock"
											? "text-red-500"
											: "text-green-500"
											}`}>
										{productDetails.avlbl === 0
											? "SOLD"
											: productDetails.availability}
									</span>
								) : null}



							</div>

							{brandsDetails?.paymentMethod ? (
								<div>
									<div className='text-lg font-medium leading-loose mb-1.75'>
										Payment Link
									</div>
									<div className='grid gap-2'>
										{brandsDetails.paymentMethod.split(",").map((item) => {
											const link = item.trim();
											return (
												<a
													className='flex items-center justify-center max-w-480 py-1.75 border border-gray-101 rounded-xl hover:underline'
													target='_blank'
													href={link}>
													{link}
												</a>
											);
										})}
									</div>
								</div>
							) : null}
							{storeData?.pdp_settings?.is_add_to_cart_button && (
								<div className='flex gap-5  mt-16 mb-6 items-center '>
									<div className='border px-3 h-12 items-center flex gap-10 p-4 '>
										<button className='  text-xl cursor-pointer' onClick={() => { updateCartQuantity(cardItem?.qty - 1) }}>-</button>
										<button className='  text-xl cursor-pointer'  >{cardItem?.qty || 0}</button>
										<button className='  text-xl cursor-pointer' onClick={() => { updateCartQuantity(cardItem?.qty + 1 || 1) }}>+</button>
									</div>
									{/* <div className='text-white h-14 max-w-340 w-full '> */}


									{/* // 	cardItem?.qty > 0 ?
								     	// 	<Link to='/cart'>
								    	// 	<button className='text-white h-14 max-w-340 w-full rounded-15' style={{ backgroundColor: 'rgb(119, 0, 0)', boxShadow: 'rgba(0, 0, 0, 0.5) 8px -8px 12px inset, rgba(0, 0, 0, 0.3) 9px 9px 15px' }}>
									 // 	Go to Cart
									 // 	</button>
									 // 	</Link>
									 // : */}
									{/* <button onClick={handleAddToCart} className='text-white h-14 max-w-340 w-full rounded-15' style={{ backgroundColor: 'rgb(119, 0, 0)', boxShadow: 'rgba(0, 0, 0, 0.5) 8px -8px 12px inset, rgba(0, 0, 0, 0.3) 9px 9px 15px' }}>
											{
												storeData?.pdp_settings?.is_add_to_cart_button &&
													storeData?.pdp_settings?.is_buy_button
													? 'Buy Now'
													: storeData?.pdp_settings?.is_add_to_cart_button
														? 'Add to cart'
														: 'Buy Now'
											}
										</button> */}

									{/* </div> */}
								</div>
							)

							}

							{storeData?.pdp_settings?.is_add_to_cart_button && (
								<div className='flex gap-5  mt-16 mb-6 items-center '>
									<div className='border px-3 h-12 items-center flex gap-10 p-4 '>
										<button
											className='  text-xl cursor-pointer'
											onClick={() => {
												updateCartQuantity(cardItem?.qty - 1);
											}}>
											-
										</button>
										<button className='  text-xl cursor-pointer'>
											{cardItem?.qty || 0}
										</button>
										<button
											className='  text-xl cursor-pointer'
											onClick={() => {
												updateCartQuantity(cardItem?.qty + 1 || 1);
											}}>
											+
										</button>
									</div>
									<div className='text-white h-14 max-w-340 w-full '>
										<button
											onClick={handleAddToCart}
											className='text-white h-14 max-w-340 w-full rounded-15'
											style={{
												backgroundColor: "rgb(119, 0, 0)",
												boxShadow:
													"rgba(0, 0, 0, 0.5) 8px -8px 12px inset, rgba(0, 0, 0, 0.3) 9px 9px 15px",
											}}>
											Add to Cart
										</button>
									</div>
								</div>
							)}
							{storeData?.pdp_settings?.is_buy_button
								&& (
									<button
										className='w-fit  mt-4 inline text-white disabled:opacity-50 disabled:cursor-not-allowed py-2 px-9 font-normal text-lg rounded-10 shadow-lg '
										disabled={
											!productDetails?.price && !productDetails?.listprice
										}
										style={{ background: "#7c75ec", cursor :!productDetails?.price && !productDetails?.listprice? 'not-allowed' :'' }}
										onClick={checkoutPayment}>
										Buy
									</button>
								)}


							{productDetails?.description && (
								<div>
									<div className='text-lg font-medium leading-loose border-b border-solid border-gray-107'>
										Product Description
									</div>
									<div className='mt-1.75'>{productDetails.description}</div>
								</div>
							)}

							<div>
								<div className='text-lg font-medium leading-loose border-b border-solid border-gray-107'>
									keywords
								</div>
								<div className='flex flex-wrap gap-2 my-5'>
									{productDetails?.product_tag &&
										productDetails?.product_tag.length > 0 &&
										productDetails?.product_tag.map((tag, index) => (
											<div className='rounded-22 flex items-center whitespace-nowrap shadow h-30 px-2 sm:px-4 font-normal text-xs md:text-sm leading-none text-slat-104 bg-white py-0.5'>
												{tag}
											</div>
										))}
								</div>

								<div className='relative w-full'>
									<Swiper
										slidesPerView='auto'
										spaceBetween={10}
										preventClicks={false}
										preventClicksPropagation={false}
										freeMode={true}
										onSwiper={(swiper) => (swiperRef.current = swiper)}
										className='pb-1 pr-10 mr-5'>
										{fieldsToDisplay.map((field) =>
											productDetails?.[field]?.length > 0 ? (
												<SwiperSlide key={field} style={{ width: "auto" }}>
													<div
														className='rounded-22 flex items-center whitespace-nowrap shadow h-30 px-2 sm:px-4 font-normal text-xs md:text-sm leading-none text-slate-600 bg-white py-0.5'
														title={field}>
														<span className='font-semibold'>{field} : </span>{" "}
														{Array.isArray(productDetails?.[field])
															? productDetails?.[field]?.join(", ")
															: productDetails?.[field]}
													</div>
												</SwiperSlide>
											) : null
										)}
									</Swiper>
									{isOverflowing && (
										<>
											<div
												className='absolute right-0  lg:h-10 h-8 lg:w-10 top-0 lg:-top-1 hover:shadow-xl  bg-gray-50  w-8 rounded-full flex justify-center items-center'
												style={{ cursor: "pointer", zIndex: 10 }}
												onClick={() => {
													if (swiperRef.current) {
														swiperRef.current.slideNext();
													}
												}}>
												<MdOutlineKeyboardArrowLeft className='transform rotate-180 text-xl ' />
											</div>
											<div
												className='absolute  lg:h-10 h-8 top-0 lg:-top-1 lg:w-10 bg-gray-50  w-8 rounded-full flex hover:shadow-xl lg:-left-6 -left-5 justify-center items-center'
												style={{ cursor: "pointer", zIndex: 10 }}
												onClick={() => {
													if (swiperRef.current) {
														swiperRef.current.slidePrev();
													}
												}}>
												<MdOutlineKeyboardArrowLeft className='text-xl ' />
											</div>
										</>
									)}
								</div>
							</div>

							<div>
								{(brandsDetails?.title ||
									brandsDetails?.email ||
									brandsDetails?.contact ||
									brandsDetails?.instagramUrl ||
									brandsDetails?.facebookUrl ||
									brandsDetails?.info ||
									brandsDetails?.couponCode ||
									brandsDetails?.paymentDetails ||
									brandsDetails?.shippingDetails) && (
										<div className='text-lg font-medium leading-loose border-b border-solid border-gray-107'>
											Contact Details
										</div>
									)}
								{brandsDetails?.title && (
									<div className='flex flex-row items-center my-1.75 text-base'>
										<div className='w-1/4'>Brand Name</div>
										<div className='text-gray-105'>{brandsDetails.title} </div>
									</div>
								)}
								{brandsDetails?.email && (
									<div className='flex flex-row items-center my-1.75 text-base'>
										<div className='w-1/4'> Brand Email</div>
										<a
											className='text-gray-105 p-0'
											href={`mailto:${brandsDetails.email}`}>
											{brandsDetails.email}
										</a>
									</div>
								)}
								{brandsDetails?.contact && (
									<div className='flex flex-row items-center my-1.75 text-base'>
										<div className='w-1/4'>Contact</div>
										<a
											className='text-gray-105 p-0'
											href={`tel:${brandsDetails.contact}`}>
											{brandsDetails.contact}
										</a>
									</div>
								)}

								{brandsDetails?.instagramUrl || brandsDetails?.facebookUrl ? (
									<div className='flex my-1.75 gap-5'>
										{brandsDetails?.instagramUrl && (
											<a
												href={brandsDetails?.instagramUrl}
												target='_blank'
												className='p-0'>
												<img src={instagramIcon} width='28px' />
											</a>
										)}
										{brandsDetails?.facebookUrl && (
											<a
												href={brandsDetails?.facebookUrl}
												target='_blank'
												className='p-0'>
												<img src={facebookIcon} width='28px' />
											</a>
										)}
									</div>
								) : null}
								{brandsDetails?.info ? (
									<p className='text-base font-semibold mt-2'>
										{brandsDetails.info}
									</p>
								) : null}
							</div>

							{brandsDetails?.couponCode ? (
								<div className='flex flex-row items-center my-1.75 text-base'>
									<div className='w-1/4'>Coupon Code</div>
									<div className='flex items-center gap-2'>
										<p className='text-base'>{brandsDetails.couponCode}</p>{" "}
										<CopyToClipboard
											text={brandsDetails.couponCode}
											onCopy={() => message.success("Copied", 1)}>
											<CopyOutlined
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
												}}
												className='text-lg'
											/>
										</CopyToClipboard>
									</div>
								</div>
							) : null}

							{brandsDetails?.paymentDetails && (
								<div>
									<div className='text-lg font-medium leading-loose border-b border-solid border-gray-107'>
										Payment Details
									</div>
									<div className='mt-1.75'>
										{linkifyText(brandsDetails.paymentDetails)}
									</div>
								</div>
							)}

							{brandsDetails?.shippingDetails && (
								<div>
									<div className='text-lg font-medium leading-loose border-b border-solid border-gray-107'>
										Shipping Details
									</div>
									<div className='mt-1.75'>
										{linkifyText(brandsDetails.shippingDetails)}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductDetails;

