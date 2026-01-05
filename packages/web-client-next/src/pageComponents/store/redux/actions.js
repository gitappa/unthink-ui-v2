import { GET_CREATOR_STORE_DATA, GET_STORE_DATA, SET_STORE_DATA } from "./constants";

export const getStoreData = () => ({
	type: GET_STORE_DATA,
});

export const getCreatoStoreData = (payload) => ({
	type: GET_CREATOR_STORE_DATA,
	payload
});

export const setStoreData = (payload) => ({
	type: SET_STORE_DATA,
	payload,
});
