import { getUserFromToken } from "../../src/utils/auth";
import Template from "../../src/models/Templates";
import dbConnect from "../../src/utils/dbConnect";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Connect to database
    await dbConnect();

    // Get user ID from token
    let userId;
    try {
      const user = getUserFromToken(req);
      userId = user.userId;
    } catch (authError) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication failed' 
      });
    }

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User ID not found' 
      });
    }

    const { template, styles } = req.body;

    // Validate required fields
    if (!template) {
      return res.status(400).json({ 
        success: false, 
        message: 'Template content is required' 
      });
    }

    // Create new template
    const newTemplate = await Template.create({
      template,
      styles: styles || '',
      userId
    });
 
    return res.status(201).json({ 
      success: true,
      message: 'Template saved successfully', 
      data: newTemplate 
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to save template' 
    });
  }
}