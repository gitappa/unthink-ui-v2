const TRY_ON_ACTION_TYPES = new Set([
  "VIRTUAL_TRYON",
  "MANAGED_PRODUCT_TRYON",
  "TRY_VARIANTS",
  "STYLE_YOUR_ROOM",
  "STYLE_YOUR_LOOK",
  "TRY_IN_MY_ROOM",
]);

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Unknown time";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getContactLabel = (alert) =>
  alert.email_id || alert.email || alert.emailId || alert.phone || "Unknown contact";

export const getAlertImages = (alert) => {
  if (alert.watermarked_result_url) return [alert.watermarked_result_url];
  if (Array.isArray(alert.try_on_images)) return alert.try_on_images.filter(Boolean);
  if (alert.try_on_image) return [alert.try_on_image];
  if (alert.cover_image) return [alert.cover_image];
  if (Array.isArray(alert.media)) return alert.media.filter((url) => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url));
  if (alert.feedback?.imageUrl) return [alert.feedback.imageUrl];
  return [];
};

export const getAlertSummary = (alert) => {
  const name = alert.full_name || alert.name || "A customer";

  if (alert.action_type === "WISHLIST_ADD") return `A new collection is created by ${name}`;
  if (TRY_ON_ACTION_TYPES.has(alert.action_type)) return `A new virtual try-on is created by ${name}`;
  if (alert.action_type === "EVENT_SIGNUP") return `Received a new signup from ${name}`;
  if (alert.action_type === "INPUT_TEXT") return `${name} submitted a response`;
  if (alert.action_type === "INPUT_IMAGE") return `Image submitted by ${name}`;
  if (alert.action_type === "LIST_BRANDS") return `New brand added by ${name}`;
  if (alert.action_type === "ADD_MY_PRODUCTS") return `${name} added products`;
  if (alert.action_type === "COLLECTION_FROM_SKU") return `SKU collection created by ${name}`;
  if (alert.action_type === "PRODUCT_FEEDBACK") return `Product feedback submitted by ${name}`;
  if (alert.action_type === "REQUEST_STATUS_COLLECTION") {
    return `${name} ${alert.request_status === "approved" ? "granted" : "did not grant"} collection permission`;
  }
  if (alert.action_type === "REQUEST_STATUS_TRYON") {
    return `${name} ${alert.request_status === "approved" ? "granted" : "did not grant"} try-on permission`;
  }
  if (alert.action_type === "LICENSED_COPY") return "Licensed copy image";

  return alert.action_type ? `${alert.action_type} activity` : "Customer activity";
};

export const getAlertDetails = (alert) => {
  const details = [];
  const contact = getContactLabel(alert);
  if (contact) details.push({ label: "Email id/Phone", value: contact });

  if (alert.action_type === "INPUT_TEXT") {
    details.push({ label: alert.text_header || "Response", value: alert.text_input || "-" });
  }
  if (alert.action_type === "REFERRAL") {
    details.push({ label: "Referred", value: [alert.referred_name, alert.referred_contact].filter(Boolean).join(" - ") });
  }
  if (alert.action_type === "LIST_BRANDS") {
    details.push({ label: "Brand name", value: alert.brand_name || "-" });
    details.push({ label: "Description", value: alert.brand_description || "-" });
  }
  if (alert.action_type === "COLLECTION_FROM_SKU" && alert.sku_count !== undefined) {
    details.push({ label: "SKU count", value: alert.sku_count });
  }

  return details;
};

export const getPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 3) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const startPage = Math.min(Math.max(1, currentPage - 1), totalPages - 2);
  return [startPage, startPage + 1, startPage + 2];
};
