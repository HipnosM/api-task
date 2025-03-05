import express from 'express';
import * as userController from "../controllers/userController.js";

const router = express.Router();

// registrar
router.post('/register', userController.createUser);

// logar
router.post('/login', userController.userLogin);

export {router as userAuth};