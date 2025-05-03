import dbConnect from '../../src/utils/dbConnect';
import { getUserFromToken } from '../../src/utils/auth';
import CustomizedSites from '../../src/models/CustomizedSites';
import { useGuestUser } from '../../src/hooks/useGuestUser';

export default async function handler(req, res) {
  const { isGuest, guestName } = useGuestUser();
  await dbConnect();
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { templateId, templateName, customizedSiteHTML, customizedSiteCSS } = req.body;

  const { userId} = getUserFromToken(req);

  if (!userId || !templateId || !customizedSiteHTML ) {
    console.error('Missing required fields:', { userId, templateId, customizedSiteHTML });
    return res.status(400).json({ message: 'Missing required fields' });
  }




  try {
        const newCustomizedSite = await CustomizedSites.create({
            templateId,
            templateName,
            customizedSiteHTML,
            customizedSiteCSS,
            userId : userId ?  userId: guestName,
        });
        console.log
    return res.status(200).json({ success: true, customizedSite: newCustomizedSite, message: 'Template saved successfully' });
 
  } catch (err) {
    console.error('Error saving template:', err);
    return res.status(500).json({ message: 'Server error',err:err });
  }
}