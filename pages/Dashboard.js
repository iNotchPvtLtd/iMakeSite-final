import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './components/Layout';
import Image from 'next/image';
import { useUserFromToken } from '../src/hooks/useUserFromToken';
import { useGuestUser } from '../src/hooks/useGuestUser';


export default function Dashboard() {
  const { userId } = useUserFromToken();
  const { isGuest, guestName } = useGuestUser();
  const router = useRouter();
  const [selectedTemplates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState(null);

  useEffect(() => {
    console.log('Dashboard useEffect called : isGuest', isGuest);
    console.log('Dashboard useEffect called : guestName', guestName);
    console.log('Dashboard useEffect called : pendingTemplate', pendingTemplate);
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const fixedTemplateIds = [1,2,3,4,5,6,7,8,9,10,11];
        
        // Fetch templates and user selections concurrently
        const [baseTemplatesResponse, userSelectionsResponse] = await Promise.all([
          axios.get(`api/webtemplates?templateIds=${fixedTemplateIds.join(',')}`),
          userId ? axios.get(`api/webtemplates?userId=${userId}`) : Promise.resolve({ data: { templates: [] } })
        ]).catch(() => [
          { data: { success: false, templates: [] } }, // Default empty response on error for base templates
          { data: { success: false, templates: [] } }  // Default empty response on error for user selections
        ]);
        
        const baseTemplates = baseTemplatesResponse.data.success ? baseTemplatesResponse.data.templates : [];
        const userSelections = userSelectionsResponse.data.success ? userSelectionsResponse.data.templates : [];
        
        // Combine and deduplicate templates
        const combinedTemplatesMap = new Map();
        
        // Add base templates first
        baseTemplates.forEach(template => {
          combinedTemplatesMap.set(template.templateId, { 
            ...template, 
            isSelected: false // Default to not selected initially
          });
        });
        
        // Add user selections, marking them as selected and updating existing entries
        userSelections.forEach(selectedTemplate => {
          if (combinedTemplatesMap.has(selectedTemplate.templateId)) {
            // Update existing base template entry
            combinedTemplatesMap.set(selectedTemplate.templateId, {
              ...combinedTemplatesMap.get(selectedTemplate.templateId),
              ...selectedTemplate, // Ensure user selection data (like isSelected and status) overrides base data
              // Use the isSelected value from the user's selection data
              isSelected: selectedTemplate.isSelected !== undefined ? selectedTemplate.isSelected : true 
            });
          } else {
            // Add user-selected template if it wasn't a base template
            combinedTemplatesMap.set(selectedTemplate.templateId, { 
              ...selectedTemplate, 
              // Use the isSelected value from the user's selection data
              isSelected: selectedTemplate.isSelected !== undefined ? selectedTemplate.isSelected : true 
            });
          }
        });
        
        // Convert map back to array
        const finalTemplates = Array.from(combinedTemplatesMap.values());
        
        setTemplates(finalTemplates);
        // No longer need separate setSelectedTemplates state, isSelected flag handles it
        // setSelectedTemplates(userSelections); // Remove this line
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [userId]);


  const handleTemplateSelection = async (template, select) => {
    try {
      if (isGuest) {
        setPendingTemplate({ template, select });
        setShowLoginModal(true);
        return;
      }

      // Check if template is already selected to prevent duplicates
      const isAlreadySelected = templates.find(
        t => t.templateId === template.templateId && t.isSelected
      );

      if (select && isAlreadySelected) {
        return; // Prevent duplicate selection
      }

      const response = await axios.put('api/webtemplates', {
        userId: userId,
        templateId: template.templateId,
        name: template.name,
        description: template.description,
        previewImage: template.previewImage,
        htmlPath: template.htmlPath,
        category: template.category,
        isSelected: select,
        status: select ? 'active' : 'inactive',
        isActive: true,
        version: '1.0',
        settings: {
          isCustomized: false,
          lastEdited: null
        }
      });
  
      if (response.data.success) {
        // Update local state
        setTemplates(prevTemplates => 
          prevTemplates.map(t => 
            t.templateId === template.templateId 
              ? { ...t, isSelected: select }
              : t
          )
        );
        setShowPreviewModal(false);
      }
    } catch (error) {
      console.error('Error updating template selection:', error);
      // Handle specific error cases
      if (error.response && error.response.status === 409) {
        // Retry the operation with a PUT request
        try {
          const retryResponse = await axios.put('api/webtemplates', {
            userId: userId,
            templateId: template.templateId,
            isSelected: select,
            status: select ? 'active' : 'inactive'
          });
          
          if (retryResponse.data.success) {
            setTemplates(prevTemplates => 
              prevTemplates.map(t => 
                t.templateId === template.templateId 
                  ? { ...t, isSelected: select }
                  : t
              )
            );
            setShowPreviewModal(false);
          }
        } catch (retryError) {
          console.error('Error retrying template selection:', retryError);
          alert('Failed to update template selection. Please try again.');
        }
      } else {
        alert('Failed to update template selection. Please try again.');
      }
    }
  };

  const handleGuestButtonClick = (template) => {
    setShowLoginModal(false);
    localStorage.setItem('dynamicTemplateUrl', template.htmlPath);
    localStorage.setItem('dynamicTemplateUrlName', template.name);
    router.push(`/TemplateEditor?templateId=${template.templateId}`);
  };

  const handleCustomizeClick = async (template, e) => {
    if (e) e.stopPropagation();
    
    try {
      // For logged-in users, select the template first
      if (userId) {
        const isAlreadySelected = templates.find(
          t => t.templateId === template.templateId && t.isSelected
        );

        if (!isAlreadySelected) {
          await handleTemplateSelection(template, true);
        }
        // Navigate to TemplateEditor with templateId
        ///TemplateEditor?htmlUrl=https://your-bucket/path/to/index.html
        localStorage.setItem('dynamicTemplateUrl', template.htmlPath);
        localStorage.setItem('dynamicTemplateUrlName', template.name);
        router.push(`/TemplateEditor?templateId=${template.templateId}`);
      } else if (isGuest) {
        // For guest users, save template selection with guest identifier

            // Store the template for later and show login modal
            setPendingTemplate(template);
            setShowLoginModal(true);

      } else {
        // If not logged in and not a guest, redirect to login
        router.push('/login');
      }
    } catch (error) {
      console.error('Error customizing template:', error);
      alert('Failed to customize template. Please try again.');
    }
  };


  const handlePreviewClick = (template, e) => {
    e.stopPropagation();
    setCurrentTemplate(template);
    setShowPreviewModal(true);
  };

  return (
    <Layout>
    <div className="dashboard-container">
      <h1>Welcome to iMakeSite</h1>
      {isGuest && (
        <div className="guest-banner">
          <p> Hi, {guestName}! You're in guest mode. You can preview and customize complimentary templates.  </p>
          <button onClick={() => router.push('/login')} className="login-link">
            👉 Unlock
          </button>
        </div>
      )} 

      {/* First Grid - Dashboard Features */}
      {!isGuest && (
           <div className="dashboard-grid">
            <div className="dashboard-card" onClick={() => router.push('/wishes')}>
              <div className="card-icon">
                <img src="/youridea.png" alt="Wishes"  />
              </div>
              <h2>Wishes</h2>
              <p>Tell us your requests and requirements for your new website.</p>
            </div>

            <div className="dashboard-card" onClick={() => router.push('/file-manager')}>
              <div className="card-icon">
                <img src="/file-manager.png" alt="File Manager" />
              </div>
              <h2>File Manager</h2>
              <p>Have new images for your website? Perfect! Upload them via our easy-to-use file manager.</p>
            </div>

            <div className="dashboard-card" onClick={() => router.push('/DashboardEditor')}>
              <div className="card-icon">
                <img src="/editor.png" alt="Editor" />
              </div>
              <h2>iMakeSite Design Studio</h2>
              <p>Start building your website with our powerful drag-and-drop editor.</p>
            </div>
            <div className="dashboard-card" onClick={() => router.push('/ViewTemplates')}>
          <div className="card-icon">
            <img src="/templates.png" alt="Saved Templates" />
          </div>
          <h2>Saved Templates</h2>
          <p>View and manage your saved website templates.</p>
        </div>
      </div>
)}

     

      {/* Templates Section */}
      <div className="templates-section">
          <h2 className='template-title'>Complimentary Templates</h2>
          {loading ? (
          <div className="loading">Loading templates...</div>
        ) : (
          <div className="templates-grid">
            {templates.map(template => {
              const isSelected = template.isSelected || selectedTemplates.some(
                st => st.templateId === template.templateId
              );

              return (
                <div 
                  key={template._id}
                  className={`template-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="template-preview">
                    <Image
                      src={template.previewImage}
                      alt={template.name}
                      width={400}
                      height={250}
                      style={{ objectFit: 'cover' }}
                      className="preview-image"
                    />
                    {isSelected && (
                      <div className="selected-badge">Selected</div>
                    )}
                  </div>
                  <div className="template-info">
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                    <div className="template-footer">
                      <span className="category">{template.category}</span>
                      <div className="action-buttons">
                        <button 
                          className="preview-btn"
                          onClick={(e) => handlePreviewClick(template, e)}
                        >
                          Preview Template
                        </button>
                        <button 
                          className="continue-btn color-wrap bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomizeClick(template);
                          }}
                        >
                          {isSelected ? 'I want to use this template' : 'I want to use this template'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>

        {/* Preview Modal */}
        {showPreviewModal && currentTemplate && (
          <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
            <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
              <div className="preview-header">
                <h2>{currentTemplate.name}</h2>
                <button 
                  className="close-preview-btn"
                  onClick={() => setShowPreviewModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="preview-body">
                <iframe 
                  src={currentTemplate.htmlPath} 
                  title={currentTemplate.name}
                  className="preview-iframe"
                />
              </div>
              <div className="preview-actions">
                {isGuest ? (
                  <div className="guest-actions">
                    <p>Create an account to save your customized template!</p>
                    <div className="action-buttons">
                      <button 
                        className="action-btn primary"
                        onClick={() => router.push('/login')}
                      >
                        Create Account / Login
                      </button>
                      {/* <button 
                        className="action-btn secondary"
                        onClick={() => handleCustomizeClick(currentTemplate)}
                      >
                        Continue as Guest
                      </button> */}
                    </div>
                  </div>
                ) : (
                  <div className="user-actions">
                    <button 
                      className="action-btn primary"
                      onClick={() => handleTemplateSelection(currentTemplate, true)}
                    >
                      I Like It! Select This Template
                    </button>
                    <button 
                      className="action-btn secondary"
                      onClick={() => handleTemplateSelection(currentTemplate, false)}
                    >
                      No, Thanks
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .preview-modal-content {
            width: 95vw;
            height: 95vh;
            background: white;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
          }

          .preview-header h2 {
            margin: 0;
            font-size: 1.5rem;
            color: #343a40;
          }

          .close-preview-btn {
            background: none;
            border: none;
            font-size: 2rem;
            color: #6c757d;
            cursor: pointer;
            padding: 0;
            line-height: 1;
          }

          .close-preview-btn:hover {
            color: #343a40;
          }

          .preview-body {
            flex: 1;
            position: relative;
            overflow: hidden;
          }

          .preview-iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
          }

          .preview-actions {
            padding: 1.5rem;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }

          .guest-actions, .user-actions {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .guest-actions p {
            margin: 0;
            color: #495057;
            text-align: center;
          }

          .action-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
          }

          .action-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
          }

          .action-btn::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, #0066ff, transparent);
            transition: transform 0.5s ease;
            transform: translateX(-100%);
          }

          .action-btn:hover::before {
            transform: translateX(100%);
          }

          .action-btn:hover {
            color: white;
          }

          .action-btn.primary {
            background: #0066ff;
            color: white;
          }

          .action-btn.primary:hover {
            background: #0052cc;
          }

          .action-btn.secondary {
            background: #e9ecef;
            color: #495057;
          }

          .action-btn.secondary:hover {
            background: #dee2e6;
            border: 2px solid transparent;
            animation: borderAnimation 2s ease infinite;
          }

          @keyframes borderAnimation {
            0% {
              border-color: #ff0080;
            }
            50% {
              border-color: #ff8c00;
            }
            100% {
              border-color: #40e0d0;
            }
          }
        `}</style>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
            <div className="modal-content login-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Login Required</h2>
                <button className="close-button" onClick={() => setShowLoginModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="modal-icon">🔐</div>
                <p>To save and customize your selected template, please create an account or log in.</p>
                <div className="modal-actions-login-required">
                  <button 
                    className="modal-btn login"
                    onClick={() => router.push('/login')}
                  >
                    Create Account / Login
                  </button>
                  <button 
                    className="modal-btn preview"
                    onClick={() => {
                            handleGuestButtonClick(pendingTemplate);
                    }}
                  >
                    Continue as Guest
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .modal-overlay {
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
            backdrop-filter: blur(4px);
          }

          .modal-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }

          .modal-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .modal-btn:hover {
            transform: translateY(-1px);
          }

          .modal-btn.close {
            background: #e9ecef;
            color: #495057;
          }

          .modal-btn.close:hover {
            background: #dee2e6;
          }

          .login-modal {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 400px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
          }

          .modal-header h2 {
            margin: 0;
            font-size: 1.25rem;
            color: #1a202c;
          }

          .close-button {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #64748b;
            cursor: pointer;
            padding: 0.25rem;
            line-height: 1;
            transition: color 0.2s;
          }

          .close-button:hover {
            color: #1a202c;
          }

          .modal-body {
            padding: 1.5rem;
          }

          .modal-icon {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 1rem;
          }

          .modal-body p {
            text-align: center;
            color: #4a5568;
            margin: 0 0 1.5rem;
            line-height: 1.5;
          }

          .modal-actions-login-required {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .modal-btn {
            width: 100%;
            padding: 0.75rem;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .modal-btn.login {
            background: #3b82f6;
            color: white;
          }

          .modal-btn.login:hover {
            background: #2563eb;
          }

          .modal-btn.preview {
            background: #f1f5f9;
            color: #f1f5f9;
          }

          .modal-btn.preview:hover {
            background:rgb(216, 226, 240);
          }
        `}</style>


      {/* Second Grid - Templates Preview */}
      {/* <div className="templates-section">
        <h2>Complimentary Templates</h2>
        <div className="templates-grid">
          {templates.map(template => (
            <div 
              key={template.id} 
              className="template-card"
              onClick={() => handleTemplateClick(template.url)}
            >
              <div className="template-image">
                <Image src={template.image} alt={template.name} />
              </div>
              <div className="template-info">
                <h3>{template.name}</h3>
                <p>{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      <style jsx>{`
        .dashboard-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        h1 {
          font-size: 2.5rem;
          color: #2d3748;
          margin-bottom: 2rem;
          text-align: center;
        }

        .guest-banner {
          background: #EDF2F7;
          border-radius: 8px;
          padding: 1rem 2rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .guest-banner p {
          margin: 0;
          color: #4A5568;
        }

        .login-link {
          background: #4299E1;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .login-link:hover {
          background: #3182CE;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .dashboard-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid #edf2f7;
        }

        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .card-icon {
          width: 64px;
          height: 64px;
          margin-bottom: 1rem;
        }

        .card-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .templates-section {
          padding: 2rem 0;
          background: #F7FAFC;
          border-radius: 12px;
          margin-top: 2rem;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
          margin: 0 2rem 3rem;
          padding: 1rem;
        }

        .template-card {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          cursor: pointer;
        }

        .template-card:hover {
          transform: translateY(-5px);
        }

        .template-image img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .template-info {
          padding: 1.5rem;
          background: white;
        }

        .template-info h3 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
        }

        .template-info p {
          margin: 0;
          color: #718096;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #718096;
        }

        .template-image {
          position: relative;
          overflow: hidden;
        }

        .template-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .template-card:hover .template-overlay {
          opacity: 1;
        }

        .preview-btn {
          background: #0066ff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transform: translateY(20px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .template-card:hover .preview-btn {
          transform: translateY(0);
        }

        .preview-btn:hover {
          background: #0052cc;
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
        }

        .guest-modal-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          width: 100%;
        }

        .guest-modal-content p {
          color: #4a5568;
          font-size: 1.1rem;
          margin: 0;
          text-align: center;
        }

        .modal-btn.login {
          background: #0066ff;
          margin-bottom: 1rem;
        }

        .modal-btn.preview {
          background: #718096;
        }

        .template-card.selected {
              border: 2px solid #0066ff;
              box-shadow: 0 0 10px rgba(0, 102, 255, 0.2);
            }

            .selected-badge {
              position: absolute;
              top: 10px;
              right: 10px;
              background: #0066ff;
              color: white;
              padding: 5px 10px;
              border-radius: 15px;
              font-size: 0.8rem;
              font-weight: 600;
              z-index: 2;
            }

            .template-card.selected .preview-btn {
              background: #22c55e;
            }

            .template-card.selected .preview-btn:hover {
              background: #16a34a;
            }


          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            border-radius: 8px;
            width: 90%;
            // height: 90%;
            position: relative;
          }

           .guest-modal-content-section {
            background: white;
            border-radius: 8px;
            width: 90%;
            height: 82%;
            position: relative;
          }

          .preview-iframe {
            width: 100%;
            height: calc(100% - 60px);
            border: none;
            border-radius: 8px 8px 0 0;
          }

          .modal-actions {
            padding: 1rem;
            display: flex;
            justify-content: flex-end;
            background: white;
            border-radius: 0 0 8px 8px;
          }

          .modal-btn {
            padding: 0.5rem 1rem;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-weight: 600;
          }

          .modal-btn.close {
            background: #e2e8f0;
            color: #495057;
          }

          .modal-btn.close:hover {
            background: #cbd5e0;
          }

          .overlay-buttons {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .modal-actions {
          padding: 1rem;
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          background: white;
          border-radius: 0 0 8px 8px;
        }

        .modal-btn {
          // padding: 0.75rem 1.5rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .modal-btn.select {
          background: #22c55e;
          color: white;
        }

        .modal-btn.select:hover {
          background: #16a34a;
        }

        .modal-btn.unselect {
          background: #ef4444;
          color: white;
        }

        .modal-btn.unselect:hover {
          background: #dc2626;
        }

        .modal-btn.close {
          background: #e2e8f0;
          color: #495057;
        }

        .modal-btn.close:hover {
          background: #cbd5e0;
        }
          .customize-btn {
    background: #22c55e;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .customize-btn:hover {
    background: #16a34a;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

  .template-card.selected .customize-btn {
    background: #0066ff;
  }

  .template-card.selected .customize-btn:hover {
    background: #0052cc;
  }

   .templates-section {
            margin-top: 2rem;
            padding: 0rem;
          }

          .templates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
          }

          .template-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            border: 2px solid transparent;
          }

          .template-card.selected {
            border-color: #0066ff;
            box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.1);
          }

          .template-preview {
            position: relative;
            height: 250px;
            background: #f8fafc;
          00%;
            object-fit: cover;
          }

          .selected-badge {
            position: absolut   c    border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
            z-index: 2;
          }

          .template-inf0066ff          padding: 1.5rem;
          }

          .template-info h3 {
            margin: 0;
            font-size: 1.25rem;
            color: #1a202c;
          }

       {   ;
            color: #4a5568;
            font-size: 0.95rem;
          }

          .template-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
          }

          .category {
            background: #f0f9ff;
            color: #0066ff;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .action-buttons {
            display: flex;
            gap: 0.75rem;
          }

          .preview-btn,
          .continue-btn {
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            font-weight: 500;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s;
          }

          .preview-btn {
            background: #f3f4f6;
            color: #4b5563;
          }

          .preview-btn:hover {
            background: #e5e7eb;
          }

          .continue-btn {
            background: #0066ff;
            color: white;
          }

          .continue-btn:hover {
            background: #0052cc;
          }

          .template-card.selected .continue-btn {
            background: #22c55e;
          }

          .template-card.selected .continue-btn:hover {
            background: #16a34a;
          }
            
        .guest-banner {
          background-color: #EDF2F7;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .guest-banner p {
          color: #4A5568;
          margin-bottom: 1rem;
        }

        .login-link {
          background-color: #4299E1;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.2s;
        }

        .login-link:hover {
          background-color: #3182CE;
        }
        .guest-close{
            margin-top: 50px;
           margin-bottom: auto;
    }
           .template-title {
                 padding-left: 13px;
    padding-top: 11px;
           }
      `}</style>
    </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
            <p className="mb-6">Create an account to save your customized template!</p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  router.push('/login');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Create Account / Login
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  if (pendingTemplate) {
                    router.push(`/TemplateEditor?templateId=${pendingTemplate.template.templateId}`);
                  }
                }}
                className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50 transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
