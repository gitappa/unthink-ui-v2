// actions.js

import { TOGGLE_SHOW_MORE } from "./constants";

export const toggleShowMore = (show) => ({
    type: TOGGLE_SHOW_MORE,
    payload: show
});