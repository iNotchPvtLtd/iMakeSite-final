import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    console.log('Login button clicked'); 
    console.log('e',e);// Add this line to check if the button is being clicked
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/login', { email, password });
      
      console.log('Login response:', response);
      if (response.data.success) {
        router.push('/Dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      console.log('Login failed: ' + error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <Image src="/images/iMakeSiteLogo.png" alt="iNotch Logo" width={400} height={150} priority />
        </div>
        {error && <div className="error-message">{error}</div>}
        <form>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button" onClick={handleLogin}>Login</button>
          <div className="guest-login">
            <p>or</p>
            <Link href="/Dashboard" className="guest-button">
              Continue as Guest
            </Link>
            <p className="guest-note">Note: Guest access has limited features</p>
          </div>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f7fafc;
        }

        .login-card {
          background: white;
          padding: 2rem 4rem 2rem 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        h1 {
          margin-bottom: 2rem;
          text-align: center;
          color: #2d3748;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4a5568;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 1rem;
        }

        .login-button {
          width: 100%;
          padding: 0.75rem;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .login-button:hover {
          background: #3182ce;
        }
        .guest-login {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .guest-login p {
          color: #718096;
          margin: 0.5rem 0;
        }

        .guest-button {
          display: inline-block;
          width: 100%;
          padding: 0.75rem;
          background: #718096;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          transition: background 0.2s;
        }

        .guest-button:hover {
          background: #4a5568;
        }

        .guest-note {
          font-size: 0.875rem;
          color: #718096;
          margin-top: 0.5rem;
        }

        .error-message {
          color: #e53e3e;
          background: #fff5f5;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}