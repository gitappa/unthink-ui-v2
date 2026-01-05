import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "../../helper/useNavigate";
import { Skeleton, Spin } from "antd";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";

import CategoriesList from "./CategoriesList";
import { fetchCategories, setShowCategories } from "./redux/actions";
import { categoriesAPIs } from "../../helper/serverAPIs";
import ProductCard from "../../components/singleCollection/ProductCard";

import styles from './categories.module.scss';
import {
	category_widget_type_influencer_widget,
	category_widget_type_suggestion_chip,
	category_widget_type_super_admin_seller_widget,
} from "../../constants/codes";
import {
	filterAvailableProductList,
	generateRoute,
	isEmpty,
} from "../../helper/utils";
import {
	adminUserId,
	is_store_instance,
	super_admin,
} from "../../constants/config";

const Categories = ({ hideBack }) => {
	const navigate = useNavigate();
	const [selectedSubCategories, setSelectedSubCategories] = useState([]);
	const [categoriesProducts, setCategoriesProducts] = useState([]);
	const [fetchingCategoriesProducts, setFetchingCategoriesProducts] =
		useState(false);
	const [selectedFilter, setSelectedFilter] = useState(null);

	const selectedSubCategory = useMemo(
		() => selectedSubCategories[selectedSubCategories.length - 1],
		[selectedSubCategories]
	);

	const dispatch = useDispatch();
	const [
		categoriesList,
		categoriesMetaData,
		categoriesIsFetching,
		categoriesFetchingSuccess,
		categoriesFetchingError,
		authUserIsFetching,
		isUserLogin,
		authUser,
		admin_list
	] = useSelector((state) => [
		state.categories.list || [],
		state.categories.metadata,
		state.categories.isFetching,
		state.categories.success,
		state.categories.error,
		state.auth.user.isFetching,
		state.auth.user.isUserLogin,
		state.auth.user.data,
		state.store.data.admin_list,
	]);

	const finalCategoriesList = useMemo(() => categoriesList, [categoriesList]);

	const onCategoryClick = (category) => {
		if (
			[
				category_widget_type_influencer_widget,
				category_widget_type_super_admin_seller_widget,
			].includes(category.widget_type) &&
			category.user_name
		) {
			const shareUrl = generateRoute(category.user_id, category.user_name);
			// navigate(shareUrl);
			window.open(shareUrl, "_blank"); // opening in new tab for now // can be changed
		} else {
			setSelectedSubCategories([
				{
					...category,
				},
			]);
		}
	};

	const onSubCategoryClick = (subCategory) => {
		setSelectedSubCategories([
			...selectedSubCategories,
			{
				...subCategory,
			},
		]);
	};

	// function to fetch products by action string
	const fetchProductsBySelectedActionString = async () => {
		setFetchingCategoriesProducts(true);

		const query = {};
		let query_text = "";
		if (
			selectedSubCategory &&
			selectedSubCategory.widget_type === category_widget_type_suggestion_chip
		) {
			query_text = selectedSubCategory.action_string;
		} else query[selectedSubCategory.key] = selectedSubCategory.key_value;

		if (selectedFilter)
			query[selectedFilter.query_key] = selectedFilter.query_key_value;

		try {
			const products = await categoriesAPIs.fetchCategoriesProductsAPICall(
				query,
				query_text
			);
			if (products && products.status === 200 && products.data) {
				setCategoriesProducts(
					products.data.data
						? filterAvailableProductList(products.data.data)
						: []
				);
			}
		} catch {
			setCategoriesProducts([]);
		}

		setFetchingCategoriesProducts(false);
	};

	const handleFilterChange = (filter) => {
		if (
			selectedFilter &&
			selectedFilter.query_key_value === filter.query_key_value
		) {
			setSelectedFilter(null);
		} else {
			setSelectedFilter(filter);
		}
	};

	const email = authUser?.emailId;
	const isEmailAdmin = admin_list?.includes(email);

	const metadata = useMemo(
		() => ({
			isAdminLoggedIn:
				authUser.user_id === adminUserId || isEmailAdmin ||
				(is_store_instance && authUser.user_name === super_admin),
		}),
		[authUser.user_id, authUser.user_name, adminUserId]
	);

	const fnFetchCategories = useCallback(() => {
		dispatch(fetchCategories(metadata));
	}, [metadata]);

	useEffect(() => {
		if (
			authUser.user_id &&
			!authUserIsFetching &&
			categoriesList.length === 0 &&
			!categoriesIsFetching &&
			!categoriesFetchingSuccess &&
			!categoriesFetchingError
		) {
			fnFetchCategories();
		}
	}, [categoriesList, authUser.user_id]);

	useEffect(() => {
		if (
			!isEmpty(categoriesMetaData) &&
			JSON.stringify(metadata) !== JSON.stringify(categoriesMetaData)
		) {
			fnFetchCategories();
		}
	}, [metadata]);

	useEffect(() => {
		// fetching products based on selected sub category action string
		if (selectedSubCategory && !selectedSubCategory.next_level?.length) {
			fetchProductsBySelectedActionString();
		}

		//scroll to top on category change
		window.scrollTo(0, 0);
	}, [selectedSubCategory, selectedFilter]);

	const onBack = () => {
		if (selectedSubCategories.length) {
			const newSelectedSubCategories = [...selectedSubCategories];
			newSelectedSubCategories.pop();
			setSelectedSubCategories(newSelectedSubCategories);
		} else {
			dispatch(setShowCategories(false));
		}
		setSelectedFilter(null);
		setCategoriesProducts([]);
	};

	return (
		<>
			{(selectedSubCategory || !hideBack) && (
				<div className='sm:container mx-3 sm:mx-auto pt-7 lg:pt-0'>
					<div className='max-w-6xl-1 w-full mx-auto flex'>
						<div className='flex items-center cursor-pointer' onClick={onBack}>
							<ArrowLeftOutlined className='text-xl leading-none text-black-200 flex' />
							<span className='pl-4 text-xl font-medium capitalize'>
								{selectedSubCategory?.title || "Back"}
							</span>
						</div>
					</div>
				</div>
			)}
			<div className='container mx-auto'>
				<div className='mx-2.5'>
					{(selectedSubCategory?.filter?.length && (
						<div className='flex max-w-6xl-1 w-full mx-auto mt-7'>
							{selectedSubCategory.filter.map((filter) => (
								<div
									key={filter.query_key_value}
									className={`cursor-pointer rounded-full mx-2 my-1 w-max border border-gray-500 ${selectedFilter?.query_key_value === filter.query_key_value
										? "bg-primary text-white"
										: "text-black-200"
										}`}
									onClick={() => handleFilterChange(filter)}>
									<p
										level={5}
										className='m-0 px-2 sm:px-4 py-1 font-normal text-xs md:text-sm'>
										{filter.title}
									</p>
								</div>
							))}
						</div>
					)) ||
						null}
					{categoriesIsFetching ||
						authUserIsFetching ||
						(fetchingCategoriesProducts && !categoriesProducts.length) ? (
						categoriesIsFetching ? (
							<div className='p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 gap-2 pt-7'>
								<Skeleton.Input active className='w-full h-180 lg:h-260' />
								<Skeleton.Input active className='w-full h-180 lg:h-260' />
								<Skeleton.Input active className='w-full h-180 lg:h-260' />
								<Skeleton.Input active className='w-full h-180 lg:h-260' />
								<Skeleton.Input
									active
									className='w-full h-180 lg:h-260 block md:hidden 2xl:block'
								/>
								<Skeleton.Input
									active
									className='w-full h-180 lg:h-260 block md:hidden 2xl:block'
								/>
							</div>
						) : (
							<div className='max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto'>
								<div className='w-full grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 gap-2.5 lg:gap-4 lg:pl-5 pt-3'>
									<Skeleton.Input
										active={true}
										className='w-40 sm:w-180 lg:w-80 h-180 lg:h-340'
									/>
									<Skeleton.Input
										active={true}
										className='w-40 sm:w-180 lg:w-80 h-180 lg:h-340'
									/>
									<Skeleton.Input
										active={true}
										className='w-40 sm:w-180 lg:w-80 h-180 lg:h-340'
									/>
									<Skeleton.Input
										active={true}
										className='w-40 sm:w-180 lg:w-80 h-180 lg:h-340 block sm:hidden 2xl:block'
									/>
								</div>
							</div>
						)
					) : (
						<div>
							{selectedSubCategory ? (
								selectedSubCategory.next_level?.length ? (
									<div>
										<CategoriesList
											category={selectedSubCategory}
											onCategoryClick={onSubCategoryClick}
										/>
									</div>
								) : (
									<div>
										{categoriesProducts.length ? (
											<div className='max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto'>
												<div className='flex flex-col lg:flex-row '>
													<div className='w-full grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 gap-2.5 lg:gap-4 pt-2 lg:pt-0'>
														{categoriesProducts?.map((product) => (
															<ProductCard
																key={product?.mfr_code}
																product={product}
																hideViewSimilar
																enableClickTracking
																productClickParam={{
																	iCode: authUser.influencer_code,
																}}
																hideAddToWishlist={
																	is_store_instance && !isUserLogin
																}
															/>
														))}
													</div>
												</div>
											</div>
										) : (
											<h2 className='text-center mt-16 text-xl'>
												Products not found
											</h2>
										)}
									</div>
								)
							) : (
								<div className='grid gap-4 lg:gap-6'>
									{finalCategoriesList.length ? (
										finalCategoriesList.map((category) =>
											category.next_level?.length ? (
												<CategoriesList
													category={category}
													title={category.title}
													onCategoryClick={onCategoryClick}
													fnFetchCategories={fnFetchCategories}
												/>
											) : null
										)
									) : (
										<h2 className='text-center mt-16 text-xl'>
											Categories not found
										</h2>
									)}
								</div>
							)}
						</div>
					)}
					{(fetchingCategoriesProducts && categoriesProducts.length && (
						<div className='fixed z-40 top-0 left-0 flex justify-center items-center w-full h-full backdrop-filter backdrop-contrast-75'>
							<Spin
								indicator={<LoadingOutlined className='text-3xl-1' spin />}
							/>
						</div>
					)) ||
						null}
				</div>
			</div>
		</>
	);
};

export default React.memo(Categories);
