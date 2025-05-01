import express from 'express';
import upload from '../middleware/upload';
import { registerServiceProvider } from '../controllers/serviceProviderRegistration';

const router = express.Router();

router.post(
  '/register',
  upload.fields([
  
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'idDocument', maxCount: 1 },
  ]),
  registerServiceProvider
);

export default router;
