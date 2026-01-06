import { OPEN_PRODUCT_MODAL, CLOSE_PRODUCT_MODAL } from "./constants";

export const openProductModal = ({
	payload,
	collectionId,
	allowEdit = false,
}) => ({
	type: OPEN_PRODUCT_MODAL,
	payload,
	collectionId,
	allowEdit,
});

export const closeProductModal = () => ({
	type: CLOSE_PRODUCT_MODAL,
});
