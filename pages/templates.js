import { useState } from 'react';
import Layout from './components/Layout';
import Image from 'next/image';
export default function Templates() {
  const [templates] = useState([
    {
      id: 1,
      name: 'Simple Portfolio',
      description: 'Clean and minimal portfolio template',
      image: '/templates/portfolio.png',
      // url: 'https://github.com/iNotchPvtLtd/iMakeSite.git'
      url: 'https://github.com/iNotchPvtLtd/iMakeSite/archive/refs/heads/main.zip'
    },
    {
      id: 2,
      name: 'Business Landing',
      description: 'Professional business landing page',
      image: '/templates/business.png',
      // url: 'https://github.com/iNotchPvtLtd/iMakeSite.git'
      url: 'https://github.com/iNotchPvtLtd/iMakeSite/archive/refs/heads/main.zip'
    },
    {
      id: 3,
      name: 'E-commerce Store',
      description: 'Modern e-commerce template',
      image: '/templates/ecommerce.png',
      // url: 'https://github.com/iNotchPvtLtd/iMakeSite.git'
      url: 'https://github.com/iNotchPvtLtd/iMakeSite/archive/refs/heads/main.zip'
    }
  ]);

  const handleTemplateClick = (url) => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Programmatically click the link to trigger download
    link.click();
  };

  return (
    <Layout>
    <div className="templates-page">
      <h1>Free React Templates</h1>
      <p className="subtitle">Choose a template to start building your website</p>
      
      <div className="templates-grid">
        {templates.map(template => (
          <div 
            key={template.id} 
            className="template-card"
            onClick={() => handleTemplateClick(template.url)}
          >
            <div className="template-image">
              <Image src={template.image} alt={template.name} width={50} height={50}/>
            </div>
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .templates-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        h1 {
          font-size: 2rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #718096;
          margin-bottom: 2rem;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .template-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s;
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
      `}</style>
    </div>
    </Layout>
  );
}