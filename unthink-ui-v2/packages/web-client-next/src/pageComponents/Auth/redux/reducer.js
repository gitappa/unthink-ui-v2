import { combineReducers } from "redux";

import customProductsReducer from "../../customProducts/redux/reducer";
import {
	GET_SINGLE_USER_COLLECTION,
	GET_SINGLE_USER_COLLECTION_FAILURE,
	GET_SINGLE_USER_COLLECTION_SUCCESS,
	GET_USER_COLLECTION,
	GET_USER_COLLECTIONS,
	GET_USER_COLLECTIONS_FAILURE,
	GET_USER_COLLECTIONS_RESET,
	GET_USER_COLLECTIONS_SUCCESS,
	GET_USER_COLLECTION_FAILURE,
	GET_USER_COLLECTION_SUCCESS,
	GET_USER_INFO,
	GET_USER_INFO_FAILURE,
	GET_USER_INFO_SUCCESS,
	IS_SAVING_USER_INFO,
	REMOVE_COLLECTION_FROM_USER_COLLECTIONS,
	REMOVE_PRODUCTS_FROM_USER_COLLECTIONS,
	REPLACE_AND_UPDATE_USER_COLLECTION_DATA,
	REPLACE_SORTED_USER_COLLECTIONS,
	SET_STARRED_USER_COLLECTIONS,
	SET_UPDATED_STATUS_USER_COLLECTIONS,
} from "./constants";

const userCollectionsInitialState = {
	data: [],
	isFetching: false,
};

const userInitialState = {
	data: {},
	error: {},
	isFetching: false,
	isSavingUserInfo: false,
	collections: {
		...userCollectionsInitialState,
		data: [...userCollectionsInitialState.data],
		count: "",
	},
	singleCollections: {
		data: [],
	},
	enablePlist: false,
	userNotFound: false,
	isUserLogin: false,
};

const userReducer = (state = userInitialState, action = {}) => {
	const payload = action.payload;
	const newState = { ...state };
	// console.log("authReduceraction", newState.data);
	
	switch (action.type) {
		case GET_USER_INFO:
			newState.isFetching = true;
			newState.data = {};
			return newState;
		case GET_USER_INFO_SUCCESS:
			newState.data = payload;
			newState.isFetching = false;
			newState.enablePlist = !!payload.user_name; // enable create plist (blog/auto collection) only for the users who has the username
			newState.userNotFound = !payload.emailId; // using this to check if user is guest user
			newState.isUserLogin = !!payload.emailId;
			// newState.isUserLogin = !!payload.emailId && !payload.trial_user; // removed trial user check // allowing try for free users all actions

			// reset collections
			if (action.options.resetCollections) newState.collections.data = [];
			return newState;
		case GET_USER_INFO_FAILURE:
			newState.error = payload;
			newState.isFetching = false;
			newState.userNotFound = false;
			newState.isUserLogin = false;
			return newState;
		case IS_SAVING_USER_INFO:
			newState.isSavingUserInfo = payload ?? false;
			return newState;

		case GET_USER_COLLECTIONS:
			newState.collections.isFetching = true;
			return newState;
		case GET_USER_COLLECTIONS_SUCCESS:
			newState.collections.data = payload;
			newState.collections.params = action.params;
			newState.collections.count = action.count;
			newState.collections.isFetching = false;
			return newState;
		case GET_USER_COLLECTIONS_FAILURE:
			newState.collections.isFetching = false;
			return newState;
		case GET_USER_COLLECTIONS_RESET:
			newState.collections = {
				...userCollectionsInitialState,
				data: [...userCollectionsInitialState.data],
			};
			return newState;

		case GET_USER_COLLECTION:
			newState.collections.isFetching = true;
			return newState;
		case GET_USER_COLLECTION_SUCCESS:
			const { _id } = payload;
			if (_id) {
				const collIndex = newState.collections.data.findIndex(
					(i) => i._id === _id
				);

				if (collIndex !== -1) {
					newState.collections.data[collIndex] = payload;
					newState.collections.data = newState.collections.data.slice(); // copy array with new reference // to take effect wherever it is being used
				} else {
					newState.collections.data.push(payload);
				}
			}

			newState.collections.isFetching = false;
			return newState;
		case GET_USER_COLLECTION_FAILURE:
			newState.collections.isFetching = false;
			return newState;

		// SINGLE COLLECTION ACTIONS

		case GET_SINGLE_USER_COLLECTION:
			newState.collections.isFetching = true;
			return newState;

		case GET_SINGLE_USER_COLLECTION_SUCCESS:
			newState.collections.isFetching = false;
			newState.singleCollections.data = payload;
			return newState;

		case GET_SINGLE_USER_COLLECTION_FAILURE:
			newState.collections.isFetching = false;
			return newState;

		case REMOVE_PRODUCTS_FROM_USER_COLLECTIONS: {
			// NEW
			const { _id, products } = action;
			const collection = newState.collections.data.find((cl) => cl._id === _id);

			if (collection && products) {
				collection.product_lists = collection.product_lists.filter(
					(p) => !products.includes(p.mfr_code)
				);
			}

			return newState;
		}

		case SET_STARRED_USER_COLLECTIONS: {
			// NEW
			const { collections, starred } = action; // collections format = [{_id:'_id'},{_id:'_id'}]
			const collectionsList = collections.map((cl) => cl._id);

			newState.collections.data = newState.collections.data.map((cl) => {
				if (collectionsList.includes(cl._id)) {
					return {
						...cl,
						starred,
					};
				}

				return cl;
			});

			return newState;
		}

		case SET_UPDATED_STATUS_USER_COLLECTIONS: {
			// set current auth user's collection status in redux state
			// NEW
			const { _id, status } = action;
			const collection = newState.collections.data.find((cl) => cl._id === _id);

			if (collection && status) {
				collection.status = status;
			}

			return newState;
		}

		case REPLACE_SORTED_USER_COLLECTIONS: {
			// replace sorted collections with current auth user's collections
			// NEW
			const { collections } = action;
			if (collections) {
				newState.collections.data = [...collections];
			}

			return newState;
		}

		case REPLACE_AND_UPDATE_USER_COLLECTION_DATA: {
			// replace and update user collection full data
			// NEW
			if (payload._id) {
				const ind = newState.collections.data.findIndex(
					(cl) => cl._id === payload._id
				);

				if (ind !== -1) {
					newState.collections.data[ind] = { ...payload };
					newState.collections.data = newState.collections.data.slice(); // copy array with new reference // to take effect wherever it is being used
				}
			}

			return newState;
		}

		case REMOVE_COLLECTION_FROM_USER_COLLECTIONS: {
			if (payload._id) {
				newState.collections.data = newState.collections.data.filter((cl) => {
					return cl._id !== payload._id;
				});
			}
			return newState;
		}

		default:
			return newState;
	}
};

const authReducer = combineReducers({
	user: userReducer,
	customProducts: customProductsReducer, // handle custom products actions only like, API call
});

export default authReducer;
