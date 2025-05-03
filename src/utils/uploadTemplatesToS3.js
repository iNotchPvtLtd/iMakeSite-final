// import s3 from '@/lib/s3';
// import formidable from 'formidable';
// import fs from 'fs';
// import Template from '../models/webtemplate'; 
// import dbConnect from '../utils/dbConnect';
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).end();

//   const form = formidable({ multiples: true, uploadDir: '/tmp', keepExtensions: true });

//   form.parse(req, async (err, fields, files) => {
//     if (err) return res.status(500).json({ error: 'Error parsing form data' });

//     const { name } = fields;
//     const folderName = name.toLowerCase().replace(/\s+/g, '-');

//     await dbConnect();

//     const uploadToS3 = async (file, key) => {
//       const fileStream = fs.createReadStream(file.filepath);
//       const params = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Key: `templates/${folderName}/${key}`,
//         Body: fileStream,
//         ContentType: file.mimetype || 'application/octet-stream',
//         ACL: 'public-read',
//       };
//       await s3.upload(params).promise();
//       return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/templates/${folderName}/${key}`;
//     };

//     const htmlUrl = await uploadToS3(files.indexHtml, 'index.html');
//     const previewUrl = await uploadToS3(files.previewImage, 'preview.png');

//     const template = new Template({
//       name,
//       templateId: folderName,
//       previewImageUrl: previewUrl,
//       htmlUrl,
//       folderPath: `templates/${folderName}/`,
//       createdAt: new Date(),
//     });

//     await template.save();

//     res.status(200).json({ success: true, template });
//   });
// }
