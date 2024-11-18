import express from 'express';
import { LoginController,getAdminController, logoutController } from '../controllers/adminControllers.js';
import isAuth from '../middlewares/authMiddleware.js';

const router=express.Router();

router.post('/login',LoginController);
router.get('/logout',logoutController);
router.get('/getAdmin',isAuth,getAdminController)

export default router;



