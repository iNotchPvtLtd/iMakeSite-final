import dbConnect from '../../src/utils/dbConnect.js';
import Wish from '../../src/models/Wish';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getUserFromToken } from '../../src/utils/auth';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function WishesHandler(req, res) {
  await dbConnect();

  try {
    const { userId } = getUserFromToken(req);

    console.log('Wished User ID:', userId);

    if (req.method === 'GET') {
        const wish = await Wish.findOne({ 
          userId,
          type: 'page',
          name: 'website-inspiration'
        }).sort({ createdAt: -1 });
        
        return res.status(200).json({
          success: true,
          data: wish?.content || { websites: [], files: [], comment: '' }
        });
      }

      if (req.method === 'POST') {
        const form = formidable({ 
            multiples: true,
            uploadDir,
            keepExtensions: true, 
            filename: (name, ext, part) => {
                return `${Date.now()}-${part.originalFilename}`;
              }
        });
        
  

        const parseFormData = () =>
          new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
              if (err) {
                reject(err);
                return;
              }
              resolve([fields, files]);
            });
          });
        
        const [fields, files] = await parseFormData();
        
    
          const wishData = JSON.parse(fields.wishData);

          let savedFiles = [];
       
        // Handle files properly
            if (files.files) {
                const fileArray = Array.isArray(files.files) ? files.files : [files.files];
                savedFiles = fileArray.map(file => ({
                name: file.originalFilename,
                path: `/uploads/${file.newFilename}`,
                type: file.mimetype,
                size: file.size
                }));
            }

          console.log('Saved files:', savedFiles);

        const wish = await Wish.create({
            userId: wishData.userId,
            name: wishData.name,
            type: wishData.type,
            content: {
            websites: wishData.content.websites,
            comment: wishData.content.comment,
            files: savedFiles
            }
        });


        return res.status(201).json({
            success: true,
            data: wish.content
        });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });

  } catch (error) {
    console.error('Wishes API Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '10mb',
  }
};