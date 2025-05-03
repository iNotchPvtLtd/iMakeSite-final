import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout'; // Assuming Layout component exists

export default function BrowserPreview() {
  const router = useRouter();
  const { templateId } = router.query;
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (templateId) {
      fetchTemplateData(templateId);
    }
  }, [templateId]);

  const fetchTemplateData = async (id) => {
    setLoading(true);
    setError('');
    try {
      // Use the existing API endpoint identified earlier
      const response = await axios.get(`/api/templates/${id}`);
      if (response.data.success) {
        setTemplateData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch template data.');
      }
    } catch (err) {
      console.error('Error fetching template data:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching template data.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back(); // Go back to the previous page (ViewTemplates)
  };

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={handleBack} style={styles.backButton}>← Back</button>
          <h1 style={styles.title}>Browser Preview{templateData ? `: ${templateData.pageName}` : ''}</h1>
        </div>

        {loading && <div style={styles.message}>Loading preview...</div>}
        {error && <div style={styles.errorMessage}>Error: {error}</div>}

        {templateData && (
          <div style={styles.previewContainer}>
            <iframe
              srcDoc={`<style>${templateData.styles}</style>${templateData.template}`}
              title={`Preview of ${templateData.pageName}`}
              style={styles.iframe}
              sandbox="allow-scripts allow-same-origin" // Allow scripts but restrict some actions for security
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

// Basic inline styles for demonstration
const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '1rem',
  },
  backButton: {
    padding: '0.5rem 1rem',
    marginRight: '1rem',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: '#f8f8f8',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
  },
  message: {
    textAlign: 'center',
    padding: '2rem',
    color: '#555',
  },
  errorMessage: {
    textAlign: 'center',
    padding: '2rem',
    color: 'red',
    fontWeight: 'bold',
  },
  previewContainer: {
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden',
    height: '75vh', // Adjust height as needed
    backgroundColor: '#fff',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
};
