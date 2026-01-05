import {
	OPEN_PRODUCT_DETAILS_COPY_MODAL,
	CLOSE_PRODUCT_DETAILS_COPY_MODAL,
} from "./constants";

export const openProductDetailsCopyModal = (data) => ({
	type: OPEN_PRODUCT_DETAILS_COPY_MODAL,
	data,
});

export const closeProductDetailsCopyModal = () => ({
	type: CLOSE_PRODUCT_DETAILS_COPY_MODAL,
});
