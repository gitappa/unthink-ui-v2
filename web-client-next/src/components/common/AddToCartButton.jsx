import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiShoppingCart } from "react-icons/fi";
import { FaCartArrowDown } from "react-icons/fa";
import { addToCart } from "../../pageComponents/DeliveryDetails/redux/action";
import { GuestPopUpShow } from "../../pageComponents/Auth/redux/actions";
import { getTTid } from "../../helper/getTrackerInfo";
import { getNormalizedCartQty } from "../../helper/product/productCardHelpers";
import { useRouter } from "next/router";

export const addProductToCart = ({
  dispatch,
  product,
  qty = 1,
  userId,
  source,
  collection,
  eventId,
}) => {
  if (!product?.mfr_code || !dispatch) return;

  const cartUserId = userId || getTTid();
  const cartProduct = {
    mfr_code: product.mfr_code,
    tagged_by: product?.tagged_by || [],
    qty: getNormalizedCartQty(qty),
  };

  if (source) cartProduct.source = source;
  if (collection) cartProduct.collection = collection;
  if (eventId) cartProduct.event_id = eventId;

  dispatch(
    addToCart({
      is_display_amount: true,
      products: [cartProduct],
      product_lists: [],
      collection_name: "my cart",
      type: "system",
      user_id: cartUserId,
      path: `my_cart_${cartUserId}`,
    }),
  );
};

const AddToCartButton = ({
  product,
  qty = 1,
  kiosk = {},
  authUserId,
  onGuestPopupOpen,
  source,
  collection,
  eventId,
  isOutOfStock = false,
  disabled,
  className,
  iconClassName,
  showIcon = false,
  style,
  type = "button",
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isDisabled = disabled ?? (!product?.price && !product?.listprice);
  const normalizedQty = getNormalizedCartQty(qty);
  const { collection: cartData } = useSelector((state) => state.cart);

  const cartCollection = cartData?.product_lists
    ?.map((arr) => arr?.mfr_code)
    .find((arr) => arr === product?.mfr_code);
  const {
    hasAccess: hasKioskAccess,
    getLogin: getKioskLogin,
    enableGuestPopup: enableKioskGuestPopup,
  } = kiosk;
  const handleGoToCart = (event) => {
    event.stopPropagation();
    event.preventDefault();
    router.push("/cart");
  };
  const handleAddToCart = (event) => {
    event?.stopPropagation?.();
    event?.preventDefault?.();

    if (isOutOfStock) return;

    if (cartCollection) {
      handleGoToCart(event);
      return;
    }

    if (!product?.mfr_code) return;

    const kioskLogin = getKioskLogin?.();
    const cartUserId = kioskLogin?.user_id || authUserId || getTTid();

    if ((hasKioskAccess || enableKioskGuestPopup) && !kioskLogin?.user_id) {
      onGuestPopupOpen?.({
        type: "cart",
        product: {
          mfr_code: product.mfr_code,
          tagged_by: product.tagged_by || [],
        },
        qty: normalizedQty,
      });
      dispatch(GuestPopUpShow(true));
      return;
    }

    addProductToCart({
      dispatch,
      product,
      qty: normalizedQty,
      userId: cartUserId,
      source,
      collection,
      eventId,
    });
  };

  const icon = cartCollection ? (
    <FaCartArrowDown className={isOutOfStock ? "hidden" : iconClassName} />
  ) : (
    <FiShoppingCart className={isOutOfStock ? "hidden" : iconClassName} />
  );

  return (
    <button
      type={type}
      className={className}
      onClick={handleAddToCart}
      disabled={isDisabled}
      style={style}
    >
      {showIcon ? icon : null}
      { isOutOfStock
          ? "Out of Stock"
          : cartCollection
            ? " Go to Cart "
            : " Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
