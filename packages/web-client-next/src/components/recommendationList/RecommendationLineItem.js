import React from "react";
import { Typography } from "antd";

import { recommendationsWrapperId } from "./RecommendationList";
import { useSelector } from "react-redux";

const { Text } = Typography;

// Smooth scroll utility function for Next.js
const scrollTo = (elementId) => {
	const element = document.querySelector(elementId);
	if (element) {
		element.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	}
};

export const pageKeys = {
	sharedCollection: "shared_collection",
};

export default function RecommendationLineItem({
	pageKey = pageKeys.sharedCollection,
	onCloseCollectionDrawer,
}) {
	const [sharedPageRec] = useSelector((state) => [
		state.shared?.recommendations ?? {},
	]);

	const scrollToCuratedForYou = () => {
		scrollTo(`#${recommendationsWrapperId}`);
		onCloseCollectionDrawer();
	};

	switch (pageKey) {
		case pageKeys.sharedCollection:
			return sharedPageRec?.data.length ? (
				<div
					className={"unthink-shared-collection-list__data-row"}
					onClick={scrollToCuratedForYou}>
					<Text style={{ fontWeight: 500 }}>Curated for you</Text>
				</div>
			) : null;

		default:
			break;
	}

	return null;
}
