import { apiInstance } from "../../../helper/apiCall";
import { auraYfretUserCollBaseUrl } from "../../../constants/config";

const mediaBaseUrl = `${auraYfretUserCollBaseUrl}/user/media`;

export const createMedia = (payload) =>
  apiInstance({
    url: `${mediaBaseUrl}/create/`,
    method: "post",
    data: payload,
  });

export const fetchMedia = (params) =>
  apiInstance({
    url: `${mediaBaseUrl}/fetch/`,
    method: "get",
    params,
  });

export const updateMedia = (payload) =>
  apiInstance({
    url: `${mediaBaseUrl}/update/`,
    method: "post",
    data: payload,
  });

export const deleteMedia = (media_id) =>
  apiInstance({
    url: `${mediaBaseUrl}/delete/`,
    method: "delete",
    data: { media_id },
  });
