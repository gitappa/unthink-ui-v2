import React, { useMemo } from "react";
import { useRouter } from 'next/router'; const navigate = (path) => useRouter().push(path);

import CarousalContainer from "../../components/carousel/CarouselContainer";
import { getBlogCollectionPagePath, isEmpty } from "../../helper/utils";
import {
	PUBLISHED,
	STORE_USER_NAME_HEROESVILLAINS,
	STORE_USER_NAME_SAMSKARA,
} from "../../constants/codes";
import { is_store_instance, current_store_name } from "../../constants/config";
import { gTagShopWidgetClick } from "../../helper/webTracker/gtag";

const CollectionCarouselContainer = ({
	pageUser,
	authUser,
	pageUserCollections,
}) => {
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
					video_url: coll.video_url || pageUser.video_url || pageUser.video_url,
					metadata: {
						path: coll.path,
						_id: coll._id,
						name: coll.name,
						path: coll.path,
						status: coll.status,
						collection_theme: coll.collection_theme,
					},
				}))
				.slice(0, 10),
		[pageUserCollections]
	);
	const isSamskaraInstance = useMemo(
		() => is_store_instance && current_store_name === STORE_USER_NAME_SAMSKARA,
		[]
	);

	const isHeroesVillainsInstance = useMemo(
		() =>
			is_store_instance &&
			current_store_name === STORE_USER_NAME_HEROESVILLAINS,
		[]
	);

	const handleItemClick = (item) => {
		// GTAG CONFIGURATION
		// START
		gTagShopWidgetClick({
			_id: item.metadata.id,
			name: item.metadata.name,
			path: item.metadata.path,
			status: item.metadata.status,
			user_name: authUser.user_name,
			user_id: authUser.user_id,
		});

		console.log("GTAG SHOP WIDGET CLICK", item);

		// END

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

	return blogCollections?.length >= 5 ? (
		<div>
			<div className='max-w-7xl mx-auto'>
				<CarousalContainer
					items={blogCollections}
					handleItemClick={handleItemClick}
					hideTitle
					showOuterTitle
					description={
						pageUser.description &&
							(isSamskaraInstance || isHeroesVillainsInstance)
							? pageUser.description
							: ""
					}
				/>
			</div>
		</div>
	) : null;
};

export default CollectionCarouselContainer;
