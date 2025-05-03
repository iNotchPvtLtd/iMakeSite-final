import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TemplatePreview() {
  const router = useRouter();
  const { templateId } = router.query;
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    if (templateId) {
      const fetchTemplateData = async () => {
        try {
          const response = await axios.get(`/api/templates/${templateId}`);
          if (response.data.success) {
            setTemplate(response.data.template);
          }
        } catch (error) {
          console.error('Error fetching template:', error);
        }
      };
      fetchTemplateData();
    }
  }, [templateId]);



  if (!template) return <div>Loading...</div>;

  return (
    <div className="preview-wrapper">
      <iframe 
        src={template.htmlPath} 
        className="preview-iframe" 
        title={template.name}
      />
      <div className="button-bar">
        <button
          onClick={() => router.push(`/templates/customize/${templateId}`)}
          className="use-template-btn"
        >
          Use this Template
        </button>
        <button
          onClick={() => router.back()}
          className="back-btn"
        >
          Back
        </button>
      </div>

      <style jsx>{`
        .preview-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
        }
        
        .preview-iframe {
          flex: 1;
          width: 100%;
          border: none;
        }
        
        .button-bar {
          padding: 1rem;
          background: white;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        .use-template-btn, .back-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .use-template-btn {
          background: #0066ff;
          color: white;
        }
        
        .back-btn {
          background: #f1f1f1;
          color: #333;
        }
        
        .use-template-btn:hover, .back-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}