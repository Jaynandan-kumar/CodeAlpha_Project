import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  displayName: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  coverImage: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 30 },
    displayName: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    bio: { type: String, default: '', maxlength: 300 },
    avatar: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

userSchema.index({ username: 'text', displayName: 'text' });

export const User = mongoose.model<IUser>('User', userSchema);
