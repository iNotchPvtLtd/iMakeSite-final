'use client';
import { useEffect, useRef } from 'react';
import createStudioEditor from '@grapesjs/studio-sdk';
import {
  tableComponent,
  listPagesComponent,
  lightGalleryComponent,
  swiperComponent,
  iconifyComponent,
  fsLightboxComponent,
  accordionComponent,
  flexComponent,
  rteTinyMce,
} from '@grapesjs/studio-sdk-plugins';
import '@grapesjs/studio-sdk/style';
import Layout from './components/Layout';


export default function EditorPage() {
  const editorRef = useRef(null); // Access editor later if needed

  useEffect(() => {
    const initEditor = async () => {
      try {
        console.log('Initializing Studio Editor...');
        
        await createStudioEditor({
          root: '#studio-editor',
          licenseKey: '09178c57296d459e850be4915535d7123cbc3b8a7e504e0c9c6810be89b104d9',
          theme: 'light',
          project: {
            type: 'web',
            id: 'coke-template-project',
          },
          identity: {
            id: 'user-001',
          },
          assets: {
            storageType: 'cloud',
          },
          storageManager: {
            type: 'remote',
            stepsBeforeSave: 10,
            options: {
              remote: {
                headers: {
                  // Add auth headers if needed
                },
                urlStore: '/api/save-project',
                urlLoad: '/api/load-project',
              },
            },
          },
          plugins: [
            tableComponent.init(),
            listPagesComponent.init(),
            lightGalleryComponent.init(),
            swiperComponent.init(),
            iconifyComponent.init(),
            fsLightboxComponent.init(),
            accordionComponent.init(),
            flexComponent.init(),
            rteTinyMce.init(),
          ],
          onInit: async (editor) => {
            try {
              console.log('Initializing Studio Editor...editor', editor);
   
              editorRef.current = editor;
              console.log('Editor initialized via onInit:', editor);

              // Fetch HTML inside onInit
              const res = await fetch('https://imakesite.s3.eu-north-1.amazonaws.com/templates/nextly/index.html');
              if (!res.ok) throw new Error('Failed to fetch template from S3');
              const html = await res.text();
             
              console.log('Fetched HTML inside onInit. Length:', html.length);
              // Uncomment the line below to log the full HTML (can be very long)
              // console.log('Full HTML:', html);

              // Add a small delay to ensure the editor is fully ready
              setTimeout(() => {
                try {
                  console.log('Attempting to set components after delay...');
                  editor.setComponents(html);
                  console.log('Successfully called editor.setComponents after delay.');
                  // Optional: Check if components were actually added
                  const componentCount = editor.getComponents().length;
                  console.log(`Editor now has ${componentCount} root components.`);
                } catch (setCompError) {
                  console.error('Error during editor.setComponents:', setCompError);
                  // Log the HTML again in case of error to see what caused it
                  console.error('HTML content that caused error (first 500 chars):', html.substring(0, 500));
                }
                console.log('Finished processing HTML loading attempt.');
              }, 200); // 200ms delay
            } catch (err) {
              console.error('Error loading HTML from S3:', err);
            }
          },
        });

        console.log('Editor initialization completed');
      } catch (error) {
        console.error('Error initializing Studio Editor:', error);
      }
    };

    

      initEditor();

  }, []);

  return (
    <Layout>
      <a href="/DashboardEditor" style={{ textDecoration: 'none' }}>
        ← Back
      </a>
      <h1 className="editor-title" style={{ textAlign: 'center' }}>
        iMakeSite Studio Editor
      </h1>
      <div id="studio-editor" style={{ height: '100vh' }}></div>
    </Layout>
  );
}
