import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";
import { openProductModal } from "../../pageComponents/customProductModal/redux/actions";
import { openProductDetailsCopyModal } from "../../pageComponents/productDetailsCopyModal/redux/actions";
import { getStaticImageSrc } from "../../helper/product/productCardHelpers";
import ProductRemoveAction from "./ProductRemoveAction";
import more from "../singleCollection/images/Card/more.svg";
import styles from "../singleCollection/ProductCard.module.css";

const ProductMenuButton = ({
  product,
  collectionId,
  showCustomProductsMenu,
  size,
  menuIcon,
  setMenuIcon,
  menuRef,
  isDefaultWidget,
  showRemoveIcon,
  removeFromWishlistClick,
  enableCopyFeature,
  isCustomProductsPage,
  allowEdit,
  onEditClick,
}) => {
  const dispatch = useDispatch();

  const handleOpenProductModal = useCallback(
    (allowEdit) => {
      dispatch(
        openProductModal({
          payload: product,
          collectionId,
          allowEdit,
        }),
      );
    },
    [dispatch, product, collectionId],
  );

  const handleEditClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (onEditClick) {
        onEditClick();
      } else {
        handleOpenProductModal(true);
      }
    },
    [onEditClick, handleOpenProductModal],
  );

  const handleCopyClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      product && dispatch(openProductDetailsCopyModal(product));
    },
    [dispatch, product],
  );

  if (!showCustomProductsMenu) {
    return null;
  }

  return (
    <>
      <img
        src={getStaticImageSrc(more)}
        alt="More options"
        height={32}
        width={32}
        onClick={(e) => {
          setMenuIcon(true);
          e.stopPropagation();
        }}
        className={
          styles[
            size === "small" ? "product-menu-dropdown-small" : "product-menu-icon"
          ]
        }
      />
      {menuIcon && (
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          className={
            styles[
              size === "small"
                ? "product-menu-dropdown-mini"
                : "product-menu-dropdown"
            ]
          }
        >
          <ProductRemoveAction
            isVisible={isDefaultWidget && showRemoveIcon}
            size={size}
            onRemove={removeFromWishlistClick}
            onAfterRemove={() => setMenuIcon(false)}
            isMenuItem
          />
          {enableCopyFeature && (
            <div
              className={styles["product-menu-item"]}
              onClick={(e) => {
                handleCopyClick(e);
                setMenuIcon(false);
              }}
            >
              <div
                className={`${styles["menu-item-circle"]} ${
                  size === "small"
                    ? styles["icon-circle-small"]
                    : styles["icon-circle-medium"]
                }`}
              >
                <LuCopy className={styles.copyIcon} />
              </div>
              <p className={styles["text-gray"]}>Copy</p>
            </div>
          )}
          {isCustomProductsPage && allowEdit && (
            <div
              className={styles["product-menu-item"]}
              onClick={(e) => {
                handleEditClick(e);
                setMenuIcon(false);
              }}
            >
              <p
                className={`${styles["product-cart-button"]} ${styles["product-cart-icon2"]} ${size === "small" ? styles["product-cart-icon-small"] : styles["product-cart-icon-lg"]}`}
                style={{ backgroundColor: "#f8f6f4" }}
              >
                <FiEdit
                  style={{
                    color: "#9a9b9b",
                    backgroundColor: "#f8f6f4",
                  }}
                  className={styles["product-cart-icon-smalls"]}
                />
              </p>
              <p className={styles["text-gray"]}>Edit</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductMenuButton;
