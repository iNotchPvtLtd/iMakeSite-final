import { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

export default function EditorPage() {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    const initEditor = grapesjs.init({
      container: '#gjs',
      fromElement: false,
      height: '100%',
      width: 'auto',
      storageManager: false,
      canvas: {
        styles: [],
        scripts: []
      },
    });

    setEditor(initEditor);

    initEditor.on('load', async () => {
      const templateUrl = 'https://imakesite.s3.eu-north-1.amazonaws.com/templates/nextly/index.html';
      const response = await fetch(templateUrl);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const bodyContent = doc.body.innerHTML;
      const inlineStyles = Array.from(doc.querySelectorAll('style'))
        .map(style => style.textContent)
        .join('\n');

      initEditor.setComponents(bodyContent);
      initEditor.setStyle(inlineStyles);

      // Example: Load content from Strapi
      try {
        const strapiRes = await fetch('http://localhost:1337/api/homepage');
        const strapiData = await strapiRes.json();

        // Inject Strapi content (customize based on your data shape)
        const strapiHeading = strapiData?.data?.attributes?.title || 'Default Title';
        initEditor.addComponents(`<h1>${strapiHeading}</h1>`);
      } catch (err) {
        console.error('Failed to load Strapi content:', err);
      }
    });

    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
      }
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0;
          height: 100%;
        }
        #gjs {
          height: 100vh;
        }
      `}</style>

      <div id="gjs" ref={editorRef}></div>
    </>
  );
}
