import {
    GET_CREATOR_COLLECTIONS,
    GET_CREATOR_COLLECTIONS_SUCCESS,
    GET_CREATOR_COLLECTIONS_FAILURE,
} from "./constants";

const initialState = {
    CreatorCollections: [],
    loading: false,
    error: null,
};

const creatorCollectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CREATOR_COLLECTIONS:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_CREATOR_COLLECTIONS_SUCCESS:
            console.log("CreatorCollections", action.payload);
            return {
                ...state,
                loading: false,
                CreatorCollections: action.payload?.data ?? [],
            };
        case GET_CREATOR_COLLECTIONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default creatorCollectionReducer;
