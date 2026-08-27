import React from "react";
import { useDispatch } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { current_store_name } from "../../../constants/config";
import { WISHLIST_TITLE } from "../../../constants/codes";
import { removeFromWishlist } from "../../wishlistActions/removeFromWishlist/redux/actions";
import { getTTid } from "../../../helper/getTrackerInfo";

const DEFAULT_BUTTON_CLASS =
  "box-border flex h-8 w-8 items-center justify-center rounded-full bg-white p-0 shadow-[0px_2px_12px_rgba(0,0,0,0.1)] min-[1000px]:transition-all min-[1000px]:duration-200 min-[1000px]:ease-in-out min-[1000px]:hover:bg-[#f5f5f5] min-[1000px]:hover:shadow-[0px_4px_16px_rgba(0,0,0,0.15)] max-[1024px]:p-1";

const WishlistHeartButton = ({
  isActive = false,
  onClick,
  onAdd,
  productMfrCode,
  userId,
  store = current_store_name,
  containerClassName = "",
  buttonClassName = DEFAULT_BUTTON_CLASS,
  activeIconClassName = "text-red-500",
  inactiveIconClassName = "",
  title = "Add to wishlist",
}) => {
  const dispatch = useDispatch();

  const handleRemove = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!productMfrCode) return;

    dispatch(
      removeFromWishlist({
        products: [productMfrCode],
        collection_name: "my wishlist",
        type: "system",
        successMessage: `${WISHLIST_TITLE} has been successfully deleted`,
        errorMessage: `Failed to delete ${WISHLIST_TITLE}, try after sometime`,
        removeCollectionFromUserCollections: true,
        wishlistCallBack: true,
        user_id: userId || getTTid(),
        store,
        clearSelectedCollectionData: true,
      }),
    );
  };

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
      return;
    }

    if (isActive) {
      handleRemove(event);
      return;
    }

    onAdd?.(event);
  };

  const button = (
    <button
      aria-label={title}
      className={buttonClassName}
      onClick={handleClick}
      title={title}
      type="button"
    >
      {isActive ? (
        <FaHeart className={activeIconClassName} />
      ) : (
        <FaRegHeart className={inactiveIconClassName} />
      )}
    </button>
  );

  if (!containerClassName) return button;

  return <div className={containerClassName}>{button}</div>;
};

export default WishlistHeartButton;
