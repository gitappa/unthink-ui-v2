import { current_store_name } from "../../../constants/config";

export const getMediaIdentity = (authUser = {}) => {
  if (authUser.user_id) return { user_id: authUser.user_id };
  if (authUser.emailId) return { emailId: authUser.emailId };
  if (authUser.email) return { emailId: authUser.email };
  if (authUser.phone) return { phone: authUser.phone };
  return {};
};

export const getStoreName = (storeData = {}) =>
  storeData.store_name || storeData.user_name || current_store_name;

export const getMediaTypeFromFile = (file) => {
  const type = file?.type || "";
  if (type.startsWith("video/")) return "video";
  return "image";
};

export const getUploadedMediaUrl = (response, mediaType) => {
  const item = response?.data?.data?.[0] || response?.data?.[0] || response?.data;
  if (!item) return "";
  if (mediaType === "image") {
    return item?.other_dimensions?.["340X340"]?.[0]?.url || item?.url || "";
  }
  return item?.url || "";
};

export const normalizeMediaList = (response) => {
  const data = response?.data?.data || response?.data?.results || response?.data || [];
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object"
      ? Object.values(data).flat()
      : [];

  return Array.isArray(list)
    ? list
      .filter(Boolean)
      .sort((a, b) => (b.modified_on || b.created_on || 0) - (a.modified_on || a.created_on || 0))
    : [];
};

export const getMediaId = (media) => media.media_id || media.id || media._id;
