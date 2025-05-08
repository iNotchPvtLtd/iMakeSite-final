import { createContext, useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getCookie('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          userId: decoded.userId,
          email: decoded.email,
        });
      } catch (err) {
        console.error('Invalid token:', err);
        setUser(null);
      }
    }
  }, []);

  return (
    <SessionContext.Provider value={{ user, isLoggedIn: !!user }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);

// Helper to read cookie
function getCookie(name) {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}
