import WebTemplate from '../../../src/models/WebTemplate';
import dbConnect from '../../../src/utils/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const templates = await WebTemplate.find({ isActive: true })
      .select('templateId name description previewImage templatePath htmlPath folderPath category')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}