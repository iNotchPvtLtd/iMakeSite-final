import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjsPresetWebpage from 'grapesjs-preset-webpage';
import React from 'react';
import axios from 'axios';
import { useGuestUser } from '../src/hooks/useGuestUser';
import DomainModal from './components/DomainModal';
import blockBasic from 'grapesjs-blocks-basic';
import FormPlugin from 'grapesjs-plugin-forms';

export default function TemplateEditor() {
    const router = useRouter();
    const { templateId } = router.query;
    const editorRef = useRef(null);
    const [templateName, setTemplateName] = useState('');
    const { isGuest, guestName } = useGuestUser();
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [dynamicHeadContent, setDynamicHeadContent] = useState('');


      const generateNumericId = (length = 3) => {
        return Math.floor(Math.random() * Math.pow(10, length));
      };
      

    useEffect(() => {
        const htmlPath = localStorage.getItem('dynamicTemplateUrl');
        const templateName = localStorage.getItem('dynamicTemplateUrlName');
        setTemplateName(templateName);
        // if (!htmlPath) return;

      const initEditor = async () => {
        try {
        //   const res = await fetch('https://imakesite.s3.eu-north-1.amazonaws.com/templates/thumsup/index.html');
            const res = await fetch(htmlPath);
            const html = await res.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const headContent = doc.head.innerHTML;
            setDynamicHeadContent(headContent);

        

                // Initialize editor
                const editor = grapesjs.init({
                    container: '#gjs',
                    height: '100vh',
                    width: 'auto',
                    fromElement: false,
                    components: doc.body.innerHTML,
                    storageManager: false,
                    plugins: [grapesjsPresetWebpage, FormPlugin, blockBasic],
                    // canvas: {
                    //   styles: [
                    //     'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
                    //     ...css
                    //   ],
                    //   scripts: scripts,
                    // },
                    canvas: {
                        styles: [
                            'https://unpkg.com/grapesjs/dist/css/grapes.min.css',
                            'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
                            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
                            'https://imakesite.s3.eu-north-1.amazonaws.com/templates/pets/css/style.css',
                            'https://imakesite.s3.eu-north-1.amazonaws.com/templates/pets/_next/static/media/a34f9d1faa5f3315-s.p.woff2'
                        ],
                        scripts: [
                         'https://imakesite.s3.eu-north-1.amazonaws.com/templates/pets/js/script.js',
                        'https://imakesite.s3.eu-north-1.amazonaws.com/templates/pets/_next/static/chunks/fd9d1056-555af0a569cb886d.js',
                        'https://imakesite.s3.eu-north-1.amazonaws.com/templates/pets/_next/static/chunks/23-f34458a7000dafc3.js'
       

                        ], // Add any required scripts here
                    },

 

      
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
            console.log('dynamicHeadContent data', dynamicHeadContent);
            console.log('document.querySelector.head.innerHTML', document.querySelector('head').outerHTML);
           
    
            const finalHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              ${dynamicHeadContent}  <!-- your template headContent -->
              <style>
                ${editorRef.current.getCss()}  <!-- GrapesJS inline styles -->
              </style>
            </head>
            <body>
              ${editorRef.current.getHtml()} <!-- GrapesJS canvas HTML -->
            </body>
            </html>
            `.trim();
            
            
            console.log('finalHtml data', finalHtml);

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
                finalHtml,
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
               handleSaveTemplate(finalHtml, port)
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