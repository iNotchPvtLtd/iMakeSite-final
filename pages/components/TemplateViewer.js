import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TemplateViewer() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/api/getTemplates');
        setTemplates(response.data.templates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) return <div>Loading templates...</div>;

  return (
    <div className="template-viewer">
      <h2>Saved Templates</h2>
      <div className="templates-grid">
        {templates.map(template => (
          <div key={template._id} className="template-card">
            <div className="template-preview" dangerouslySetInnerHTML={{ __html: template.template }} />
            <div className="template-info">
              <h3>Template</h3>
              <p>Saved on: {new Date(template.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .template-viewer {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        .template-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        .template-preview {
          padding: 1rem;
          background: white;
          min-height: 200px;
        }
        .template-info {
          padding: 1.5rem;
          background: #f7fafc;
        }
      `}</style>
    </div>
  );
}