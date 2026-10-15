import { Schema, model, Document, Types } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  owner: Types.ObjectId;
  members: {
    userId: Types.ObjectId;
    role: 'owner' | 'admin' | 'member';
    joinedAt: Date;
  }[];
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: Date;
  dueDate?: Date;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 200 },
    description: { type: String, default: '', maxlength: 2000 },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
      joinedAt: { type: Date, default: Date.now },
    }],
    status: {
      type: String,
      enum: ['planning', 'active', 'on-hold', 'completed', 'archived'],
      default: 'planning',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    startDate: { type: Date },
    dueDate: { type: Date },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for common queries
projectSchema.index({ owner: 1 });
projectSchema.index({ 'members.userId': 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ archived: 1 });

export const Project = model<IProject>('Project', projectSchema);
