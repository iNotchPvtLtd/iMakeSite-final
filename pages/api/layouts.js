import dbConnect from '../../src/utils/dbConnect';
import Layouts from '../../src/models/Layouts';
import { getUserFromToken } from '../../src/utils/auth';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  try {
    const { userId } = getUserFromToken(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    switch (method) {
      case 'GET': {
        const layouts = await Layouts.find({ isActive: true, userId });
        return res.status(200).json({ success: true, layouts });
      }

      case 'POST': {
        const { layoutName, type, imageUrl, description, userId } = req.body;

        if (!layoutName || !type) {
          return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const newLayout = await Layouts.create({
          layoutName,
          type,
          imageUrl,
          description,
          userId
        });

        return res.status(201).json({ success: true, layout: newLayout });
      }

      default:
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Layouts API Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
