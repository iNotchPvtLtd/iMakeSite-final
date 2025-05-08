'use client';

import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

const EditorFromStrapi = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    const loadEditor = async () => {
      // 1. Fetch metadata from Strapi
      try {
        const strapiRes = await fetch('https://your-strapi-api.com/api/templates/1?populate=*');
        const strapiData = await strapiRes.json();

        const s3HtmlUrl = strapiData?.data?.attributes?.html?.url;
        if (!s3HtmlUrl) throw new Error('HTML URL not found in Strapi response');

        // 2. Fetch HTML from S3
        const htmlRes = await fetch(s3HtmlUrl);
        const htmlString = await htmlRes.text();

        // 3. Initialize GrapesJS
        const editor = grapesjs.init({
          container: '#gjs',
          fromElement: false,
          height: '100vh',
          width: 'auto',
          storageManager: false,
          panels: {
            defaults: [
              {
                id: 'options',
                buttons: [
                  {
                    id: 'preview',
                    label: 'Preview',
                    command: 'preview',
                    togglable: true,
                  },
                ],
              },
            ],
          },
        });

        editor.setComponents(htmlString);
        editor.setStyle('');
        editor.stopCommand('preview');
        editor.Panels.getButton('options', 'preview')?.set('active', false);

        // Prevent preview from being activated accidentally
        editor.on('run:preview', () => {
          editor.stopCommand('preview');
          editor.Panels.getButton('options', 'preview')?.set('active', false);
        });

        editorRef.current = editor;
      } catch (err) {
        console.error('Error loading editor content:', err);
      }
    };

    loadEditor();
  }, []);

  return (
    <div>
      <div id="gjs" />
    </div>
  );
};

export default EditorFromStrapi;
