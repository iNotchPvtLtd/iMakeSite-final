import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './components/Layout';

export default function Finish() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const handleFinish = () => {
    setShowPopup(true);

  };

  return (
    <Layout>
    <div className="finish-container">
      <div className="content">
        <h1 className="title">Finish!</h1>
        <p className="message">All finished! Thats all we need to create your stunning new website.</p>
        <button className="finish-btn" onClick={handleFinish}>
          Continue
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Congratulations! 🎉</h2>
            <p>Your website is ready to be created!</p>
            <div className="popup-buttons">
              <button 
                className="cancel-btn" 
                onClick={() => setShowPopup(false)}
              >
                Go Back
              </button>
              <button 
                className="confirm-btn" 
                onClick={() => router.push('/Dashboard')}
              >
                Create Website
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .finish-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          padding: 2rem;
        }

        .content {
          background: white;
          padding: 3rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          max-width: 600px;
          width: 100%;
        }

        .title {
          font-size: 2.5rem;
          color: #1a202c;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .message {
          color: #4a5568;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .finish-btn {
          background: #4299e1;
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .finish-btn:hover {
          background: #3182ce;
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .popup {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          max-width: 400px;
          width: 90%;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .popup h2 {
          font-size: 1.8rem;
          color: #1a202c;
          margin-bottom: 1rem;
        }

        .popup p {
          color: #4a5568;
          margin-bottom: 2rem;
        }

        .popup-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .cancel-btn, .confirm-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn {
          background: white;
          border: 2px solid #e2e8f0;
          color: #4a5568;
        }

        .cancel-btn:hover {
          background: #f8fafc;
        }

        .confirm-btn {
          background: #4299e1;
          border: none;
          color: white;
        }

        .confirm-btn:hover {
          background: #3182ce;
        }
      `}</style>
    </div>
    </Layout>
  );
}