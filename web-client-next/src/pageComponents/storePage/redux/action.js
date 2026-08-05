import { FETCH_MY_TRYONS_COLLECTION, FETCH_MY_WISHLIST_COLLECTION, Loader_PDP } from "./constant";


export function PDPloader (payload){
    return{
        type:Loader_PDP,
        payload:payload,
    }
}

export const fetchMyWishlistCollection = (payload) => ({
  type: FETCH_MY_WISHLIST_COLLECTION,
  payload,
});

export const fetchMyTryonsCollection = (payload) => ({
  type: FETCH_MY_TRYONS_COLLECTION,
  payload,
});

