import express from 'express';
import { createCustomerRequest } from '../controllers/customerController';

const router = express.Router();

router.post('/submit', createCustomerRequest);

export default router;
