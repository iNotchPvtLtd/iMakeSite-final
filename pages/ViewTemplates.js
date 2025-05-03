import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from './components/Layout';
import { downloadTemplate } from '../src/utils/templateDownloader';

export default function ViewTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [templateToPreview, setTemplateToPreview] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/getTemplate');
      if (response.data.success) {
        setTemplates(response.data.data);
      } else {
        console.error('Failed to fetch templates:', response.data.message);
        // Show error message to user
        alert(response.data.message || 'Failed to fetch templates');
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      // Show error message to user
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch templates';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/Dashboard');
  };

  const handleViewData = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handlePreviewClick = (template) => {
    console.log("Previewing template:", template);
    setTemplateToPreview(template);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setTemplateToPreview(null);
  };

  const handleCloseDataModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };



  return (
    <Layout>
    <div className="container">
      <div className="header">
         <h1>Saved Templates</h1>
        <button onClick={handleBack} className="back-button">
          ← Back
        </button>
       
        {/* <button onClick={handleLogout} className="logout-button">
          Logout
        </button> */}
      </div>

      {loading ? (
        <div className="loading">Loading templates...</div>
      ) : (
        <div className="templates-grid">
          {templates.length > 0 ? (
            templates.map((template, index) => (
              <div key={template._id || index} className="template-card">
                <h3>{template.pageName || `Template ${index + 1}`}</h3>
                <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                <div className="preview">
                  <iframe
                    srcDoc={`
                      <style>${template.styles}</style>
                      ${template.template}
                    `}
                    title="Template Preview"
                  />
                </div>
                <div className="template-actions">
                  <button 
                    onClick={() => handleViewData(template)}
                    className="action-button"
                  >
                    View Data
                  </button>
                  <button 
                    onClick={() => handlePreviewClick(template)}
                    className="action-button preview-button"
                    style={{ marginLeft: '10px' }}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => downloadTemplate(template)}
                    className="action-button download-button"
                    style={{ marginLeft: '10px' }}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-templates">
              <p>No templates found. Create a new template to get started!</p>
              <button
                onClick={() => router.push('/DashboardEditor')}
                className="get-started-btn"
              >
                Create Template
              </button>
            </div>
          )}
        </div>
      )}
 {isModalOpen && selectedTemplate && (
        <div className="modal-overlay" onClick={handleCloseDataModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Template Data</h3>
              <button className="close-button" onClick={handleCloseDataModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="data-section">
                <div className="section-header">
                  <h4>HTML Template</h4>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(selectedTemplate.template);
                      const button = event.target;
                      button.textContent = 'Copied!';
                      setTimeout(() => button.textContent = 'Copy', 2000);
                    }} 
                    className="copy-button"
                  >
                    Copy
                  </button>
                </div>
                <pre>{selectedTemplate.template}</pre>
              </div>
              <div className="data-section">
                <div className="section-header">
                  <h4>CSS Styles</h4>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(selectedTemplate.styles);
                      const button = event.target;
                      button.textContent = 'Copied!';
                      setTimeout(() => button.textContent = 'Copy', 2000);
                    }} 
                    className="copy-button"
                  >
                    Copy
                  </button>
                </div>
                <pre>{selectedTemplate.styles}</pre>
              </div>
              <div className="data-section">
                <h4>Created At</h4>
                <p>{new Date(selectedTemplate.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && templateToPreview && (
        <div className="modal-overlay" onClick={handleClosePreview}>
          <div className="modal-content preview-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Template Preview: {templateToPreview.pageName || 'Untitled'}</h3>
              <button className="close-button" onClick={handleClosePreview}>×</button>
            </div>
            <div className="modal-body preview-modal-body">
              <div style={{ border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden', height: '60vh' }}>
                <iframe 
                  srcDoc={`<style>${templateToPreview.styles}</style>${templateToPreview.template}`}
                  title="Template Preview Content"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .back-button {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          background: transparent;
          cursor: pointer;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .template-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          background: white;
        }

        .preview {
          height: 200px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 1rem;
        }

        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
            .template-actions {
          margin-top: 1rem;
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .action-button {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          background: #4299e1;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-button:hover {
          background: #3182ce;
        }

        .template-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .template-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .modal-overlay {
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
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        .modal-body {
          padding: 1rem;
        }

        .data-section {
          margin-bottom: 1.5rem;
        }

        .data-section h4 {
          margin-bottom: 0.5rem;
          color: #4a5568;
          margin: 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .copy-button {
          padding: 4px 8px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          background: #f7fafc;
          color: #4a5568;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .copy-button:hover {
          background: #edf2f7;
        }

        pre {
          background: #f7fafc;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .logout-button {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          background: #f56565;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-button:hover {
          background: #c53030;
        }

        .no-templates {
          grid-column: 1 / -1;
          text-align: center;
          padding: 2rem;
          background: #f7fafc;
          border-radius: 8px;
          color: #4a5568;
        }
       

        .get-started-btn {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .get-started-btn:hover {
          background: #3182ce;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
    </Layout>
  );
}