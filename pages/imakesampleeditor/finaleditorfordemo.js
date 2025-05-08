
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjsPresetWebpage from 'grapesjs-preset-webpage';
import React from 'react';
import axios from 'axios';
// import { useGuestUser } from '../src/hooks/useGuestUser';
import { useGuestUser } from '../../src/hooks/useGuestUser';



const DomainModal = ({ isOpen, onClose, onSubmit }) => {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!domain) {
      setError('Enter your domain name to publish your fantastic website!');
      return;
    }

    const trimmedDomain = domain.trim();
    const isLocalhost = /^localhost(:\d+)?$/.test(trimmedDomain);
    const isValidDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(trimmedDomain);

    if (isLocalhost || isValidDomain) {
      setIsSubmitting(true);
      try {
        const response = await onSubmit(trimmedDomain);
        if (response.status === 400 && response.data.message === 'Port is already in use') {
          setError('The specified port is already in use. Please choose a different port.');
        } else {
          setIsSubmitting(false);
          onClose();
        }
      } catch (err) {
        setError('Failed to host your website. Please try again.');
        setIsSubmitting(false);
      }
    } else {
      setError('Please enter a valid domain name or localhost:port');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '400px',
      }}>
        <h2 style={{ marginTop: 0, color: '#1a1a1a' }}>Host Your Website!</h2>
        <p style={{ color: '#4a5568' }}>Add your domain here to go live instantly.🚀</p>
        
        <input
          type="text"
          value={domain}
          onChange={(e) => {
            setDomain(e.target.value);
            setError('');
          }}
          placeholder="example.com"
          style={{
            width: '100%',
            padding: '8px 5px',
            marginBottom: '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            fontSize: '16px',
          }}
        />
        
        {error && <p style={{ color: '#e53e3e', marginBottom: '12px' }}>{error}</p>}
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e2e8f0',
              color: isSubmitting ? '#9ca3af' : '#1a1a1a',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !domain}
            className={domain ? 'color-wrap' : ''}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting || !domain ? 'not-allowed' : 'pointer',
              opacity: isSubmitting || !domain ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.3s ease'
            }}
          >
            {isSubmitting ? (
              <>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Hosting...
              </>
            ) : (
              'Launch Website'
            )}
          </button>
        </div>
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
        `}</style>
      </div>
    </div>
  );
};

// import Layout from './components/Layout';



export default function TemplateEditor() {
    const router = useRouter();
    const { templateId } = router.query;
    const editorRef = useRef(null);
    const [templateName, setTemplateName] = useState('');
    const { isGuest, guestName } = useGuestUser();
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

  

      const generateNumericId = (length = 3) => {
        return Math.floor(Math.random() * Math.pow(10, length));
      };
      

    useEffect(() => {

        const initEditor = async () => {
            try {
                // setLoading(true);

                const htmlPath = localStorage.getItem('dynamicTemplateUrl');
                const templateName = localStorage.getItem('dynamicTemplateUrlName');
                setTemplateName(templateName);
                if (!htmlPath) return;
            
                // Fetch template HTML
                const res = await fetch(htmlPath);
                const html = await res.text();

                // Pre-process the HTML to ensure compatibility
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

    

                // Initialize editor
                const editor = grapesjs.init({
                    container: '#gjs',
                    fromElement: false,
                    components: doc.documentElement.innerHTML,
                    storageManager: false,
                    height: '100vh',
                    width: 'auto',
                    plugins: [grapesjsPresetWebpage],
                    canvas: {
                        styles: [
                            'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
                        ],
                        scripts: [], // Add any required scripts here
                    },
                    // deviceManager: {
                    //     devices: [
                    //         {
                    //             name: 'Desktop',
                    //             width: '',
                    //         },
                    //         {
                    //             name: 'Tablet',
                    //             width: '768px',
                    //             widthMedia: '992px',
                    //         },
                    //         {
                    //             name: 'Mobile',
                    //             width: '320px',
                    //             widthMedia: '480px',
                    //         }
                    //     ]
                    // },
                    blockManager: {
                        appendTo: '#blocks'
                    },
                    panels: {
                        defaults: [
                            {
                                id: 'layers',
                                el: '.panel__right',
                                resizable: {
                                    tc: false,
                                    cr: true,
                                    bc: false,
                                    keyWidth: 'flex-basis',
                                },
                            },
                            {
                                id: 'panel-switcher',
                                el: '.panel__devices',
                                buttons: [
                                    {
                                        id: 'device-desktop',
                                        label: '🖥️ Desktop',
                                        command: 'set-device-desktop',
                                        active: true,
                                        togglable: false,
                                    },
                                    {
                                        id: 'device-tablet',
                                        label: '📱 Tablet',
                                        command: 'set-device-tablet',
                                        togglable: false,
                                    },
                                    {
                                        id: 'device-mobile',
                                        label: '📱 Mobile',
                                        command: 'set-device-mobile',
                                        togglable: false,
                                    }
                                ],
                            }
                        ]
                    }
                });

                // Apply custom styling
                const style = document.createElement('style');
                style.innerHTML = `


            .gjs-pn-panel {
            position: absolute;
          }
          .gjs-two-color {
            color: #fff;
          }
          .gjs-four-color {
            color: #fff;
          }
 
          .gjs-cv-canvas {
              box-sizing: border-box;
              width: calc(100% - 220px);
              height: calc(100% - 50px);
              bottom: 0;
              overflow: hidden;
              z-index: 1;
              position: absolute;
              left: 0;
              top: 6%;
            //   top: var(--gjs-canvas-top);
          }
                `;
                document.head.appendChild(style);

                // editor.Canvas.getBody().style.width = '100px';
                editorRef.current = editor;


                // localStorage.removeItem('dynamicTemplateUrl');
            } catch (error) {
                console.error('Failed to initialize editor:', error);
            }
        };

        initEditor();
    }, [templateId]);

    const handleSave = async () => {
 
        if (!editorRef.current) return;

        try {
            const customizedSiteHTML = editorRef.current.getHtml();
            const customizedSiteCSS = editorRef.current.getCss();

            console.log('iMakeSite SampleTemplate saved html data', customizedSiteHTML);
            console.log('iMakeSite SampleTemplate saved html data', customizedSiteCSS  );

            const template = customizedSiteHTML;
            const styles = customizedSiteCSS;
           

            if(isGuest){
                setShowDomainModal(true);
                return;
            }else{

                const data = {
                    template,
                    styles,
                    timestamp: new Date()
                  };
    
                  //Save template to saveTemplate MongoDB
                  const responseTemplate = await axios.post('/api/saveTemplate', data);
    
                    // Save the HTML and CSS to the saveCustomizedSite database
                    const response = await axios.post('/api/saveCustomizedSite', {
                    templateId,
                    templateName,
                    customizedSiteHTML,
                    customizedSiteCSS
                });

                if (response.status && responseTemplate.status) {
                    alert('Template saved successfully');
                    setShowDomainModal(true);
                    return;
                }
               
            }
           
        } catch (error) {
            console.error('Failed to save template:', error);
            alert('Failed to save template');
        }
    };

    const handleBack = () => {
        router.push('/Dashboard');
    };



    async function handleSaveTemplate(htmlContent, port) {

        const res = await fetch('/api/dynamic-template', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ htmlContent, port }),
        });
    
        const data = await res.json();
    
        if (data.success) {
            console.log(`Server started on port: ${data.port}`);
        } else {
            console.error(`Error: ${data.message}`);
        }
    }
    

    const handleDomainSubmit = async (domain) => {
        try {
            setIsSaving(true);
            if (!editorRef.current) {
                throw new Error('Editor not initialized');
            }

            const customizedSiteHTML = editorRef.current.getHtml();
            const customizedSiteCSS = editorRef.current.getCss();
            

            const randomTemplateId =  generateNumericId();

            console.log('iMakeSite SampleTemplate domain data', domain);
            console.log('iMakeSite SampleTemplate guestName data', guestName);
            console.log('iMakeSite SampleTemplate templateId data', templateId);
            console.log('iMakeSite SampleTemplate templateName data', templateName);
            console.log('iMakeSite SampleTemplate nanoid data', randomTemplateId);

            if (!customizedSiteHTML || !customizedSiteCSS) {
                throw new Error('Template content is empty');
            }

            const response = await axios.post('/api/hostTemplate', {
                randomTemplateId,
                templateName,
                customizedSiteHTML,
                customizedSiteCSS,
                domain,
                guestName
            });

            if (response.status === 200 && response.data) {
                const { previewUrl } = response.data.template;
                alert(`Awesome! Your site is now live at ${previewUrl}`);
                setShowDomainModal(false);
                
               const port = /^localhost:(\d+)$/.exec(domain.trim())?.[1];
                
               // Redirect to the hosted template
               handleSaveTemplate(customizedSiteHTML, port)
                // Redirect to the hosted template
                // window.open(previewUrl, '_blank');
                // window.open(templateUrl, '_blank');

            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Failed to host template:', error);
            let errorMessage = 'Failed to host template. ';
            if (error.response) {
                errorMessage += error.response.data?.message || 'Server error occurred.';
            } else if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Please try again later.';
            }
            alert(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        // <Layout>
        <div>
            <DomainModal
                isOpen={showDomainModal}
                onClose={() => setShowDomainModal(false)}
                onSubmit={handleDomainSubmit}
            />
            <div
                className="toolbar"
                style={{
                    background: '#1f1f1f',
                    borderBottom: '1px solid #2c2c2c',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={handleBack}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#2d3748',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => e.target.classList.add('color-wrap')}
                        onMouseOut={(e) => e.target.classList.remove('color-wrap')}
                    >
                        ← Back
                    </button>
                    <h2 style={{ color: '#ffffff', margin: 0, paddingLeft:'450px', fontFamily:'cursive' }}>iMakeSite Editor - {templateName || 'Loading'}</h2>
                    </div>
                <button
                    onClick={handleSave}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'rgb(217 16 132)',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => e.target.classList.add('color-wrap')}
                    onMouseOut={(e) => e.target.classList.remove('color-wrap')}
                >
                    💾 Save my website
                </button>
            </div>

            {/* {htmlLoaded ? (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: 'calc(100vh - 60px)',
                    color: '#ffffff'
                }}>
                    Loading editor...
                </div>
            ) : ( */}
                       <div id="gjs"  />
            {/* )} */}
        </div>
        // </Layout>
    );
}

