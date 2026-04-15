import {
    GET_STORED_ATTRIBUTES,
    UPDATE_ATTRIBUTE_POOL,
    GET_STORED_ATTRIBUTES_FAILURE,
    GET_STORED_ATTRIBUTES_SUCCESS,
    UPDATE_STORED_ATTRIBUTE_POOL,
    UPDATE_STORED_ATTRIBUTE_POOL_SUCCESS,
    UPDATE_STORED_ATTRIBUTE_POOL_FAILURE,
} from "./constants";

export const getStoredAttributes = (payload) => ({
    type: GET_STORED_ATTRIBUTES,
    payload,
});

export const getStoredAttributeSuccess = (attributes) => ({
    type: GET_STORED_ATTRIBUTES_SUCCESS,
    payload: attributes,
});

export const getStoredAttributesFailure = () => ({
    type: GET_STORED_ATTRIBUTES_FAILURE,
});

export const updateAttributePool = (updatedPool) => ({
    type: UPDATE_ATTRIBUTE_POOL,
    payload: updatedPool,
});

export const updateStoredAttributePool = (updatedPool) => ({
    type: UPDATE_STORED_ATTRIBUTE_POOL,
    payload: updatedPool,
});

export const updateStoredAttributePoolSuccess = (updatedPool) => ({
    type: UPDATE_STORED_ATTRIBUTE_POOL_SUCCESS,
    payload: updatedPool,
});

export const updateStoredAttributePoolFailure = (updatedPool) => ({
    type: UPDATE_STORED_ATTRIBUTE_POOL_FAILURE,
    payload: updatedPool,
});
