import mongoose, { Document, Model } from 'mongoose'
import { isValidService } from './statics'

interface Notes {
  username?: string;
  email?: string;
  other?: string;
}

interface Stats {
  timesUsed: number;
  lastUsed: number;
}

export interface Service {
  name: string;
  user: mongoose.Schema.Types.ObjectId;
  logo?: string;
  domain?: string;
  notes: Notes
  encoding: string;
  stats: Stats
  create_date: Date;
}

interface ServiceModel extends Service, Document {
  toAuthJSON: () => Service;
}

interface IServiceModel extends Model<ServiceModel> {
  isValidService: (service: Service) => [boolean, { [key: string]: string }];
}

const serviceSchema = new mongoose.Schema<ServiceModel, IServiceModel>({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  logo: String,
  domain: String,
  notes: {
    username: String,
    email: String,
    other: String,
  },
  encoding: {
    type: String,
    default: 'base58',
  },
  stats: {
    timesUsed: {
      type: Number,
      default: 0,
    },
    lastUsed: {
      type: Number,
      default: 0,
    }
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

serviceSchema.methods.toAuthJSON = function (): Omit<Service, 'user'> {
  const { _id, __v, user, ...service } = this.toObject();
  return service;
};

serviceSchema.statics.isValidService = isValidService

const Service = mongoose.model<ServiceModel, IServiceModel>('Service', serviceSchema);
export default Service;