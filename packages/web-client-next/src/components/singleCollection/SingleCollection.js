// NOT USING
import React, { useEffect, useMemo, useState } from "react";
import { Skeleton, Typography, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

import ProductCard from "./ProductCard";
import { collectionAPIs } from "../../helper/serverAPIs";
import { handleRecProductClick } from "../../pageComponents/recommendations/redux/actions";
import { getIsRootPage, getIsSharedPage } from "../../helper/utils";
import { useNavigate } from "../../helper/useNavigate";
import { favorites_collection_name } from "../../constants/codes";

const { Text } = Typography;

const SingleCollection = ({
	collection,
	showLoading = false,
	enableClickTracking = false,
	user_name,
	user_id,
	isSingleCollectionSharedPage,
}) => {
	const navigate = useNavigate();
	const [productsData, setProductsData] = useState([]);
	const [showMore, setShowMore] = useState(false);
	const dispatch = useDispatch();
	const [sharedUser, authUser] = useSelector((state) => [
		state?.influencer?.user?.data || {},
		state?.auth?.user?.data || {},
	]);

	const shareCollectionUrl = useMemo(
		() => "",
		// generateShareCollectionPath(
		// 	user_id ||
		// 		(getIsSharedPage() ? sharedUser?.user_id : authUser?.user_id),
		// 	user_name ||
		// 		(getIsSharedPage() ? sharedUser?.user_name : authUser?.user_name),
		// 	collection?.collection_id
		// )
		[user_name, user_id, sharedUser, authUser]
	);

	useEffect(() => {
		const mfrcode_list = collection?.product_list?.map((data) => data.mfr_code);
		try {
			(async () => {
				if (mfrcode_list.length) {
					const response = await collectionAPIs.fetchCollectionProductsAPICall({
						mfrcode_list,
					});
					if (response?.data?.status_code === 200 && response?.data?.data) {
						setProductsData(response?.data?.data);
					}
				}
			})();
		} catch (error) {
			console.log("collection product fetching error:", error);
		}
	}, [collection?.product_list]);

	const onProductClick = () => {
		if (enableClickTracking) dispatch(handleRecProductClick());
	};

	const productsToShow = useMemo(
		() =>
			// showMore
			// 	? productsData
			// 	: collection?.cover_image
			// 	? productsData?.slice(0, 8)
			// 	: productsData?.slice(0, 12),
			showMore ? productsData : productsData?.slice(0, 16),
		[productsData, showMore]
	);

	if (showLoading) {
		return (
			<div className='max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto pt-10 lg:pt-20'>
				<Skeleton.Input active={true} className='w-1/2 h-10 mb-9' />
				<div className='flex flex-col lg:flex-row'>
					<div className='h-180 md:h-200 lg:h-700 w-full'>
						<Skeleton.Input
							active={true}
							className='w-full h-180 md:h-200 lg:h-700'
						/>
					</div>
					<div className='w-full grid grid-cols-2 gap-2.5 lg:gap-4 lg:pl-5 pt-3'>
						<Skeleton.Input
							active={true}
							className='lg:max-w-480 h-180 lg:h-full'
						/>
						<Skeleton.Input
							active={true}
							className='lg:max-w-480 h-180 lg:h-full'
						/>
						<Skeleton.Input
							active={true}
							className='lg:max-w-480 h-180 lg:h-full'
						/>
						<Skeleton.Input
							active={true}
							className='lg:max-w-480 h-180 lg:h-full'
						/>
					</div>
				</div>
			</div>
		);
	}

	const onTitleClick = () => navigate(shareCollectionUrl);

	return (
		(!(getIsRootPage() && collection?.product_list?.length === 0) && (
			<div className='max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto pt-10 lg:pt-20'>
				{!isSingleCollectionSharedPage && (
					<div className='pb-1 md:pb-5'>
						<div className='flex justify-between'>
							<h1
								onClick={onTitleClick}
								className='text-xl md:text-xl-2 font-semibold capitalize collection_title underline cursor-pointer max-w-max'>
								{collection?.name === "favorites" &&
								collection?.type === "system"
									? favorites_collection_name
									: collection?.name}
							</h1>
							{(authUser?.user_name || sharedUser?.user_name) && (
								<Button
									type='primary'
									className='rounded-lg dark:bg-black-200 dark:border-black-200'
									// ghost
									onClick={onTitleClick}>
									View all
								</Button>
								// <h1
								// 	className='text-base text-purple-101 underline cursor-pointer min-w-max'
								// 	onClick={onTitleClick}>
								// 	View
								// </h1>
							)}
						</div>
						{collection?.description ? (
							<p className='text-sm max-w-xl-1 mt-3 leading-normal ellipsis_2'>
								{collection.description}
							</p>
						) : null}
					</div>
				)}
				{collection?.product_list?.length ? (
					<div className='flex flex-col lg:flex-row'>
						<div className='w-full grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 gap-2.5 lg:gap-4 pt-2 lg:pt-0'>
							{!isSingleCollectionSharedPage && collection?.cover_image && (
								<div className='h-180 md:h-200 w-full lg:h-700 lg:w-656px col-span-2 sm:col-span-3 md:col-span-3 lg:col-span-2 lg:row-span-2 flex-grow'>
									<img
										onClick={onTitleClick}
										className='h-full object-cover rounded-xl w-full cursor-pointer'
										src={collection?.cover_image}
									/>
								</div>
							)}
							{productsToShow.map((product) => (
								<div className='' key={product.mfr_code}>
									<ProductCard
										product={product}
										onProductClick={onProductClick}
										enableClickTracking={enableClickTracking}
										productClickParam={{
											iCode: sharedUser?.influencer_code,
											cCode: sharedUser?.company_code,
											collectionId: collection?.collection_id,
											product_brand: product.product_brand,
											brand: product.brand,
										}}
									/>
								</div>
							))}
						</div>
					</div>
				) : (
					<div className='text-center text-lg font-medium'>
						No products found
					</div>
				)}
				{!showMore &&
					// (collection?.cover_image
					// 	? productsData?.length > 8
					// 	: productsData?.length > 12) && (
					productsData?.length > 16 && (
						<div className='mt-6 flex justify-center'>
							<Button
								type='primary'
								className='rounded-lg h-8'
								ghost
								onClick={() => setShowMore(true)}>
								Show more
							</Button>
						</div>
					)}
			</div>
		)) ||
		null
	);
};

export default SingleCollection;
