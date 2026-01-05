import { useRouter } from 'next/router';

/**
 * Custom hook to provide navigate functionality similar to Gatsby
 * Usage: const navigate = useNavigate(); navigate('/path');
 */
export const useNavigate = () => {
  const router = useRouter();
  return (path) => router.push(path);
};
