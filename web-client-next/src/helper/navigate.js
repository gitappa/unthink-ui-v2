// Helper function to replace Gatsby's navigate()
// Use this for client-side navigation in Next.js

import { useRouter } from 'next/router';

export const useNavigate = () => {
  const router = useRouter();
  
  return (path, options = {}) => {
    router.push(path);
  };
};

// For non-hook usage, use next/router directly
export { useRouter };
