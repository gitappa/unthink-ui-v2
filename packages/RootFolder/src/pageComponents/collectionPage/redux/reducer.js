// reducer.js

import { TOGGLE_SHOW_MORE } from "./constants";

const initialState = {
    isShowMoreActive: false,
};

const showMoreReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_SHOW_MORE:
            return {
                ...state,
                isShowMoreActive: action.payload,
            };
        default:
            return state;
    }
};

export default showMoreReducer;
