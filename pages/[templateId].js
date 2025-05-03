import { useEffect } from 'react';
import Head from 'next/head';
import dbConnect from '../src/utils/dbConnect';
import Template from '../src/models/Templates';

export default function HostedTemplate({ template }) {
  useEffect(() => {
    if (template?.css) {
      const styleElement = document.createElement('style');
      styleElement.textContent = template.css;
      document.head.appendChild(styleElement);

      // Handle any scripts in the template
      if (template.html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = template.html;
        const scripts = tempDiv.getElementsByTagName('script');
        Array.from(scripts).forEach(script => {
          const newScript = document.createElement('script');
          Array.from(script.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = script.textContent;
          document.body.appendChild(newScript);
        });
      }

      return () => {
        document.head.removeChild(styleElement);
        // Clean up any added scripts
        const scripts = document.getElementsByTagName('script');
        Array.from(scripts).forEach(script => {
          if (script.hasAttribute('data-template-script')) {
            document.body.removeChild(script);
          }
        });
      };
    }
  }, [template?.css, template?.html]);

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Template Not Found</h1>
          <p className="text-gray-600">The requested template could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{template.title || 'Hosted Template'}</title>
      </Head>
      <div className="template-container">
        <div dangerouslySetInnerHTML={{ __html: template.html }} />
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  await dbConnect();
  const { templateId } = params;

  try {
    const template = await Template.findOne({ templateId });
    
    if (!template) {
      return {
        props: {
          template: null
        }
      };
    }

    return {
      props: {
        template: JSON.parse(JSON.stringify({
          html: template.html,
          css: template.css
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching template:', error);
    return {
      props: {
        template: null
      }
    };
  }
}