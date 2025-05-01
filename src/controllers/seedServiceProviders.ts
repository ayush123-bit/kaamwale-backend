import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import ServiceProvider from '../models/ServicerRegistration'; // adjust the path accordingly
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const skillPool = [
  'Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Painter',
  'Cleaner', 'Technician', 'Driver', 'Gardener', 'Welder',
];

const cities = [
  { city: 'Delhi', pincode: '110001', lat: 28.6139, lon: 77.2090 },
  { city: 'Mumbai', pincode: '400001', lat: 19.0760, lon: 72.8777 },
  { city: 'Bangalore', pincode: '560001', lat: 12.9716, lon: 77.5946 },
  { city: 'Hyderabad', pincode: '500001', lat: 17.3850, lon: 78.4867 },
  { city: 'Kolkata', pincode: '700001', lat: 22.5726, lon: 88.3639 },
];

function getRandomSkills() {
  const shuffled = [...skillPool].sort(() => 0.5 - Math.random());
  const numSkills = Math.floor(Math.random() * 2) + 2;
  return shuffled.slice(0, numSkills).map((skill) => ({
    skill,
    perHour: Math.floor(Math.random() * 200) + 100,
    perDay: Math.floor(Math.random() * 1500) + 500,
  }));
}

function getCategoryFromSkill(skills: any[]): string {
  const mainSkill = skills[0].skill;
  if (['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Welder'].includes(mainSkill)) return 'Construction';
  if (['Mechanic', 'Driver'].includes(mainSkill)) return 'Transport';
  if (['Cleaner', 'Gardener'].includes(mainSkill)) return 'Maintenance';
  if (['Technician'].includes(mainSkill)) return 'IT & Repair';
  return 'General';
}

async function seed() {
  await mongoose.connect(MONGO_URI!);
  console.log('Connected to MongoDB');

  const workers = [];

  for (let i = 21; i <= 40; i++) {
    const hashedPassword = await bcrypt.hash(`password${i}`, 10);
    const skills = getRandomSkills();
    const cityData = cities[Math.floor(Math.random() * cities.length)];
    const worker = new ServiceProvider({
      name: `Worker ${i}`,
      email: `worker${i}@example.com`,
      phone: `98765432${(10 + i).toString().padStart(2, '0')}`,
      password: hashedPassword,
      category: getCategoryFromSkill(skills),
      experience: `${Math.floor(Math.random() * 15) + 1} years`,
      skills: skills,
      address: `House No. ${i * 5}, Lane ${i}`,
      city: cityData.city,
      pincode: cityData.pincode,
      latitude: cityData.lat + Math.random() * 0.02,
      longitude: cityData.lon + Math.random() * 0.02,
      profilePicUrl: `https://dummyimage.com/200x200/000/fff&text=Worker${i}`,
      idPicUrl: `https://dummyimage.com/200x200/000/fff&text=ID${i}`,
      idType: 'Aadhaar',
      idNumber: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      agree: true,
    });

    workers.push(worker);
  }

  await ServiceProvider.insertMany(workers);
  console.log('Seeded 20 diverse service providers successfully');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
