// instanciando o express
import express from 'express';
import fs from 'fs';

const app = express();
const port = 4000;

app.use(express.json());

const dataAnimes = {
    jujutsu: './src/data/jujutsukaisen.json',
    dragonball: './src/data/dragonball.json',
    hunterxhunter: './src/data/hunterxhunter.json'
};

// ler o arquivo json
const readData = data => JSON.parse(fs.readFileSync(data, 'utf-8'));

// escrever no arquivo json
const writeData = (data, body) => fs.writeFileSync(data, JSON.stringify(body, null, 2));

// métodos e rotas
// GET
app.get('/:anime', (req, res) => {
    const { anime } = req.params;

    if (!dataAnimes[anime]) res.json({ message: 'Anime não encontrado' });

    res.json(readData(dataAnimes[anime]));
});

// GET by ID
app.get('/:anime/:id', (req, res) => {
    const { anime, id } = req.params;
    const data = readData(dataAnimes[anime]);
    const findData = data.find(item => item.id === parseInt(id));
    if (!findData) res.json({ message: 'Personagem não encontrado' });
    res.json(findData);
})

// POST
app.post('/:anime', (req, res) => {
    const { anime } = req.params;
    const body = req.body;
    const data = readData(dataAnimes[anime]);

    const newData = {
        id: data.length + 1,
        nome: body.nome,
        habilidade: body.habilidade,
        altura: body.altura,
        peso: body.peso
    };

    if (!dataAnimes[anime]) res.json({ message: 'Anime não encontrado' });

    data.push(newData);
    writeData(dataAnimes[anime], data);
    res.json(data);
});

// PUT
app.put('/:anime/:id', (req, res) => {
    const { anime, id } = req.params;
    const body = req.body;
    const data = readData(dataAnimes[anime]);
    const findData = data.find(item => item.id === parseInt(id));
    const newData = {
        id: findData.id,
        nome: body.nome,
        habilidade: body.habilidade,
        altura: body.altura,
        peso: body.peso
    };

    if(newData.nome === undefined) newData.nome = findData.nome;
    if(newData.habilidade === undefined) newData.habilidade = findData.habilidade;
    if(newData.altura === undefined) newData.altura = findData.altura;
    if(newData.peso === undefined) newData.peso = findData.peso;

    if (!findData) res.json({ message: 'Personagem não encontrado' });

    const index = data.indexOf(findData);
    data[index] = newData;
    writeData(dataAnimes[anime], data);
    res.json(data);
});

// DELETE
app.delete('/:anime/:id', (req, res) => {
    const { anime, id } = req.params;
    const data = readData(dataAnimes[anime]);
    const newData = data.filter(item => item.id !== parseInt(id));
    if (data.length === newData.length) res.json({ message: 'Personagem não encontrado' });
    writeData(dataAnimes[anime], newData);
    res.json({ message: 'Personagem deletado com sucesso' });
})

// start do servidor
app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});