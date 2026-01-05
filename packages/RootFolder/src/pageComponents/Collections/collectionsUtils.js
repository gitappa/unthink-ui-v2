import { COLLECTION_PRIVATE, COLLECTION_PUBLIC } from "../../constants/codes";

export const getCollectionList = (collectionList = []) =>
	collectionList.reduce((list, b) => {
		list.push(
			...(b?.collections ?? []).map((i) => ({
				...i,
				access: b.access || COLLECTION_PRIVATE,
				user_id: b.user_id,
				expert_id: b.expert_id,
			}))
		);
		return list;
	}, []);

export const getBlogCollectionList = (collectionList = []) =>
	collectionList.reduce((list, b) => {
		list.push(
			...(b?.blog_collections ?? []).map((i) => ({
				...i,
				access: b.access || COLLECTION_PRIVATE,
				user_id: b.user_id,
				expert_id: b.expert_id,
			}))
		);
		return list;
	}, []);

export const getGroupedSharedCollectionList = (collectionList = []) => {
	return collectionList
		.filter((c) => c.access === COLLECTION_PUBLIC)
		.map((c) => ({
			...c,
			collections:
				(c.collections &&
					c.collections.map((i) => ({
						...i,
						access: c.access || COLLECTION_PRIVATE,
						user_id: c.user_id,
						expert_id: c.expert_id,
					}))) ||
				[],
		}));
};

export const getProductsListFromCollections = (
	collectionList = [],
	selectedCollections = []
) => {
	const productsList = [];
	getCollectionList(collectionList).forEach((i) => {
		selectedCollections.includes(i?.collection_id) &&
			i.product_list &&
			productsList.push(...i.product_list);
	});
	return productsList;
};

// // to bo removed later // //
// export const getCollectionList = (collectionList = []) => {
// 	let listData = [];
// 	collectionList.map((list) => {
// 		listData = [...listData, ...(list?.collections ?? [])];
// 	});
// 	return listData;
// };

export const getCreateCollectionAPI = (isShared = false) =>
	isShared ? "/shared/collections/create/" : "/wishlist/create_collections/";
