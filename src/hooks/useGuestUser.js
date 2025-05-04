import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useGuestUser = () => {
  const [isGuest, setIsGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is guest by checking for absence of JWT token
    const jwtToken = document.cookie.includes('jwtToken');
    setIsGuest(!jwtToken);

    // Load or generate guest name
    if (!jwtToken) {
      const storedGuestName = localStorage.getItem('guestName');
      if (storedGuestName) {
        setGuestName(storedGuestName);
      } else {
        const newGuestName = `Guest_${Math.random().toString(36).substr(2, 6)}`;
        localStorage.setItem('guestName', newGuestName);
        setGuestName(newGuestName);
      }
    }
  }, []);

  const restrictedPaths = ['/wishes', '/file-manager', '/studio'];

  useEffect(() => {
    if (isGuest && restrictedPaths.includes(router.pathname)) {
      router.push('/Dashboard');
    }
  }, [isGuest, router.pathname]);

  return { isGuest, guestName };
};