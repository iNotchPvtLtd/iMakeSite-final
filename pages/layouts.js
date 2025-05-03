import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './components/Layout';
import axios from 'axios';
import { useUserFromToken } from '../src/hooks/useUserFromToken';


export default function Layouts() { 
    const router = useRouter();
    const [selectedLayout, setSelectedLayout] = useState(null); 
    const { userId } = useUserFromToken();  
    const [loading, setLoading] = useState(true);  
  
    useEffect(() => {
      const fetchLayouts = async () => {
        try {
          console.log('loading...',loading);
          if(!userId) return;
          setLoading(false);
        } catch (error) {
          console.error('Error fetching layouts:', error);
          setLoading(false);
        }
      };
      fetchLayouts();
    }, [userId]);

    // Reset loading state when userId changes
    useEffect(() => {
      setLoading(true);
    }, [userId]);

     
  
    useEffect(() => {
      if (selectedLayout) {
        localStorage.setItem('selectedLayout', selectedLayout);
      }
    }, [selectedLayout]);
  
    const handleLayoutSelect = (layout) => {
      console.log('Selected layout:', layout);
      setSelectedLayout(layout);
    };
  
    // if (loading) {
    //   return (
    //     <Layout>
    //       <div className="loading">Loading layouts...</div>
    //     </Layout>
    //   );
    // }



    const handleSave = async () => {
  
      try {
        if (!userId) {
          alert('Please login to save your wishes');
          return;
        }
    
        if (!selectedLayout) {
          alert('Please select a layout');
          return;
        }

        const layoutData = {
          userId: userId || '680417bca7b9cd7caa4a71fc',
          layoutName: selectedLayout || 'default-layout',
          type: selectedLayout || 'default-layout',
          imageUrl: selectedLayout ? '/single-page-layout.svg' : '/multi-page-layout.svg',
          description: `A ${selectedLayout} layout with a modern design`,
          isActive: true,
        };
    

        const response = await axios.post('api/layouts', layoutData);
        console.log('layout Data saved successfully:', response.data);
    
        if (response.data.success) {
          alert('Layout saved successfully!');
          router.push('/logo');
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
 {/* <div className="layout-container">
        <h1 className="title">Layout</h1>
        <p className="subtitle">Do you prefer a modern one-page site or a traditional multi-page site with different subpages?</p> */}

        {/* <div className="layout-options">
          {layouts.map((layout) => (
            <div 
              key={layout._id}
              className={`layout-card ${selectedLayout === layout.type ? 'selected' : ''}`}
              onClick={() => handleLayoutSelect(layout)}
            >
              <div className="layout-image">
                <Image
                  src={layout.imageUrl}
                  alt={layout.name}
                  width={300}
                  height={200}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h3>{layout.name}</h3>
              <p className="layout-description">{layout.description}</p>
            </div>
          ))}
        </div> */}


    <div className="layout-container">
      <h1 className="title">Layout</h1>
      <p className="subtitle">Do you prefer a modern one-page site or a traditional multi-page site with different subpages?</p>

      <div className="layout-options">
       
        <div 
          className={`layout-card ${selectedLayout === 'one-pager' ? 'selected' : ''}`}
          onClick={() => handleLayoutSelect('one-pager')}
        >
          <div className="layout-image">
            <img src="/single-page-layout.svg" alt="One-Pager Layout" />
          </div>
          <h3>Single-Page-Layout</h3>
        </div>

        <div 
          className={`layout-card ${selectedLayout === 'multi-pager' ? 'selected' : ''}`}
          onClick={() => handleLayoutSelect('multi-pager')}
        >
          <div className="layout-image">
            <img src="/multi-page-layout.svg" alt="Multi-Pager Layout" />
          </div>
          <h3>Multi-Page-Layout</h3>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="previous-btn" onClick={() => router.push('/wishes')}>
          Previous
        </button>
        <button 
          className="continue-btn" 

          // onClick={() => router.push('/logo')}
          onClick={handleSave}  
          disabled={!selectedLayout}
        >
          Continue
        </button>
      </div>

      <style jsx>{`
        .layout-container {
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
          margin-bottom: 3rem;
        }

        .layout-options {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .layout-card {
          width: 300px;
          padding: 2rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .layout-card:hover {
          border-color: #0066ff;
        }

        .layout-card.selected {
          border-color: #0066ff;
          background-color: #f0f7ff;
        }

        .layout-image {
          margin-bottom: 1.5rem;
        }

        .layout-image img {
          width: 100%;
          height: auto;
        }

        h3 {
          color: #2d3748;
          font-size: 1.2rem;
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

        .continue-btn:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
        }

        .loading {
            text-align: center;
            padding: 2rem;
            color: #718096;
          }

          .layout-description {
            color: #718096;
            font-size: 0.9rem;
            margin-top: 1rem;
          }
      `}</style>
    </div>
    </Layout>
  );
}