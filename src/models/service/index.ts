import mongoose, { Document } from 'mongoose'

interface Service {
  name: string;
  user: mongoose.Schema.Types.ObjectId;
  logo?: string;
  domain?: string;
  notes?: string[];
  algorithm?: string;
  create_date?: Date;
}

interface ServiceModel extends Service, Document {
  toAuthJSON: () => Service;
}

const serviceSchema = new mongoose.Schema<ServiceModel>({
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
  notes: [String],
  algorithm: {
    type: String,
    default: 'hp3',
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

const Service = mongoose.model<ServiceModel>('Service', serviceSchema);
export default Service;