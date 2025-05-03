import WebTemplate from '../../../src/models/WebTemplate';
import dbConnect from '../../../src/utils/dbConnect';

export default async function handler(req, res) {
  await dbConnect();

  const { templateId } = req.query;

  if (req.method === 'POST') {
    try {
      const template = await WebTemplate.findOne({ templateId });
      if (!template) {
        return res.status(404).json({ success: false, error: 'Template not found' });
      }

      template.userInputs = req.body;
      template.updatedAt = new Date();
      await template.save();

      return res.status(200).json({ success: true, data: template });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  res.status(405).json({ success: false, error: 'Method not allowed' });
}