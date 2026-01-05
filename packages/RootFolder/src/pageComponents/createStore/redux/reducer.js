import {
    GET_STORED_ATTRIBUTES_FAILURE,
    GET_STORED_ATTRIBUTES_SUCCESS,
    GET_STORED_ATTRIBUTES,
    UPDATE_ATTRIBUTE_POOL,
    UPDATE_STORED_ATTRIBUTE_POOL,
    UPDATE_STORED_ATTRIBUTE_POOL_SUCCESS,
    UPDATE_STORED_ATTRIBUTE_POOL_FAILURE,
} from "./constants";

const initialState = {
    attributePool: [],
    error: {},
    isFetching: false,
};

const attributePoolReducer = (state = initialState, action = {}) => {
    const payload = action.payload;
    const newState = { ...state };
    switch (action.type) {
        case GET_STORED_ATTRIBUTES:
            newState.isFetching = true;
            return newState;
        case GET_STORED_ATTRIBUTES_SUCCESS:
            newState.attributePool = payload;
            newState.isFetching = false;
            return newState;
        case GET_STORED_ATTRIBUTES_FAILURE:
            newState.isFetching = false;
            return newState;
        case UPDATE_ATTRIBUTE_POOL:
            console.log("Updating attribute pool with new data:", payload);
            newState.attributePool.data = payload;
            return newState;
        case UPDATE_STORED_ATTRIBUTE_POOL:
            newState.isFetching = true;
            return newState;
        case UPDATE_STORED_ATTRIBUTE_POOL_SUCCESS:
            newState.attributePool = payload;
            newState.isFetching = false;
            return newState;
        case UPDATE_STORED_ATTRIBUTE_POOL_FAILURE:
            newState.isFetching = false;
            return newState;
        default:
            return newState;
    }
};


export default attributePoolReducer;
