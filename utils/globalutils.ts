import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface CustomerRequest {
    description: string;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY||"")

  export async function getCoordinates(address: string): Promise<Coordinates | null> {
    const apiKey = process.env.OPEN_CAGE_API_KEY;
    const url = 'https://api.opencagedata.com/geocode/v1/json'
    console.log(address);
    try {
      const response = await axios.get(url, {
        params: {
          q: address,
          key: apiKey,
          language: 'en'
        }
      })
    console.log("respobse:")
    console.log(response.data);
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry
        return { latitude: lat, longitude: lng }
      } else {
        return null
      }
    } catch(err:any) {
      console.log(err);
      return null;
    }
  }


  export async function generatePriorityScore(description: string): Promise<number> {
    try {
        console.log(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const prompt = `You are a helpful assistant. Read the following customer request description and determine its urgency level.

      Return a single decimal number between 0 and 1 (inclusive), representing urgency.
      
      - 0.0 to 0.33 indicates **low urgency**
      - 0.34 to 0.66 indicates **medium urgency**
      - 0.67 to 1.0 indicates **high urgency**
      
      Do not include any explanation, text, or formatting — just return the number.
      
      Description: "${description}"`;
      

      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const score = parseFloat(text)
      if (isNaN(score)) throw new Error('Invalid score returned from Gemini')
      return score
    } catch (error) {
      console.error('Error generating priority score:', error)
      throw error
    }
  }
  
  


