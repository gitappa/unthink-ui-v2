import React from "react";
import { useDispatch } from "react-redux";
import { FiShoppingCart } from "react-icons/fi";
import { FaCartArrowDown } from "react-icons/fa";
import { addToCart } from "../../pageComponents/DeliveryDetails/redux/action";
import { getTTid } from "../../helper/getTrackerInfo";
import { getNormalizedCartQty } from "../../helper/product/productCardHelpers";

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
  authUserId,
  getKioskLogin,
  hasKioskAccess = false,
  enableKioskGuestPopup = false,
  onGuestRequired,
  source,
  collection,
  eventId,
  cartCollection,
  onGoToCart,
  isOutOfStock = false,
  disabled,
  className,
  iconClassName,
  showIcon = false,
  style,
  children,  
  type = "button",
}) => {
  const dispatch = useDispatch();
  const isDisabled = disabled ?? (!product?.price && !product?.listprice);
  const normalizedQty = getNormalizedCartQty(qty);

  const handleAddToCart = (event) => {
    event?.stopPropagation?.();
    event?.preventDefault?.();

    if (isOutOfStock) return;

    if (cartCollection && onGoToCart) {
      onGoToCart(event);
      return;
    }

    if (!product?.mfr_code) return;

    const kioskLogin = getKioskLogin?.();
    const cartUserId = kioskLogin?.user_id || authUserId || getTTid();

    if (
      (hasKioskAccess || enableKioskGuestPopup) &&
      !kioskLogin?.user_id &&
      onGuestRequired
    ) {
      onGuestRequired({
        event,
        product,
        qty: normalizedQty,
      });
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
      {children ||
        (isOutOfStock
          ? "Out of Stock"
          : cartCollection
            ? " Go to Cart "
            : " Add to Cart")}
    </button>
  );
};

export default AddToCartButton;
