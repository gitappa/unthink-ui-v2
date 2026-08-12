import { collectionAPIs } from "../../../helper/serverAPIs";
import { PUBLISHED } from "../../../constants/codes";
import { adminUserId } from "../../../constants/config";

const LOOKBOOK_GENERATED_BY = "lookbook_based";
const PRODUCT_LIMIT = 12;

const getResponseList = (response) => {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  return [];
};

const getCollectionId = (collection) => collection?._id || collection?.collection_id || "";

export const isAdminLookBook = (collection) => String(collection?.user_id || "") === String(adminUserId || "");

export const normalizeLookBookCollections = (collections = []) => {
  const byId = new Map();

  collections.forEach((collection) => {
    const id = getCollectionId(collection);
    if (!id || collection?.status !== PUBLISHED) return;
    byId.set(id, { ...collection, _id: id });
  });

  return Array.from(byId.values());
};

export const fetchStoreAssistantLookBooks = async () => {
  const response = await collectionAPIs.fetchCollectionsAPICall({
    user_id: adminUserId,
    product_limits: PRODUCT_LIMIT,
    view: "admin",
    generated_by: LOOKBOOK_GENERATED_BY,
  });

  return normalizeLookBookCollections(getResponseList(response));
};

export const updateLookBookKioskVisibility = async (collection) => {
  const collectionId = getCollectionId(collection);
  if (!collectionId) throw new Error("Missing collection id");

  const response = await collectionAPIs.updateCollectionAPICall({
    collection_id: collectionId,
    starred: !collection.starred,
  });

  if (response?.data?.status_code && response.data.status_code !== 200) {
    throw new Error(response.data.status_desc || "Failed to update lookbook");
  }

  return {
    ...collection,
    starred: !collection.starred,
  };
};

export const reorderLookBookCollections = async (collections = []) => {
  const response = await collectionAPIs.reorderCollectionAPICall({
    ordered_collections_id: collections.map((collection) => collection._id).filter(Boolean),
  });

  if (response?.data?.status_code && response.data.status_code !== 200) {
    throw new Error(response.data.status_desc || "Failed to reorder lookbooks");
  }

  return response;
};
