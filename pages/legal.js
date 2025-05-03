import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from './components/Layout';

export default function Legal() {
  const router = useRouter();
  const [legalInfo, setLegalInfo] = useState({
    siteNotice: '',
    privacyPolicy: '',
    cookiePolicy: ''
  });

  const handleInputChange = (field, value) => {
    setLegalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Layout>
    <div className="legal-container">
      <div className="header-section">
        <h1 className="title">Legal</h1>
        <p className="subtitle">Create the legal information for your disclosure and privacy policy</p>
      </div>

      <div className="legal-sections">
        <div className="section">
          <h3>INFORMATION FOR YOUR SITE NOTICE</h3>
          <textarea
            value={legalInfo.siteNotice}
            onChange={(e) => handleInputChange('siteNotice', e.target.value)}
            placeholder="Add content to your site notice if applicable, e.g. for legal entities with VAT No. and local court"
            className="legal-textarea"
          />
        </div>

        <div className="section">
          <h3>INFORMATION ABOUT YOUR PRIVACY POLICY</h3>
          <textarea
            value={legalInfo.privacyPolicy}
            onChange={(e) => handleInputChange('privacyPolicy', e.target.value)}
            placeholder="Add content to your privacy policy or add a link"
            className="legal-textarea"
          />
        </div>

        <div className="section">
          <h3>COOKIE POLICY</h3>
          <textarea
            value={legalInfo.cookiePolicy}
            onChange={(e) => handleInputChange('cookiePolicy', e.target.value)}
            placeholder="Add content about your cookie policy regarding the use of cookies on your website or add a link"
            className="legal-textarea"
          />
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="previous-btn" onClick={() => router.push('/contact')}>
          Previous
        </button>
        <button className="finish-btn" onClick={() => router.push('/finish')}>
          Finish!
        </button>
      </div>

      <style jsx>{`
        .legal-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: #f8fafc;
          min-height: 100vh;
        }

        .header-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .title {
          font-size: 2.5rem;
          color: #1a202c;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .subtitle {
          color: #4a5568;
          font-size: 1.1rem;
        }

        .legal-sections {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .section h3 {
          color: #2d3748;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .legal-textarea {
          width: 100%;
          min-height: 150px;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          resize: vertical;
          transition: all 0.3s ease;
        }

        .legal-textarea:focus {
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
          outline: none;
        }

        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 3rem;
        }

        .previous-btn, .finish-btn {
          padding: 1rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .previous-btn {
          background: white;
          border: 2px solid #e2e8f0;
          color: #4a5568;
        }

        .previous-btn:hover {
          background: #f8fafc;
        }

        .finish-btn {
          background: #4299e1;
          border: none;
          color: white;
        }

        .finish-btn:hover {
          background: #3182ce;
        }
      `}</style>
    </div>
    </Layout>
  );
}