import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  template: String,
  styles: String,
  userId: {
    type: String,
    ref: 'iMakeSiteUsers',
    required: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  domain: {
    type: String,
    required: false
  },
  createdAt: { type: Date, default: Date.now },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Template || mongoose.model('Template', templateSchema);
