import {
	CLOSE_PRODUCT_DETAILS_COPY_MODAL,
	OPEN_PRODUCT_DETAILS_COPY_MODAL,
} from "./constants";

const initialState = {
	isModalOpen: false,
	productDetails: {},
};

const productDetailsCopyModalReducer = (state = initialState, action = {}) => {
	const newState = { ...state };
	switch (action.type) {
		case OPEN_PRODUCT_DETAILS_COPY_MODAL:
			newState.isModalOpen = true;
			newState.productDetails = action.data;
			return newState;
		case CLOSE_PRODUCT_DETAILS_COPY_MODAL:
			newState.isModalOpen = false;
			newState.productDetails = {};
			return newState;

		default:
			return state;
	}
};

export default productDetailsCopyModalReducer;
