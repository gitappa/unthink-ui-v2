import { WISHLIST_TITLE } from "../../constants/codes";
import { addToCart } from "../DeliveryDetails/redux/action";
import { getwishlistUserCollection } from "../Auth/redux/actions";
import { addProductToWishlistCollection } from "../wishlistActions/addProductToWishlistCollection/redux/actions";
import { removeFromWishlist } from "../wishlistActions/removeFromWishlist/redux/actions";

export const buildSelectedProductPayload = (products = []) =>
  products.map((item) => ({
    mfr_code: item.mfr_code,
    tagged_by: item.tagged_by || [],
    name: item.name,
    image: item.image,
  }));

export const dispatchSelectedProductsAction = ({
  action,
  dispatch,
  products = [],
  selectedProducts = [],
  userId,
  source = "COLLECTION",
  collection,
  collectionId,
  onComplete,
  store_name
}) => {
  const selectedProductPayload = buildSelectedProductPayload(products);

  if (!action || !dispatch || !userId || !selectedProductPayload.length) {
    return false;
  }

  if (action === "cart") {
    dispatch(
      addToCart({
        is_display_amount: true,
        products: selectedProductPayload.map((item) => ({
          ...item,
          qty: 1,
          source,
          ...(collection ? { collection } : {}),
        })),
        product_lists: [],
        collection_name: "my cart",
        type: "system",
        user_id: userId,
        path: `my_cart_${userId}`,
      }),
    );
    onComplete?.();
    return true;
  }

  if (action === "wishlist") {
    dispatch(
      addProductToWishlistCollection({
        product_lists: selectedProductPayload,
        user_id: userId,
        store:store_name,
        successMessage: `${WISHLIST_TITLE} updated successfully`,
        errorMessage: `Failed to update ${WISHLIST_TITLE}`,
        callback: () => {
          dispatch(
            getwishlistUserCollection({
              path: `my_wishlist_${userId}`,
            }),
          );
        },
      }),
    );
    onComplete?.();
    return true;
  }

  if (action === "Delete" && collectionId) {
    dispatch(
      removeFromWishlist({
        _id: collectionId,
        products: selectedProducts,
        successMessage: "Products deleted successfully",
        errorMessage: "Failed to delete products",
        removeFromUserCollections: true,
      }),
    );
    onComplete?.();
    return true;
  }

  return false;
};
