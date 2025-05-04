import mongoose from 'mongoose';

const layoutsSchema = new mongoose.Schema({
  layoutName: String,
  type: String,
  imageUrl: String,
  description: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'iMakeSiteUsers',
    required: true,
  },
  isActive: { type: Boolean, default: true },
});

export default mongoose.models.Layouts || mongoose.model('Layouts', layoutsSchema);
