import mongoose from 'mongoose';

const iMakeSiteUsersSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: {
    type: Date
  }
});


export default mongoose.models.iMakeSiteUsers || mongoose.model('iMakeSiteUsers', iMakeSiteUsersSchema);