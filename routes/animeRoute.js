import express from "express";
import * as animeController from "../controllers/animeController.js";

const router = express.Router();

// Pegar os animes
router.get("/", animeController.getAnimes);

// Adicionar um novo anime
router.post("/", animeController.addAnime);

// Atualizar um anime
router.put("/:id", animeController.updateAnime);

// Deletar um anime
router.delete("/:id", animeController.deleteAnime);

export { router as animeRouter };