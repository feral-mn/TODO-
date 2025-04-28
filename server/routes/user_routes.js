import user_controller from  '../controller/user_controler.js'
import express from 'express';
const router = express.Router();
import format from '../middleware/format.js'


router.post('/signup', format, user_controller.signup)

router.post('/signin', format, user_controller.signin) 


export default router