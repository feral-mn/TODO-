import express from 'express';
const router = express.Router();
import api_controller from '../controller/api_controller.js';



router.get('/api', api_controller);

export default router;