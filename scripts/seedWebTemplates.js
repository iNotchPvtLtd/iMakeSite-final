import WebTemplate from '../src/models/WebTemplate.js';
import dbConnect from '../src/utils/dbConnect.js';


const templates = [
  {
    templateId: 1,
    userId: "68076fca4d99ff086e10710e",
    name: "Nextly",
    description: "A sleek and modern template built with Next.js.",
    previewImage: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/nextly/preview.jpg",
    templatePath: "templates/nextly",
    htmlPath: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/nextly/index.html",
    folderPath: "nextly",
    category: "NextJS", 
    isActive: true,
    isSelected: false,
    timestamp: new Date().toISOString()
  },
  {
    templateId: 2,
    userId: "68076fca4d99ff086e10710e",
    name: "Pepsi",
    description: "A vibrant promotional landing page for beverages.",
    previewImage: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/pepsi/preview.jpg",
    templatePath: "templates/pepsi",
    htmlPath: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/pepsi/index.html",
    folderPath: "pepsi",
    category: "NextJS",
    isActive: true,
    isSelected: false,
    timestamp: new Date().toISOString()
  },
  {
    templateId: 3,   //ok
    userId: "68076fca4d99ff086e10710e",
    name: "Coke",
    description: "An elegant and clean product page for Coca-Cola.",
    previewImage: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/coke/preview.jpg",
    templatePath: "templates/coke",
    htmlPath: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/coke/index.html",
    folderPath: "coke",
    category: "NextJS",
    isActive: true,
    isSelected: false,
    timestamp: new Date().toISOString()
  },
  {
    templateId: 4,
    userId: "68076fca4d99ff086e10710e",
    name: "Fanta",
    description: "An interactive single-page app built with ReactJS.",
    previewImage: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/fanta/preview.jpg",
    templatePath: "templates/fanta",
    htmlPath: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/fanta/index.html",
    folderPath: "fanta",
    category: "ReactJS",
    isActive: true,
    isSelected: false,
    timestamp: new Date().toISOString()
  },
  {
    templateId: 5,
    userId: "68076fca4d99ff086e10710e",
    name: "Thums Up",
    description: "A dynamic Vue.js landing page for Thums Up.",
    previewImage: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/thumsup/preview.jpg",
    templatePath: "templates/thumsup",
    htmlPath: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/thumsup/index.html",
    folderPath: "thumsup",
    category: "VueJS",
    isActive: true,
    isSelected: false,
    timestamp: new Date().toISOString()
  },
  {
    templateId: 6,
    userId: "68076fca4d99ff086e10710e",
    name: "Sprite",
    description: "A clean and fast Vue.js marketing page.",
    previewImage: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/sprite/preview.jpg",
    templatePath: "templates/sprite",
    htmlPath: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/sprite/index.html",
    folderPath: "sprite",
    category: "VueJS",
    isActive: true,
    isSelected: false,
    timestamp: new Date().toISOString()
  }
];

async function seedTemplates() {
  try {
   await dbConnect();
    
    // Clear existing templates
    await WebTemplate.deleteMany({});
    
    // Insert new templates
    await WebTemplate.insertMany(templates);
    
    console.log('Templates seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding templates:', error);
    process.exit(1);
  }
}

seedTemplates();