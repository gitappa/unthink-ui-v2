import React, { useEffect, useMemo, useState, useCallback } from "react";
// import icon_all_products from "../../images/Logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart, removeFromCart } from "./redux/action";
import { removeFromWishlist } from "../wishlistActions/removeFromWishlist/redux/actions";
// import inputIcon from "../../images/icons/input-icon.svg";
import Link from 'next/link';
import { useNavigate } from "../../helper/useNavigate";
import cart_icon from "../../images/cart.svg";
import { getTTid } from "../../helper/getTrackerInfo";
import Cookies from "js-cookie";
import { getUserInfo, GuestPopUpShow } from "../Auth/redux/actions";
import GuestPopUp from "../Auth/GuestPopUp";
import { COOKIE_TT_ID, SIGN_IN_EXPIRE_DAYS } from "../../constants/codes";
import { authAPIs, collectionAPIs } from "../../helper/serverAPIs";
import { current_store_name } from "../../constants/config";
import { setCookie } from "../../helper/utils";

const DeliveryDetails = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [authUserId, cart_attributes] = useSelector((state) => [
		state.auth.user.data.user_id,
		state.store.data.cart_attributes,
	]);
	const { collection, loading } = useSelector((state) => state.cart);
	const [unSignedData, setUnSignedData] = useState(null);
	const [isGuestPopUpShow] = useSelector((state) => [
		state.GuestPopUpReducer.isGuestPopUpShow,
	]);
		
	const [guestData, setGuestData] = useState({
		email: "",
		phone: "",
		altPhone: "",
	});

	const [errors, setErrors] = useState({ email: "", phone: "", altPhone: "" });
	const [isPopupShow, setIsPopupShow] = useState(false);
	const mycartcollectionpath = `my_cart_${authUserId || getTTid()}`;

	const extractedProducts = useMemo(() => {
		if (!collection?.product_lists) return [];
		return collection.product_lists.map((item) => ({
			mfr_code: item.mfr_code,
			qty: item.qty,
			tagged_by: item.tagged_by,
		}));
	}, [collection]);

	useEffect(() => {
		if (mycartcollectionpath) {
			dispatch(fetchCart(mycartcollectionpath));
		}
	}, [dispatch, mycartcollectionpath]);

	console.log("collection", collection);

	const handleRemove = (products) => {
		console.log("Removing products:", products);
		const payload = {
			products: [products],
			collection_id: collection?.collection_id || collection?._id,
		};
		dispatch(removeFromCart(payload));
	};

	// ✅ Update Quantity
	const updateCartQuantity = (product, newQty) => {
		const payload = {
			products: [
				{
					mfr_code: product.mfr_code,
					tagged_by: product?.tagged_by || [],
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

	// Memoized function to get cart attribute values for a product
	const getCartAttributeValues = useMemo(() => {
		return (product) => {
			const attrs = cart_attributes || [];
			return attrs
				.map((attr) => {
					const value = product[attr];

					if (value && Array.isArray(value) && value.length > 0) {
						return { name: attr, value: value.join(", ") };
					} else if (
						value &&
						!Array.isArray(value) &&
						value.toString().trim() !== ""
					) {
						return { name: attr, value: value.toString() };
					}

					return null;
				})
				.filter(Boolean);
		};
	}, [cart_attributes]);

	const products = (collection?.product_lists || []).map((p) => ({
		...p,
		qty: p.qty || 1,
	}));

	function formatValue(value) {
		if (!value) return "";

		// If it's already a proper array → return as comma string
		if (Array.isArray(value)) {
			return value.join(", ");
		}

		// If it's the broken format → fix it
		if (typeof value === "string" && value.includes("['")) {
			return value
				.replace(/[\[\]']+/g, "") // remove [ ] '
				.split(",")
				.map((v) => v.trim())
				.join(", ");
		}

		return value;
	}

	// Email validation
	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	// Phone validation
	const validatePhone = (phone) => {
		const phoneRegex = /^[0-9]{10}$/; // 10 digit phone number
		return phoneRegex.test(phone.replace(/\D/g, ""));
	};

	// Guest data change handler
	const guestChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setGuestData((data) => ({ ...data, [name]: value }));
			if (errors.email) setErrors({ ...errors, email: "" });
		},
		[errors]
	);

	// Guest skip handler
	const handleGuestSkip = () => {
		dispatch(GuestPopUpShow(false));
		setIsPopupShow(false);
	};

	const handleGuestSubmit = useCallback(
		async (e) => {
			e.preventDefault();

			if (!guestData.email) {
				setErrors({ ...errors, email: "Email is required" });
				return;
			}

			if (!validateEmail(guestData.email)) {
				setErrors({ ...errors, email: "Please enter a valid email address" });
				return;
			}

			// Phone validation for cart page
			if (guestData.phone === "" && guestData.altPhone === "") {
				setErrors({
					...errors,
					phone: "At least one phone number is required",
				});
				return;
			}

			if (guestData.phone && !validatePhone(guestData.phone)) {
				setErrors({
					...errors,
					phone: "Please enter a valid 10-digit phone number",
				});
				return;
			}

			if (guestData.altPhone && !validatePhone(guestData.altPhone)) {
				setErrors({
					...errors,
					altPhone: "Please enter a valid 10-digit phone number",
				});
				return;
			}

			const tid = Cookies.get("tid");
			const store = current_store_name;

			// Set default value of isGuestLoggedIn to false if not already set
			if (!Cookies.get("isGuestLoggedIn")) {
				Cookies.set("isGuestLoggedIn", false, { expires: SIGN_IN_EXPIRE_DAYS });
			}

			if (validateEmail(guestData.email)) {
				try {
					const response = await collectionAPIs.fetchCollectionsAPICall({
						is_display_amount: true,
						path: `my_cart_${tid}`,
					});

					setUnSignedData(response?.data?.data?.[0] || null);

					const res = await authAPIs.GuestRegisterAPICall({
						emailId: guestData.email,
						user_id: tid,
						store,
						phone: guestData.phone || null,
						altPhone: guestData.altPhone || null,
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
						// Cookies.set('isGuestSkip', false, { expires: GUESTSKIP_EXPIRE_HOURS / 24 });
						setIsPopupShow(false);

						const responseNew = await collectionAPIs.fetchCollectionsAPICall({
							is_display_amount: true,
							path: `my_cart_${user_id}`,
						});

						const unSignDat = response?.data?.data?.[0]?.product_lists?.map(
							(item) => ({
								mfr_code: item.mfr_code,
								qty: item.qty,
								tagged_by: item.tagged_by,
							})
						);

						const newSignData =
							responseNew?.data?.data?.[0]?.product_lists?.map((item) => ({
								mfr_code: item.mfr_code,
								qty: item.qty,
								tagged_by: item.tagged_by,
							}));

						// Merge quantities from unSignDat and newSignData
						const mergedProducts = {};

						// Add all unsigned items to merge map
						if (unSignDat && Array.isArray(unSignDat)) {
							unSignDat.forEach((item) => {
								const key = item.mfr_code;
								if (!mergedProducts[key]) {
									mergedProducts[key] = { ...item };
								} else {
									mergedProducts[key].qty += item.qty;
								}
							});
						}

						// Add/merge signed items with quantities
						if (newSignData && Array.isArray(newSignData)) {
							newSignData.forEach((item) => {
								const key = item.mfr_code;
								if (!mergedProducts[key]) {
									mergedProducts[key] = { ...item };
								} else {
									mergedProducts[key].qty += item.qty;
								}
							});
						}

						// Convert merged map back to array
						const mergedProductsArray = Object.values(mergedProducts);

						const payload = {
							products: mergedProductsArray,
							product_lists: [],
							collection_name: "my cart",
							type: "system",
							user_id: user_id || getTTid(),
							path: `my_cart_${user_id || getTTid()}`,
						};

						dispatch(addToCart(payload));
					}
				} catch (error) {
					console.log(error);
				}
			}
		},
		[
			guestData.email,
			guestData.phone,
			guestData.altPhone,
			dispatch,
			extractedProducts,
		]
	);

	// Handle continue button click
	const handleContinueClick = () => {
		const isUserLoginCookies = Cookies.get("isGuestLoggedIn") === "true";

		// If user is not authenticated and not already a guest, show popup
		if (!authUserId && !isUserLoginCookies) {
			setIsPopupShow(true);
			dispatch(GuestPopUpShow(true));
		} else {
			navigate("/cart/checkout");
		}
	};

	return (
		<>
			<div className='mt-14 '>
				<div className='text-4xl lg:text-4xl font-semibold flex flex-col items-center mb-14 text-center'>
					<span>CART</span>
				</div>
				<div className='lg:flex w-full px-10 '>
					<div className='flex-1'>
						{products.length === 0 ? (
							<div className='text-center py-20 text-gray-500 text-2xl font-medium '>
								<div className='flex gap-1 items-center  justify-center'>
									<img src={cart_icon} className='h-16 w-16' />
									Your cart is empty
								</div>
							</div>
						) : (
							<div>
								{products.map((item, index) => (
									item && item.mfr_code ? (
										<div key={index} className='border-b pb-8 mb-6'>
											<div className='flex lg:gap-10 gap-3  md:p-4 w-full items-start'>
												<Link href={`/product/${item.mfr_code}`}>
													<img
														className='md:h-40 md:w-32 h-14  w-14 object-cover rounded-2xl '
														src={item.image}
														alt={item.name}
													/>
												</Link>
												<div className='flex flex-col flex-1'>
													<Link
													href={`/product/${item.mfr_code}`}
														className='p-0 m-0'>
														<h4 className='md:text-2xl text-xl font-semibold text-black-100'>
														{item.name}
													</h4>
												</Link>

												{/* Cart Attributes with proper styling */}
												<div className='mt-2 flex flex-wrap gap-2'>
													{getCartAttributeValues(item).length > 0 && (
														getCartAttributeValues(item).map((attr, idx) => (
															<div
																key={idx}
																className='inline-flex items-center px-3 py-1 rounded-md text-xs font-medium'
																style={{
																	background: "#770100",
																	boxShadow: `inset 8px -8px 12px rgba(0, 0, 0, 0.5),9px 9px 15px rgba(0, 0, 0, 0.3)`,
																}}>
																<span className='font-semibold text-gray-100 capitalize'>
																	{attr.name}:
																</span>
																<span className='ml-1 text-white'>
																	{formatValue(attr.value)}
																</span>
															</div>
														))
													) 
													// : (
													// 	<div
													// 		className='inline-flex items-center px-3 py-1 rounded-md text-xs'
													// 		style={{
													// 			background: "#770100",
													// 			boxShadow: `inset 8px -8px 12px rgba(0, 0, 0, 0.5),9px 9px 15px rgba(0, 0, 0, 0.3)`,
													// 		}}>
													// 		<span className='text-gray-500'>
													// 			No attributes available
													// 		</span>
													// 	</div>
													// )
													}
												</div>

												<div className='flex items-center lg:gap-16 md:gap-7 gap-4 mt-5'>
													<div
														style={{ height: "52px" }}
														className='flex md:gap-10 gap-4 border justify-between items-center md:py-4 px-2 md:px-4 rounded-md w-fit'>
														<button
															style={{
																cursor: loading ? "not-allowed" : "pointer",
															}}
															className='text-xl font-bold'
															disabled={loading}
															onClick={() =>
																item.qty === 1
																	? handleRemove(item.mfr_code)
																	: updateCartQuantity(item, item.qty - 1)
															}>
															-
														</button>
														<p>{item.qty}</p>
														<button
															style={{
																cursor: loading ? "not-allowed" : "pointer",
															}}
															className='text-xl font-bold'
															disabled={loading}
															onClick={() =>
																updateCartQuantity(item, item.qty + 1)
															}>
															+
														</button>
													</div>
													<button
														className='text-red-600 hover:underline'
														disabled={loading}
														onClick={() => handleRemove(item?.mfr_code)}>
														Remove
													</button>
												</div>
											</div>
											<div className='text-right'>
												<p className='text-xl font-semibold'>
													₹ {(item.price * item.qty).toLocaleString()}
												</p>
											</div>
										</div>
									</div>
									) : null
								))}
								<div>
									<p
										className='md:p-5 p-3 text-sm md:text-base border'
										style={{
											background: "#faf5e7",
											borderColor: "#FFC633",
											borderRadius: 4,
										}}>
										<span className='pr-3' style={{ color: "#FFC633" }}>
											%
										</span>
										10% Instant Discount with Federal Bank Debit Cards on a min
										spend of $150. TCA
									</p>
								</div>
							</div>
						)}
					</div>

					{/* Right Side - Order Summary */}
					{products.length !== 0 && (
						<div
							className='border lg:p-10 md:p-7 p-5 w-[400px] lg:ml-10 rounded-sm shadow-lg h-full sticky top-36 lg:mt-0 mt-6'
							style={{ borderColor: "#D1D1D8", minWidth: "450px" }}>
							<h2 className='text-center font-bold md:text-3xl text-2xl mb-6 md:mb-10'>
								ORDER SUMMARY
							</h2>

							<div className='flex justify-between mb-5'>
								<p className='md:text-lg text-base'>Subtotal</p>
								<p className='md:text-lg text-base font-medium'>
									₹ {collection?.total_amount?.toLocaleString()}
								</p>
							</div>
							<div className='flex justify-between mb-5'>
								<p className='md:text-lg text-base'>Discount</p>
								<p className='md:text-lg text-base font-medium'>20%</p>
							</div>
							<div className='flex justify-between mb-5'>
								<p className='md:text-lg text-base'>Shipping</p>
								<p
									className='md:text-lg text-base font-medium text-teal-600'
									style={{ color: "#3AA39F" }}>
									Free
								</p>
							</div>
							<div
								className='flex justify-between border-b-2 pb-5 mb-6'
								style={{ borderColor: "#D1D1D8" }}>
								<p className='md:text-lg text-base'>Coupon Applied</p>
								<p className='md:text-lg text-base font-medium'>0.00</p>
							</div>

							<div className='flex justify-between font-bold md:mb-8 mb-5'>
								<p className='md:text-xl text-lg'>TOTAL</p>
								<p className='md:text-xl text-lg '>
									₹ {collection?.total_amount?.toLocaleString()}
								</p>
							</div>

							<div className='flex justify-between text-gray-600 text-sm'>
								<p>Estimated Delivery by</p>
								<p className='font-semibold text-black'>1st Nov 2025</p>
							</div>
							<div className='relative mt-6'>
								<input
									placeholder='Coupon Code'
									type='text'
									className='border p-5 w-full mb-6'
								/>
								<img src='' alt='input' className='absolute right-5 top-5' />
							</div>

							<div className='p-0'>
								<button
									onClick={handleContinueClick}
									style={{
										boxShadow: `inset 8px -8px 12px rgba(0, 0, 0, 0.5),9px 9px 15px rgba(0, 0, 0, 0.3)`,
										background: "#770000",
									}}
									className='text-white mt-5 w-full rounded-xl lg:h-13 h-11'>
									Continue
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{isGuestPopUpShow && (
				<GuestPopUp
					handleGuestSubmit={handleGuestSubmit}
					errors={errors}
					handleGuestSkip={handleGuestSkip}
					guestChange={guestChange}
					guestData={guestData}
					setIsPopupShow={setIsPopupShow}
					cartPageGuestPopup
				/>
			)}
		</>
	);
};

export default DeliveryDetails;
