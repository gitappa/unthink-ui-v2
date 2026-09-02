import { enable_view_similar_products } from "../../constants/config";

const PRODUCT_BUY_BUTTON_CLASS =
  "box-border flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-px py-[5px] text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:!bg-[var(--color-secondary)] md:px-1.5 md:py-3 md:text-base";

const PRODUCT_BUY_BUTTON_SMALL_CLASS =
  "box-border flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-[5px] py-2 text-xs font-semibold text-white transition-all duration-300 ease-in-out hover:bg-[var(--color-secondary)]";

const KIOSK_BUTTON_CLASS =
  "group box-border flex cursor-pointer items-center justify-center gap-2 rounded-xl px-px py-[5px] text-sm button-kiosk-card text-black hover:bg-kiosk-primary  hover:text-white font-medium";

export const KIOSK_CART_ICON_CLASS =
  "h-4 w-4 md:h-5 md:w-5 filter brightness-0 group-hover:invert";

export const getProductBuyButtonClass = (size, hasKioskAccess) =>
  size === "small"
    ? PRODUCT_BUY_BUTTON_SMALL_CLASS
    : hasKioskAccess
      ? KIOSK_BUTTON_CLASS
      : PRODUCT_BUY_BUTTON_CLASS;

export const getDisabledProductBuyButtonClass = (size, hasKioskAccess) =>
  getProductBuyButtonClass(size, hasKioskAccess).replace("cursor-pointer", "");

export const getStaticImageSrc = (image) => image?.src || image;

export const getCurrentCollectionForCard = ({
  blogCollectionPage,
  collectionId,
  collectionName,
  collections,
  singleCollections,
}) => {
  if (collectionId && singleCollections?._id === collectionId) {
    return singleCollections;
  }

  const collectionFromList = collectionId
    ? collections?.find((item) => item._id === collectionId)
    : null;

  if (collectionFromList) {
    return collectionFromList;
  }

  if (blogCollectionPage?.collection_name) {
    return blogCollectionPage;
  }

  if (collectionName) {
    return { collection_name: collectionName };
  }

  return singleCollections;
};

export const getCollectionFlags = (collection) => {
  const currentCollectionName = collection?.collection_name
    ?.trim()
    ?.toLowerCase();

  return {
    isMyWishlistCollection: currentCollectionName === "my wishlist",
    isMyTryonsCollection: currentCollectionName === "my tryons",
  };
};

export const shouldEnableViewSimilar = (hideViewSimilar) =>
  enable_view_similar_products === "false" ? false : !hideViewSimilar;

const normalizeAttributeKey = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

const getAttributeConfig = (attribute) => {
  if (typeof attribute === "string") {
    return {
      key: attribute,
      label: attribute.replace(/_/g, " ").trim(),
    };
  }

  if (!attribute || typeof attribute !== "object") return null;

  const key =
    attribute.key ||
    attribute.value ||
    attribute.name ||
    attribute.field ||
    attribute.attribute ||
    attribute.attribute_name;

  if (!key) return null;

  return {
    key,
    label:
      attribute.label ||
      attribute.title ||
      attribute.display_name ||
      String(key).replace(/_/g, " ").trim(),
  };
};

const getProductValue = (product, attributeKey) => {
  if (!product || !attributeKey) return undefined;

  if (Object.prototype.hasOwnProperty.call(product, attributeKey)) {
    return product[attributeKey];
  }

  const normalizedAttributeKey = normalizeAttributeKey(attributeKey);
  const productKey = Object.keys(product).find(
    (key) => normalizeAttributeKey(key) === normalizedAttributeKey,
  );

  return productKey ? product[productKey] : undefined;
};

const formatAttributeValue = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        String(item ?? "")
          .replace(/,+$/, "")
          .trim(),
      )
      .filter(Boolean)
      .join(", ");
  }

  return String(value ?? "")
    .replace(/,+$/, "")
    .trim();
};

export const getProductCardAttributes = (product, attributes = []) =>
  attributes
    .map(getAttributeConfig)
    .filter(Boolean)
    .map((attribute) => ({
      ...attribute,
      value: formatAttributeValue(getProductValue(product, attribute.key)),
    }))
    .filter((attribute) => attribute.value.length > 0);

export const getNormalizedCartQty = (qty = 1) => {
  const numericQty = Number(qty);
  return Number.isFinite(numericQty) ? Math.max(numericQty, 0) : 1;
};
