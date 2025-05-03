import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './components/Layout';
const { Uint8Array } = typeof window !== 'undefined' ? window : {};
// import axios from 'axios';
import Image from 'next/image';

export default function Logo() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [showLogoOptions, setShowLogoOptions] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showLogoDesignPopup, setShowLogoDesignPopup] = useState(false);
  const [selectedLogoType, setSelectedLogoType] = useState('');
  const [logoDetails, setLogoDetails] = useState({
    businessName: '',
    industry: '',
    color: '',
    style: '',
    additionalNotes: ''
  });

  const handleSubmit = async (e) => {
    console.log('Logo details:', selectedLogoType);
    e.preventDefault();
    setShowFileModal(false);
    window.open('https://www.svgviewer.dev/', '_blank');
  };


    // Load logo from localStorage on component mount
    useEffect(() => {
        const savedLogo = localStorage.getItem('logoFile');
        if (savedLogo) {
          setFiles([dataURLtoFile(savedLogo, 'logo')]);
        }
      }, []);
    
      // Save logo to localStorage when files change
      useEffect(() => {
        if (files.length > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            localStorage.setItem('logoFile', reader.result);
          };
          reader.readAsDataURL(files[0]);
        } else {
          localStorage.removeItem('logoFile');
        }
      }, [files]);

        // Helper function to convert Data URL to File object
        const dataURLtoFile = (dataurl, filename) => {
          try {
            if (!dataurl || !filename) {
              throw new Error('Invalid input: dataurl and filename are required');
            }
            
            const arr = dataurl.split(',');
            if (arr.length < 2) {
              throw new Error('Invalid data URL format');
            }
            
            const mimeMatch = arr[0].match(/:(.*?);/);
            if (!mimeMatch || !mimeMatch[1]) {
              throw new Error('Invalid MIME type in data URL');
            }
            
            const mime = mimeMatch[1];
            const bstr = atob(arr[1]);
            const n = bstr.length;
            const u8arr = new Uint8Array(n);
            
            for (let i = 0; i < n; i++) {
              u8arr[i] = bstr.charCodeAt(i);
            }
            
            return new File([u8arr], filename, { type: mime });
          } catch (error) {
            console.error('Error converting data URL to file:', error);
            return null;
          }
        };


    // Add this useEffect to handle the navigation from colors page
    useEffect(() => {
        const { fromColors } = router.query;
        if (fromColors && files.length > 0) {
          // Scroll to the logo preview section
          const previewElement = document.querySelector('.logo-preview');
          if (previewElement) {
            previewElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, [router.query, files]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (uploadedFiles) => {
    setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChooseFiles = () => {
    setShowFileModal(true);
  };
  
  const selectFile = (file) => {
    handleFiles([file]);
    setShowFileModal(false);
  };

  return (
    <Layout>
    <div className="logo-container">
      <h1 className="title">Logo</h1>
      <p className="subtitle">Create a corporate identity your customers will recognize</p>

      <div className="logo-sections">
        <div className="upload-section">
          {files.length > 0 ? (
            <div className="logo-preview">
              <Image 
                src={URL.createObjectURL(files[0])} 
                alt="Logo preview" 
                className="preview-image"
                width={200}
                height={200}
              />
              <button className="remove-btn" onClick={() => setFiles([])}>×</button>
            </div>
          ) : (
            <div 
            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              multiple
              onChange={(e) => handleFiles(Array.from(e.target.files))}
            />
            <div className="drop-zone-content">
              <div className="upload-icon">+</div>
              <p>Drop files here; Click to upload or</p>
              <button className="choose-files-btn" onClick={handleChooseFiles}>Choose from uploaded files</button>
            </div>
          </div>
         
          )}
        </div>

       <div 
        className="no-logo-section"
        onClick={() => setShowLogoOptions(true)}
        style={{ cursor: 'pointer' }}
      >
        <div className="question-mark">?</div>
        <h3>Logo not available?</h3>
      </div>
    </div>

    {showLogoOptions && (
      <div className="logo-options">
        <button className="close-options" onClick={() => setShowLogoOptions(false)}>×</button>
        <div className="option">
          <input type="checkbox" id="text-only" 
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedLogoType('text-only');
                    setShowLogoDesignPopup(true);
                  }
                }}
          />
          <label htmlFor="text-only">I WANT A TEXT-ONLY LOGO</label>
          <p className="option-description">We will find the optimal lettering for your logo</p>
        </div>
        <div className="option">
          <input type="checkbox" id="contact-designer" />
          <label htmlFor="contact-designer">PLEASE CONTACT MY PRINTER/ADVERTISING/GRAPHIC DESIGNER TO REQUEST EXISTING LOGO FILES</label>
        </div>
      </div>
    )}
  
  
  {showLogoDesignPopup && (
  <div className="logo-popup__overlay">
    <div className="logo-popup__content">
      <button onClick={() => setShowLogoDesignPopup(false)} className="logo-popup__close-btn">×</button>
      <h2 className="logo-popup__title">Logo Design Preview</h2>

      <form onSubmit={handleSubmit} className="logo-popup__form">
        <div className="logo-popup__form-group">
          <label>Business Name</label>
          <input
            type="text"
            value={logoDetails.businessName}
            onChange={(e) => setLogoDetails({ ...logoDetails, businessName: e.target.value })}
          />
        </div>
        <div className="logo-popup__form-group">
          <label>Industry</label>
          <input
            type="text"
            value={logoDetails.industry}
            onChange={(e) => setLogoDetails({ ...logoDetails, industry: e.target.value })}
          />
        </div>
        <div className="logo-popup__form-group">
          <label>Preferred Colors</label>
          <input
            type="text"
            value={logoDetails.color}
            onChange={(e) => setLogoDetails({ ...logoDetails, color: e.target.value })}
          />
        </div>
        <div className="logo-popup__form-group">
          <label>Style Preferences</label>
          <select
            value={logoDetails.style}
            onChange={(e) => setLogoDetails({ ...logoDetails, style: e.target.value })}
          >
            <option value="">Select Style</option>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimalist">Minimalist</option>
            <option value="playful">Playful</option>
          </select>
        </div>
        <div className="logo-popup__form-group">
          <label>Additional Notes</label>
          <textarea
            value={logoDetails.additionalNotes}
            onChange={(e) => setLogoDetails({ ...logoDetails, additionalNotes: e.target.value })}
          />
        </div>
        <button type="submit" className="logo-popup__submit-btn">Save Logo Design</button>
      </form>
    </div>
  </div>
)}



{showFileModal && (
  <div className="file-modal">
    <div className="modal-content">
      <div className="modal-header">
        <h3>Choose from uploaded files</h3>
        <button onClick={() => setShowFileModal(false)}>×</button>
      </div>
      <div className="modal-body">
        {files.map((file) => (
          <div key={file.id || file.name} className="file-item" onClick={() => selectFile(file)}>
            <span>{file.name}</span>
            <span>{(file.size / 1024).toFixed(2)} KB</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
      <div className="navigation-buttons">
        <button className="previous-btn" onClick={() => router.push('/layouts')}>
          Previous
        </button>
        <button className="continue-btn" onClick={() => router.push('/colors')}>
          Continue
        </button>
      </div>

      <style jsx>{`
        .logo-container {
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
          margin-bottom: 2rem;
        }

        .logo-sections {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .upload-section, .no-logo-section {
          flex: 1;
        }

        .drop-zone {
          border: 2px dashed #e2e8f0;
          border-radius: 8px;
          padding: 3rem;
          text-align: center;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drop-zone.dragging {
          background-color: #f7fafc;
          border-color: #0066ff;
        }

        .drop-zone-content {
          color: #718096;
        }

        .upload-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #0066ff;
        }

        .choose-files-btn {
          color: #0066ff;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          margin-top: 0.5rem;
        }

        .no-logo-section {
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
        }

        .question-mark {
          font-size: 3rem;
          color: #718096;
          margin-bottom: 1rem;
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
          logo-preview {
          position: relative;
          height: 200px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          padding: 1rem;
        }

        .remove-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ff4444;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .remove-btn:hover {
          background: #ff0000;
        }

        .logo-options {
        position: relative;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 2rem;
        margin-bottom: 2rem;
      }

      .close-options {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #718096;
        cursor: pointer;
      }

      .option {
        margin-bottom: 1.5rem;
      }

      .option:last-child {
        margin-bottom: 0;
      }

      .option input[type="checkbox"] {
        margin-right: 1rem;
      }

      .option label {
        font-weight: 500;
        color: #2d3748;
      }

      .option-description {
        margin-top: 0.5rem;
        color: #718096;
        margin-left: 1.8rem;
      }
        .continue-btn {
          background: #0066ff;
          color: white;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .logo-preview {
          position: relative;
          height: 200px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          padding: 1rem;
        }



.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #e2e8f0;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  cursor: pointer;
}

.design-preview {
  margin-top: 1.5rem;
}
         .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
          }
    






          .logo-popup__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-popup__content {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.logo-popup__close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  background: none;
  font-size: 1.5rem;
  color: #444;
  cursor: pointer;
}

.logo-popup__title {
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: #222;
}

.logo-popup__form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.logo-popup__form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.logo-popup__form-group input,
.logo-popup__form-group select,
.logo-popup__form-group textarea {
  width: 100%;
  padding: 0.7rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

.logo-popup__form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.logo-popup__submit-btn {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logo-popup__submit-btn:hover {
  background-color: #1d4ed8;
}




      `}</style>
    </div>
    </Layout>
  );
}