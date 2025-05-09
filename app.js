const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Garante que o index.html está na pasta public

// Configuração da sessão
app.use(session({
  secret: 'meu_segredo',
  resave: false,
  saveUninitialized: true,
}));

let estoque = require('./estoque.json');

// Lista de usuários
let usuarios = [
  { username: 'cliente1', password: 'senha123' },
  { username: 'cliente2', password: 'senha456' }
];

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const usuario = usuarios.find(u => u.username === username && u.password === password);

  if (usuario) {
    req.session.user = usuario;
    return res.send('Login bem-sucedido');
  } else {
    return res.status(401).send('Credenciais inválidas');
  }
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send('Logout bem-sucedido');
  });
});

// Middleware de verificação
function verificarAutenticacao(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send('Você precisa estar logado');
  }
  next();
}

// Rotas protegidas
app.get('/estoque', verificarAutenticacao, (req, res) => {
  res.json(estoque);
});

app.post('/vender', verificarAutenticacao, (req, res) => {
  const { id, quantidade } = req.body;
  const produto = estoque.find(p => p.id === id);

  if (!produto) return res.status(404).send('Produto não encontrado');
  if (produto.quantidade < quantidade) return res.status(400).send('Estoque insuficiente');

  produto.quantidade -= quantidade;
  fs.writeFileSync('./estoque.json', JSON.stringify(estoque, null, 2));
  res.send('Venda registrada com sucesso');
});

app.post('/adicionar', verificarAutenticacao, (req, res) => {
  const { id, nome, quantidade } = req.body;

  if (estoque.find(p => p.id === id)) {
    return res.status(400).send('ID já existe');
  }

  estoque.push({ id, nome, quantidade });
  fs.writeFileSync('./estoque.json', JSON.stringify(estoque, null, 2));
  res.send('Produto adicionado com sucesso');
});

app.put('/editar', verificarAutenticacao, (req, res) => {
  const { id, nome, quantidade } = req.body;
  const produto = estoque.find(p => p.id === id);

  if (!produto) return res.status(404).send('Produto não encontrado');

  produto.nome = nome;
  produto.quantidade = quantidade;
  fs.writeFileSync('./estoque.json', JSON.stringify(estoque, null, 2));
  res.send('Produto editado com sucesso');
});

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});