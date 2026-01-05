// NOT USING
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import SingleCollection from "../../components/singleCollection/SingleCollection";
import { COLLECTION_PUBLIC, PUBLISHED } from "../../constants/codes";
import { getIsCollectionPage } from "../../helper/utils";
import { getCurrentUserStore } from "../Auth/redux/selector";
import { getCollectionList } from "../Collections/collectionsUtils";

const ProfileCollection = ({
	showInfluencerCollection,
	enableClickTracking,
	collection_id,
	user_name,
	user_id,
	isSingleCollectionSharedPage,
}) => {
	const [userCollections, influencerCollections, collectionPageData] =
		useSelector((state) => [
			state?.auth?.user?.collections?.data || [],

			state?.influencer?.collections?.data || [],
			state?.collectionPage,
		]);

	// showing all collection from collection array only
	const collectionsData = useMemo(() => {
		if (getIsCollectionPage()) {
			// filter collection base on store and blog url on collection page
			return getCollectionList(
				showInfluencerCollection &&
					collectionPageData?.collection?.status === PUBLISHED
					? influencerCollections
					: userCollections
			)?.filter(
				(collection) =>
					collection.store === user_name && // compare with username as store from url
					collection.blog_url &&
					collection.blog_url === collectionPageData?.collection?.blog_url
			);
		}

		return getCollectionList(
			showInfluencerCollection ? influencerCollections : userCollections
		);
	}, [influencerCollections, userCollections, collectionPageData]);

	const checkSingleCollection = (id) =>
		isSingleCollectionSharedPage ? id === collection_id : true;

	const collectionsToShow = collectionsData.filter(
		(c) =>
			c.access !== COLLECTION_PUBLIC && checkSingleCollection(c.collection_id)
	);

	return (
		<div className='mx-3 sm:container sm:mx-auto'>
			{collectionsToShow.map((collection) => (
				<div key={collection?.collection_id}>
					<SingleCollection
						collection={collection}
						enableClickTracking={enableClickTracking}
						user_name={user_name}
						user_id={user_id}
						isSingleCollectionSharedPage={isSingleCollectionSharedPage}
					/>
				</div>
			))}
		</div>
	);
};

export default ProfileCollection;
