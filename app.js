const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Serve index.html

let estoque = require('./estoque.json');

// Endpoint para obter estoque
app.get('/estoque', (req, res) => {
  res.json(estoque);
});

// Endpoint para vender
app.post('/vender', (req, res) => {
  const { id, quantidade } = req.body;
  const produto = estoque.find(p => p.id === id);

  if (!produto) return res.status(404).send('Produto não encontrado');
  if (produto.quantidade < quantidade) return res.status(400).send('Estoque insuficiente');

  produto.quantidade -= quantidade;

  fs.writeFileSync('./estoque.json', JSON.stringify(estoque, null, 2));
  res.send('Venda registrada com sucesso');
});

// Garante que / carrega o HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
