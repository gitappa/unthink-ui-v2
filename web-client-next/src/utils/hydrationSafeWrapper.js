import { useEffect, useState } from 'react';

/**
 * HOC to wrap components that might have hydration issues.
 * Ensures component only renders on client after hydration is complete.
 */
export function withHydrationSafe(Component) {
  return function HydrationSafeWrapper(props) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) {
      return null;
    }

    return <Component {...props} />;
  };
}

/**
 * Hook to check if component is mounted (hydrated)
 */
export function useHydration() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
