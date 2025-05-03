import { useRouter } from 'next/router';
import axios from 'axios';
import { useUserFromToken } from './../../src/hooks/useUserFromToken';
import { useGuestUser } from './../../src/hooks/useGuestUser';

export default function Layout({ children }) {
  const router = useRouter();
  const { userId, userEmail } = useUserFromToken();
  const { isGuest, guestName } = useGuestUser();

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      document.cookie = 'jwtToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <div className="header">
        {isGuest ? (
          <div className="user-info">
            <span> {guestName}</span>
            <button onClick={() => router.push('/login')} className="login-btn">Login</button>
          </div>
        ) : userId && (
          <div className="user-info">
            <span>{userEmail}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </div>
      {children}

      <style jsx>{`
        .header {
          padding: 1rem 2rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .user-info {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 1rem;
        }

        .logout-btn {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          background: #f56565;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #c53030;
        }

        .login-btn {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          background: #4299e1;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-btn:hover {
          background: #3182ce;
        }

        .user-info span {
          color: #4a5568;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
