import mongoose from 'mongoose';

const WebTemplateSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  templateId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  previewImage: String,
  htmlPath: String,
  category: String,
  isSelected: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  version: String,
  settings: {
    isCustomized: Boolean,
    lastEdited: Date
  }
}, {
  timestamps: true
});

// Create a compound unique index for userId and templateId
WebTemplateSchema.index({ userId: 1, templateId: 1 }, { unique: true });

export default mongoose.models.WebTemplate || mongoose.model('WebTemplate', WebTemplateSchema);













// import mongoose from 'mongoose';

// const webTemplatesSchema = new mongoose.Schema({
//   templateId: { 
//     type: Number, 
//     required: true ,
//     unique: true
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'iMakeSiteUsers',
//     required: true
//   },
//   name: { 
//     type: String, 
//     required: true 
//   },
//   description: String,
//   previewImage: String,
//   templatePath: String,
//   htmlPath: String,
//   folderPath: String,
//   category: String,
//   status: {
//     type: String,
//     enum: ['active', 'inactive'],
//     default: 'active'
//   },
//   configData: {
//     fields: [{
//       name: String,
//       type: String, // text, image, icon
//       label: String,
//       required: Boolean,
//       placeholder: String
//     }],
//     sections: [{
//       name: String,
//       fields: [String] // references to fields
//     }]
//   },
//   userInputs: {
//     type: Map,
//     of: mongoose.Schema.Types.Mixed
//   },
//   isSelected: { 
//     type: Boolean, 
//     default: false 
//   },
//   selectedAt: {
//     type: Date,
//     default: null
//   },
//   unselectedAt: {
//     type: Date,
//     default: null
//   },
//   selectionHistory: [{
//     action: {
//       type: String,
//       enum: ['selected', 'unselected'],
//       required: true
//     },
//     timestamp: {
//       type: Date,
//       default: Date.now
//     }
//   }],
//   isActive: { 
//     type: Boolean, 
//     default: true 
//   },
//   timestamp: { 
//     type: Date, 
//     default: Date.now 
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   },
//   updatedAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// // Add compound index for userId and templateId
// webTemplatesSchema.index({ userId: 1, templateId: 1 }, { unique: true });

// // Add a pre-save middleware to update selection timestamps
// webTemplatesSchema.pre('save', function(next) {
//   if (this.isModified('isSelected')) {
//     const action = this.isSelected ? 'selected' : 'unselected';
//     this.selectionHistory.push({
//       action,
//       timestamp: new Date()
//     });
    
//     if (this.isSelected) {
//       this.selectedAt = new Date();
//     } else {
//       this.unselectedAt = new Date();
//     }
//   }
//   next();
// });

// // Static method to toggle selection
// webTemplatesSchema.statics.toggleSelection = async function(userId, templateId) {
//   const template = await this.findOne({ userId, templateId });
//   if (template) {
//     template.isSelected = !template.isSelected;
//     return template.save();
//   }
//   return null;
// };


// // Method to get selection history
// webTemplatesSchema.methods.getSelectionHistory = function() {
//   return this.selectionHistory.sort((a, b) => b.timestamp - a.timestamp);
// };

// export default mongoose.models.WebTemplates || mongoose.model('WebTemplates', webTemplatesSchema);