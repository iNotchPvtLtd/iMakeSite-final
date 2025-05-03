import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from './components/Layout';
export default function FileManager() {
  const router = useRouter(); 
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [folders, setFolders] = useState([]);

const handleSubmit = (e) => {
  e.preventDefault();
  if (newFolderName.trim()) {
    const newFolder = {
      id: Date.now(),
      name: newFolderName.trim(),
      files: []
    };
    setFolders([...folders, newFolder]);
    setNewFolderName('');
  }
};

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
    // Handle the uploaded files
    setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileToFolder = (fileIndex, folderId) => {
    const file = files[fileIndex];
    const updatedFolders = folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, files: [...folder.files, file] };
      }
      return folder;
    });
    setFolders(updatedFolders);
    setFiles(files.filter((_, index) => index !== fileIndex));
  };

  return (
    <Layout>
    <div className="file-manager">
      <div className="header">
        <h1>File Manager</h1>
        <p>Upload and manage your content and files</p>
      </div>

      <div className="create-folder-section">
        <h2>Create New Folder</h2>
        <p>Organize your uploads in folders</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Enter folder name"
          />
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>

      <div className="folders-section">
  {folders.map(folder => (
    <div key={folder.id} className="folder-item">
      <div className="folder-header">
        <h3>📁 {folder.name}</h3>
        <span>{folder.files.length} files</span>
      </div>
      <div className="folder-files">
        {folder.files.map((file, index) => (
          <div key={index} className="file-item">
            <span>{file.name}</span>
            <span>{(file.size / 1024).toFixed(2)} KB</span>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>


      <div className="files-section">
        <div className="files-header">
          <h2>Unassigned <span className="file-count">0 files</span></h2>
          <div className="file-actions">
            <select className="sort-dropdown">
              <option value="">Sort By</option>
              <option value="name">Name</option>
              <option value="date">Date</option>
            </select>
            <button className="icon-btn">↻</button>
            <button className="icon-btn">↑</button>
          </div>
        </div>

      

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
            <p>Drop files here or click to upload</p>
          </div>
        </div>

        <div className="files-list">
  {files.map((file, index) => (
    <div key={index} className="file-item">
      <span>{file.name}</span>
      <div className="file-actions">
        <span>{(file.size / 1024).toFixed(2)} KB</span>
        <select 
          onChange={(e) => handleFileToFolder(index, Number(e.target.value))}
          defaultValue=""
        >
          <option value="" disabled>Move to folder</option>
          {folders.map(folder => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  ))}
</div>
      


      </div>

      <div className="navigation-buttons">
      <button className="dashboard-btn" onClick={() => router.push('/Dashboard')}>
            Dashboard / Previous
          </button>
      </div>



      <style jsx>{`
        .file-manager {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 1.8rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .header p {
          color: #718096;
        }

        .create-folder-section {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .create-folder-section h2 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .create-folder-section p {
          color: #718096;
          margin-bottom: 1rem;
        }

        form {
          display: flex;
          gap: 1rem;
        }

        input {
          flex: 1;
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }

        .submit-btn {
          background: #0066ff;
          color: white;
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .files-section {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .files-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .file-count {
          color: #718096;
          font-size: 0.9rem;
          font-weight: normal;
        }

        .file-actions {
          display: flex;
          gap: 0.5rem;
        }

        .sort-dropdown {
          padding: 0.3rem 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }

        .icon-btn {
          padding: 0.3rem 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          background: white;
          cursor: pointer;
        }

        .drop-zone {
          border: 2px dashed #e2e8f0;
          border-radius: 8px;
          padding: 3rem;
          text-align: center;
        }

        .drop-zone-content {
          color: #718096;
        }

        .upload-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #0066ff;
        }

         .drop-zone.dragging {
          background-color: #f7fafc;
          border-color: #0066ff;
        }

        .files-list {
          margin-top: 1rem;
        }

        .file-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .file-item:last-child {
          border-bottom: none;
        }
          .navigation-buttons {
          display: flex;
          justify-content: flex-start;
          margin-top: 2rem;
        }

        .dashboard-btn {
          padding: 0.75rem 2rem;
          border: 1px solid #0066ff;
          border-radius: 4px;
          background: white;
          color: #0066ff;
          cursor: pointer;
          font-weight: 500;
        }

        .dashboard-btn:hover {
          background: #f0f7ff;
        }
          folders-section {
    margin: 2rem 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .folder-item {
    background: #f7fafc;
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid #e2e8f0;
  }

  .folder-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .folder-header h3 {
    margin: 0;
    font-size: 1rem;
    color: #2d3748;
  }

  .folder-files {
    max-height: 200px;
    overflow-y: auto;
  }

  .file-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .file-actions select {
    padding: 0.25rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .folders-section {
    margin: 2rem 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .folder-item {
    background: #f7fafc;
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
  }

  .folder-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .folder-header h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    color: #2d3748;
  }
      `}</style>
    </div>
    </Layout>
  );
}