// NOT USING
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spin } from "antd";

import { PUBLISHED } from "../../constants/codes";
import CollectionProductList from "./CollectionProductList";
import useWindowSize from "../../helper/useWindowSize";

export default function CollectionPageContent({ collection_name }) {
	const [authUser, currentSingleCollection] = useSelector((state) => [
		state.auth.user.data || {},
		state.collectionPage?.collection,
	]);

	// const { width } = useWindowSize();

	// const plistIpp = useMemo(() => {
	// 	let ipp = 20;
	// 	if (width < 1536 && width >= 640) {
	// 		ipp = 21;
	// 	} else if (width <= 640) {
	// 		ipp = 20;
	// 	}
	// 	return ipp;
	// }, [width]);

	// useEffect(() => {
	// 	if (influencer.user_id && influencer.store && collection_name) {
	// 		// if user name and email id same than take the part of email before @ otherwise take username as store
	// 		const influencerCurrentStore =
	// 			influencer.emailId === influencer.user_name
	// 				? influencer.emailId?.split("@")[0]
	// 				: influencer.user_name;
	// 		const pages = influencer?.store?.[influencerCurrentStore]?.pages;
	// 		const currentCollection = pages?.find((page) =>
	// 			page.path.endsWith(collection_name)
	// 		);
	// 		if (
	// 			currentCollection?.status === PUBLISHED ||
	// 			influencer?.user_id === authUser?.user_id
	// 		) {
	// 			// dispatch(setCollectionPageData(currentCollection)); // UPDATE // REMOVE
	// 			if (!pListData?.length && !isFetching)
	// 				dispatch(fetchCollectionPagePListData({ plistIpp }));
	// 		}
	// 	}
	// }, [influencer, collection_name, authUser.user_id]);

	// reset plist data on component unmount

	return (
		<div>
			{currentSingleCollection && (
				<CollectionProductList
					collection={currentSingleCollection}
					enableClickTracking
				/>
			)}

			{/* <div className='mt-6 flex justify-center'>
				{isFetching && pListData.length ? (
					<Spin className='flex h-8' />
				) : (
					<Button
						type='primary'
						className='rounded-lg h-8'
						ghost
						onClick={onShowMoreClick}>
						Show more
					</Button>
				)}
			</div> */}
		</div>
	);
}
