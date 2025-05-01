
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import ServiceProvider from '../models/ServicerRegistration';
import {getCoordinates} from '../../utils/globalutils';
import cloudinary from '../../utils/cloudinary';

const uploadToCloudinary = async (buffer: Buffer, folder: string, filename: string) => {

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, public_id: filename }, (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url);
      })
      .end(buffer);
  });
};

export const registerServiceProvider = async (req: Request, res: Response): Promise<void> => {
  try {
const {name,email,phone,password,category,experience,skills, address,city,zipcode,idType,idNumber,state,agree} = req.body;
    console.log(req.body)
    let parsedSkills;
    try {
      parsedSkills = JSON.parse(skills); 
      if (!Array.isArray(parsedSkills) || parsedSkills.some(s => !s.skill || !s.perHour || !s.perDay)) {
        return
      }
    } catch (err) {
      return
    }
    
  console.log("1");
   
    let profilePhoto: Express.Multer.File | undefined;
    let idDocument: Express.Multer.File | undefined;
    
    if (req.files && !Array.isArray(req.files)) {
    
      profilePhoto = req.files['profilePhoto']?.[0];
      idDocument = req.files['idDocument']?.[0];
    }
    console.log(req.files)

    if ( !profilePhoto || !idDocument) {
      return 
    }
  console.log("2")
    const fullAddress = `${address}, ${city}, ${zipcode}, ${state}`;
    const coordinates = await getCoordinates(address)
    if (!coordinates) {
    res.status(400).json({ error: 'Invalid address, could not get coordinates.' })
    return
     }
     console.log(3);
     console.log(coordinates);
    const { latitude, longitude } = coordinates
    const hashedPassword = await bcrypt.hash(password, 10);
    const [ profileUrl, idDocUrl] = await Promise.all([
     
      uploadToCloudinary(profilePhoto.buffer, 'profile_photos', `profile_${Date.now()}`),
      uploadToCloudinary(idDocument.buffer, 'id_documents', `id_${Date.now()}`),
    ]);

    const newProvider = new ServiceProvider({
      name,
      email,
      phone,
      password: hashedPassword,
      address: fullAddress,
      category,
      experience,
      skills : parsedSkills,
      latitude,
      longitude,
      idType,
      idNumber,
      city,
      pincode : zipcode,
      agree,
      profilePicUrl: profileUrl,
      idPicUrl: idDocUrl,
    });

    await newProvider.save();

    res.status(201).json({ message: 'Service provider registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
