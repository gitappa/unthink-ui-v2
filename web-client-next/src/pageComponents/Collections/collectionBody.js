import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "antd";
import {
	setSelectedCollection,
	setShowGallery,
	getCollectionProductsAsync,
	setCollectionTitle,
	setSelectedCollectionId,
	setShowCollection,
} from "./redux/actions";
import getRecentlyViewed from "../../helper/getRecentlyViewed";
import CollectionRow from "./collectionRow";
import CollectionGallery from "./collectionGallery";
import addImg from "../../images/add.svg";
import {
	getCollectionList,
	getGroupedSharedCollectionList,
} from "./collectionsUtils";
import styles from './collectionBody.module.scss';
import { COLLECTION_PUBLIC } from "../../constants/codes";
import { getTTid } from "../../helper/getTrackerInfo";
import HelpMeShopModal from "../../components/helpMeShop/HelpMeShopModal";

const CollectionBody = (props) => {
	const dispatch = useDispatch();
	const [expandedList, setExpandedList] = useState([]);
	const [collectionState, recentlyViewedList, showGallery] = useSelector(
		(state) => [
			state?.collections?.collectionList,
			state?.collections?.recentlyViewedList ?? [],
			state?.collections?.showGallery ?? false,
		]
	);
	const ttId = getTTid();
	const collectionDataList = getCollectionList(collectionState.data);
	const groupedSharedCollectionList = getGroupedSharedCollectionList(
		collectionState.data
	);
	const groupedSharedCollectionListForUser = groupedSharedCollectionList.filter(
		(c) => c.expert_id === ttId
	);
	const groupedSharedCollectionListByExpert =
		groupedSharedCollectionList.filter((c) => c.user_id === ttId);

	const convertCollectionList = ({ shared }) => {
		const checkCollection = (collection) =>
			collection.data.type !== "system" &&
			(shared !== undefined
				? shared
					? collection.data.access === COLLECTION_PUBLIC
					: collection.data.access !== COLLECTION_PUBLIC
				: true);

		return collectionDataList
			.map((collection) => ({
				value: collection.name,
				data: collection,
				type: "COLLECTIONS",
			}))
			.filter(checkCollection);
	};

	const getFavouriteCollection = () => {
		return collectionDataList.filter(
			(data) => data.name === "favorites" && data.type === "system"
		);
	};

	const selectedData = (type, data, value) => {
		if (type) {
			dispatch(setSelectedCollection(type));

			if (data && data.product_list) {
				dispatch(getCollectionProductsAsync(data.product_list));
			}
		} else {
			dispatch(setSelectedCollection("CUSTOM"));
		}
		dispatch(setSelectedCollectionId(data?.collection_id ?? ""));
		dispatch(setCollectionTitle(value));
		dispatch(setShowGallery(true));
	};
	const getRecentCollection = () => {
		const recentData = [];
		if (recentlyViewedList.length > 0) {
			recentData.push({
				value: "Recently Viewed",
				type: "RECENTLY_VIEWED",
				data: {},
			});
		}
		if (getRecentlyViewed().length > 0) {
			recentData.push({
				value: "Recently Clicked",
				type: "RECENTLY_CLICKED",
				data: {},
			});
		}
		return recentData;
	};
	const handleFavouriteClick = () => {
		let collection = getFavouriteCollection()[0];
		selectedData("FAVORITES", collection, collection.name);
	};
	return showGallery ? (
		<CollectionGallery />
	) : (
		<div className='unthink-collection-body'>
			<HelpMeShopModal />
			<div className='unthink-collection-body__header'>
				<Image
					src={addImg}
					preview={false}
					onClick={() => {
						dispatch(setShowCollection(true));
					}}
				/>
			</div>
			<CollectionRow
				name={"Recent"}
				list={getRecentCollection()}
				onClick={selectedData}
				expandedList={expandedList}
				setExpandedList={setExpandedList}
			/>
			{getFavouriteCollection().length > 0 && (
				<CollectionRow
					name={"Favorites"}
					list={[]}
					onListClick={handleFavouriteClick}
				/>
			)}
			{collectionDataList?.length > 0 && (
				<CollectionRow
					name={"My Collections"}
					list={convertCollectionList({ shared: false })}
					onClick={selectedData}
					expandedList={expandedList}
					setExpandedList={setExpandedList}
					showShareOption
					// showHelpMeShop disabled help me shop flow for now
				/>
			)}
			{/* should be removed later */}
			{/* {collectionDataList?.length > 0 && (
				<CollectionRow
					name={"Shared Collections"}
					list={convertCollectionList({ shared: true })}
					onClick={selectedData}
					expandedList={expandedList}
					setExpandedList={setExpandedList}
				/>
			)} */}
			{groupedSharedCollectionListForUser.map((c) => (
				<CollectionRow
					key={c._id}
					name={`Shared Collections for ${c.fname || c.user_id}`}
					list={(c.collections || []).map((coll) => ({
						value: coll.name,
						data: coll,
						type: "COLLECTIONS",
					}))}
					onClick={selectedData}
					expandedList={expandedList}
					setExpandedList={setExpandedList}
				/>
			))}
			{groupedSharedCollectionListByExpert.map((c) => (
				<CollectionRow
					key={c._id}
					name={`Shared Collections by ${c.expert_name || c.expert_id}`}
					list={(c.collections || []).map((coll) => ({
						value: coll.name,
						data: coll,
						type: "COLLECTIONS",
					}))}
					onClick={selectedData}
					expandedList={expandedList}
					setExpandedList={setExpandedList}
				/>
			))}
		</div>
	);
};
export default CollectionBody;
