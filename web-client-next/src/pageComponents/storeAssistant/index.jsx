import StoreAssistantProtected from "./components/StoreAssistantProtected";
import StoreAssistantDashboard from "./StoreAssistantDashboard";

const StoreAssistant = () => (
  <StoreAssistantProtected>
    <StoreAssistantDashboard />
  </StoreAssistantProtected>
);

export default StoreAssistant;
