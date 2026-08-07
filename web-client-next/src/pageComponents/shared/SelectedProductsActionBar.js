import React from "react";
import { Checkbox, Dropdown } from "antd";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  DownOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

export const SELECTED_PRODUCTS_ACTIONS = {
  COLLECTION: "collection",
  WISHLIST: "wishlist",
  CART: "cart",
  DELETE: "Delete",
  SAVE: "save",
  SHARE: "share",
};

const defaultActionConfig = {
  [SELECTED_PRODUCTS_ACTIONS.COLLECTION]: {
    key: SELECTED_PRODUCTS_ACTIONS.COLLECTION,
    icon: <AppstoreAddOutlined />,
    label: "Add to collection",
  },
  [SELECTED_PRODUCTS_ACTIONS.WISHLIST]: {
    key: SELECTED_PRODUCTS_ACTIONS.WISHLIST,
    icon: <HeartOutlined />,
    label: "Add to Wishlist",
  },
  [SELECTED_PRODUCTS_ACTIONS.CART]: {
    key: SELECTED_PRODUCTS_ACTIONS.CART,
    icon: <ShoppingCartOutlined />,
    label: "Add to cart",
  },
  [SELECTED_PRODUCTS_ACTIONS.DELETE]: {
    key: SELECTED_PRODUCTS_ACTIONS.DELETE,
    icon: <DeleteOutlined />,
    label: "Delete",
  },
  [SELECTED_PRODUCTS_ACTIONS.SAVE]: {
    key: SELECTED_PRODUCTS_ACTIONS.SAVE,
    label: "Save",
  },
  [SELECTED_PRODUCTS_ACTIONS.SHARE]: {
    key: SELECTED_PRODUCTS_ACTIONS.SHARE,
    label: "Share",
  },
};

export const getSelectedProductsActionItems = (actions = []) =>
  actions
    .map((action) =>
      typeof action === "string"
        ? defaultActionConfig[action]
        : {
            ...defaultActionConfig[action.key],
            ...action,
          },
    )
    .filter(Boolean);

const renderButtonContent = (item) => (
  <>
    {item.icon}
    <span className={item.icon ? "ml-2" : ""}>{item.buttonLabel || item.label}</span>
  </>
);

const SelectedProductsActionBar = ({
  actions = [],
  selectedCount = 0,
  isAllSelected = false,
  isIndeterminate = false,
  isSelectMode = false,
  variant = "dropdown",
  onSelectAllChange,
  onStartSelect,
  onCancel,
  onAction,
  labels = {},
  classNames = {},
}) => {
  const items = getSelectedProductsActionItems(actions);
  const isActionDisabled = selectedCount === 0;

  if (!isSelectMode) {
    return (
      <button
        type="button"
        className={classNames.selectButton}
        role={classNames.selectButtonRole}
        onClick={onStartSelect}
        title={labels.selectTitle || "Click and select multiple products"}
      >
        {labels.select || "Select"}
      </button>
    );
  }

  const checkbox = (
    <Checkbox
      className={classNames.checkbox}
      indeterminate={isIndeterminate}
      onClick={(e) => e.stopPropagation()}
      onChange={onSelectAllChange}
      checked={isAllSelected}
    >
      {selectedCount} {labels.selected || "Selected"}
    </Checkbox>
  );

  if (variant === "buttons") {
    return (
      <>
        <button
          type="button"
          className={classNames.checkboxButton}
          onClick={onSelectAllChange}
          title={labels.selectAllTitle || "Select all products"}
        >
          {checkbox}
        </button>
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={item.className || classNames.actionButton}
            onClick={(e) => onAction?.(item, e)}
            disabled={isActionDisabled}
            title={item.title}
          >
            {renderButtonContent(item)}
          </button>
        ))}
        <button type="button" onClick={onCancel} className={classNames.cancelButton}>
          {labels.cancel || "Cancel"}
        </button>
      </>
    );
  }

  return (
    <div className={classNames.wrapper}>
      <div className={classNames.checkboxWrapper}>{checkbox}</div>
      <Dropdown
        menu={{
          items,
          onClick: ({ key }) => onAction?.({ key }),
        }}
        disabled={isActionDisabled}
        trigger={["click"]}
      >
        <button
          type="button"
          className={`${isActionDisabled ? classNames.dropdownDisabled : classNames.dropdownActive} ${classNames.dropdownButton}`}
          title={labels.actionsTitle || "Click to add selected products"}
          disabled={isActionDisabled}
        >
          {labels.actions || "Actions"} <DownOutlined className={classNames.dropdownIcon} />
        </button>
      </Dropdown>
      <p onClick={onCancel} className={classNames.cancelText} role="button">
        {labels.cancel || "Cancel"}
      </p>
    </div>
  );
};

export default SelectedProductsActionBar;
