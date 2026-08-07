const isPlainObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value);

const DEFAULT_STORE_ASSISTANT_SETTINGS = {
  enabled: false,
  features: {},
  default_tab: "aura_search",
  event_app_list: [],
};

const normalizeEventItem = (item, index) => {
  if (typeof item === "string") {
    return {
      id: `event_${index}`,
      label: item || `Event ${index + 1}`,
      description: "Open event app",
      url: item,
      icon: "event",
      open_in_new_tab: true,
    };
  }

  return {
    id: item?.id || `event_${index}`,
    label: item?.label || item?.name || `Event ${index + 1}`,
    description: item?.description || "Open event app",
    url: item?.url || item?.link || "",
    icon: item?.icon || "event",
    open_in_new_tab: item?.open_in_new_tab !== false,
  };
};

export const normalizeStoreAssistantSettings = (settings) => {
  const source = isPlainObject(settings) ? settings : {};
  const merged = {
    ...DEFAULT_STORE_ASSISTANT_SETTINGS,
    ...source,
    features: {
      ...DEFAULT_STORE_ASSISTANT_SETTINGS.features,
      ...(source.features || {}),
    },
  };

  return {
    ...merged,
    event_app_list: Array.isArray(merged.event_app_list)
      ? merged.event_app_list.map(normalizeEventItem).filter((item) => item.label)
      : [],
  };
};
