import { FETCH_PRODUCT_DETAILS, FETCH_PRODUCT_DETAILS_FAILURE, FETCH_PRODUCT_DETAILS_SUCCESS, RESET_PRODUCT_DETAILS } from "./constants";


const initialState = {
  data: [],
  productDetails: {},
  image: "",
  isLoading: false,
  isFetched: false,
};
const fetchProductReducer = (state = initialState, action) => {
  switch (action.type) {

    case FETCH_PRODUCT_DETAILS:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_PRODUCT_DETAILS_SUCCESS: {
      const rawImage = action.payload?.image || "";
      const cleanedImage =
        typeof rawImage === "string" ? rawImage.replace(/"/g, "") : "";

      return {
        ...state,
        productDetails: action.payload,
        image: cleanedImage, // ✅ stored here
        isLoading: false,
        isFetched: true,
      };
    }

    case FETCH_PRODUCT_DETAILS_FAILURE:
      return {
        ...state,
        productDetails: {},
        image: "", // ✅ reset
        isLoading: false,
        isFetched: true,
      };
    case RESET_PRODUCT_DETAILS:
      return {
        ...initialState
      };

    default:
      return state;
  }
}
export default fetchProductReducer;
