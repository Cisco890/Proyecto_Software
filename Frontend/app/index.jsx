import { useEffect } from 'react';
import { router, useNavigationContainerRef } from 'expo-router';

export default function Index() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/login');
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
