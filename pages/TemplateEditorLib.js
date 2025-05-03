import { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import plugin from 'grapesjs-preset-webpage';

export default function EditorPage() {
  const editorRef = useRef(null);
  const [setLoading] = useState(true);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.hasChildNodes()) {




    //   window.editor = grapesjs.init({
    //     height: '100%',
    //     showOffsets: true,
    //     noticeOnUnload: false,
    //     storageManager: false,
    //     container: '#gjs',
    //     fromElement: true,

    //     plugins: ['grapesjs-preset-webpage'],
    //     pluginsOpts: {
    //       'grapesjs-preset-webpage': {}
    //     }
    //   });
    // };

     
      const editor = grapesjs.init({
        container: '#gjs',
        fromElement: true,
        height: '100vh',
        width: 'auto',
        plugins: [plugin],  // Add the preset plugin
        pluginsOpts: {
          'gjs-preset-webpage': {
            header: true,
            navbar: true,
            panels: {
              defaults: ['properties', 'html', 'css', 'device'],
              left: ['layers', 'styles'],
            },
          },
        },        
        storageManager: false,
        canvas: {
          styles: [],
          scripts: [],
        },
        assetManager: {
          assets: [],
          upload: false,
        },
      });

      editor.on('load', () => {
        const templateUrl = 'https://imakesite.s3.eu-north-1.amazonaws.com/templates/fanta/index.html'; // Update this with your actual URL
        loadTemplateFromS3(editor, templateUrl);
      });
    }
  }, []);

  async function loadTemplateFromS3(editor, url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const html = await res.text();
      console.log("Template Editor LIb",html);

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const bodyHTML = doc.body.innerHTML;
      const inlineStyles = Array.from(doc.querySelectorAll('style'))
        .map(style => style.textContent).join('\n');
      const externalStyles = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'))
        .map(link => link.href);
      const externalScripts = Array.from(doc.querySelectorAll('script[src]'))
        .map(script => script.src);

      editor.setComponents(bodyHTML);
      editor.setStyle(inlineStyles);

      const canvasDoc = editor.Canvas.getDocument();
      if (!canvasDoc) return;

      externalStyles.forEach(href => {
        const link = canvasDoc.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        canvasDoc.head.appendChild(link);
      });

      externalScripts.forEach(src => {
        const script = canvasDoc.createElement('script');
        script.src = src;
        canvasDoc.body.appendChild(script);
      });

      setLoading(false);
    } catch (err) {
      console.error('Failed to load template:', err);
    }
  }

  

  return (
    <div >
      
      <div id="gjs" ref={editorRef}/>
    </div>
  );
}
