const buildUrl = (baseUrl, path, params = {}) => {
  const url = new URL(`${String(baseUrl || "").replace(/\/$/, "")}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

const requestJson = async (url) => {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.status === "error") {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const fetchStoreAssistantEventTemplates = ({ apiBaseUrl, store }) =>
  requestJson(buildUrl(apiBaseUrl, "/store-assistant/event-templates", { store }));

export const fetchStoreAssistantRealtimeFeed = ({
  apiBaseUrl,
  store,
  eventId,
  timeRange,
  startDate,
  endDate,
  contact,
  page,
  pageSize,
}) =>
  requestJson(
    buildUrl(apiBaseUrl, "/store-assistant/realtime-feed", {
      store,
      event_id: eventId,
      time_range: timeRange,
      start_date: startDate,
      end_date: endDate,
      contact,
      page,
      page_size: pageSize,
    })
  );
