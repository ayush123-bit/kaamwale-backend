import { Request, Response } from 'express'
import CustomerRequest from '../models/customerRequest'
import {getCoordinates, generatePriorityScore} from '../../utils/globalutils'


export const createCustomerRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, description, issueType, address } = req.body
    const coordinates = await getCoordinates(address)
    if (!coordinates) {
    res.status(400).json({ error: 'Invalid address, could not get coordinates.' })
    return
     }
     console.log(coordinates);
    const { latitude, longitude } = coordinates
    const urgencyScore = await generatePriorityScore(description)
    console.log(urgencyScore);
    const urgencyLevel = urgencyScore < 0.34 ? 'low' : urgencyScore < 0.67 ? 'medium' : 'high'
    const request = new CustomerRequest({
      name,
      phone,
      address,
      category: issueType,
      description,
      urgencyScore,
      urgencyLevel,
      status: 'pending',
      latitude,
      longitude
    })
    await request.save()
    res.status(201).json({ message: 'Customer request saved successfully.' })
  } catch(err:any) {
    console.log(err);
    res.status(500).json({ error: 'Failed to save customer request.' })
  }
}
