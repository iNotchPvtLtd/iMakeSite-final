import dbConnect from '../pages/utils/dbConnect.js';
import Layout from './../models/Layouts';
const seedLayouts = async () => {
  await dbConnect();

  const layouts = [
    {
      name: 'Single-Page-Layout',
      type: 'one-pager',
      imageUrl: '/single-page-layout.svg',
      description: 'Modern, scrollable single-page website perfect for storytelling and simple navigation.',
      isActive: true
    },
    {
      name: 'Multi-Page-Layout',
      type: 'multi-pager',
      imageUrl: '/multi-page-layout.svg',
      description: 'Traditional multi-page website with dedicated pages for different content sections.',
      isActive: true
    }
  ];

  try {
    await Layout.deleteMany({});
    await Layout.insertMany(layouts);
    console.log('Layouts seeded successfully');
  } catch (error) {
    console.error('Error seeding layouts:', error);
  }
  process.exit();
};

seedLayouts();