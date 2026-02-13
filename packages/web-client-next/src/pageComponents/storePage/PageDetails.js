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
import styles from "./storePage.module.scss";

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
  isCollectionPage
}) => {
  const [storeData, isGuestUser, singleCollections, influencerCollections] =
    useSelector((state) => [
      state.store.data,
      state.auth.user.userNotFound,
      state.auth.user.singleCollections.data,
      state.auth.user.data,
    ]);
const publish = singleCollections.status === 'published'
	const userId = influencerCollections.user_id === singleCollections.user_id
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
    [isMyProfilePage, authUser],
  );

  // creating qr code for profile page
  const qrCodeGeneratorURL = useMemo(
    () => collectionQRCodeGenerator(profilePagePath),
    [profilePagePath],
  );

  const currentPath = getCurrentPath();

  const isHideProfileComponent = useMemo(
    () =>
      (isSamskaraInstance || isHeroesVillainsInstance) &&
      currentPath === PATH_ROOT,
    [isSamskaraInstance, isHeroesVillainsInstance, currentPath],
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
      <div className={styles.pageDetailsContainer}>
        <div className={styles.pageDetailsInner}>
          <Skeleton.Input active={true} className={styles.skeletonBanner} />
          <div className={styles.skeletonProfileSection}>
            <div className={styles.skeletonProfileImageWrapper}>
              <Skeleton.Input
                active={true}
                className={styles.skeletonProfileImage}
              />
            </div>
            <div className={styles.skeletonProfileInfo}>
              <Skeleton.Input active className={styles.skeletonProfileName} />
            </div>
          </div>
        </div>
      </div>
    );
  }
	if (!userId && !publish && isSingleCollectionSharedPage && !isPageOwner ) {
		console.log('helloworld');
		return <BlogPageNotFound />
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
        <div className={styles.pageDetailsContainer}>
          <div className={styles.pageDetailsInner}>
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
                isCollectionPage={isCollectionPage}
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
