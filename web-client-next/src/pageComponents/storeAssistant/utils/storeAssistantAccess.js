const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

export const isStoreAssistantUser = ({ authUser, storeAssistantList = [] }) => {
  const email = normalizeEmail(authUser?.emailId || authUser?.email);
  if (!email || !Array.isArray(storeAssistantList)) return false;

  return storeAssistantList.some((assistant) => {
    const assistantEmail =
      typeof assistant === "string"
        ? assistant
        : assistant?.emailId || assistant?.email || assistant?.user_email;

    return normalizeEmail(assistantEmail) === email;
  });
};

export const hasStoreAssistantAccess = ({
  isUserLogin,
  authUser,
  settings,
  storeAssistantList,
}) => {
  if (!settings?.enabled || !isUserLogin) return false;
  return isStoreAssistantUser({ authUser, storeAssistantList });
};

export const getAssistantDisplayName = (authUser = {}) =>
  authUser.first_name || authUser.user_name || authUser.emailId || authUser.email || "Assistant";
