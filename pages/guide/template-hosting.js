import { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import Head from 'next/head';

export default function TemplateHostingGuide({ content }) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    setHtmlContent(marked(content));
  }, [content]);

  return (
    <>
      <Head>
        <title>Template Hosting Guide - iMakeSite</title>
        <meta name="description" content="Learn how to host your website template" />
      </Head>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div 
          className="prose prose-lg prose-blue max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </>  
  );
}

export async function getStaticProps() {
  const guidePath = path.join(process.cwd(), 'src', 'utils', 'template-hosting-guide.md');
  const content = fs.readFileSync(guidePath, 'utf8');

  return {
    props: {
      content
    }
  };
}