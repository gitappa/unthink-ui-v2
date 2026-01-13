import React, { useEffect, useRef, useState } from "react";
import { ArrowRightOutlined, DownCircleOutlined } from "@ant-design/icons";
import styles from './allBlogPages.module.scss';

import useWindowSize from "../../helper/useWindowSize";
import { productCountToShow } from "../../helper/utils";
import SingleCollectionProductList from "./SingleCollectionProductList";
import { COLLECTIONS_ID } from "../../constants/codes";
import { Button, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getInfluencerCollectionsSuccess } from "../Influencer/redux/actions";
import { getUserCollectionsSuccess } from "../Auth/redux/actions";

const AllBlogPages = ({
	enableClickTracking,
	pageUserCollections,
	pageUser,
	isPageLoading = false,
	authUser,
	isUserLogin,
	isStoreHomePage,
	isBTInstance,
	isSamskaraInstance,
	selectedSortOption,
	handleSortOptionChange,
	onShowMoreClick,
	isLoading,
	setIsLoading,
	dataEmpty,
	authUserCollections,
	influencerUserCollections,
	showWishlistModal
}) => {
	const { width } = useWindowSize();

	console.log("pageUserCollections", pageUserCollections);


	const [
		authUserCollectionsCount,
		influencerUserCollectionsCount,
	] = useSelector((state) => [
		state.auth.user.collections.count,
		state.influencer.collections.count,
	]);

	const dispatch = useDispatch();

	const handleScrollToNextCollection = () => {
		const collections = document.querySelectorAll(".single-collection-class");

		for (let i = 0; i < collections.length; i++) {
			const rect = collections[i]?.getBoundingClientRect();
			const isMobile = width <= 1024;
			const isTablet = 1024 < width && width <= 1280;
			const isDesktop = 1280 < width;

			let collectionTopRequiredMargin;

			if (isBTInstance) {
				collectionTopRequiredMargin = 75;
			} else if (isSamskaraInstance && isMobile) {
				collectionTopRequiredMargin = 50;
			} else if (isSamskaraInstance && isTablet) {
				collectionTopRequiredMargin = 150;
			} else if (isSamskaraInstance && isDesktop) {
				collectionTopRequiredMargin = 115;
			} else if (isMobile) {
				collectionTopRequiredMargin = 0;
			} else {
				collectionTopRequiredMargin = 30;
			}

			if (collectionTopRequiredMargin + 5 < rect.top) {
				window.scrollTo({
					left: 0,
					top: rect.top + window.scrollY - collectionTopRequiredMargin,
					behavior: "smooth",
				}); // add space above the element (30px)

				break;
			}
		}
	};

	const loadMoreRef = useRef(null);
	const prevCollectionsLength = useRef(pageUserCollections?.length);
	const [autoLoadCount, setAutoLoadCount] = useState(0);

	useEffect(() => {

		if (dataEmpty.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					// If first API call returns <10 items, stop auto-loading
					if (autoLoadCount === 0 && (authUserCollectionsCount !== 10 && influencerUserCollectionsCount !== 10)) {
						console.log("Stopping auto-load, received less than 10 items on first call");
						setAutoLoadCount(2); // Stop further auto-load
					}
					// Auto-load up to 2 times if at least 10 items are received
					else if (autoLoadCount < 2) {
						console.log("Auto-loading more items");
						onShowMoreClick();
						setAutoLoadCount(prev => prev + 1);
					}
				}
			},
			{
				root: null,
				rootMargin: "100px", // Start fetching before reaching the bottom
				threshold: 0.1,
			}
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => {
			if (loadMoreRef.current) {
				observer.unobserve(loadMoreRef.current);
			}
		};
	}, [dataEmpty]);

	useEffect(() => {
		if (pageUserCollections?.length === 0) {
			setIsLoading(false);
			console.log("Collections loaded successfully" );
		}
	}, [pageUserCollections]);


	useEffect(() => {
		if (pageUserCollections?.length !== prevCollectionsLength.current && !showWishlistModal) {
			dispatch(getInfluencerCollectionsSuccess(pageUserCollections, influencerUserCollectionsCount));
			dispatch(getUserCollectionsSuccess(pageUserCollections, authUserCollectionsCount));
			prevCollectionsLength.current = pageUserCollections?.length; // Update previous length
		}
	}, [pageUserCollections?.length, dispatch]);

	return (
		<>
			<div id={COLLECTIONS_ID} className='flex flex-col gap-5 md:gap-12'>
				{pageUserCollections.map((blogCollectionPage) => (
					<SingleCollectionProductList
						key={blogCollectionPage._id}
						blogCollectionPage={blogCollectionPage}
						enableClickTracking={enableClickTracking}
						pageUser={pageUser}
						showCollectionDetails
						productCountToShow={productCountToShow(
							width,
							!!blogCollectionPage.cover_image
						)}
						isPageLoading={isPageLoading}
						authUser={authUser}
						isUserLogin={isUserLogin}
						showUserImage={isStoreHomePage}
						user_name={
							blogCollectionPage.user_name ||
							(pageUser.user_id === blogCollectionPage.user_id
								? pageUser.user_name
								: "")
						}
						profile_image={
							blogCollectionPage.profile_image ||
							(pageUser.user_id === blogCollectionPage.user_id
								? pageUser.profile_image
								: "")
						}
						selectedSortOption={selectedSortOption}
						handleSortOptionChange={handleSortOptionChange}
					/>
				))}
			</div>

			{/* Load More Observer */}

			{/* Load More Observer (Only for first 2 loads) */}
			{autoLoadCount < 2 && dataEmpty.length !== 0 && (
				<div ref={loadMoreRef} className="h-10 my-2 w-full flex justify-center items-center">
					<Spin size="large" />
				</div>
			)}

			{/* Load More Button (After 2 auto loads) */}
			{autoLoadCount >= 2 && (influencerUserCollectionsCount === 10 || authUserCollectionsCount === 10) && dataEmpty.length !== 0 ? (
				<div className="w-full flex justify-center my-4">
					{isLoading ? (
						<Spin size="large" />
					) : (
						<button
							className='bg-violet-100 text-white py-2 px-4 rounded-lg'
							onClick={onShowMoreClick}
						>
							Show More <ArrowRightOutlined />
						</button>
					)}
				</div>
			) : null}


			<div className='z-30 fixed h-24 w-18.5 mb-18.5 lg:mb-0 bottom-2 right-6 flex justify-center items-center down-circle-outlined'>
				<DownCircleOutlined
					className='text-white text-3xl md:text-4xl cursor-pointer rounded-full'
					onClick={handleScrollToNextCollection}
				/>
			</div>

		</>
	);
};

export default AllBlogPages;
