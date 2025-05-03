import { defaultTemplates } from '../../../src/utils/defaultTemplates';
import fs from 'fs/promises';
import path from 'path';
import AWS from 'aws-sdk';

// Initialize S3 if using AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

async function getTemplateContent(template) {
  try {
    if (template.storage === 's3') {
      // Get content from S3
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: template.templatePath
      };
      const data = await s3.getObject(params).promise();
      return data.Body.toString('utf-8');
    } else {
      // Get content from local file system
      const filePath = path.join(process.cwd(), 'templates', template.templatePath);
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    }
  } catch (error) {
    console.error('Error loading template content:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  const { templateId } = req.query;

  if (req.method === 'GET') {
    try {
      const template = defaultTemplates.find(t => t.templateId === parseInt(templateId));
    
      if (!template) {
        return res.status(404).json({ success: false, message: 'Template not found' });
      }

      // Get the template content
      const content = await getTemplateContent(template);

      res.status(200).json({ 
        success: true, 
        template: {
          ...template,
          content
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error loading template content' 
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { content } = req.body;
      const template = defaultTemplates.find(t => t.templateId === parseInt(templateId));

      if (!template) {
        return res.status(404).json({ success: false, message: 'Template not found' });
      }

      // Save content based on storage type
      if (template.storage === 's3') {
        const params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: template.templatePath,
          Body: content
        };
        await s3.putObject(params).promise();
      } else {
        const filePath = path.join(process.cwd(), 'templates', template.templatePath);
        await fs.writeFile(filePath, content, 'utf-8');
      }

      res.status(200).json({ success: true, message: 'Template updated successfully' });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error saving template content' 
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}