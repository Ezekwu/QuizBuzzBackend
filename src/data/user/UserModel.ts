import mongoose, { Schema } from 'mongoose';
import User from '../../types/User.js';


const userSchema = new Schema<User>({
  clerkUserId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  }
});

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;

