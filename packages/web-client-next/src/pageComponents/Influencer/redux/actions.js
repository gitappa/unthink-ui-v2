import {
	GET_INFLUENCER_INFO,
	GET_INFLUENCER_INFO_SUCCESS,
	GET_INFLUENCER_INFO_FAILURE,
	GET_INFLUENCER_COLLECTIONS,
	GET_INFLUENCER_COLLECTIONS_SUCCESS,
	GET_INFLUENCER_COLLECTIONS_FAILURE,
	GET_INFLUENCER_COLLECTION,
	GET_INFLUENCER_COLLECTION_SUCCESS,
	GET_INFLUENCER_COLLECTION_FAILURE,
	REPLACE_AND_UPDATE_INFLUENCER_COLLECTION_DATA,
	CLEAR_INFLUENCER_COLLECTIONS,
} from "./constants";

export const getInfluencerInfo = (payload) => ({
	type: GET_INFLUENCER_INFO,
	payload,
});

export const getInfluencerInfoSuccess = (payload) => ({
	type: GET_INFLUENCER_INFO_SUCCESS,
	payload,
});

export const getInfluencerInfoFailure = (payload) => ({
	type: GET_INFLUENCER_INFO_FAILURE,
	payload,
});

export const getInfluencerCollections = (payload) => ({
	type: GET_INFLUENCER_COLLECTIONS,
	payload,
});

export const clearInfluencerCollections = () => ({
	type: CLEAR_INFLUENCER_COLLECTIONS,
});


export const getInfluencerCollectionsSuccess = (payload, count, params) => ({
	type: GET_INFLUENCER_COLLECTIONS_SUCCESS,
	payload,
	params,
	count
});

export const getInfluencerCollectionsFailure = (payload) => ({
	type: GET_INFLUENCER_COLLECTIONS_FAILURE,
	payload,
});

// single collection
export const getInfluencerCollection = (payload) => ({
	type: GET_INFLUENCER_COLLECTION,
	payload,
});

export const getInfluencerCollectionSuccess = (payload) => ({
	type: GET_INFLUENCER_COLLECTION_SUCCESS,
	payload,
});

export const getInfluencerCollectionFailure = (payload) => ({
	type: GET_INFLUENCER_COLLECTION_FAILURE,
	payload,
});

export const replaceAndUpdateInfluencerCollectionData = (payload) => ({
	// replace and update user collection full data
	// NEW
	type: REPLACE_AND_UPDATE_INFLUENCER_COLLECTION_DATA,
	payload,
});
