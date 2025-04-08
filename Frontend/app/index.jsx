import { useEffect } from 'react';
import { router, useNavigationContainerRef } from 'expo-router';

export default function Index() {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/login');
    }, 50); 

    return () => clearTimeout(timeout);
  }, []);

  return null;
}