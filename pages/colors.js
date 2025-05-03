import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './components/Layout';

export default function Colors() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showWebsiteInput, setShowWebsiteInput] = useState(false);
  const [showLogoInput, setShowLogoInput] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Add after the initial state declarations
useEffect(() => {
    const savedColors = localStorage.getItem('selectedColors');
    const savedNotes = localStorage.getItem('colorNotes');
    const savedOption = localStorage.getItem('colorOption');
    
    if (savedColors) setColors(JSON.parse(savedColors));
    if (savedNotes) setNotes(savedNotes);
    if (savedOption) {
      setSelectedOption(savedOption);
      setShowWebsiteInput(savedOption === 'website');
      setShowLogoInput(savedOption === 'logo');
    }
  }, []);
  

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    setShowWebsiteInput(optionId === 'website');
    setShowLogoInput(optionId === 'logo');
    localStorage.setItem('colorOption', optionId);
  };

  const handleColorChange = (type, value) => {
    const newColors = {
      ...colors,
      [type]: value
    };
    setColors(newColors);
    localStorage.setItem('selectedColors', JSON.stringify(newColors));
  };

  const handleNotesChange = (value) => {
    setNotes(value);
    localStorage.setItem('colorNotes', value);
  };
  
  const [colors, setColors] = useState({
    main: '#ffffff',
    accent: '#ffffff',
    text: '#000000'
  });
  const [notes, setNotes] = useState('');

  const colorOptions = [
    {
      id: 'website',
      title: 'See website',
      icon: '💻'
    },
    {
      id: 'logo',
      title: 'See logo',
      icon: '🎨'
    },
    {
      id: 'custom',
      title: 'Choose colors yourself',
      icon: '📋'
    }
  ];

  return (
    <Layout>
    <div className="colors-container">
      <h1 className="title">Colors</h1>
      <p className="subtitle">Set the color scheme for your website</p>

      <div className="color-options">
        {colorOptions.map((option) => (
          <div
            key={option.id}
            className={`color-card ${selectedOption === option.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(option.id)}
          >
            <div className="icon-circle">
              <span className="icon">{option.icon}</span>
            </div>
            <h3>{option.title}</h3>
          </div>
        ))}
      </div>

      {showWebsiteInput && (
        <div className="website-input-section">
          <div className="input-content">
            <h2>Which colors should we use for the website?</h2>
            <p>Choose your preferred colors</p>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="Previous website (www.your-business.com)..."
              className="website-url-input"
            />
          </div>
        </div>
      )}

{showLogoInput && (
        <div className="logo-input-section">
          <div className="back-button" onClick={() => router.push({
                    pathname: '/logo',
                    query: { fromColors: 'true' }
                    })}>
                    <span>←</span> Use Logo Colors
          </div>
          <div className="input-content">
            <h2>Do you already have a logo we can use?</h2>
            <p>Send us a link to the logo or upload it under `&quot;`Add logo`&quot;`</p>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="www.my-logo-link.com"
              className="logo-url-input"
            />
          </div>
        </div>
      )}

{selectedOption === 'custom' && (
  <div className="color-picker-section">
    <div className="input-content">
      <h2>Which colors should we use for the website?</h2>
      <p>Choose your preferred colors</p>
      
      <div className="color-inputs">
        <div className="color-input-group">
          <label>Main color</label>
          <input 
            type="color" 
            value={colors.main}
            onChange={(e) => handleColorChange('main', e.target.value)} 
          />
        </div>
        
        <div className="color-input-group">
          <label>Accent color</label>
          <input 
            type="color" 
            value={colors.accent}
            onChange={(e) => handleColorChange('accent', e.target.value)} 
          />
        </div>
        
        <div className="color-input-group">
          <label>Text color</label>
          <input 
            type="color" 
            value={colors.text}
            onChange={(e) => handleColorChange('text', e.target.value)} 
          />
        </div>
      </div>

      <div className="notes-section">
        <label>Is there anything we should know?</label>
        <textarea 
          value={notes}
          placeholder="Additional notes about your color preferences..."
          onChange={(e) => handleNotesChange(e.target.value)}
        />
      </div>
    </div>
  </div>
)}
      <div className="navigation-buttons">
        <button className="previous-btn" onClick={() => router.push({
                    pathname: '/logo',
                    query: { fromColors: 'true' }
                    })}>
          Previous
        </button>
        <button 
          className="continue-btn" 
          onClick={() => router.push('/content')}
          disabled={!selectedOption}
        >
          Continue
        </button>
      </div>

      <style jsx>{`
        .colors-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .title {
          font-size: 1.8rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #718096;
          margin-bottom: 3rem;
        }

        .color-options {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .color-card {
          width: 250px;
          padding: 2rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .color-card:hover {
          border-color: #0066ff;
        }

        .color-card.selected {
          border-color: #0066ff;
          background-color: #f0f7ff;
        }

        .icon-circle {
          width: 60px;
          height: 60px;
          background-color: #f7fafc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .icon {
          font-size: 2rem;
        }

        h3 {
          color: #2d3748;
          font-size: 1.2rem;
        }

        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }

        .previous-btn {
          padding: 0.75rem 2rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          background: white;
          color: #4a5568;
          cursor: pointer;
        }

        .continue-btn {
          background: #0066ff;
          color: white;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .continue-btn:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
        }
          .website-input-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          position: relative;
          text-align: center;
        }

        .modal-content h2 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .modal-content p {
          color: #718096;
          margin-bottom: 1.5rem;
        }

        .website-url-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 4px;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .close-modal {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #718096;
          cursor: pointer;
        }
          .website-input-section {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          margin: 2rem 0;
          text-align: center;
        }

        .website-input-section h2 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .website-input-section p {
          color: #718096;
          margin-bottom: 1.5rem;
        }

        .website-url-input {
          width: 100%;
          max-width: 500px;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 4px;
          font-size: 1rem;
        }

         .website-input-section {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          margin: 2rem 0;
          text-align: center;
          max-width: 800px;
          margin: 2rem auto;
        }

        .input-content {
          max-width: 500px;
          margin: 0 auto;
        }

        .website-input-section h2 {
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .website-input-section p {
          color: #718096;
          margin-bottom: 1.5rem;
        }

        .website-url-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 4px;
          font-size: 1rem;
          color: #4a5568;
        }

        .website-url-input::placeholder {
          color: #a0aec0;
        }

        .logo-input-section {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          margin: 2rem auto;
          text-align: center;
          max-width: 800px;
          position: relative;
        }

        .back-button {
          position: absolute;
          left: 1rem;
          top: 1rem;
          color: #0066ff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .back-button span {
          font-size: 1.2rem;
        }

        .logo-url-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 4px;
          font-size: 1rem;
          color: #4a5568;
        }

        .logo-url-input::placeholder {
          color: #a0aec0;
        }

        .color-picker-section {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    margin: 2rem auto;
    max-width: 800px;
  }

  .color-inputs {
    display: grid;
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .color-input-group {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .color-input-group label {
    min-width: 100px;
    color: #4a5568;
  }

  .color-input-group input[type="color"] {
    width: 50px;
    height: 50px;
    padding: 0;
    border: 2px solid #e2e8f0;
    border-radius: 4px;
  }

  .notes-section {
    margin-top: 2rem;
  }

  .notes-section label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
  }

  .notes-section textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 4px;
    resize: vertical;
  }
      `}</style>
    </div>
    </Layout>
  );
}