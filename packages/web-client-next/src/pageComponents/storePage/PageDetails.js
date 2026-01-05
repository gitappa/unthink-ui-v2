import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";

// import { getInfluencerInfo } from "../Influencer/redux/actions";
import sharedPageTracker from "../../helper/webTracker/sharedPageTracker";
import {
	collectionQRCodeGenerator,
	generateRoute,
	getCurrentPath,
} from "../../helper/utils";
import UserNotFound from "../Influencer/UserNotFound";
import BlogPageNotFound from "../Influencer/BlogPageNotFound";
import ProfileComponent from "../Influencer/ProfileComponent";
import CollectionDetails from "../../components/singleCollection/CollectionDetails";
import { is_store_instance } from "../../constants/config";
import { PATH_ROOT } from "../../constants/codes";

const PageDetailsComponent = ({
	enablePageViewTracking,
	sharePageUrl,
	pageUser,
	authUser,
	isSingleCollectionSharedPage,
	currentSingleCollection,
	isPageLoading,
	updateWishlistInProgress = false,
	isStoreHomePage = false,
	isPageOwner,
	isMyProfilePage,
	isSamskaraInstance,
	isHeroesVillainsInstance,
	collectionsBy,
}) => {
	const [storeData, isGuestUser] = useSelector((state) => [
		state.store.data,
		state.auth.user.userNotFound,
	]);

	const {
		my_products_enable: isMyProductsEnable,
		seller_list: storeSellerList,
	} = storeData;

	// const pageUser = showInfluencerInfo ? shareUser : authUser;

	// useEffect(() => { // UPDATE
	// 	if (showInfluencerInfo && (user_name || user_id)) {
	// 		dispatch(getInfluencerInfo({ user_name, user_id }));
	// 	}
	// }, [showInfluencerInfo, user_name, user_id, collection_name]);

	// single collection page, page view track event

	const profilePagePath = useMemo(
		() =>
			isMyProfilePage
				? generateRoute(authUser?.user_id, authUser?.user_name)
				: getCurrentPath(),
		[isMyProfilePage, authUser]
	);

	// creating qr code for profile page
	const qrCodeGeneratorURL = useMemo(
		() => collectionQRCodeGenerator(profilePagePath),
		[profilePagePath]
	);

	const currentPath = getCurrentPath();

	const isHideProfileComponent = useMemo(
		() =>
			(isSamskaraInstance || isHeroesVillainsInstance) &&
			currentPath === PATH_ROOT,
		[isSamskaraInstance, isHeroesVillainsInstance, currentPath]
	);

	useEffect(() => {
		if (
			enablePageViewTracking &&
			pageUser.user_id &&
			isSingleCollectionSharedPage &&
			currentSingleCollection._id
		) {
			sharedPageTracker.onPageView({
				object_id: currentSingleCollection.user_id,
				iCode: authUser.influencer_code,
				cCode: pageUser.company_code,
				collection_id: currentSingleCollection._id,
				collectionName: currentSingleCollection.collection_name,
				campCode: currentSingleCollection.campaign_code,
				collectionICode:
					typeof currentSingleCollection.influencer_code === "string"
						? currentSingleCollection.influencer_code || "UTH-DIRECT"
						: pageUser.influencer_code || "UTH-DIRECT",
			});
		}
	}, [
		enablePageViewTracking,
		pageUser.user_id,
		currentSingleCollection._id,
		isSingleCollectionSharedPage,
	]);

	// BT root page, influencer page, page view track event
	useEffect(() => {
		if (
			enablePageViewTracking &&
			pageUser.user_id &&
			!isSingleCollectionSharedPage
		) {
			sharedPageTracker.onPageView({
				object_id: pageUser.user_id,
				iCode: authUser.influencer_code,
				cCode: pageUser.company_code,
				collectionICode: pageUser.influencer_code, // Attaching influencer code of the owner of the store/collection as yfret_utm_source
			});
		}
	}, [enablePageViewTracking, pageUser.user_id, isSingleCollectionSharedPage]);

	if (isPageLoading) {
		return (
			<div className='lg:container lg:mx-auto'>
				<div className='max-w-6xl-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto'>
					<Skeleton.Input active={true} className='w-full h-32 lg:h-80' />
					<div className='ml-4 lg:ml-12 flex items-end'>
						<div className='-mt-16 md:-mt-28 max-w-s-1 h-120 md:h-200'>
							<Skeleton.Input
								active={true}
								className='w-120 md:w-200 h-120 md:h-200'
							/>
						</div>
						<div className='lg:pb-4 pl-4 w-full'>
							<Skeleton.Input active className='h-11 w-1/2' />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (isSingleCollectionSharedPage) {
		if (!currentSingleCollection._id) {
			// UPDATE // RE_CHECK LOGIC OR KEEP IT
			return <BlogPageNotFound />;
		}
	} else {
		if (!pageUser.user_id) {
			return <UserNotFound />;
		}
	}

	return (
		<>
			{pageUser && (isSingleCollectionSharedPage || !isHideProfileComponent) ? (
				<div className='lg:container lg:mx-auto'>
					<div className='max-w-6xl-1 lg:max-w-3xl-2 2xl:max-w-6xl-2 mx-auto'>
						{isSingleCollectionSharedPage ? (
							<CollectionDetails
								sharePageUrl={sharePageUrl}
								pageUserUserId={pageUser.user_id}
								pageUserInfluencerCode={pageUser.influencer_code}
								collection={currentSingleCollection}
								collectionOwner={pageUser}
								updateWishlistInProgress={updateWishlistInProgress}
								enableBannerClickTracking
								isPageOwner={isPageOwner}
							/>
						) : (
							!isHideProfileComponent && (
								<ProfileComponent
									sharePageUrl={sharePageUrl}
									pageUser={pageUser}
									name={collectionsBy}
									showBanner
									showRoundedImage={is_store_instance && !isStoreHomePage}
									qrCodeGeneratorURL={qrCodeGeneratorURL}
									isPageOwner={isPageOwner}
									isGuestUser={isGuestUser}
									isMyProfilePage={isMyProfilePage}
								/>
							)
						)}
					</div>
				</div>
			) : null}
		</>
	);
};

export default PageDetailsComponent;
