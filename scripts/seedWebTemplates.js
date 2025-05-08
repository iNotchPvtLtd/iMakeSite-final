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
  },
  {
    templateId: 7,
    userId: "68076fca4d99ff086e10710e",
    name: "Tesla",
    description: "Tesla, Inc. is an American multinational automotive and clean energy company. Headquartered in Austin, Texas, it designs, manufactures and sells battery electric vehicles.",
    previewImage: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/tesla/preview.jpg",
    templatePath: "templates/tesla",
    htmlPath: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/tesla/index.html",
    folderPath: "tesla",
    category: "PHP",
    isActive: true,
    isSelected: false,
    timestamp: new Date().toISOString()
  },
  {
    templateId: 8,
    userId: "68076fca4d99ff086e10710e",
    name: "Pets",
    description: "A pet, or companion animal, is an animal kept primarily for a person's company or entertainment rather than as a working animal",
    previewImage: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/pets/preview.jpg",
    templatePath: "templates/pets",
    htmlPath: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/pets/index.html",
    folderPath: "pets",
    category: "PHP",
    isActive: true,
    isSelected: false,
    timestamp: new Date().toISOString()
  },
  {
    templateId: 9,
    userId: "68076fca4d99ff086e10710e",
    name: "FlyNow",
    description: "Fly Smarter. FlyNow. Your Journey Starts Here.",
    previewImage: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/travel/preview.jpg",
    templatePath: "templates/travel",
    htmlPath: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/travel/index.html",
    folderPath: "travel",
    category: "NextJS",
    isActive: true,
    isSelected: false,
    timestamp: new Date().toISOString()
  },{
    templateId: 10,
    userId: "68076fca4d99ff086e10710e",
    name: "Brigthon",
    description: "Welcome to Brigthon Edu, where innovative learning meets real-world results.",
    previewImage: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/brighton/preview.jpg",
    templatePath: "templates/brighton",
    htmlPath: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/brighton/index.html",
    folderPath: "brighton",
    category: "HTML",
    isActive: true,
    isSelected: false,
    timestamp: new Date().toISOString()
  },
  {
    templateId: 11,
    userId: "68076fca4d99ff086e10710e",
    name: "HighTech",
    description: "Welcome to Brigthon Edu, where innovative learning meets real-world results.",
    previewImage: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/hightech/preview.jpg",
    templatePath: "templates/hightech",
    htmlPath: "https://imakesite.s3.eu-north-1.amazonaws.com/templates/hightech/index.html",
    folderPath: "hightech",
    category: "HTML/JS",
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