import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function TemplatePage() {
  const router = useRouter();
  const { templateId } = router.query;
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!templateId) return;

    const fetchTemplate = async () => {
      try {
        const response = await fetch(`/api/templates/${templateId}`);
        const data = await response.json();
        
        if (data.success) {
          setTemplate(data.template);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('Failed to fetch template');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div>Error: {error}</div></Layout>;
  if (!template) return <Layout><div>Template not found</div></Layout>;

  return (
    <Layout>
      <div className="template-container">
        <h1>{template.name}</h1>
        <p>{template.description}</p>
        {template.previewImage && (
          <img 
            src={template.previewImage} 
            alt={template.name}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
      </div>
    </Layout>
  );
}