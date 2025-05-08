import React, { useState } from 'react';

const DomainModal = ({ isOpen, onClose, onSubmit }) => {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!domain) {
      setError('Enter your domain name to publish your fantastic website!');
      return;
    }

    const trimmedDomain = domain.trim();
    const isLocalhost = /^localhost(:\d+)?$/.test(trimmedDomain);
    const isValidDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(trimmedDomain);

    if (isLocalhost || isValidDomain) {
      setIsSubmitting(true);
      try {
        const response = await onSubmit(trimmedDomain);
        if (response?.status === 400 && response.data?.message === 'Port is already in use') {
          setError('The specified port is already in use. Please choose a different port.');
        } else {
          setIsSubmitting(false);
          onClose();
        }
      } catch (err) {
        setError('Failed to host your website. Please try again.');
        setIsSubmitting(false);
      }
    } else {
      setError('Please enter a valid domain name or localhost:port');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginTop: 0, color: '#1a1a1a' }}>Host Your Website!</h2>
        <p style={{ color: '#4a5568' }}>Add your domain here to go live instantly.🚀</p>
        
        <input
          type="text"
          value={domain}
          onChange={(e) => {
            setDomain(e.target.value);
            setError('');
          }}
          placeholder="example.com"
          style={inputStyle}
        />
        
        {error && <p style={{ color: '#e53e3e', marginBottom: '12px' }}>{error}</p>}
        
        <div style={buttonContainerStyle}>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={cancelButtonStyle(isSubmitting)}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !domain}
            className={domain ? 'color-wrap' : ''}
            style={submitButtonStyle(isSubmitting || !domain)}
          >
            {isSubmitting ? (
              <>
                <span style={spinnerStyle} />
                Hosting...
              </>
            ) : (
              'Launch Website'
            )}
          </button>
        </div>

        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes colorWrap {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          .color-wrap {
            background: linear-gradient(270deg, #ff0080, #ff8c00, #40e0d0, #ff0080);
            background-size: 400% 400%;
            animation: colorWrap 4s ease infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

// Inline styles
const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2000,
};

const modalStyle = {
  backgroundColor: '#ffffff',
  padding: '24px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '400px',
};

const inputStyle = {
  width: '100%',
  padding: '8px 5px',
  marginBottom: '12px',
  border: '1px solid #e2e8f0',
  borderRadius: '4px',
  fontSize: '16px',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
};

const cancelButtonStyle = (isDisabled) => ({
  padding: '8px 16px',
  backgroundColor: '#e2e8f0',
  color: isDisabled ? '#9ca3af' : '#1a1a1a',
  border: 'none',
  borderRadius: '4px',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  opacity: isDisabled ? 0.7 : 1,
});

const submitButtonStyle = (isDisabled) => ({
  padding: '8px 16px',
  backgroundColor: '#4f46e5',
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  opacity: isDisabled ? 0.7 : 1,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'background-color 0.3s ease',
});

const spinnerStyle = {
  display: 'inline-block',
  width: '16px',
  height: '16px',
  border: '2px solid #ffffff',
  borderTopColor: 'transparent',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

export default DomainModal;
