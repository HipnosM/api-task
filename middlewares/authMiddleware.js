import jwt from "jsonwebtoken";

const authentication = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Token não fornecido." });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido." });
    }
};

export default authentication;