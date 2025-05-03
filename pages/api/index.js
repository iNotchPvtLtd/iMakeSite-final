import WebTemplate from '../../src/models/WebTemplate';
import dbConnect from '../../src/utils/dbConnect';

export default async function handler(req, res) {
    const { templateId } = req.query;
  
    if (req.method === 'GET') {
      try {
        await dbConnect();
        
        const template = await WebTemplate.findOne({ templateId })
          .select('templateId name description previewImage templatePath htmlPath folderPath category configData userInputs');
  
        if (!template) {
          return res.status(404).json({ 
            success: false, 
            error: 'Template not found' 
          });
        }
  
        // Add default configData if not present
        if (!template.configData) {
          template.configData = {
            fields: [
              {
                name: 'title',
                type: 'text',
                label: 'Page Title',
                required: true,
                placeholder: 'Enter page title'
              },
              {
                name: 'description',
                type: 'text',
                label: 'Description',
                required: false,
                placeholder: 'Enter description'
              }
            ],
            sections: [
              {
                name: 'Basic Information',
                fields: ['title', 'description']
              }
            ]
          };
        }
  
        return res.status(200).json({
          success: true,
          template
        });
      } catch (error) {
        console.error('Error fetching template:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
    }

  if (req.method === 'POST') {
    try {
      const template = await WebTemplate.create(req.body);
      return res.status(201).json({ success: true, data: template });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}