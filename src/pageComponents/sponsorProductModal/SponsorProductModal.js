import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Spin, Upload, notification, message } from "antd";
import {
	UploadOutlined,
	LoadingOutlined,
	CopyOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import CopyToClipboard from "react-copy-to-clipboard";

import Modal from "../../components/modal/Modal";
import { updateWishlist } from "../wishlistActions/updateWishlist/redux/actions";
import { generateRoute, getPercentage, isEmpty } from "../../helper/utils";
import { profileAPIs } from "../../helper/serverAPIs";
// import { COLLECTION_COVER_IMG_SIZES } from "../../constants/codes";

const { Dragger } = Upload;

const defaultProductData = {
	mfr_code: "",
	name: "",
	brand: "",
	url: "",
	image: "",
	upload_image: "",
	price: "",
	listprice: "",
	product_brand: "",
	currency: "USD",
	currency_symbol: "&#36;",
	// discount: "above 20",
	avlble: 1,
	color: "",
	tagged_by: [],
	starred: true, //to be added by default for future use, neednot be shown on input page
	sponsored: true, //to be added by default for future use, neednot be shown on input page
	hide: false, //to be added by default for future use, neednot be shown on input page
};

const SponsorProductModal = ({
	isModalOpen,
	onModalClose,
	collectionData,
	data = {},
	onProductEdit,
	allowEdit = false,
	sellerDetails,
}) => {
	const { data: product, isEdit, isView } = data;
	const [productData, setProductData] = useState({
		...defaultProductData,
	});
	const [productFormError, setProductFormError] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [openContactDetails, setOpenContactDetails] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		if (isModalOpen) {
			if (product) {
				setProductData({
					...product,
				});
			}

			return () => {
				setProductData({
					...defaultProductData,
				});
				setOpenContactDetails(false);
			};
		}

		return () => {};
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
		// else if (!data.tagged_by.length) {
		// 	errorMEssage =
		// 		"Please add at-least one tag related to the product in Tagged by input";
		// }

		setProductFormError(() => errorMEssage);

		return !errorMEssage;
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
					upload_image: value,
				};

				return newData;
			});
		},
		[productFormError, validateProductForm]
	);

	// const handleProductTaggedByInputChange = useCallback(
	// 	(values) =>
	// 		setProductData((data) => {
	// 			const newData = {
	// 				...data,
	// 				tagged_by: values,
	// 			};
	// 			// productFormError && validateProductForm(newData);

	// 			return newData;
	// 		}),
	// 	[productFormError, validateProductForm]
	// );

	const handleProductDataSubmit = (e) => {
		e.preventDefault();
		if (validateProductForm(productData)) {
			const editPayload = {
				_id: collectionData._id,
				attributesData: {
					sponsor_details: {
						...(collectionData.sponsor_details || {}),
					},
				},
				fetchUserCollection: true,
			};

			if (isEdit) {
				const currentProduct = collectionData.sponsor_details.product_list.find(
					({ mfr_code }) => mfr_code === product.mfr_code
				);

				currentProduct.name = productData.name;
				currentProduct.brand = productData.brand;
				currentProduct.url = productData.url;
				currentProduct.image = productData.upload_image || productData.image;
				currentProduct.price = +productData.price;
				currentProduct.listprice = +productData.listprice;
				currentProduct.product_brand = productData.product_brand;
				currentProduct.color = productData.color;
				currentProduct.tagged_by = productData.tagged_by;

				editPayload.attributesData.sponsor_details.product_list = [
					...(collectionData.sponsor_details?.product_list || []),
				];
			} else {
				editPayload.attributesData.sponsor_details.product_list = [
					...(collectionData.sponsor_details?.product_list || []),
					{
						mfr_code: (
							productData.mfr_code ||
							+(
								collectionData.sponsor_details?.product_list?.at(-1)
									?.mfr_code || 0
							) + 1
						).toString(),
						name: productData.name,
						brand: productData.brand,
						url: productData.url,
						image: productData.upload_image || productData.image,
						price: +productData.price,
						listprice: +productData.listprice,
						product_brand: productData.product_brand,
						currency: "USD",
						currency_symbol: "&#36;",
						// discount: "above 20",
						avlble: 1, // keep it default and fixed YES
						color: productData.color,
						tagged_by: productData.tagged_by,
						starred: true, //to be added by default for future use, neednot be shown on input page
						sponsored: true, //to be added by default for future use, neednot be shown on input page
						hide: false, //to be added by default for future use, neednot be shown on input page
					},
				];
			}

			dispatch(updateWishlist(editPayload));
			onModalClose();
		}
	};

	const RequiredLabel = ({ children, required = false, ...props }) => (
		<label className='text-base' {...props}>
			{children} {required ? <span className='text-red-600'>*</span> : null}
		</label>
	);

	const discountPer =
		product?.price &&
		product?.listprice &&
		productData?.listprice > productData?.price &&
		getPercentage(productData.listprice, productData.price);

	const brandsDetails = useMemo(
		() => sellerDetails[productData.brand],
		[sellerDetails, productData.brand]
	);

	const currencySymbol = useMemo(
		() =>
			productData?.currency_symbol ? productData.currency_symbol : "&#36;",
		[productData?.currency_symbol]
	);

	return (
		<Modal
			isOpen={isModalOpen}
			headerText={
				isView
					? productData?.name || "Product Details"
					: isEdit
					? "Update Product"
					: "Add any Product"
			}
			onClose={onModalClose}
			size='md'
			zIndexClassName='z-50'>
			<div>
				<form onSubmit={handleProductDataSubmit}>
					{isView ? (
						<div>
							{brandsDetails?.brandName && brandsDetails.brandDescription ? (
								<div className='pb-4 justify-evenly'>
									<span className='text-base font-semibold'>
										About {brandsDetails.brandName}
									</span>
									<p className='text-justify'>
										{brandsDetails.brandDescription}
									</p>
								</div>
							) : null}

							<div className='grid grid-cols-1 tablet:grid-cols-2 gap-4 tablet:gap-8'>
								<div className='h-full'>
									<img
										src={productData.image}
										className='rounded-xl h-260px object-cover md:ml-auto m-auto'
										loading='lazy'
										width='260px'
									/>
								</div>
								<div className=''>
									{/* {productData.name && (
										<div className='text-xl-1.5 font-semibold capitalize'>
											{productData.name}
										</div>
									)} */}
									{!brandsDetails && productData.brand ? (
										<div className='text-slat-103 mb-4'>
											<span className='font-bold mr-1'>Brand : </span>
											<span>{productData.brand}</span>
										</div>
									) : null}
									{productData.description && (
										<div className='text-slat-103'>
											<span>{productData.description}</span>
										</div>
									)}
									<div>
										<div className=''>
											<span className='font-semibold text-xl'>
												{productData?.price || productData?.listprice ? (
													<span
														dangerouslySetInnerHTML={{
															__html: `${currencySymbol}${
																productData.price || productData.listprice
															}`,
														}}
													/>
												) : null}
											</span>

											{productData?.price &&
											productData.listprice > productData?.price ? (
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
										</div>
										<div className='text-red-600'>
											{discountPer ? `-${discountPer}%` : null}
										</div>
										{/* {productData?.brand ? (
											<div className='mt-2 text-indigo-600 hover:underline'>
												<Link
													className='p-0'
													href={generateRoute(undefined, productData?.brand)}
													target='_blank'>
													More from this seller
												</Link>
											</div>
										) : null} */}
									</div>
									{brandsDetails ? (
										<div className='mt-4'>
											{openContactDetails ? (
												<div className=''>
													<h3 className='text-xl font-semibold'>
														Contact Details
													</h3>
													<hr className='my-1' />
													<p className='text-lg font-semibold'>
														{brandsDetails.title}
													</p>
													<p className='text-base'>
														Email:{" "}
														<a
															className='p-0'
															href={`mailto:${brandsDetails.email}`}>
															{brandsDetails.email}
														</a>
													</p>
													<p className='text-base'>
														Contact:{" "}
														<a
															className='p-0'
															href={`tel:${brandsDetails.contact}`}>
															{brandsDetails.contact}
														</a>
													</p>
													{brandsDetails.info ? (
														<p className='text-base font-semibold mt-2'>
															{brandsDetails.info}
														</p>
													) : null}
													{brandsDetails.couponCode ? (
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
												</div>
											) : (
												<div>
													<div className='text-left'>
														<button
															type='submit'
															className=' flex items-center bg-indigo-600 rounded-xl text-indigo-100 font-bold text-sm p-2'
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																setOpenContactDetails(true);
															}}>
															Buy Now
														</button>
													</div>
												</div>
											)}
										</div>
									) : null}
								</div>
							</div>
							{allowEdit ? (
								<div className='tablet:col-span-2 '>
									<div className='text-right'>
										<button
											type='submit'
											className='bg-indigo-600 rounded-xl text-indigo-100 font-bold text-sm p-3 min-w-38'
											onClick={() => onProductEdit(productData)}>
											Edit
										</button>
									</div>
								</div>
							) : null}
						</div>
					) : (
						<div>
							<div className='mb-4'>
								<h2 className='text-lg font-semibold'>
									Fill these details to add your own product link!
								</h2>
							</div>
							<div className='grid grid-cols-1 tablet:grid-cols-2 gap-4 tablet:gap-8'>
								<div>
									<RequiredLabel
										className='text-base'
										// required
									>
										Product title
									</RequiredLabel>
									<input
										className='text-left placeholder-gray-101 outline-none px-3 h-12 rounded-xl w-full'
										placeholder='Enter product title / name'
										name='name'
										type='text'
										value={productData.name}
										onChange={handleProductDataInputChange}
										// required
									/>
								</div>
								<div>
									<RequiredLabel
										className='text-base'
										// required
									>
										Seller name/brand
									</RequiredLabel>
									<input
										className='text-left placeholder-gray-101 outline-none px-3 h-12 rounded-xl w-full'
										placeholder='Enter seller brand name'
										name='brand'
										type='text'
										value={productData.brand}
										onChange={handleProductDataInputChange}
										// required
									/>
								</div>
								{/* <div>
							<label className='text-base'>Unique code</label>
							<input
								class='text-left placeholder-gray-101 outline-none px-3 h-12 rounded-xl w-full'
								placeholder='Enter product uniquer code / mfr code'
								name='mfr_code'
								type='number'
								value={productData.mfr_code}
								onChange={handleProductDataInputChange}
							/>
							</div> */}
								<div>
									<div className='flex flex-col gap-4'>
										<RequiredLabel className='text-base' required>
											Image URL
										</RequiredLabel>

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
											) : productData.upload_image ? (
												<div className='flex flex-col items-center justify-center'>
													<div className='max-w-s-1 w-120 lg:w-200 h-120 lg:h-56'>
														<img
															src={productData.upload_image}
															height='100%'
															width='100%'
															className='object-cover rounded-xl max-w-s-1 w-120 lg:w-56 h-120 lg:h-56'
														/>
													</div>
													<div className='text-center text-primary underline lg:text-lg text-base cursor-pointer'>
														<span onClick={() => handleUploadImageChange("")}>
															remove or change Image
														</span>
													</div>
												</div>
											) : (
												<div className='flex flex-col items-center justify-center'>
													<Dragger
														className='bg-transparent h-56 w-56'
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

										<div className='text-center font-medium text-lg'>Or</div>

										<input
											className='text-left placeholder-gray-101 outline-none px-3 h-12 rounded-xl w-full'
											placeholder='Enter product image URL'
											name='image'
											type='url'
											value={productData.image}
											onChange={handleProductDataInputChange}
											required={!productData.upload_image}
										/>
									</div>
								</div>
								<div>
									<RequiredLabel
										className='text-base'
										// required
									>
										Product page URL
									</RequiredLabel>
									<input
										className='text-left placeholder-gray-101 outline-none px-3 h-12 rounded-xl w-full'
										placeholder='Enter product page redirection URL'
										name='url'
										type='url'
										value={productData.url}
										onChange={handleProductDataInputChange}
										// required
									/>
								</div>
								{/* <div>
							<label className='text-base'>Tagged by</label>
							<Select
								mode='tags'
								className='w-full text-base tag-select-input'
								name='tagged_by'
								placeholder='Enter related tags'
								value={productData.tagged_by || []}
								onChange={handleProductTaggedByInputChange}
								size='large'></Select>
						</div> */}
								{/* <div>
							<label className='text-base'>Color</label>
							<input
								class='text-left placeholder-gray-101 outline-none px-3 h-12 rounded-xl w-full'
								placeholder='Enter product color'
								name='color'
								type='text'
								value={productData.color}
								onChange={handleProductDataInputChange}
							/>
						</div> */}
								{/* <div>
							<label className='text-base'>Product brand</label>
							<input
								class='text-left placeholder-gray-101 outline-none px-3 h-12 rounded-xl w-full'
								placeholder='Enter product brand name'
								name='product_brand'
								type='text'
								value={productData.product_brand}
								onChange={handleProductDataInputChange}
							/>
							</div> */}
								<div className='tablet:col-span-2'>
									<p className='text-base'>Currency: $ USD</p>
								</div>
								<div>
									<RequiredLabel
										className='text-base'
										// Required
									>
										List price
									</RequiredLabel>
									<input
										className='text-left placeholder-gray-101 outline-none px-3 h-12 rounded-xl w-full'
										placeholder='Enter product list price'
										name='listprice'
										type='number'
										value={productData.listprice}
										onChange={handleProductDataInputChange}
										// required
									/>
								</div>
								<div>
									<RequiredLabel
										className='text-base'
										// required
									>
										Price
									</RequiredLabel>
									<input
										className='text-left placeholder-gray-101 outline-none px-3 h-12 rounded-xl w-full'
										placeholder='Enter product final price'
										name='price'
										type='number'
										value={productData.price}
										onChange={handleProductDataInputChange}
										// required
									/>
								</div>

								{productFormError ? (
									<div className='tablet:col-span-2 text-center'>
										<p className='text-red-600 text-lg'>{productFormError}</p>
									</div>
								) : null}

								<div className='tablet:col-span-2 text-right'>
									<button
										type='submit'
										className='bg-indigo-600 rounded-xl text-indigo-100 font-bold text-sm p-3 min-w-38'>
										{isEdit ? "Save" : "Add"}
									</button>
								</div>
							</div>
						</div>
					)}
				</form>
			</div>
		</Modal>
	);
};

export default React.memo(SponsorProductModal);
