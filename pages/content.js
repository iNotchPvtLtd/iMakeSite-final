import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './components/Layout';

export default function Content() {
    const router = useRouter();
    const [pages, setPages] = useState([]);
    const [currentTitle, setCurrentTitle] = useState('');
    const [sections, setSections] = useState([{ id: 1, content: '', files: [] }]);

    const [selectedThemeId, setSelectedThemeId] = useState(null);

    // useEffect(() => {
    //   const savedPages = localStorage.getItem('websitePages');
    //   if (savedPages) {
    //     setPages(JSON.parse(savedPages));
    //   } 
    // })



  const handleAddSection = () => {
    const newSection = {
      id: sections.length + 1,
      content: '',
      files: []
    };
    setSections([...sections, newSection]);
  };

  const handleDeleteSection = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const handleFileUpload = (sectionId, files) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          files: [...section.files, ...Array.from(files)]
        };
      }
      return section;
    }));
  };

// Add new state for carousel
const [currentSlide, setCurrentSlide] = useState(0);

// Add carousel control handlers
const nextSlide = () => {
  setCurrentSlide((prev) => (prev + 1) % themeOptions.length);
};

const prevSlide = () => {
  setCurrentSlide((prev) => (prev - 1 + themeOptions.length) % themeOptions.length);
};


  // Add theme options
  const themeOptions = [
    { 
      id: 'http://localhost:3001/', 
      name: 'Modern', 
      description: 'Clean and minimalist design',
      thumbnail: '/coke.png'
    },
    { 
      id: 'http://localhost:3002/', 
      name: 'Classic', 
      description: 'Traditional and elegant layout',
      thumbnail: '/pepsi.png'
    },
    { 
      id: 'http://localhost:3003/', 
      name: 'Creative', 
      description: 'Bold and artistic style',
      thumbnail: '/thumsup.png'
    },
    { 
      id: 'http://localhost:3004/', 
      name: 'Professional', 
      description: 'Corporate and business-focused',
      thumbnail: '/sprite.png'
    }
  ];
  

  // Update the handleThemeSelect function
  const handleThemeSelect = (themeId) => {
    setSelectedThemeId(themeId);
    localStorage.setItem('selectedTheme', themeId);
    router.push(themeId, undefined, { shallow: true });
  };
  
  
  useEffect(() => {
    const savedPages = localStorage.getItem('websitePages');
    if (savedPages) {
      setPages(JSON.parse(savedPages));
    }
  }, []);

  const handleAddContent = () => {
    if (currentTitle.trim()) {
      const newPages = [...pages, { id: Date.now(), title: currentTitle }];
      setPages(newPages);
      localStorage.setItem('websitePages', JSON.stringify(newPages));
      setCurrentTitle('');
    }
  };

  const handleRemovePage = (id) => {
    const newPages = pages.filter(page => page.id !== id);
    setPages(newPages);
    localStorage.setItem('websitePages', JSON.stringify(newPages));
  };

  const handleEdit = (id) => {
    const page = pages.find(p => p.id === id);
    setCurrentTitle(page.title);
  };

  return (

    <Layout>
      <div className="content-container">
        <h1 className="title">iMakeSite</h1>
        <h5 className="title">Themes & Content</h5>
        <p className="subtitle">What pages do you want to display on your website?</p>
      



  <div className="theme-section">
    
    <h2 className="section-title">Choose a Theme</h2>
    <div className="carousel-container">
      <button className="carousel-btn prev" onClick={prevSlide}>❮</button>
      <div className="carousel-content">
      
        {themeOptions.map((theme, index) => (
      <div 
      key={theme.id}
      className={`carousel-item ${index === currentSlide ? 'active' : ''} ${selectedThemeId === theme.id ? 'selected' : ''}`}
      onClick={() => handleThemeSelect(theme.id)}
    >
            <div 
              className="theme-preview"
              style={{ 
                backgroundImage: `url(${theme.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="theme-info">
              <h3>{theme.name}</h3>
              <p>{theme.description}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-btn next" onClick={nextSlide}>❯</button>
    </div>
    <div className="carousel-dots">
      {themeOptions.map((_, index) => (
        <span 
          key={index} 
          className={`dot ${index === currentSlide ? 'active' : ''}`}
          onClick={() => setCurrentSlide(index)}
        />
      ))}
    </div>
  </div>


        <div className="content-section">
          <div className="title-input-section">
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              placeholder="Title..."
              className="title-input"
            />
            <button 
              className="add-content-btn"
              onClick={handleAddContent}
              disabled={!currentTitle.trim()}
            >
              <span className="plus-icon">+</span>
              Add Content
            </button>
          </div>

          {pages.length > 0 && (
            <div className="pages-list">
              {pages.map(page => (
                <div key={page.id} className="page-item">
                  <span className="page-title">{page.title}</span>
                  <button className="edit-btn" onClick={() => handleEdit(page.id)}>
                    Edit
                  </button>
                  <button className="remove-btn" onClick={() => handleRemovePage(page.id)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {sections.map((section) => (
          <div key={section.id} className="section-container">
            <div className="section-header">
              <h2>SECTION {section.id}</h2>
              <button onClick={() => handleDeleteSection(section.id)} className="delete-section">
                Delete section
              </button>
            </div>

            <div className="editor-toolbar">
              <button className="toolbar-btn"><strong>B</strong></button>
              <button className="toolbar-btn"><i>I</i></button>
              <button className="toolbar-btn"><u>U</u></button>
              <div className="separator"></div>
              <button className="toolbar-btn">⌘</button>
              <button className="toolbar-btn">≡</button>
              <button className="toolbar-btn">•</button>
              <div className="separator"></div>
              <button className="toolbar-btn">↺</button>
              <button className="toolbar-btn">↻</button>
            </div>

            <textarea
              placeholder="What do you want to communicate to your customers in this section?"
              className="content-editor"
            />

            <div className="file-upload">
              <div className="upload-area">
                <span>Drop files here. Click to upload or</span>
                <button className="upload-btn">Choose from uploaded files</button>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(section.id, e.target.files)}
                  className="file-input"
                />
              </div>
            </div>
          </div>
        ))}

        <button onClick={handleAddSection} className="add-section-btn">
          + Add another section
        </button>

        <div className="navigation-buttons">
          <button className="previous-btn" onClick={() => router.push('/colors')}>
            Previous
          </button>
          <button 
      className="continue-btn" 
      onClick={() => {
        if (selectedThemeId) {
          localStorage.setItem('selectedTheme', selectedThemeId);
        }
        router.push('/contact');
      }}
      disabled={pages.length === 0 || selectedThemeId}
    >
      Continue
    </button>
        </div>

        <style jsx>{`

          .section-container {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .editor-toolbar {
            display: flex;
            gap: 5px;
            padding: 8px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            margin-bottom: 10px;
          }

          .toolbar-btn {
            padding: 5px 10px;
            border: none;
            background: none;
            cursor: pointer;
            border-radius: 4px;
          }

          .toolbar-btn:hover {
            background: #f7fafc;
          }

          .separator {
            width: 1px;
            background: #e2e8f0;
            margin: 0 5px;
          }

          .content-editor {
            width: 100%;
            min-height: 150px;
            padding: 15px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            margin-bottom: 15px;
            resize: vertical;
          }

          .file-upload {
            border: 2px dashed #e2e8f0;
            border-radius: 4px;
            padding: 20px;
            text-align: center;
          }

          .upload-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }

          .upload-btn {
            color: #0066ff;
            background: none;
            border: none;
            cursor: pointer;
            text-decoration: underline;
          }

          .file-input {
            display: none;
          }

          .add-section-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border: 2px solid #0066ff;
            border-radius: 4px;
            background: white;
            color: #0066ff;
            cursor: pointer;
            margin: 20px 0;
          }

          .content-container {
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

          .content-section {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
          }

          .title-input-section {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .title-input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            font-size: 1rem;
          }

          .add-content-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border: 2px solid #0066ff;
            border-radius: 4px;
            background: white;
            color: #0066ff;
            cursor: pointer;
            font-weight: 500;
          }

          .plus-icon {
            font-size: 1.2rem;
            font-weight: bold;
          }

          .pages-list {
            max-height: 300px;
            overflow-y: auto;
            padding-right: 0.5rem;
          }

          .page-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            margin-bottom: 0.5rem;
          }

          .page-title {
            flex: 1;
          }

          .edit-btn {
            padding: 0.5rem 1rem;
            margin-right: 0.5rem;
            background: #f0f7ff;
            color: #0066ff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .remove-btn {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #ff4444;
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
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

          .theme-section {
      margin-bottom: 2rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .theme-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .theme-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .theme-preview {
      height: 180px;
      background: #f7fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .theme-info {
      padding: 1rem;
    }

    .theme-info h3 {
      font-size: 1.1rem;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    .theme-info p {
      font-size: 0.9rem;
      color: #718096;
      margin: 0;
    }

    .carousel-container {
      position: relative;
      display: flex;
      align-items: center;
      margin: 2rem 0;
    }

    .carousel-content {
      width: 100%;
      overflow: hidden;
      position: relative;
      height: 350px;
    }

    .carousel-item {
      position: absolute;
      width: 100%;
      opacity: 0;
      transition: all 0.5s ease;
      transform: translateX(100%);
    }

    .carousel-item.active {
      opacity: 1;
      transform: translateX(0);
    }

    .carousel-btn {
      background: rgba(0, 0, 0, 0.3);
      color: white;
      border: none;
      padding: 1rem;
      cursor: pointer;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      transition: background 0.3s;
    }

    .carousel-btn:hover {
      background: rgba(0, 0, 0, 0.5);
    }

    .carousel-btn.prev {
      margin-right: 1rem;
    }

    .carousel-btn.next {
      margin-left: 1rem;
    }

    .carousel-dots {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #e2e8f0;
      cursor: pointer;
      transition: background 0.3s;
    }

    .dot.active {
      background: #0066ff;
    }

    /* Update theme card styles for carousel */
    .theme-preview {
      height: 250px;
    }
      .carousel-item {
      position: absolute;
      width: 100%;
      opacity: 0;
      transition: all 0.5s ease;
      transform: translateX(100%);
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .theme-preview {
      height: 400px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transition: transform 0.3s ease;
    }

    .theme-preview:hover {
      transform: scale(1.02);
    }

    .theme-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(5px);
    }

    .carousel-btn {
      background: rgba(0, 0, 0, 0.5);
      color: white;
      font-size: 1.5rem;
      width: 50px;
      height: 50px;
    }
      .carousel-item.selected {
      border: 3px solid #0066ff;
      transform: scale(1.02);
    }

    .carousel-item.selected .theme-info {
      background: rgba(0, 102, 255, 0.1);
    }

    .carousel-item.selected h3 {
      color: #0066ff;
    }

    .theme-preview {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .carousel-item.selected .theme-preview {
      box-shadow: 0 8px 16px rgba(0, 102, 255, 0.2);
    }

    .carousel-content {
      width: 100%;
      overflow: hidden;
      position: relative;
      height: 280px;  // Reduced from 350px
    }

    .theme-preview {
      height: 200px;  // Reduced from 400px
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transition: transform 0.3s ease;
    }

    .theme-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;  // Reduced from 1.5rem
      background: rgba(255, 255, 255, 0.95);
    }

    .theme-info h3 {
      font-size: 1rem;  // Reduced from 1.1rem
      margin-bottom: 0.25rem;  // Reduced from 0.5rem
    }

    .theme-info p {
      font-size: 0.8rem;  // Reduced from 0.9rem
      line-height: 1.2;
    }
      .carousel-content {
      width: 100%;
      overflow: hidden;
      position: relative;
      height: 280px;
      background: #ffffff;
    }

    .theme-preview {
      height: 200px;
      background-size: contain;  // Changed from 'cover' to 'contain'
      background-position: center;
      background-repeat: no-repeat;
      transition: transform 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px;
      background-color: #f8f9fa;
    }

    .carousel-item {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: all 0.5s ease;
      transform: translateX(100%);
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .theme-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.98);
      border-top: 1px solid #edf2f7;
    }

    theme-checkbox {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 2;
    }

    .theme-checkbox input {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .carousel-item.selected {
      border: 3px solid #0066ff;
      transform: scale(1.02);
    }

    .continue-btn:disabled {
      background: #cbd5e0;
      cursor: not-allowed;
      opacity: 0.7;
    }

        `}</style>
      </div>
    </Layout>
  );
}