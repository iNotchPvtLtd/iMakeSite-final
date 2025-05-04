import { useEffect, useState } from 'react';


export const useUserFromToken = () => {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const allCookies = document.cookie;
      const jwtToken = allCookies
        .split(';')
        .find(c => c.trim().startsWith('jwtToken='));

      if (jwtToken) {
        const token = jwtToken.split('=')[1];
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(base64));
          setUserId(payload.userId || payload.sub); // fallback to sub if userId not present
          setUserEmail(payload.email);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }
  }, []);

  return { userId, userEmail };
};
