import { useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthProvider';

export const useInactivityTimeout = (timeout = 60000) => {
  const { logout: logoutCallback } = useAuth();
  const timeoutId = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(logoutCallback, timeout);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimeout));

    resetTimeout(); // Initial call to start the timeout

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimeout));
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return null;
};
