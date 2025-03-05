import prisma from "../config/prismaClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Verificar se já tem cadastro
const userExists = async (email) => await prisma.user.findUnique({
    where: {
        email: email
    }
});

// Gerar token
const generateToken = (id, email) => jwt.sign({ id, email }, process.env.SECRET_KEY, { expiresIn: "1h" });

// Criar usuário
const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Preencha todos os campos." });

    const user = await userExists(email);
    if (user) return res.status(400).json({ message: "Já existe um usuário com esse e-mail." });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        });
        return res.status(201).json({ message: "Usuário criado com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário." });
        console.error(error);
    }
};

// Logar usuário
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Preencha corretamente todos os campos." });


    try {
        const user = await userExists(email);
        if (!user) return res.status(400).json({ message: "E-mail não encontrado." });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(400).json({ message: "Senha inválida." });

        const token = generateToken(user.id, user.email);

        res.status(200).json({ message: "Login realizado com sucesso.", token: token });
    } catch (error) {
        res.status(500).json({ error: "Erro ao realizar login." });
        console.error("Erro: ", error);
    }
};

export { createUser, userLogin };