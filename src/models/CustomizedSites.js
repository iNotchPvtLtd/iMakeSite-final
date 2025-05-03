
import mongoose from 'mongoose';

const customizedSitesSchema = new mongoose.Schema({
  templateId: Number,
  templateName: String,
  customizedSiteHTML: String,
  customizedSiteCSS : String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'iMakeSiteUsers',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.CustomizedSites || mongoose.model('CustomizedSites', customizedSitesSchema);
