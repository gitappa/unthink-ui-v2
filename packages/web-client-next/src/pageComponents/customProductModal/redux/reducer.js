import { CLOSE_PRODUCT_MODAL, OPEN_PRODUCT_MODAL } from "./constants";

const getInitialState = () => ({
	data: {},
	isOpen: false,
});

const productModalReducer = (state = getInitialState(), action = {}) => {
	const newState = { ...state };
	const { payload = {} } = action;

	switch (action.type) {
		case OPEN_PRODUCT_MODAL:
			newState.data = payload;
			newState.collectionId = action.collectionId;
			newState.allowEdit = action.allowEdit;
			newState.isOpen = true;

			return newState;
		case CLOSE_PRODUCT_MODAL:
			return getInitialState();

		default:
			return state;
	}
};

export default productModalReducer;
