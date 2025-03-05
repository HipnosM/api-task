// instanciando o express
import express from 'express';
import cors from "cors";
import dotenv from "dotenv";

import authentication from './middlewares/authMiddleware.js';
import { userAuth } from './routes/userRoute.js';
import { animeRouter } from './routes/animeRoute.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// métodos/rotas
app.use("/auth", userAuth);
app.use("/animes", authentication, animeRouter);

// start do servidor
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});