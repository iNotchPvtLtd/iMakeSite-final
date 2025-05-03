import dbConnect from '../../src/utils/dbConnect';
import Template from '../../src/models/Templates';
import { getUserFromToken } from '../../src/utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
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

    // Fetch templates for verified user
    const templates = await Template.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ 
      success: true, 
      data: templates 
    });
    
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch templates' 
    });
  }
}
