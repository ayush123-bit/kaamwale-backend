import mongoose, { Document, Schema } from 'mongoose'

export interface ICustomerRequest extends Document {
  name: string
  phone: string
  address: string
  category: string
  date: Date
  urgencyScore: number
  status: string
  latitude: number
  longitude: number
  urgencyLevel: 'low' | 'medium' | 'high'
  description: string
}

const customerRequestSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true }, // ✅ added description field
  date: { type: Date, default: Date.now },
  urgencyScore: { type: Number, required: true, min: 0, max: 1 },
  status: { type: String, required: true, default: 'pending' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  urgencyLevel: { type: String, required: true, enum: ['low', 'medium', 'high'] }
})

export default mongoose.model<ICustomerRequest>('CustomerRequest', customerRequestSchema)
