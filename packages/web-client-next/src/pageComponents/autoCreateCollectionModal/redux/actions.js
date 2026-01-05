import {
	CLOSE_AUTO_CREATE_COLLECTION_MODAL,
	OPEN_AUTO_CREATE_COLLECTION_MODAL,
} from "./constants";

export const openAutoCreateCollectionModal = (payload) => ({
	type: OPEN_AUTO_CREATE_COLLECTION_MODAL,
	payload,
});

export const closeAutoCreateCollectionModal = () => ({
	type: CLOSE_AUTO_CREATE_COLLECTION_MODAL,
});
