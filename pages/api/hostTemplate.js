import dbConnect from '../../src/utils/dbConnect';
import Template from '../../src/models/Templates';

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
console.log('Received request to host template:', req.body);
  try {
    await dbConnect();

    const { templateId, templateName, customizedSiteHTML, customizedSiteCSS, domain, guestName } = req.body;

    // Validate domain format
    const trimmedDomain = domain.trim();
    const isDomainValid =
      /^localhost:\d+$/.test(trimmedDomain) ||
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(trimmedDomain);
    
    if (!isDomainValid) {
      return res.status(400).json({ message: 'Invalid domain format' });
    }
    

    // Check if domain is already taken
    const existingTemplate = await Template.findOne({ domain });
    if (existingTemplate) {
      return res.status(409).json({ message: 'Domain already in use' });
    }


    // Create new template
    const template = await Template.create({
      templateId,
      templateName,
      html: customizedSiteHTML,
      css: customizedSiteCSS,
      domain,
      userId: undefined, // Assuming userId is not required for hosted template
      createdBy: guestName || 'anonymous',
      createdAt: new Date(),
      updatedAt: new Date()
    })


    // Return success with template info
    return res.status(200).json({
      message: 'Template hosted successfully',
      template: {
        id: template._id,
        domain,
        previewUrl: domain.startsWith('localhost') ? `http://${domain}` : `https://${domain}`
      }
    });

  } catch (error) {
    console.error('Template hosting error:', error);
    return res.status(500).json({ message: 'Failed to host template' });
  }
}