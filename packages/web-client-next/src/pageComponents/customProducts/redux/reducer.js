import {
	FETCH_CUSTOM_PRODUCTS,
	FETCH_CUSTOM_PRODUCTS_SUCCESS,
	FETCH_CUSTOM_PRODUCTS_FAILURE,
	REMOVE_CUSTOM_PRODUCTS,
	REMOVE_CUSTOM_PRODUCTS_SUCCESS,
	REMOVE_CUSTOM_PRODUCTS_FAILURE,
	REMOVE_PRODUCTS_FROM_SAVED_CUSTOM_PRODUCTS,
	UPDATE_CUSTOM_PRODUCTS,
	UPDATE_CUSTOM_PRODUCTS_SUCCESS,
	UPDATE_CUSTOM_PRODUCTS_FAILURE,
} from "./constants";

const initialState = () => ({
	data: [],
	isLoading: false,
	isFetched: false,
});

const customProductsReducer = (state = initialState(), action = {}) => {
	const payload = action.payload;
	const newState = { ...state };

	switch (action.type) {
		case FETCH_CUSTOM_PRODUCTS:
			newState.isLoading = true;
			return newState;

		case FETCH_CUSTOM_PRODUCTS_SUCCESS:
			newState.data = payload;
			newState.isLoading = false;
			newState.isFetched = true;
			return newState;

		case FETCH_CUSTOM_PRODUCTS_FAILURE:
			newState.data = [];
			newState.isLoading = false;
			newState.isFetched = true;
			return newState;

		case REMOVE_CUSTOM_PRODUCTS:
			newState.isLoading = true;
			return newState;

		case REMOVE_CUSTOM_PRODUCTS_SUCCESS:
		case REMOVE_CUSTOM_PRODUCTS_FAILURE: {
			return {
				...newState,
				isLoading: false, // Ensure loading is stopped
			};
		}

		case REMOVE_PRODUCTS_FROM_SAVED_CUSTOM_PRODUCTS: {
			const { mfr_codes } = action;

			// Filtered data
			const filteredData = Array.isArray(newState.data.data)
				? newState.data.data.filter((p) => !mfr_codes.includes(p.mfr_code))
				: [];

			// Calculate new total_count
			const removedCount = newState.data.data.length - filteredData.length;

			const updatedState = {
				...newState,
				data: {
					...newState.data,
					data: filteredData,
					total_count: Math.max(0, newState.data.total_count - removedCount), // Ensure it doesn't go negative
				},
				isLoading: false, // Ensure loading is stopped after removing
			};

			console.log("Updated State:", updatedState);

			return updatedState;
		}


		case UPDATE_CUSTOM_PRODUCTS:
			newState.isLoading = true;
			return newState;

		case UPDATE_CUSTOM_PRODUCTS_SUCCESS:
			newState.isLoading = false;

			if (action.payload && action.payload.data) {
				const updatedProduct = action.payload.data[0];

				const productIndex = newState.data.data.findIndex(product => product.mfr_code === updatedProduct.mfr_code);

				if (productIndex !== -1) {
					const productToUpdate = newState.data.data[productIndex];

					Object.keys(updatedProduct).forEach(key => {
						if (updatedProduct[key] !== undefined) {
							productToUpdate[key] = updatedProduct[key];
						}
					});

					newState.data.data[productIndex] = productToUpdate;
				}
			}

			return newState;

		case UPDATE_CUSTOM_PRODUCTS_FAILURE:
			newState.isLoading = false;
			return newState;

		default:
			return newState;
	}
};

export default customProductsReducer;
