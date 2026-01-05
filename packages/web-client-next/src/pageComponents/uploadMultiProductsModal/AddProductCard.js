import React, { useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Select, Tooltip, notification, Upload } from "antd";
import {
	CloseCircleOutlined,
	Loading3QuartersOutlined,
	DownOutlined,
	UpOutlined,
} from "@ant-design/icons";

import { isEmpty } from "../../helper/utils";
import {
	collectionAPIs,
	collectionPageAPIs,
	profileAPIs,
} from "../../helper/serverAPIs";
import { saveUserInfo } from "../Auth/redux/actions";
import { current_store_name } from "../../constants/config";
import ProductFiltersTags from "../productFilters/ProductFiltersTags";
import { attributesToAvoid } from "../customProductModal/CustomProductModal";
import AdditionalAttributes from "../productFilters/AdditionalAttributes";
import { useEffect } from "react";
import { CURRENCY_INR, CURRENCY_SYMBOLS } from "../../constants/codes";

const { Dragger } = Upload;

export const additionalAttributes = [
	"gender",
	"age_group",
	"discount",
	"brand",
	"occasion",
	"color",
	"material",
	"pattern",
	"style",
];

const AddProductCard = ({
	product,
	onRemoveIconClick,
	handleProductInputChange,
	handleProductDataChange,
	handlePriceInputBlur,
	authUser,
	autoGenerateHelperText,
	storeStyle,
	collectionValue,
	currency,
	setProductData,
	productData,
	additional_images
}) => {
	const [storeTemplates, catalog_attributes, filter_settings] = useSelector(
		(state) => [
			state.store.data.templates || {},
			state.store.data.catalog_attributes || [],
			state.store.data.filter_settings || {},
		]
	);
	// console.log("productinAddProductCard", productData);

	
	const [uploadedImages, setUploadedImages] = useState(product?.additional_image || [] );
	const [showLoader, setShowLoader] = useState(false);
	const [originalDescription, setOriginalDescription] = useState("");

	
 
	const dispatch = useDispatch();

	const removeFromAddProduct = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (onRemoveIconClick) {
			onRemoveIconClick(product.mfr_code);
		}
	};

	// sending keyword, product description, profile description, product guidelines, brand description in imagetodescription API call for generate details
	const imageText = useMemo(() => {
		let aboutProduct = [];
		let finalDescription = [];

		if (!isEmpty(product?.name)) {
			aboutProduct.push(product?.name);
		}

		if (!isEmpty(product?.tags)) {
			aboutProduct.push(product?.tags?.toString());
		}

		if (!isEmpty(product?.description)) {
			aboutProduct.push(product?.description);
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
	}, [product, autoGenerateHelperText]);

	const fetchProductData = useCallback(
		 async (e) => {
			e.preventDefault();
			e.stopPropagation();

			try {
				setShowLoader(true);
				setOriginalDescription(product?.description || "");
				const payload = {
					image_url: product?.image,
					catalog_description: storeTemplates.catalog_description,
					image_text: imageText || undefined,
					mp_collection_name: collectionValue,
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
						tags: data.data.tags,
						keyword_tag_map: {},
					};
					// check and save keyword_tag_map properties which is available in additionalAttributes
					for (const key in data.data.keyword_tag_map) {
						// if (additionalAttributes.includes(key)) {
						preparedData.keyword_tag_map[key] = data.data.keyword_tag_map[key];
						// }
					}
					handleProductDataChange(product.mfr_code, preparedData);
				}
			} catch (err) {
				console.log(err);
			} finally {
				setShowLoader(false);
			}
		},
		[product, showLoader, imageText]
	);

	const handleRemoveAdditionalAttribute = (name, value) => {
		handleProductDataChange(product.mfr_code, {
			keyword_tag_map: {
				...product.keyword_tag_map,
				[name]: value,
			},
		});
	};

	const handleUndoDescription = () => {
		handleProductDataChange(product.mfr_code, {
			description: originalDescription,
		});
		setOriginalDescription("");
	};

	// removing attributes which has is_display : false and attributesToAvoid
	const additionalAttributesToShow = useMemo(() => {
		const displayedAttributes = catalog_attributes?.filter((value) => {
			return value.is_display && !attributesToAvoid.includes(value.key);
		});

		return displayedAttributes;
	}, [catalog_attributes]);

	// console.log("additionalAttributesToShow", additionalAttributesToShow);

	const [showAdditionalAttributes, setShowAdditionalAttributes] =
		useState(true);

	const toggleAttributes = () => {
		setShowAdditionalAttributes(!showAdditionalAttributes);
	};

	const [data, setData] = useState({
		title: product?.name,
		description: product?.description,
		additional_attributes: product?.keyword_tag_map,
		tags: product?.tags,
	});


	useEffect(() => {
		setData({
			title: product?.name,
			description: product?.description,
			additional_attributes: product?.keyword_tag_map,
			tags: product?.tags,
		});
	}, [showLoader]);

	// console.log("data", data);
	// console.log("product", product);
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
				additional_images.push(url)
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

	const fetchTrainAi = async () => {
		setShowLoader(true);

		const modified_text = {};

		if (data?.title !== product?.name) {
			modified_text.title = product?.name;
		}

		if (data?.description !== product?.description) {
			modified_text.description = product?.description;
		}

		if (data?.tags !== product?.tags) {
			modified_text.tags = product?.tags;
		}

		if (
			JSON.stringify(data?.additional_attributes) !==
			JSON.stringify(product?.keyword_tag_map)
		) {
			modified_text.additional_attributes = product?.keyword_tag_map;
		}

		const payload = {
			store_type: storeStyle,
			mp_collection_name: collectionValue,
			modified_data: [
				{
					image_url: product?.image_url,
					modified_text,
				},
			],
		};

		try {
			const res = await collectionAPIs.FetchAddModifiedDataKeyUrl(payload);
			if (res.data.status_code === 200) {
				console.log("res", res);
				setShowLoader(false);
			}
		} catch (error) {
			console.log("error", error);
			setShowLoader(false);
		}
		setShowLoader(false);
	};


	return (
		<div className='flex flex-col bg-slate-100 rounded-xl p-3 shadow-m w-full'>
			<div className='grid gap-3' style={{ gridTemplateColumns: "180px 1fr" }}>
				<div className='flex justify-end col-span-2'>
					<button
						type='button'
						className='text-base mt-0 flex items-center'
						onClick={removeFromAddProduct}>
						Remove <CloseCircleOutlined className='flex ml-1 text-lg' />
					</button>
				</div>
				<div className='box-content theme-unthink w-40 sm:w-180 lg:w-80'>
					<div className='h-full product_card_image'>
						<img
							src={product.image}
							width='100%'
							className='h-180 w-180 rounded-xl'
							loading='lazy'
						/>
					</div>
				</div>
				<div className='flex flex-col gap-3'>
					<div>
						<input
							className='text-left placeholder-gray-101 outline-none px-3 h-10 rounded-xl w-full'
							placeholder='Enter product title / name'
							name='name'
							type='text'
							value={product.name}
							onChange={(e) => handleProductInputChange(e, product.mfr_code)}
						/>
					</div>

					<div className='bg-white rounded-xl'>
						<textarea
							className='text-left placeholder-gray-101 outline-none rounded-xl w-full px-3 py-2 resize-none'
							placeholder='Enter description...'
							name='description'
							type='text'
							value={product.description}
							onChange={(e) => handleProductInputChange(e, product.mfr_code)}
							rows={5}
						/>                                                                                                                                                              
						{originalDescription ? (
							<div className='text-right'>
								<Tooltip title='Take back the original description'>
									<button
										className={`font-bold text-xs md:text-sm px-3 w-max ${
											showLoader
												? "cursor-not-allowed text-gray-106"
												: "cursor-pointer dark:text-white text-black-100"
										}`}
										disabled={showLoader}
										onClick={handleUndoDescription}>
										Undo
									</button>
								</Tooltip>
							</div>
						) : null}
					</div>
				</div>
			</div>

			{/* <p>yml files has been uadsffd</p> */}

			{additionalAttributesToShow.some((attr) => attr.is_display === true) && (
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
							__html: `Currency: ${
								CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS[CURRENCY_INR]
							} ${currency}`,
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
							product?.keyword_tag_map?.listprice || product.listprice || ""
						}
						onChange={(e) => handleProductInputChange(e, product.mfr_code)}
						onBlur={() => handlePriceInputBlur(product.mfr_code)}
						onWheel={(e) => e.target.blur()}
					/>
				</div>

				<div>
					<label className='text-sm'>Selling price (discounted)</label>
					<input
						className='text-left placeholder-gray-101 outline-none px-3 h-8.5 rounded-xl w-full'
						placeholder='Enter product final price'
						name='price'
						type='number'
						value={product?.keyword_tag_map?.price || product.price || ""}
						onChange={(e) => handleProductInputChange(e, product.mfr_code)}
						onWheel={(e) => e.target.blur()}
					/>
				</div>
			</div>

			<div className='bg-white rounded-xl col-span-2 mt-3'>
				<Select
					mode='tags'
					className='w-full text-sm p-1 add_product_tags_input'
					placeholder='Enter keywords'
					value={product.tags || []}
					onChange={(value) =>
						handleProductDataChange(product.mfr_code, { tags: value })
					}
					dropdownStyle={{ display: "none" }}></Select>
			</div>

			<div className='mt-3'>
				<div>
					<div
						className='text-sm md:text-base flex items-center justify-between cursor-pointer'
						onClick={toggleAttributes}>
						<span>Additional attributes</span>
						{showAdditionalAttributes ? (
							<UpOutlined className='text-sm' />
						) : (
							<DownOutlined className='text-sm' />
						)}
					</div>

					{showAdditionalAttributes && (
						<div className='flex flex-col gap-5 mt-2'>
							<AdditionalAttributes
								attributesData={product.keyword_tag_map}
								handleAdditionalAttributesChange={
									handleRemoveAdditionalAttribute
								}
								additionalAttributesToShow={additionalAttributesToShow}
								collectionValue={collectionValue}
								availableFilters={filter_settings.available_filters}
								tagThemeClassName='border border-slat-103 text-slat-103 text-sm pr-1.25 pl-2'
								isShowOptional={false}
								selectBoxSize='middle'
								fontColorTheme='text-black-100'
								fontSizeTheme='text-sm'
								setProductData={setProductData}
							/>
						</div>
					)}
				</div>
			</div>

			<div className='flex justify-end items-center gap-2 mt-3'>
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
				{product.keyword_tag_map && (
					<button
						onClick={fetchTrainAi}
						type='button'
						size='small'
						className={`text-xs md:text-sm z-10 rounded-xl py-1.5 px-4 h-full font-bold text-indigo-600 border-2 border-indigo-600`}
						// disabled={showLoader}
					>
						Train AI
					</button>
				)}
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
			{/* <div className='flex gap-2 mt-3'>
				<div className='bg-white rounded-xl w-full'>
					<textarea
						className='text-left placeholder-gray-101 outline-none rounded-xl w-full px-3 py-2 resize-none'
						placeholder='Enter hint text describing image...'
						name='hint_text'
						type='text'
						value={product.hint_text}
						onChange={(e) => handleProductInputChange(e, product.mfr_code)}
						rows={2}
					/>
				</div>
				<div className='mt-0.5'>
					<button
						onClick={fetchProductData}
						size='small'
						title='Generate name, description and tags with AI based on the image'
						className={`text-sm font-bold px-1 w-max border rounded-lg ${
							showLoader
								? "cursor-not-allowed text-gray-106 border-gray-106"
								: "cursor-pointer text-black-200 border-black-200"
						}`}
						disabled={showLoader}>
						<span>Generate details</span>
						<span className='flex justify-center gap-2'>
							by AI
							{showLoader ? (
								<Spin
									className='flex items-center'
									indicator={
										<Loading3QuartersOutlined
											className='flex text-sm text-black-200'
											spin
										/>
									}
								/>
							) : null}
						</span>
					</button>
				</div>
			</div> */}
		</div>
	);
};

export default React.memo(AddProductCard);
