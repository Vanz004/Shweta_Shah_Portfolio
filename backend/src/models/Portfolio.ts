import mongoose, { Schema, Document, Types } from 'mongoose';
import { PortfolioData } from '../types/index.js';

export interface IPortfolio extends Document {
  owner: Types.ObjectId;
  data: PortfolioData;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    data: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
