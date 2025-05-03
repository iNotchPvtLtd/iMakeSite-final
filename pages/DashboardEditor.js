import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import blockBasic from 'grapesjs-blocks-basic';
import FormPlugin from 'grapesjs-plugin-forms';
import axios from 'axios';
import Layout from './components/Layout';
import Link from 'next/link';

export default function DashboardEditor() {
  const router = useRouter();
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current && !editorRef.current) {
      const initEditor = () => {
        try {
          const editor = grapesjs.init({
            container: '#dashboard-editor',
            height: '100%',
            width: 'auto',
            plugins: [blockBasic, FormPlugin],
            blockManager: {
              appendTo: '#blocks',
              blocks: [],
              categories: {
                basic: { label: 'Basic', order: 0 },
                forms: { label: 'Forms', order: 0 }
              }
            },
            storageManager: false,
            panels: {
              defaults: [
                {
                  id: 'panel-devices',
                  el: '.panel__devices',
                  buttons: [
                    {
                      id: 'device-desktop',
                      label: 'Desktop',
                      command: 'set-device-desktop',
                      active: true,
                      togglable: false,
                      className: 'btn-device btn-device-desktop active',
                    },
                    {
                      id: 'device-mobile',
                      label: 'Mobile',
                      command: 'set-device-mobile',
                      togglable: false,
                      className: 'btn-device btn-device-mobile',
                    }
                  ]
                },
                {
                  id: 'panel-actions',
                  el: '.panel__actions',
                  buttons: [
                    {
                      id: 'visibility',
                      active: true,
                      className: 'btn-borders',
                      label: 'Borders',
                      command: 'sw-visibility',
                    },
                    {
                      id: 'save-db',  
                      className: 'btn-submit',
                      label: 'Submit', 
                      command: 'api-export-template', 
                    },
                    {
                      id: 'save',
                      className: 'btn-download',
                      label: 'Download Template',
                      command: 'save-template',
                    }
                  ]
                }
              ]
            },
            deviceManager: {
              devices: [
                {
                  name: 'Desktop',
                  width: '',
                },
                {
                  name: 'Mobile',
                  width: '320px',
                  widthMedia: '480px',
                }
              ]
            },
            // blockManager: {
            //   appendTo: '#blocks'
            // },
            layerManager: {
              appendTo: '#layers-container'
            },
            styleManager: {
              appendTo: '#style-manager-container'
            },
            traitManager: {
              appendTo: '#traits-container'
            }
          });

          editorRef.current = editor;

          const style = document.createElement('style');
          style.innerHTML = `
                          .panel__devices,
                          .panel__actions {
                          display: flex;
                          gap: 10px;
                          padding: 12px;
                          background: #f8fafc;
                          border-radius: 6px;
                          margin-bottom: 15px;
                          }
                          .btn-save-db {
                          background: #4299e1;
                          color: white;
                          border-color: #3182ce;
                          }

                          .btn-save-db:hover {
                          background: #3182ce;
                          }

                          .gjs-pn-btn {
                          display: inline-flex;
                          align-items: center;
                          justify-content: center;
                          padding: 8px 16px;
                          font-size: 14px;
                          font-weight: 500;
                          color:rgb(23, 88, 200);
                          background: white;
                          border: 1px solid #e2e8f0;
                          border-radius: 4px;
                          cursor: pointer;
                          transition: all 0.2s;
                          }

                          .gjs-pn-btn:hover {
                          background: #edf2f7;
                          border-color: #cbd5e0;
                          }

                          .gjs-pn-btn.gjs-pn-active {
                          background: #4299e1;
                          color: white;
                          border-color: #3182ce;
                          }

                          .gjs-pn-buttons {
                          display: flex;
                          flex-wrap: wrap;
                          gap: 8px;
                          }

                          .dashboard-header {
                          position: sticky;
                          top: 0;
                          z-index: 1000;
                          background: white;
                          padding: 1rem;
                          border-bottom: 1px solid #e2e8f0;
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                          }

                          .back-button,
                          .save-button {
                          display: inline-flex;
                          align-items: center;
                          padding: 8px 16px;
                          font-size: 14px;
                          font-weight: 500;
                          border-radius: 4px;
                          cursor: pointer;
                          transition: all 0.2s;
                          }
                            .gjs-block-category {
                              margin-bottom: 15px;
                              background: #ffffff;
                              border: 1px solid #e2e8f0;
                              border-radius: 8px;
                              overflow: hidden;
                            }

                            .gjs-category-title {
                              font-weight: 600;
                              color: #2d3748;
                              padding: 12px 15px;
                              background: #f8fafc;
                              border-bottom: 1px solid #e2e8f0;
                              margin: 0;
                            }

                            .gjs-blocks-c {
                              padding: 15px;
                              display: grid;
                              grid-template-columns: repeat(2, 1fr);
                              gap: 10px;
                              max-height: 300px;
                              overflow-y: auto;
                            }

                            .gjs-block {
                              min-height: 50px;
                              padding: 10px;
                              margin: 0;
                              background: #f8fafc;
                              border: 1px solid #e2e8f0;
                              border-radius: 6px;
                              transition: all 0.2s;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                            }

                            .gjs-block:hover {
                              transform: translateY(-2px);
                              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                              background: #fff;
                            }

                            .gjs-block-label {
                              font-size: 0.85rem;
                              font-weight: 500;
                              color: #4a5568;
                              text-align: center;
                            }

                            .left-sidebar {
                              background: #ffffff;
                              border-right: 1px solid #e2e8f0;
                              padding: 15px;
                            }

                            .panel__devices,
                            .panel__actions {
                              background: #f8fafc;
                              border-radius: 6px;
                              padding: 10px;
                              margin-bottom: 15px;
                            }

                            .gjs-pn-btn {
                              padding: 8px 12px;
                              margin: 0 5px;
                              border-radius: 4px;
                              background: #fff;
                              border: 1px solid #e2e8f0;
                              color: #4a5568;
                              font-weight: 500;
                            }

                            .gjs-pn-btn.gjs-pn-active {
                              background: #4299e1;
                              color: white;
                              border-color: #4299e1;
                            }

                            .editor-canvas {
                              background: #f7fafc;
                              padding: 20px;
                            }

                            .right-sidebar {
                              background: #ffffff;
                              border-left: 1px solid #e2e8f0;
                              padding: 15px;
                            }

                            #style-manager-container,
                            #traits-container,
                            #selectors-container {
                              background: #f8fafc;
                              border-radius: 6px;
                              padding: 15px;
                              margin-bottom: 15px;
                            }

                            .gjs-sm-sector {
                              margin-bottom: 15px;
                              background: #fff;
                              border-radius: 6px;
                              overflow: hidden;
                              border: 1px solid #e2e8f0;
                            }

                            .gjs-sm-title {
                              padding: 12px 15px;
                              background: #f8fafc;
                              font-weight: 600;
                              color: #2d3748;
                              border-bottom: 1px solid #e2e8f0;
                            }
                              dashboard-header {
                          position: sticky;
                          top: 0;
                          z-index: 1000;
                          background: white;
                          padding: 1rem 2rem;
                          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                          }

                          .gjs-block-category {
                          margin-bottom: 15px;
                          background: #ffffff;
                          border: 1px solid #e2e8f0;
                          border-radius: 8px;
                          overflow: hidden;
                          }

                          .gjs-blocks-c {
                          padding: 15px;
                          display: grid;
                          grid-template-columns: repeat(2, 1fr);
                          gap: 10px;
                          height: auto !important;
                          overflow-y: visible;
                          }

                          .gjs-block {
                          width: 100% !important;
                          min-height: 60px;
                          padding: 8px;
                          margin: 0;
                          border: 1px solid #e2e8f0;
                          border-radius: 6px;
                          opacity: 1 !important;
                          }

                          .gjs-block svg {
                          width: 24px;
                          height: 24px;
                          margin-bottom: 5px;
                          }

                          .gjs-block-label {
                          font-size: 12px;
                          line-height: 1.2;
                          }

                          #blocks {
                          height: auto;
                          min-height: 200px;
                          overflow-y: auto;
                          padding: 15px;
                          }

                          .left-sidebar {
                          display: flex;
                          flex-direction: column;
                          height: calc(100vh - 80px);
                          }

                          .panel-section {
                          margin-bottom: 15px;
                          }
                          .btn-borders,
                          .btn-submit,
                          .btn-download {
                          padding: 8px 16px;
                          border-radius: 4px;
                          font-weight: 500;
                          transition: all 0.2s;
                          margin: 0 5px;
                          }

                          .btn-borders {
                          background: #f8fafc;
                          border: 1px solid #e2e8f0;
                          color: #4a5568;
                          }

                          .btn-borders:hover {
                          background: #edf2f7;
                          }

                          .btn-borders.gjs-pn-active {
                          background: #4299e1;
                          color: white;
                          border-color: #3182ce;
                          }

                          .btn-submit {
                          background: #48bb78;
                          color: white;
                          border: 1px solid #38a169;
                          }

                          .btn-submit:hover {
                          background: #38a169;
                          }

                          .btn-download {
                          background: #4299e1;
                          color: white;
                          border: 1px solid #3182ce;
                          }

                          .btn-download:hover {
                          background: #3182ce;
                          }

                          .panel__actions {
                          display: flex;
                          justify-content: flex-start;
                          gap: 10px;
                          padding: 12px;
                          }
                          btn-device {
                          padding: 8px 16px;
                          border-radius: 4px;
                          font-weight: 500;
                          transition: all 0.2s;
                          margin: 0 5px;
                          background: #f8fafc;
                          border: 1px solid #e2e8f0;
                          color: #4a5568;
                        }

                        .btn-device:hover {
                          background: #edf2f7;
                        }

                        .btn-device.active {
                          background: #4299e1;
                          color: white;
                          border-color: #3182ce;
                        }

                        .panel__devices {
                          display: flex;
                          justify-content: flex-start;
                          gap: 10px;
                          padding: 12px;
                        }
                        .btn-device {
                        padding: 8px 16px;
                        border-radius: 4px;
                        font-weight: 500;
                        transition: all 0.2s;
                        margin: 0 5px;
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        color: #4a5568;
                        }

                        .btn-device.active {
                        background: #4299e1;
                        color: white;
                        border-color: #3182ce;
                        }

                        .device-mobile {
                        max-width: 320px;
                        margin: 0 auto;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        border-radius: 8px;
                        overflow: hidden;
                        }

                        .btn-device-mobile.active,
                        .btn-device-desktop.active {
                          background: #4299e1;
                          color: white;
                          border-color: #3182ce;
                        }

                        .btn-device-mobile,
                        .btn-device-desktop {
                          padding: 8px 16px;
                          border-radius: 4px;
                          font-weight: 500;
                          transition: all 0.2s;
                          margin: 0 5px;
                          background: #f8fafc;
                          background: #4299e1 !important
                          border: 1px solid #e2e8f0;
                          color: #4a5568;
                        }
                          .btn-device-mobile.active,
                          .btn-device-desktop.active,
                          .btn-device-mobile.gjs-pn-active,
                          .btn-device-desktop.gjs-pn-active {
                            background: #4299e1 !important;
                            color: white !important;
                            border-color: #3182ce !important;
                          }
                            gjs-pn-btn.btn-device-mobile.active,
                              .gjs-pn-btn.btn-device-desktop.active {
                                background: #4299e1 !important;
                                color: white !important;
                                border-color: #3182ce !important;
                              }

                              .device-mobile {
                                max-width: 320px !important;
                                margin: 0 auto !important;
                                box-shadow: 0 0 10px rgba(0,0,0,0.1) !important;
                              }

          `;


          document.head.appendChild(style);

          editor.Commands.add('save-template', {
            run: async (editor) => {
              try {
                const html = editor.getHtml();
                const css = editor.getCss();
                

                const fullHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                  <style>${css}</style>
                </head>
                <body>
                  ${html}
                </body>
                </html>
              `;

                // Create and trigger download
                const blob = new Blob([fullHtml], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const fileName = `template_${Date.now()}.html`;


                // Create download link
                const downloadLink = document.createElement('a');
                downloadLink.setAttribute('href', url);
                downloadLink.setAttribute('download', fileName);
                downloadLink.click();

                // Open in new tab
                const previewWindow = window.open('', '_blank');
                previewWindow.document.write(fullHtml);
                previewWindow.document.close();

                // Clean up URL object
                URL.revokeObjectURL(url);


                // alert('Preview Template as HTML successfully!');
              } catch (error) {
                console.error('Export failed:', error);
                alert('Failed to export template');
              }
            }
          });

          editor.Commands.add('set-device-desktop', {
            run: (editor) => {
              editor.setDevice('Desktop');
              const mobileBtn = document.querySelector('.btn-device-mobile');
              const desktopBtn = document.querySelector('.btn-device-desktop');
              if (mobileBtn && desktopBtn) {
                mobileBtn.classList.remove('active');
                desktopBtn.classList.add('active');
                mobileBtn.classList.remove('gjs-pn-active');
                desktopBtn.classList.add('gjs-pn-active');
              }
            }
          });
          
          editor.Commands.add('set-device-mobile', {
            run: (editor) => {
              editor.setDevice('Mobile');
              const mobileBtn = document.querySelector('.btn-device-mobile');
              const desktopBtn = document.querySelector('.btn-device-desktop');
              if (mobileBtn && desktopBtn) {
                desktopBtn.classList.remove('active');
                mobileBtn.classList.add('active');
                desktopBtn.classList.remove('gjs-pn-active');
                mobileBtn.classList.add('gjs-pn-active');
              }
              editor.getWrapper().addClass('device-mobile');
            }
          });

          editor.Commands.add('api-export-template', {
            run: async (editor) => {
              try {
                const template = editor.getHtml();
                const styles = editor.getCss();
                const data = {
                  template,
                  styles,
                  timestamp: new Date()
                };

                //Save template to MongoDB
                
                const response = await axios.post('/api/saveTemplate', data);
                console.log('Template saved to database:', response.data);

                alert('Template saved in DB successfully!');
              } catch (error) {
                console.error('Save failed:', error);
                alert('Failed to save template');
              }
            }
          });

        } catch (error) {
          console.error('Editor initialization error:', error);
        }
      };

      setTimeout(initEditor, 100);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleBack = () => {
    router.push('/Dashboard');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editorRef.current) {
        const html = editorRef.current.getHtml();
        const css = editorRef.current.getCss();
        const data = {
          html,
          css,
          timestamp: new Date()
        };

        // Export as JSON file
        const dataStr = JSON.stringify(data);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `template_json_${Date.now()}.json`;

        // Create and trigger download
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        console.log('Template exported as JSON:', exportFileDefaultName);
        // alert('Template exported as JSON successfully!');
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <Layout>
    <>
      <div className="dashboard-header">
        <button onClick={handleBack} className="back-button">
          ← Back
        </button>
        <div id="editor" className="editor">
        <h1 className="editor-title">iMakeSite Editor</h1>
       
              <Link href="/ViewSite" className="text-blue-600 hover:underline" style={{padding:'45px'}}>
              Switch to Studio Editor
              </Link>
         </div>
        <button
          onClick={handleSave}
          className="save-button"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save as JSON'}
        </button>
      </div>

      <div className="dashboard-editor-container" ref={containerRef}>
        <div className="left-sidebar">
          <div className="panel__devices panel-section"></div>
          <div className="panel__actions panel-section"></div>
          <div id="blocks" className="panel-section"></div>
          <div id="layers-container" className="panel-section"></div>
        </div>

        <div className="main-content">
          <div id="dashboard-tools" className="toolbar"></div>
          <div id="dashboard-editor" className="editor-canvas"></div>
        </div>

        <div className="right-sidebar">
          <div id="style-manager-container" className="panel-section"></div>
          <div id="traits-container" className="panel-section"></div>
          <div id="selectors-container" className="panel-section"></div>
        </div>

        <style jsx>{`
      editor-page {
        min-height: 100vh;
        background: #f7fafc;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: white;
        border-bottom: 1px solid #e2e8f0;
      }
       .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 1rem;
        }

        .back-button,
        .save-button {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .back-button {
          background: transparent;
          border: 1px solid #e2e8f0;
          color: #4a5568;
        }

        .back-button:hover {
          background: #f7fafc;
        }

        .save-button {
          background: #4299e1;
          border: none;
          color: white;
        }

        .save-button:hover {
          background: #3182ce;
        }

        .save-button:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }
        .dashboard-editor-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin: 1rem 0;
          overflow: hidden;
          min-height: 700px;
          display: grid;
          grid-template-columns: 250px 1fr 250px;
          gap: 1px;
          background-color: #f0f0f0;
        }

        .left-sidebar,
        .right-sidebar {
          background: white;
          border-right: 1px solid #e2e8f0;
          overflow-y: auto;
          height: 100%;
        }

        .main-content {
          display: flex;
          flex-direction: column;
          background: white;
        }

        .toolbar {
          padding: 10px;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
          min-height: 50px;
          display: flex;
          align-items: center;
        }

        .editor-canvas {
          flex: 1;
          position: relative;
          overflow: auto;
          padding: 20px;
          min-height: 600px;
        }

        .panel-section {
          padding: 15px;
          border-bottom: 1px solid #e2e8f0;
        }

        .panel-section:last-child {
          border-bottom: none;
        }

        .panel__devices,
        .panel__actions {
          display: flex;
          gap: 8px;
          padding: 8px;
        }

        #blocks {
          min-height: 200px;
        }

        #layers-container {
          min-height: 300px;
        }

        #style-manager-container {
          min-height: 300px;
        }

        #traits-container {
          min-height: 200px;
        }

        #selectors-container {
          min-height: 150px;
        }

        @media (max-width: 1200px) {
          .dashboard-editor-container {
            grid-template-columns: 200px 1fr 200px;
          }
        }

        @media (max-width: 992px) {
          .dashboard-editor-container {
            grid-template-columns: 180px 1fr 180px;
          }
        }

        :global(.gjs-one-bg) {
          background-color: white;
        }

        :global(.gjs-two-color) {
          color: #383838;
        }

        :global(.gjs-three-bg) {
          background-color: #f8fafc;
          color: #383838;
        }

        :global(.gjs-four-color) {
          color: #383838;
        }

        :global(.gjs-four-color-h:hover) {
          color: #000000;
        }

        :global(.gjs-pn-btn) {
          border: none;
          padding: 6px 8px;
          border-radius: 4px;
          background-color: #f8fafc;
          color: #383838;
          cursor: pointer;
        }

        :global(.gjs-pn-btn:hover) {
          background-color: #e2e8f0;
        }

        :global(.gjs-pn-btn.gjs-pn-active) {
          background-color: #4299e1;
          color: white;
        }
 .dashboard-editor-container {
    height: calc(100vh - 80px);
    margin: 1rem;
    overflow: hidden;
  }

  .left-sidebar,
  .right-sidebar {
    height: 100%;
    overflow-y: auto;
  }
    .editor-title {
    font-size: 24px;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
    padding: 0;
    text-align: center;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

      `}</style>
      </div>
    </>
    </Layout>
  );
}