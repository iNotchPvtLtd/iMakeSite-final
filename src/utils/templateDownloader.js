import JSZip from 'jszip'

// Utility function to download template files with hosting guide

export const downloadTemplate = async (template) => {
  try {
    // Fetch the hosting guide content
    const guideResponse = await fetch('/src/utils/template-hosting-guide.md');
    const guideContent = await guideResponse.text();

    // Create the main HTML file content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${template.pageName || 'Template'}</title>
          <style>
              ${template.styles}
          </style>
      </head>
      <body>
          ${template.template}
      </body>
      </html>
    `;

    // Create a zip file containing both HTML and README
    const zip = new JSZip();
    zip.file('index.html', htmlContent);
    zip.file('README.md', guideContent);

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = window.URL.createObjectURL(zipBlob);

    // Create a temporary link element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.pageName || 'template'}-package.zip`;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error creating template package:', error);
    alert('Failed to download template package. Please try again.');
  }
};