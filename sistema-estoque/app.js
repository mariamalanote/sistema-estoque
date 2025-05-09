const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// Usar a variável de ambiente PORT fornecida pelo Render
const PORT = process.env.PORT;

// Caminho absoluto para o arquivo JSON
const FILE = path.join(__dirname, 'sistema-estoque', 'estoque.json');

// Rota para a raiz
app.get('/', (req, res) => {
    res.send('Bem-vindo ao Sistema de Estoque!');
});

// Rota para listar produtos
app.get('/estoque', (req, res) => {
    try {
        const data = fs.readFileSync(FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).send('Erro ao ler o estoque');
    }
});

// Rota para vender produto
app.post('/vender', (req, res) => {
    const { id, quantidade } = req.body;

    try {
        const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
        const produto = data.find(item => item.id === id);

        if (produto && produto.quantidade >= quantidade) {
            produto.quantidade -= quantidade;
            fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
            res.send('Venda registrada!');
        } else {
            res.status(400).send('Produto não encontrado ou estoque insuficiente');
        }
    } catch (err) {
        res.status(500).send('Erro ao processar a venda');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
