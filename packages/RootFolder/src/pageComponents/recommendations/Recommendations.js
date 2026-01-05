import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "antd";
import ProductCard from "../../components/singleCollection/ProductCard";
import { fetchRecommendations, handleRecProductClick } from "./redux/actions";
import { filterAvailableProductList } from "../../helper/utils";
import { is_store_instance } from "../../constants/config";

//Recommendations list created for new ui integrations
const Recommendations = ({ enableClickTracking, trackCollectionData = {} }) => {
	const { trackCollectionICode } = trackCollectionData;
	const [recomList, fetching, authUser, isUserLogin] = useSelector((state) => [
		state?.appState?.recommendations.data || [],
		state?.appState?.recommendations.fetching,
		state.auth.user.data,
		state.auth.user.isUserLogin,
	]);
	const dispatch = useDispatch();

	const recommendationsList = useMemo(
		() => filterAvailableProductList(recomList),
		[recomList]
	);

	// fetch recommendations firts time on store or my profile page
	useEffect(() => {
		if (recommendationsList?.length === 0) {
			dispatch(fetchRecommendations());
		}
	}, [recommendationsList]);

	const onProductClick = () => {
		if (enableClickTracking) dispatch(handleRecProductClick());
	};

	// show loader only one time on first fetching
	if (fetching && recommendationsList?.length === 0) {
		return (
			<div className='max-w-s-3 sm:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 px-3 sm:mx-auto pb-5 bg-white'>
				<div className='pt-10 lg:pt-20 max-w-6xl-1 mx-auto'>
					<Skeleton.Input active className='w-2/3 h-10 mb-2' />
					<div className='flex flex-wrap'>
						<div className='h-200px w-1/2 md:w-1/4 pt-2 pr-2'>
							<Skeleton.Input active className='w-full h-full' />
						</div>
						<div className='h-200px w-1/2 md:w-1/4 pt-2 pr-2'>
							<Skeleton.Input active className='w-full h-full' />
						</div>
						<div className='h-200px w-1/2 md:w-1/4 pt-2 pr-2'>
							<Skeleton.Input active className='w-full h-full' />
						</div>
						<div className='h-200px w-1/2 md:w-1/4 pt-2 pr-2'>
							<Skeleton.Input active className='w-full h-full' />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		(recommendationsList?.length && (
			<div className='pb-5 max-w-s-3 sm:max-w-lg-1 md:max-w-lg-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto bg-white'>
				<div className='pt-10 lg:pt-20 '>
					<h1 className='text-xl md:text-xl-2 font-semibold pb-1 md:pb-5'>
						Recommended for you
					</h1>
					<div className='grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 gap-2.5 lg:gap-4'>
						{recommendationsList?.map((product) => (
							<ProductCard
								product={product}
								enableClickTracking={enableClickTracking}
								onProductClick={onProductClick}
								productClickParam={{
									collectionICode: trackCollectionICode,
									iCode: authUser.influencer_code,
								}}
								hideAddToWishlist={is_store_instance && !isUserLogin}
							/>
						))}
					</div>
				</div>
			</div>
		)) ||
		null
	);
};

export default Recommendations;
