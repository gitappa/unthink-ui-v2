import React from "react";
import { Button, Typography } from "antd";

import RecommendationLineItem from "../../components/recommendationList/RecommendationLineItem";

const { Text } = Typography;

const InnerCollectionList = ({
	title,
	collections,
	handleCollectionClick,
	selectedCollectionId,
}) => (
	<div>
		<Text style={{ fontWeight: 700, fontSize: "18px" }}>{title}</Text>
		{collections.map((data) => {
			return (
				<div
					className={`unthink-shared-collection-list__data-row ${
						data.collection_id === selectedCollectionId
							? "active border-primary"
							: "in-active"
					}`}
					onClick={
						data.collection_id === selectedCollectionId
							? () => {}
							: () => handleCollectionClick(data)
					}>
					<Text ellipsis={{ tooltip: data.name }}>{data?.name ?? ""}</Text>
				</div>
			);
		})}
	</div>
);

const CollectionListItems = ({
	myCollectionData,
	handleCollectionClick,
	selectedCollectionId,
	sharedCollectionData,
	onRecommendClick,
	showRecommend,
	onCloseCollectionDrawer,
}) => {
	return (
		<div>
			<div className='unthink-shared-collection-list__data'>
				<InnerCollectionList
					title='My Collections'
					collections={myCollectionData}
					handleCollectionClick={handleCollectionClick}
					selectedCollectionId={selectedCollectionId}
				/>
				{sharedCollectionData.length ? (
					<InnerCollectionList
						title='Shared Collections'
						collections={sharedCollectionData}
						handleCollectionClick={handleCollectionClick}
						selectedCollectionId={selectedCollectionId}
					/>
				) : null}
				<RecommendationLineItem
					onCloseCollectionDrawer={onCloseCollectionDrawer}
				/>
				{/* {showRecommend && (
					<Button danger onClick={onRecommendClick} className='rounded-full'>
						Recommend
					</Button>
				)} */}
				{!myCollectionData?.length && !sharedCollectionData?.length && (
					<h1 className='pt-4'>No collections found</h1>
				)}
			</div>
		</div>
	);
};

export default CollectionListItems;
