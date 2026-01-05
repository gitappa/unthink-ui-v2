import React, { useMemo } from "react";
import { useRouter } from 'next/router'; const navigate = (path) => useRouter().push(path);

import styles from './index.module.scss';
import { getBlogCollectionPagePath } from "../../helper/utils";
import { gTagShopWidgetClick } from "../../helper/webTracker/gtag";
import { PUBLISHED, ERAS_FEATURED_COLLECTIONS_ID, STORE_USER_NAME_SWIFTLYSTYLED } from "../../constants/codes";

import { MainContent } from "./pageContents/MainContent";
import { CollectionsContent } from "./pageContents/CollectionsContent";
import { Footer } from "./pageContents/Footer";
import CarousalContainer from "../../components/carousel/CarouselContainer";
import { ErasBar } from "./pageContents/ErasBar";
import { current_store_name, is_store_instance } from "../../constants/config";
import { getTTid } from "../../helper/getTrackerInfo";

const SwiftlyStyledIndex = ({ authUser, pageUser, pageUserCollections }) => {

	const blogCollections = useMemo(
		() =>
			pageUserCollections
				.filter(
					(coll) =>
						coll.status === PUBLISHED && coll.starred && !!coll.cover_image
				)
				.map((coll) => ({
					id: coll._id,
					title: coll.collection_name,
					cover_image:
						coll.cover_image || pageUser.cover_image || pageUser.profile_image,
					metadata: {
						path: coll.path,
						_id: coll._id,
						user: coll.user_name,
						shared_id: getTTid(),
						term: "",
						path: coll.path,
						status: coll.status,
						collection_theme: coll.collection_theme,
						user_id: coll.user_id
					},
				}))
				.slice(0, 10),
		[pageUserCollections]
	);

	const isSwiftlyStyledInstance = useMemo(
		() =>
			is_store_instance && current_store_name === STORE_USER_NAME_SWIFTLYSTYLED,
		[]
	);
	const handleItemClick = (item) => {

		sessionStorage.setItem("clickPage", "unthink_collection_carousel");
		const storedClickPage = sessionStorage.getItem("clickPage");

		// GTAG CONFIGURATION
		// START
		gTagShopWidgetClick({
			collection_path: item.metadata.path,
			collection_status: item.metadata.status,
			user: item.metadata.user || item.metadata.user_id,
			collection_id: item.metadata._id,
			shared_id: item.metadata.shared_id,
			term: item.metadata.term,
			user_id: item.metadata.user_id,
			clickPage: storedClickPage
		});
		// END

		console.log("GTAG SHOP WIDGET CLICK", item);

		const collectionPagePath = getBlogCollectionPagePath(
			pageUser.user_name,
			item.metadata.path,
			item.id,
			pageUser.user_id,
			item.metadata.status,
			undefined,
			item.metadata.collection_theme
		);

		collectionPagePath && navigate(collectionPagePath);
	};

	return (
		<div className='index overflow-hidden'>
			<MainContent />
			{
				isSwiftlyStyledInstance ? <CollectionsContent /> : ""
			}
			{blogCollections?.length >= 5 ? (
				<div id={ERAS_FEATURED_COLLECTIONS_ID}>
					<h2 className='headline'>Featured Collections</h2>
					<p className='sub-headline'>
						Check out the most popular collections on our website right now!
					</p>
					<div className='max-w-7xl mx-auto'>
						<CarousalContainer
							items={blogCollections}
							handleItemClick={handleItemClick}
							hideTitle
						/>
					</div>
					<div>
						<ErasBar />
					</div>
				</div>
			) : null}
			<Footer />
		</div>
	);
};

export default SwiftlyStyledIndex;
