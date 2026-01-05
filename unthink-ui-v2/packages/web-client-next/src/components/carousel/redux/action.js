import { RESET_CAROUSEL_ACTION, SET_CAROUSEL_ACTION } from "./constants";

export const setCollectionCarouselAction = (payload) => ({
	type: SET_CAROUSEL_ACTION,
	payload,
});

export const resetCollectionCarouselAction = () => ({
	type: RESET_CAROUSEL_ACTION,
});
