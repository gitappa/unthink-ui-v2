import { VTO_ICON, VTO_ICON_FAILURE, VTO_ICON_SUCCESS } from "./constants";

const initialState = {
    ButtonClick: false
};

export  const VtoIconReducer = (state = initialState, action) => {
    switch (action.type) {
        case VTO_ICON:
            return {
                ...state,
                ButtonClick: action.payload
            };

        case VTO_ICON_SUCCESS:
            return {
                ...state,
                ButtonClick: action.payload
            };

        case VTO_ICON_FAILURE:
            return {
                ...state,
                ButtonClick: action.payload
            };

        default:
            return state;
    }
};