import React from "react";
import { RxCross2 } from "react-icons/rx";
import styles from "../singleCollection/ProductCard.module.css";

const getRemoveIconCircleSizeClass = (size) =>
  size === "small" ? styles["icon-circle-small"] : styles["icon-circle-medium"];

const ProductRemoveAction = ({
  isVisible,
  size,
  onRemove,
  onAfterRemove,
  isMenuItem = false,
  hideOnMedium = false,
}) => {
  if (!isVisible) {
    return null;
  }

  const sizeClassName =
    hideOnMedium && size !== "small"
      ? "hidden"
      : getRemoveIconCircleSizeClass(size);

  const removeIcon = (
    <p className={`${styles["remove-icon-circle"]} ${sizeClassName}`}>
      <RxCross2 />
    </p>
  );

  if (isMenuItem) {
    return (
      <div className={`    gap-${size === "small" ? "2" : "3"}`}>
        <div
          className={`${styles["remove-icon-wrapper"]} ${styles["product-menu-item"]}`}
          onClick={(e) => {
            onRemove(e);
            onAfterRemove?.();
          }}
        >
          {removeIcon}
          <p className={styles["text-gray"]}>Remove</p>
        </div>
      </div>
    );
  }

  return (
    <div className={` ${styles["remove-icon"]}`} onClick={onRemove}>
      {removeIcon}
    </div>
  );
};

export default ProductRemoveAction;
