import mongoose from 'mongoose';

const wishSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: String,
  type: String,
  content: {
    websites: [{
      url: String,
      description: String
    }],
    files: [{
      name: String,
      path: String,
      type: String,
      size: Number
    }],
    comment: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Wish || mongoose.model('Wish', wishSchema);