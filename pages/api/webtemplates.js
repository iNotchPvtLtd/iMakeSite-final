import WebTemplate from '../../src/models/WebTemplate.js';
import dbConnect from '../../src/utils/dbConnect.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { userId, templateIds } = req.query;
      
      if (userId) {
        // Get user's selected templates
        const userTemplates = await WebTemplate.find({
          userId: userId,
          isActive: true
        })
        .select('templateId name description previewImage htmlPath category isSelected status')
        .sort({ updatedAt: -1 })
        .lean();

        return res.status(200).json({ 
          success: true, 
          templates: userTemplates 
        });
      } else if (templateIds) {
        // Get specific templates
        const templates = await WebTemplate.find({
          templateId: { $in: templateIds.split(',').map(Number) },
          isActive: true
        })
        .select('templateId name description previewImage htmlPath category')
        .lean();

        return res.status(200).json({ 
          success: true, 
          templates 
        });
      }

      // Get all templates
      const allTemplates = await WebTemplate.find({ isActive: true })
        .select('templateId name description previewImage htmlPath category')
        .sort({ templateId: 1 })
        .lean();

      return res.status(200).json({ 
        success: true, 
        templates: allTemplates 
      });
    } catch (error) {
      console.error('GET Error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const templateData = req.body;

      // Validate required fields
      if (!templateData.userId || !templateData.templateId || !templateData.name) {
        return res.status(400).json({
          success: false,
          error: 'userId, templateId, and name are required'
        });
      }

      // Try to find existing template
      const existingTemplate = await WebTemplate.findOne({
        userId: templateData.userId,
        templateId: templateData.templateId
      });

      let savedTemplate;
      
      if (existingTemplate) {
        // Update existing template
        savedTemplate = await WebTemplate.findOneAndUpdate(
          {
            userId: templateData.userId,
            templateId: templateData.templateId
          },
          {
            $set: {
              ...existingTemplate.toObject(),  // Keep existing data
              ...templateData,                 // Override with new data
              updatedAt: new Date()
            }
          },
          { 
            new: true,
            runValidators: true,              // Run validation on update
            context: 'query'
          }
        );
      } else {
        // Create new template with all required fields
        savedTemplate = await WebTemplate.create({
          userId: templateData.userId,
          templateId: templateData.templateId,
          name: templateData.name,
          description: templateData.description || '',
          previewImage: templateData.previewImage || '',
          htmlPath: templateData.htmlPath || '',
          category: templateData.category || 'Default',
          isSelected: templateData.isSelected || false,
          status: templateData.status || 'active',
          isActive: true,
          version: '1.0',
          settings: {
            isCustomized: false,
            lastEdited: new Date()
          },
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      return res.status(200).json({
        success: true,
        data: savedTemplate
      });
    } catch (error) {
      console.error(`${req.method} Error:`, error);
      
      if (error.code === 11000) {
        // Try to update instead of create when duplicate
        try {
          const updatedTemplate = await WebTemplate.findOneAndUpdate(
            {
              userId: req.body.userId,
              templateId: req.body.templateId
            },
            {
              $set: {
                ...req.body,
                updatedAt: new Date()
              }
            },
            { 
              new: true,
              runValidators: true
            }
          );

          return res.status(200).json({
            success: true,
            data: updatedTemplate
          });
        } catch (updateError) {
          return res.status(500).json({
            success: false,
            error: 'Failed to update existing template'
          });
        }
      }
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: Object.values(error.errors).map(err => err.message)
        });
      }
      
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  return res.status(405).json({ success: false, error: 'Method not allowed' });
}