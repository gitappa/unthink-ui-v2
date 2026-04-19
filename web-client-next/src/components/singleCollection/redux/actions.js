import { VTO_ICON, VTO_ICON_FAILURE, VTO_ICON_SUCCESS } from "./constants";

export const vtoIconState = (payload)=>({
    type:VTO_ICON,
    payload
})

export const vtoIconStateSuccess =(payload) =>({
    type:VTO_ICON_SUCCESS,
    payload
})
export const vtoIconStateFailure = (payload) =>({
    type:VTO_ICON_FAILURE,
    payload
})