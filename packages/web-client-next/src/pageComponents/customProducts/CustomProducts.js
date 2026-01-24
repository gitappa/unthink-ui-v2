import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Tooltip,
	notification,
	Skeleton,
	Checkbox,
	Spin,
	Modal,
	Select,
	Pagination,
} from "antd";
import {
	DownloadOutlined,
	Loading3QuartersOutlined,
	LoadingOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "../../helper/useNavigate";

import { AdminCheck, getIsSellerLoggedIn, isEmpty } from "../../helper/utils";
import ProductCard from "../../components/singleCollection/ProductCard";
import UploadMultiProductsModal from "../uploadMultiProductsModal";
import { fetchCustomProducts, removeCustomProducts } from "./redux/actions";
import {
	openWishlistModal,
	setProductsToAddInWishlist,
} from "../wishlist/redux/actions";

import {
	customProductsAPIs,
	profileAPIs,
	customProductsDownloadCsvURL,
} from "../../helper/serverAPIs";
import { openAutoCreateCollectionModal } from "../autoCreateCollectionModal/redux/actions";

import {
	PATH_ROOT,
	PATH_STORE,
	UPLOAD_PRODUCT_MODE_CSV,
	UPLOAD_PRODUCT_MODE_IMAGES,
	WISHLIST_TITLE,
	COLLECTION_TYPE_CUSTOM_PLIST,
	COLLECTION_GENERATED_BY_MY_PRODUCTS_BASED,
	STORE_USER_NAME_SAMSKARA,
	PRODUCT_SORT_OPTIONS,
	PRODUCT_SORT_OPTIONS_MY_PRODUCTS,
} from "../../constants/codes";
import {
	auraYfretUserCollBaseUrl,
	is_store_instance,
	adminUserId,
	current_store_name,
} from "../../constants/config";
import { openProductModal } from "../customProductModal/redux/actions";
import { GET_USER_COLLECTIONS } from "../Auth/redux/constants";

const CustomProducts = ({ isCustomProductsPage }) => {
	const navigate = useNavigate();
	const [
		authUser,
		storeData,
		customProductsCount,
		customProductsData,
		isLoading,
		isProductsFetched,
		userCollections
	] = useSelector((state) => [
		state.auth.user.data,
		state.store.data,
		state.auth.customProducts.data,
		state.auth.customProducts.data.data || [],
		state.auth.customProducts.isLoading,
		state.auth.customProducts.isFetched,
		state?.auth?.user?.collections?.data || [],
	]);

	const {
		// associate_seller,
		my_products_enable: isMyProductsEnable,
		seller_list: storeSellerList,
		sellerDetails = {},
		store_type,
		admin_list: admin_list,
	} = storeData;

	console.log(store_type);

	const [addProductsModalOpen, setAddProductsModalOpen] = useState(false);
	const [uploadProductDefaultMode, setUploadProductDefaultMode] =
		useState(null);

	// states to handle multiselect for delete and other actions
	const [enableSelectProduct, setEnableSelectProduct] = useState(false);
	const [selectedProducts, setSelectedProducts] = useState([]);

	const dispatch = useDispatch();

	const { Option } = Select;

	// const ProductTotalCount = customProductsCount.total_count

	const ProductTotalCount = useMemo(
		() => customProductsCount.total_count,
		[customProductsCount.total_count]
	);

	const productsList = useMemo(() => customProductsData, [customProductsData]);


	const isPageLoading = useMemo(() => !isProductsFetched, [isProductsFetched]); // for skeleton

	const showBackdropLoader = useMemo(
		() => isLoading && !isPageLoading,
		[isLoading, isPageLoading] // for backdrop loader
	);

	const currentSellerBrandDetails = useMemo(
		() => sellerDetails[authUser.user_name],
		[sellerDetails, authUser.user_name]
	);

	const filterName = useMemo(() => {
		const brand =
			authUser?.filters?.[current_store_name]?.strict?.brand ||
			authUser?.filters?.[current_store_name]?.strict;

		if (Array.isArray(brand)) {
			return brand || "";
		}
		return brand || "";
	}, [authUser, current_store_name]);

	// const isAssociateSeller = useMemo(
	// 	() => associate_seller?.includes(authUser.emailId),
	// 	[associate_seller, authUser.emailId]
	// );

	const isAdminLoggedIn = AdminCheck(
		authUser,
		current_store_name,
		adminUserId,
		admin_list
	);

	const isSellerLoggedIn = useMemo(
		() =>
			(isAdminLoggedIn ||
				getIsSellerLoggedIn(storeSellerList, authUser.emailId)) &&
			isMyProductsEnable,
		[isAdminLoggedIn, isMyProductsEnable, storeSellerList, authUser.emailId]
	);

	const [selectedSortOptionProduct, setSelectedSortOptionProduct] = useState(
		PRODUCT_SORT_OPTIONS_MY_PRODUCTS[0]
	); // Initial selected sort option

	// antd pagination funtion
	const [currentPage, setCurrentPage] = useState(0);

	const handleSortOptionChangeProduct = (value) => {
		// Find the selected sort option
		const selectedOption = PRODUCT_SORT_OPTIONS_MY_PRODUCTS.find(
			(item) => item.id === value
		);
		setSelectedSortOptionProduct(selectedOption);
		setCurrentPage(0);
		fetchCustomProductsList();
	};

	const fetchCustomProductsList = useCallback(() => {
		if (is_store_instance) {
			const filters = {
				...(filterName?.length && { brand: filterName }),
				custom_product: true,
			};
			dispatch(
				fetchCustomProducts({
					product_sort_by:
						selectedSortOptionProduct?.product_sort_by || undefined,
					product_sort_order:
						selectedSortOptionProduct?.product_sort_order || undefined,
					filters,
					ipp: pageSize,
					current_page: currentPage,
				})
			);
			// navigate(`/product/${products.mfr_code}`);

		}
	}, [
		isSellerLoggedIn,
		authUser.user_name,
		selectedSortOptionProduct,
		currentPage,
	]);



	useEffect(
		() => fetchCustomProductsList(),
		[
			currentPage,
			authUser.user_name,
			isSellerLoggedIn,
			selectedSortOptionProduct,
		]
	);

	useEffect(() => {
		if (authUser.user_id && !isEmpty(storeData) && !isSellerLoggedIn) {
			is_store_instance ? navigate(PATH_ROOT) : navigate(PATH_STORE);
		}
	}, [authUser.user_id, storeData, isSellerLoggedIn]);

	// reset select product feature // unselect every products
	const handleResetSelectProduct = useCallback(() => {
		setSelectedProducts([]);
		setEnableSelectProduct(false);
	}, []);

	// delete multiple products at a time
	const removeProductsFromProductsList = useCallback(
		(mfr_codes) => {
			const payload = {
				mfr_codes,
				product_sort_by:
					selectedSortOptionProduct?.product_sort_by || undefined,
				product_sort_order:
					selectedSortOptionProduct?.product_sort_order || undefined,
				filters: { brand: `${authUser.user_name}`, custom_product: true },
				ipp: pageSize,
				current_page: 0,
			};

			dispatch(removeCustomProducts(payload));
		},
		[authUser.user_name, selectedSortOptionProduct]
	);

	// select all products
	const onSelectAllChange = () => {
		setSelectedProducts(
			selectedProducts.length < productsList.length
				? productsList.map((i) => i.mfr_code)
				: []
		);
	};

	// select particular product
	const onSelectProductClick = (mfr_code) => {
		if (selectedProducts.includes(mfr_code)) {
			setSelectedProducts(selectedProducts.filter((p) => p !== mfr_code));
		} else {
			setSelectedProducts([...selectedProducts, mfr_code]);
		}
	};

	// add selected products to collection
	// const onAddSelectedProductsToCollection = useCallback(() => {
	// 	const selectedProductsData = productsList.filter((p) =>
	// 		selectedProducts.includes(p.mfr_code)
	// 	);

	// 	dispatch(setProductsToAddInWishlist(selectedProductsData));
	// 	handleResetSelectProduct();
	// 	dispatch(openWishlistModal());
	// }, [productsList, selectedProducts, handleResetSelectProduct]);

	// remove selected products
	const onDeleteSelectedProducts = useCallback(() => {
		if (selectedProducts.length) {
			Modal.confirm({
				title: "Confirm",
				content: (
					<h1>
						Are you sure? The selected product(s) will be removed permanently.
					</h1>
				),
				okText: "Ok",
				cancelText: "Cancel",
				onOk: () => {
					setSelectedProducts([]);
					removeProductsFromProductsList(selectedProducts);
				},
			});
		}
	}, [selectedProducts]);

	// remove single product
	const handleDeleteProductClick = useCallback((mfr_code) => {
		Modal.confirm({
			title: "Confirm",
			content: <h1>Are you sure? The product will be removed permanently.</h1>,
			okText: "Ok",
			cancelText: "Cancel",
			onOk: () => {
				removeProductsFromProductsList([mfr_code]);
			},
		});
	}, []);

	const handleSaveOrShareClick = () => {
		onSelectAllChange();
		setEnableSelectProduct(true);
	};

	const onSaveOrShareProductsClick = ({ isSave = false }) => {
		const SelectedProductsData = productsList.filter((p) =>
			selectedProducts.includes(p.mfr_code)
		);

		let data = { tags: [], tagged_show_filters: {}, keyword_tag_map: {} };

		const createWishlistData = {
			generated_by: COLLECTION_GENERATED_BY_MY_PRODUCTS_BASED,
			...data,
		};

		if (isSave) {
			// add selected products to collection or create collection on save click
			dispatch(
				setProductsToAddInWishlist(SelectedProductsData, {
					...createWishlistData,
					closeModalOnSuccess: true,
				})
			);
			dispatch(openWishlistModal());
		} else {
			// show collection share modal on share click
			dispatch(
				openAutoCreateCollectionModal({
					...createWishlistData,
					isShareCollectionEnable: true,
				})
			);
		}

		handleResetSelectProduct();
	};

	const onAddIconClick = () => {
		setAddProductsModalOpen(true);
		handleResetSelectProduct();
	};

	const handleUploadCustomProducts = useCallback((defaultMode) => {
		setAddProductsModalOpen(true);
		setUploadProductDefaultMode(defaultMode);
	}, []);
	const handleOpenProductModal = (product) => {
 		dispatch(
			openProductModal({
				payload: product,
				collectionId: userCollections.collection_id,
				allowEdit: true,
			})
		);
	}

	// upload image and CSV submit click
	const handleUploadProductsSubmit = useCallback(
		async ({ productData: products, selectedCsv, currency, additional_images }) => {
 
			if (selectedCsv?.url) {
				try {
					const res = await profileAPIs.updateCatalogFeedAPICall({
						brand: authUser.user_name,
						user_id: authUser.user_id,
						feed_url: selectedCsv.url,
					});

					if (res.data?.status_code === 200) {
						notification["success"]({
							message:
								"Processing your request! The products will be searchable once it is ingested.",
						});
					}

				} catch (error) {
					console.error(error);
				}
			} else if (products) {
				try {
					let res = await customProductsAPIs.addCustomProductsAPICall(
						products.map((p) => {
							// Remove custom_filter from keyword_tag_map if present
							const { custom_filter: _cf, ...restKeywordTagMap } =
								p.keyword_tag_map || {};

							return {
								...restKeywordTagMap,
								tags: Array.isArray(_cf) ? _cf.join(",") : _cf,
								name: p.name,
								image: p.image,
								custom_product: true,
								brand: authUser.user_name,
								description: p.description,
								product_tag: p.tags,
								price: +p.price,
								listprice: +p.listprice,
								currency: currency,
								additional_image: additional_images,
							};
						}),
						authUser.user_id
					);
					if (res.data?.status_code === 200) {
						notification["success"]({
							message: "Added product(s)",
						});
					 
						handleOpenProductModal(res.data.data[0])
						// navigate(`/product/${res.data.data[0].mfr_code}`);
						fetchCustomProductsList(); //  fetch custom products data after successfully upload products
 					}
				} catch (error) {
					console.error(error);
				}
			}
		},
		[authUser, fetchCustomProductsList]
	);


	const handleSellerDownloadCsv = useCallback(
		(e) => {
			if (e?.detail === 1) {
				const url = `${auraYfretUserCollBaseUrl}${customProductsDownloadCsvURL}?brand=${authUser.user_name
					}${is_store_instance ? `&store=${current_store_name}` : ""}`;

				const modal = Modal.info({
					title: "Downloading CSV",
					content:
						"Downloading the products as a CSV. You may edit and upload it again.",
					icon: <LoadingOutlined />,
					okButtonProps: { disabled: true },
				});

				setTimeout(() => {
					window.open(url, "_blank");
					modal.update({
						type: "success",
						title: "Downloaded CSV",
						content:
							"Downloaded the products as a CSV. Please check your downloads. You may update product details in csv and upload it to update your catalog",
						icon: <CheckCircleOutlined />,
						okButtonProps: { disabled: false },
					});
				}, 3000);
			}
		},
		[authUser]
	);

	const pageSize = 52;

	const handlePaginationChange = (page) => {
		setCurrentPage(page - 1);
		fetchCustomProductsList(page); // Pass current page to API call
	};

	console.log(currentPage);

	const itemRender = (_, type, originalElement) => {
		if (type === "prev") {
			return <a>Previous</a>;
		}
		if (type === "next") {
			return <a>Next</a>;
		}
		return originalElement;
	};

	return (
		<>
			<div
				className={`w-full max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto lg:pb-12 pb-20`}>
				<div className='w-full self-center my-12'>
					<div className='flex justify-between items-center'>
						<div className='text-4xl lg:text-6xl-2 md:leading-none font-normal flex items-center mb-0'>
							<span>
								My Products {ProductTotalCount ? `(${ProductTotalCount})` : ""}
							</span>
						</div>
						<div className='md:leading-none flex items-center mb-0 gap-4'>
							<Tooltip title='Add new products of your choice by uploading images or CSV'>
								<button
									onClick={onAddIconClick}
									className='cursor-pointer font-normal text-3xl lg:text-5xl h-min my-auto leading-6'>
									+
								</button>
							</Tooltip>
							{productsList.length ? (
								<Tooltip title='Download products in the CSV and you may edit and upload it again with updated data'>
									<DownloadOutlined
										onClick={handleSellerDownloadCsv}
										role='button'
										className='cursor-pointer font-normal text-2xl lg:text-4xl h-min leading-none flex justify-center items-center mt-1'
									/>
								</Tooltip>
							) : null}
						</div>
					</div>
				</div>

				{isPageLoading ? (
					<div className='w-full max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto'>
						<div className='w-full self-center my-12'>
							<div className='h-180 lg:h-340 grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 gap-2.5 lg:gap-4 pt-2'>
								<Skeleton.Input active className='w-full h-full rounded-xl' />
								<Skeleton.Input active className='w-full h-full rounded-xl' />
								<Skeleton.Input
									active
									className='w-full h-full hidden sm:block rounded-xl'
								/>
								<Skeleton.Input
									active
									className='w-full h-full hidden 2xl:block rounded-xl'
								/>
							</div>
						</div>
					</div>
				) : null}

				{productsList.length ? (
					<div className='md:flex justify-between md:items-center items-start  mb-2 md:mb-4'>
						<div className='flex justify-between items-center text-xs md:text-base mb-2'>
							{enableSelectProduct ? (
								<div className='flex items-center leading-44'>
									<div className='flex border border-gray-106 rounded py-2 pl-2'>
										<Checkbox
											className='text-xs md:text-base'
											indeterminate={
												selectedProducts.length > 0 &&
												selectedProducts.length < productsList.length
											}
											onChange={onSelectAllChange}
											checked={selectedProducts.length === productsList.length}>
											{selectedProducts.length} Selected
										</Checkbox>
									</div>
									<p
										onClick={onDeleteSelectedProducts}
										className={`
									${selectedProducts.length
												? "text-blue-103 cursor-pointer"
												: "text-gray-104 cursor-not-allowed"
											}
									 mb-0 ml-2 underline`}
										title='Click to delete selected products'
										role='button'>
										Delete
									</p>
									<p
										onClick={
											selectedProducts.length
												? () => onSaveOrShareProductsClick({ isSave: true })
												: undefined
										}
										className={`
									${selectedProducts.length
												? "text-blue-103 cursor-pointer"
												: "text-gray-104 cursor-not-allowed"
											}
									 mb-0 ml-2 underline`}
										title='Click to add selected products in collection'
										role='button'>
										Add to {WISHLIST_TITLE}
									</p>

									<p
										onClick={() => handleResetSelectProduct()}
										className='text-blue-103 mb-0 ml-2 underline cursor-pointer'
										role='button'>
										Cancel
									</p>
								</div>
							) : (
								<Tooltip title='Click and select multiple products to add to collection or delete'>
									<p
										className='text-blue-103 cursor-pointer leading-44 underline'
										role='link'
										onClick={() => setEnableSelectProduct(true)}>
										Select multiple products
									</p>
								</Tooltip>
							)}
						</div>
						<div className='flex items-center w-56 lg:w-64 h-8.5 pl-3 md:ml-auto border border-solid  border-gray-107 rounded-lg collection_page_sort_product_list'>
							<label className='whitespace-nowrap text-sm'>Sort by : </label>
							<Select
								name='sortBy'
								className='w-full'
								size='small'
								value={selectedSortOptionProduct?.id}
								onChange={handleSortOptionChangeProduct}>
								{PRODUCT_SORT_OPTIONS_MY_PRODUCTS?.map((item) => (
									<Option key={item.id} value={item.id}>
										{item.id}
									</Option>
								))}
							</Select>
						</div>
					</div>
				) : null}

				<div className='flex flex-col lg:flex-row'>
					<div className='grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 gap-2.5 lg:gap-4'>
						{productsList.length ? (
							productsList?.map((product) => (
								<div key={product.mfr_code}>
									<ProductCard
										product={product}
										isCustomProductsPage={isCustomProductsPage}
										showStar={false}
										enableHoverShowcase={false}
										enableSelect={enableSelectProduct}
										hideViewSimilar
										showRemoveIcon
										onRemoveIconClick={() =>
											handleDeleteProductClick(product.mfr_code)
										}
										isSelected={selectedProducts.includes(product.mfr_code)}
										setSelectValue={() =>
											onSelectProductClick(product.mfr_code)
										}
										allowEdit
										wishlistGeneratedBy={
											COLLECTION_GENERATED_BY_MY_PRODUCTS_BASED
										}
									/>
								</div>
							))
						) : !isPageLoading ? (
							<>
								{/* {currentSellerBrandDetails?.platform === current_store_name ||
									isEmpty(currentSellerBrandDetails?.platform) ? ( */}
								{currentSellerBrandDetails?.platform ? (
									<div className='box-content w-40 sm:w-180 lg:w-80'>
										<div className='overflow-hidden relative cursor-pointer shadow-3xl rounded-t-xl rounded-b-xl bg-lightgray-101'>
											<div className='flex justify-center items-center h-180 lg:h-340'>
												<div
													className='underline cursor-pointer text-lg lg:text-3xl'
													onClick={() =>
														handleUploadCustomProducts(
															UPLOAD_PRODUCT_MODE_IMAGES
														)
													}>
													Upload Images
												</div>
											</div>
										</div>
									</div>
								) : null}
								<div className='box-content w-40 sm:w-180 lg:w-80'>
									<div className='overflow-hidden relative cursor-pointer shadow-3xl rounded-t-xl rounded-b-xl bg-lightgray-101'>
										<div className='flex justify-center text-center items-center h-180 lg:h-340'>
											<div
												className='underline cursor-pointer text-lg lg:text-3xl'
												onClick={() =>
													handleUploadCustomProducts(UPLOAD_PRODUCT_MODE_CSV)
												}>
												Upload CSV <br />
												or product feed
											</div>
										</div>
									</div>
								</div>
							</>
						) : null}
					</div>
				</div>
				{/* Pagination component */}
				<div className='my-5 pagnation_product flex justify-center items-center w-full'>
					{productsList.length ? (
						<Pagination
							className=''
							pageSize={pageSize}
							total={ProductTotalCount}
							itemRender={itemRender}
							showSizeChanger={false}
							onChange={handlePaginationChange}
						/>
					) : (
						""
					)}
				</div>

				{/* show backdrop loader */}
				{showBackdropLoader && (
					<div className='fixed top-0 left-0 flex justify-center items-center w-full min-h-screen h-full backdrop-filter bg-gray-102 z-20'>
						<Spin
							indicator={
								<Loading3QuartersOutlined
									className='flex text-6xl-1 text-indigo-100'
									spin
								/>
							}
						/>
					</div>
				)}

				<UploadMultiProductsModal
					isModalOpen={addProductsModalOpen}
					onModalClose={() => {
						setAddProductsModalOpen(false);
						setUploadProductDefaultMode(null);
					}}
					onSubmit={handleUploadProductsSubmit}
					sellerDetails={sellerDetails}
					authUser={authUser}
					defaultMode={uploadProductDefaultMode}
					store_type={store_type}
				/>
			</div>
		</>
	);
};

export default CustomProducts;
