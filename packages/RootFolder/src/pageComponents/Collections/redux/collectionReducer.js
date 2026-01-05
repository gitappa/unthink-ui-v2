import {
	SET_COLLECTION_DETAILS_FETCHING,
	SET_COLLECTION_DETAILS,
	SET_SELECTED_COLLECTION,
	SET_SHOW_GALLERY,
	UPDATE_RECENTLY_VIEWED_LIST,
	SET_COLLECTION_PRODUCT_CODES,
	SET_COLLECTION_PRODUCTS,
	SET_COLLECTION_PRODUCTS_FETCHING,
	SET_COLLECTION_TITLE,
	SET_SHOW_COLLECTION,
	SET_CREATING_COLLECTION,
	SET_SELECTED_COLLECTION_ID,
	SET_PRODUCT_TO_SAVE_AFTER_COLLECTION_CREATED,
	SET_SHOW_COLLECTION_MODAL,
	SET_ADDING_COLLECTION,
	ADD_MFRCODE_TO_COLLECTIONS,
	SET_COLLECTION_FOR_EDIT,
} from "./constants";

const initialState = {
	collectionList: [],
	collectionListUserId: "",
	isFetching: false,
	showGallery: false,
	showCollectionModal: false,
	selectedCollection: "",
	selectedCollectionId: "",
	recentlyViewedList: [],
	productCodes: [],
	products: [],
	title: "",
	isProductsFetching: false,
	showCreateCollection: false,
	isSharedCreateCollection: false,
	isCreatingCollection: false,
	productToSaveAfterCollectionCreated: "",
	isAddingCollection: false,
	selectedCollectionForEdit: {},
};

const collectionsReducer = (state = initialState, action = {}) => {
	const newState = { ...state };
	const payload = action?.payload;
	switch (action.type) {
		case ADD_MFRCODE_TO_COLLECTIONS:
			const collectionList = newState.collectionList;
			const newData = collectionList.data.map((data) => {
				const collections = data.collections.map((collection) => {
					if (collection.collection_id === payload.collection_id) {
						if (payload.isRemove) {
							collection.product_list = collection.product_list.filter(
								(product) => product.mfr_code !== payload.mfr_code
							);
						} else {
							collection.product_list.push({ mfr_code: payload.mfr_code });
						}
					}
					return collection;
				});
				data.collections = collections;
				return data;
			});
			collectionList.data = newData;
			newState.collectionList = collectionList;
			return newState;
		case SET_ADDING_COLLECTION:
			newState.isAddingCollection = payload ?? false;
			return newState;
		case SET_SHOW_COLLECTION_MODAL:
			newState.showCollectionModal = payload ?? false;
			return newState;
		case SET_PRODUCT_TO_SAVE_AFTER_COLLECTION_CREATED:
			newState.productToSaveAfterCollectionCreated = payload;
			return newState;
		case SET_SELECTED_COLLECTION_ID:
			newState.selectedCollectionId = payload ?? "";
			return newState;
		case SET_CREATING_COLLECTION:
			newState.isCreatingCollection = payload ?? false;
			return newState;
		case SET_COLLECTION_DETAILS:
			newState.collectionList = payload ?? [];
			newState.collectionListUserId = action?.collectionListUserId || "";
			return newState;
		case SET_COLLECTION_DETAILS_FETCHING:
			newState.isFetching = payload ?? false;
			return newState;
		case SET_SELECTED_COLLECTION:
			newState.selectedCollection = payload ?? "";
			return newState;
		case SET_SHOW_GALLERY:
			newState.showGallery = payload ?? false;
			return newState;
		case UPDATE_RECENTLY_VIEWED_LIST:
			newState.recentlyViewedList = payload ?? [];
			return newState;
		case SET_COLLECTION_PRODUCT_CODES:
			newState.productCodes = payload ?? [];
			return newState;
		case SET_COLLECTION_PRODUCTS:
			newState.products = payload ?? [];
			return newState;
		case SET_COLLECTION_PRODUCTS_FETCHING:
			newState.isProductsFetching = payload ?? false;
			return newState;
		case SET_COLLECTION_TITLE:
			newState.title = payload ?? "";
			return newState;
		case SET_SHOW_COLLECTION:
			newState.showCreateCollection = !!payload;
			if (newState.showCreateCollection)
				newState.isSharedCreateCollection = !!action.isSharedCreateCollection;
			else newState.isSharedCreateCollection = false;
			return newState;
		case SET_COLLECTION_FOR_EDIT:
			newState.selectedCollectionForEdit = payload;
			return newState;

		default:
			return state;
	}
};
export default collectionsReducer;
