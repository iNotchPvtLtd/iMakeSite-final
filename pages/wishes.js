import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './components/Layout';
import axios from 'axios';
import { useUserFromToken } from './../src/hooks/useUserFromToken';

 import Image from 'next/image';

export default function Wishes() {
  const router = useRouter();
  const [websites, setWebsites] = useState([{ url: '', description: '' }]);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [comment, setComment] = useState('');
  const [showFileModal, setShowFileModal] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showDebugDetails, setShowDebugDetails] = useState(false);
  const { userId, userEmail } = useUserFromToken();

  useEffect(() => {
    const loadExistingData = async () => {
    
      console.log('userId..',userId);
      try {
        if (!userId) return;

        const response = await axios.get(`/api/wishes?userId=${userId}`);
        console.log('Wishes Data:', response.data); 
        if (response.data.success) {
          const { websites, files, comment } = response.data.data || {};
          if (websites?.length) setWebsites(websites);
          if (files?.length) setFiles(files);
          if (comment) setComment(comment);
        }else{
          setWebsites([{ url: '', description: '' }]);
          setFiles([]);
          setComment('');
        }
      } catch (error) {
        console.error('Error loading wishes:', error);
        setWebsites([{ url: '', description: '' }]);
        setFiles([]);
        setComment('');
      }
    };
    loadExistingData();
  }, [userId]);
  const handleFiles = async (uploadedFiles) => {
    try {
      const newFiles = await Promise.all(
        Array.from(uploadedFiles).map(async (file) => {
          if (file.type.startsWith('image/')) {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({
                  ...file,
                  preview: reader.result
                });
              };
              reader.readAsDataURL(file);
            });
          }
          return Promise.resolve(file);
        })
      );
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    } catch (error) {
      console.error('Error handling files:', error);
    }
  };
  // Replace img tags with Next.js Image component
  const FilePreview = ({ file }) => {
    if (file.preview) {
      return (
        <Image 
          src={file.preview} 
          alt={file.name} 
          width={120} 
          height={100} 
          className="preview-image"
        />
      );
    }
    return <div className="file-icon">📄</div>;
  };

  const handleChooseFiles = () => {
    setShowFileModal(true);
    console.log('Choose Files button clicked',showFileModal);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const addWebsite = () => {
    setWebsites([...websites, { url: '', description: '' }]);
  };

  const updateWebsite = (index, field, value) => {
    const updatedWebsites = [...websites];
    updatedWebsites[index][field] = value;
    setWebsites(updatedWebsites);
  };

  // File handling functions
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

 
  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!userId) {
        alert('Please login to save your wishes');
        return;
      }
  
      const formData = new FormData();
  
      // Append actual File objects (if any) separately
      files.forEach((fileObj) => {
        if (fileObj.file instanceof File) {
          formData.append('files', fileObj.file);
        }
      });
  
      // Prepare data without trying to include file previews/base64 blobs
      const wishData = {
        userId: userId,
        name: 'website-inspiration',
        type: 'page',
        content: {
          websites,
          comment,
          files: files.map((f) => ({ preview: f.preview })), // if you still want to save previews
        }
      };
  
      formData.append('wishData', JSON.stringify(wishData));
  
      const response = await axios.post('/api/wishes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.success) {
        setComment('');
        setWebsites([{ url: '', description: '' }]);
        setFiles([]);
        alert('Wishes saved successfully!');
        router.push('/layouts');
      }
    } catch (error) {
      console.error('Error saving wishes:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Layout>
   <div className="wishes-container">
      <div className="debug-section">
        <div className="debug-header" onClick={() => setShowDebugDetails(!showDebugDetails)}>
          <h3>Existing Wishlist: {userId?.userEmail ? `for ${userEmail}` : ''}</h3>
          <div className="debug-summary">
            <span>Websites: {websites.length}</span>
            <span>Files: {files.length}</span>
            <span>Has Comment: {comment ? 'Yes' : 'No'}</span>
            <span className="toggle-icon">{showDebugDetails ? '▼' : '▶'}</span>
          </div>
        </div>
        {showDebugDetails && (
          <div className="debug-content">
            <div className="debug-group">
              <h4>Websites</h4>
              <table className="debug-table">
                <thead>
                  <tr>
                    <th>Website URL</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {websites.map((website, index) => (
                    <tr key={index}>
                      <td>{website.url || '-'}</td>
                      <td>{website.description || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="debug-group">
              <h4>Files ({files.length})</h4>
              <table className="debug-table">
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>File Name</th>
                    <th>Type</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr key={index}>
                      <td className="preview-cell">
                        {file.preview ? (
                          <Image src={file.preview} alt={file.name} width={50} height={50} className="debug-preview-image" />
                        ) : (
                          <span className="file-icon">📄</span>
                        )}
                      </td>
                      <td>{file.name}</td>
                      <td>{file.type}</td>
                      <td>{file.size ? `${(file.size / 1024).toFixed(2)} KB` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="debug-group">
              <h4>Comment</h4>
              <div className="debug-comment">{comment || '-'}</div>
            </div>
          </div>
        )}  
      </div>
     
      <h1 className="title">Inspiration</h1>
      <p className="subtitle">What website designs do you like the most?</p>
      <div className="websites-section">
        {websites.map((website, index) => (
          <div key={index} className="website-inputs">
            <input
              type="text"
              placeholder="www.i-like-this-web"
              value={website.url}
              onChange={(e) => updateWebsite(index, 'url', e.target.value)}
            />
            <input
              type="text"
              placeholder="What I especially like about this website is..."
              value={website.description}
              onChange={(e) => updateWebsite(index, 'description', e.target.value)}
            />
          </div>
        ))}
        
        <button className="add-website-btn" onClick={addWebsite}>
          + Add another website
        </button>
      </div>
      <div className="upload-section">
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
            <p>Drop files here, Click to upload or</p>
            <button className="choose-files-btn" onClick={handleChooseFiles}>Choose from uploaded files</button>
          </div>
        </div>



       {/* Add file previews */}
       {files.length > 0 && (
    <div className="uploaded-previews">
      {files.map((file, index) => (
        <div key={file.id || index} className="preview-item">
          <button className="remove-btn" onClick={() => removeFile(index)}>×</button>
          <FilePreview file={file} />
          <p className="file-name">{file.name}</p>
        </div>
      ))}
    </div>
  )}
      

        <textarea
          className="comment-area"
          placeholder="Do you want to add a comment to the files you have uploaded?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="button-container">
        <button 
            className="dashboard-btn" 
            onClick={() => router.push('/Dashboard')}>
            Dashboard / Previous
          </button>

          <button 
            className="continue-btn" 
            onClick={handleSave}
            disabled={loading}>
            {loading ? 'Saving...' : 'Continue'}
          </button>
      </div>
      <style jsx>{`
        .wishes-container {
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

        .websites-section {
          margin-bottom: 2rem;
        }

        .website-inputs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .website-inputs input {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }

        .website-inputs input:first-child {
          width: 30%;
        }

        .website-inputs input:last-child {
          width: 70%;
        }

        .add-website-btn {
          color: #0066ff;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }

        .upload-section {
          margin-bottom: 2rem;
        }

        .drop-zone {
          border: 2px dashed #e2e8f0;
          border-radius: 8px;
          padding: 3rem;
          text-align: center;
          margin-bottom: 1rem;
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

        .comment-area {
          width: 100%;
          min-height: 150px;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          resize: vertical;
        }

        .continue-btn {
          background: #0066ff;
          color: white;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          float: right;
        }
          .file-modal {
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
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #718096;
        }

        .modal-body {
          padding: 1rem;
        }

        .file-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
          cursor: pointer;
        }

        .file-item:hover {
          background: #f7fafc;
        }

        .file-item:last-child {
          border-bottom: none;
        }

        .uploaded-previews {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin: 1rem 0;
        }

        .preview-item {
          width: 120px;
          text-align: center;
        }

        .preview-image {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        .file-icon {
          width: 100%;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 2rem;
        }

        .file-name {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #4a5568;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }

        .right-buttons {
          display: flex;
          gap: 1rem;
        }

        .dashboard-btn {
          padding: 0.75rem 2rem;
          border: 1px solid #0066ff;
          border-radius: 4px;
          background: white;
          color: #0066ff;
          cursor: pointer;
        }

        .dashboard-btn:hover {
          background: #f0f7ff;
        }

        .debug-section {
          margin: 2rem 0;
          padding: 1rem;
          background: #f7fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .debug-section pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }
           .debug-section {
          margin: 2rem 0;
          padding: 1rem;
          background: #f7fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .debug-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }

        .debug-table th,
        .debug-table td {
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          text-align: left;
        }

        .debug-table th {
          background: #edf2f7;
          font-weight: 600;
        }

        .debug-comment {
          padding: 0.5rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          min-height: 2rem;
        }

        .debug-section h4 {
          margin: 1rem 0 0.5rem;
          color: #4a5568;
        }

        .debug-header {
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: #edf2f7;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .debug-summary {
          display: flex;
          gap: 1rem;
          align-items: center;
          font-size: 0.875rem;
          color: #4a5568;
        }

        .toggle-icon {
          font-size: 0.75rem;
          color: #718096;
        }

        .debug-content {
          padding: 1rem;
          background: white;
          border-radius: 4px;
        }

        .debug-group {
          margin-bottom: 2rem;
        }

        .debug-group:last-child {
          margin-bottom: 0;
        }

        .preview-cell {
          width: 60px;
          height: 60px;
          padding: 4px !important;
        }

        .debug-preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }

        .file-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: #f7fafc;
          border-radius: 4px;
          font-size: 1.5rem;
        }
      `}</style>
    </div>
    </Layout>
  );
}