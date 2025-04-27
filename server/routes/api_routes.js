import express from 'express';
import api_controller from '../controller/api_controller.js';

const router = express.Router();

router.get('/api', api_controller);

export default router;