import prisma from "../config/prismaClient.js";

// Get animes
const getAnimes = async (req, res) => {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    try {
        const anime = await prisma.anime.findMany({
            where: {
                userId: user.id
            }
        });
        if (anime.length === 0) return res.status(404).json({ message: "Nenhum anime encontrado." });

        return res.json(anime);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar animes." });
    }
};

const addAnime = async (req, res) => {
    const user = req.user;
    const { nome, categoria } = req.body;

    if (!nome || !categoria) return res.status(400).json({ message: "Informe o nome e a categoria corretamente." });
    try {
        const newAnime = await prisma.anime.create({
            data: {
                name: nome,
                category: categoria,
                userId: user.id
            }
        });

        res.status(201).json({ message: "Anime adicionado com sucesso!", newAnime });
    } catch (error) {
        res.status(500).json({ error: "Ocorreu um erro ao adicionar o anime." });
    }
};

const updateAnime = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const { nome, categoria, assistido } = req.body;

    const anime = await prisma.anime.findFirst({
        where: {
            AND: [
                { id: parseInt(id) },
                { userId: user.id }
            ]
        }
    });
    if (!anime) return res.status(404).json({ message: "Anime não encontrado." });

    try {
        const upAnime = await prisma.anime.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: nome ? nome : anime.name,
                category: categoria ? categoria : anime.category,
                watched: assistido ? assistido === "true" : anime.watched
            }

        });

        res.status(200).json({ message: "Anime atualizado com sucesso!", upAnime });
    } catch (error) {
        res.status(500).json({ error: "Ocorreu um erro ao atualizar o anime." });
        console.log("erro:" + error);
    }
};

const deleteAnime = async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    const anime = await prisma.anime.findFirst({
        where: {
            AND: [
                { id: parseInt(id) },
                { userId: user.id }
            ]
        }
    });
    if (!anime) return res.status(404).json({ message: "Anime não encontrado." });

    try {
        await prisma.anime.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(200).json({ message: "Anime deletado com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Ocorreu um erro ao deletar o anime." });
    }
};

export { getAnimes, addAnime, updateAnime, deleteAnime };