import { combineReducers } from "redux";

import createWishlistReducer from "../createWishlist/redux/reducer";
import updateWishlistReducer from "../updateWishlist/redux/reducer";
import deleteWishlistReducer from "../deleteWishlist/redux/reducer";
import addToWishlistReducer from "../addToWishlist/redux/reducer";
import removeFromWishlistReducer from "../removeFromWishlist/redux/reducer";
import reorderWishlistReducer from "../reorderWishlist/redux/reducer";
import applyWishlistProductsFilterReducer from "../applyWishlistProductsFilter/redux/reducer";

const wishlistActionsReducer = combineReducers({
	// handle wishlist (collection) actions only like, API call
	createWishlist: createWishlistReducer,
	updateWishlist: updateWishlistReducer,
	deleteWishlist: deleteWishlistReducer,
	addToWishlist: addToWishlistReducer,
	removeFromWishlist: removeFromWishlistReducer,
	reorderWishlist: reorderWishlistReducer,
	applyWishlistProductsFilter: applyWishlistProductsFilterReducer,
});

export default wishlistActionsReducer;
