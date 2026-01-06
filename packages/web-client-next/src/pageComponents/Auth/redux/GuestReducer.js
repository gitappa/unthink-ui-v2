// reducer.js

import { GUEST_POPUP_SHOW } from "./constants";

const initialState = {
    isGuestPopUpShow: false,
};

const GuestPopUpReducer = (state = initialState, action) => {
    switch (action.type) {
        case GUEST_POPUP_SHOW:
            return {
                ...state,
                isGuestPopUpShow: action.payload,
            };
        default:
            return state;
    }
};

export default GuestPopUpReducer;
