import mongoose, { Document, Model } from 'mongoose'

interface Service {
  name: string;
  user: mongoose.Schema.Types.ObjectId;
  logo?: string;
  domain?: string;
  notes: {
    username?: string;
    email?: string;
    other?: string;
  };
  algorithm?: string;
  stats: {
    timesUsed?: number;
    lastUsed?: number;
  };
  create_date?: Date;
}

interface ServiceModel extends Service, Document {
  toAuthJSON: () => Service;
  isValidService: (service: Service) => [boolean, { [key: string]: string }];
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
  algorithm: {
    type: String,
    default: 'hp3',
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

serviceSchema.statics.isValidService = function (service): [boolean, { [key: string]: string }] {
  const errors: { [key: string]: string } = {};
  if (!service.name) {
    errors.name = 'Name is required';
  }
  if (!service.algorithm) {
    errors.algorithm = 'Algorithm is required';
  }
  if (service.notes) {
    if (service.notes.length) {
      errors.notes = 'Notes must be an object containing "username", "email", and "other"';
    }
    if (typeof service.notes !== 'object') {
      errors.notes = 'Notes must be an object';
    }
    if (service.notes.username && typeof service.notes.username !== 'string') {
      errors.notes = 'Username must be a string';
    }
    if (service.notes.email && typeof service.notes.email !== 'string') {
      errors.notes = 'Email must be a string';
    }
    if (service.notes.other && typeof service.notes.other !== 'string') {
      errors.notes = 'Other must be a string';
    }
  }
  return [Object.keys(errors).length === 0, errors];
}

const Service = mongoose.model<ServiceModel, IServiceModel>('Service', serviceSchema);
export default Service;