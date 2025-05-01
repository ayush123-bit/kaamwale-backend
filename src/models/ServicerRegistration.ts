import mongoose, { Document, Schema } from 'mongoose';

interface Skill {
  skill: string;
  perHour: number;
  perDay: number;
}

export interface IServiceProvider extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  category: string;
  experience: string;
  skills: Skill[];                      // Updated: array of skills with charges
  address: string;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
  aadhaarPicUrl: string;
  profilePicUrl: string;
  idPicUrl: string;
  idType: string;
  idNumber: string;
  agree: boolean;
}

const SkillSchema = new Schema<Skill>(
  {
    skill: { type: String, required: true },
    perHour: { type: Number, required: true },
    perDay: { type: Number, required: true },
  },
  { _id: false } // prevent _id creation for subdocuments
);

const ServiceProviderSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: String, required: true },

    skills: { type: [SkillSchema], required: true }, // Updated schema field

    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String},
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    profilePicUrl: { type: String, required: true },
    idPicUrl: { type: String, required: true },
    idType: { type: String, required: true },
    idNumber: { type: String, required: true },
    agree: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const ServiceProvider = mongoose.model<IServiceProvider>('ServiceProvider', ServiceProviderSchema);

export default ServiceProvider;
