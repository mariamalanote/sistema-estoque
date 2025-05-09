// Função de login
async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const texto = await res.text();
  alert(texto);

  if (res.ok) {
    document.getElementById('perfil').style.display = 'block';
    document.getElementById('nome-usuario').innerText = username;
    document.getElementById('login').style.display = 'none'; // Esconde a tela de login
    carregarEstoque(); // Carrega os produtos após o login
  }
}

// Função de logout
async function logout() {
  const res = await fetch('/logout', { method: 'POST' });

  const texto = await res.text();
  alert(texto);

  document.getElementById('perfil').style.display = 'none';
  document.getElementById('login').style.display = 'block'; // Exibe a tela de login novamente
}

// Função para carregar o estoque (após login)
async function carregarEstoque() {
  try {
    const res = await fetch('/estoque');
    const data = await res.json();
    const container = document.getElementById('lista-produtos');
    container.innerHTML = data.map(produto => `
      <div class="produto">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong>${produto.nome}</strong>
          <button onclick="mostrarFormularioEdicao(${produto.id})">✏️ Editar</button>
        </div>
        ID: ${produto.id}<br/>
        Quantidade: ${produto.quantidade}
        <div id="form-editar-${produto.id}" style="display:none; margin-top: 1rem;">
          <input type="text" id="editar-nome-${produto.id}" placeholder="Novo nome" />
          <input type="number" id="editar-quantidade-${produto.id}" placeholder="Nova quantidade" />
          <button onclick="editar(${produto.id})">Salvar</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar estoque:', error);
  }
}

// Função para editar produto (já existente no seu código)
async function editar(id) {
  const nome = document.getElementById(`editar-nome-${id}`).value;
  const quantidade = parseInt(document.getElementById(`editar-quantidade-${id}`).value);

  const res = await fetch('/editar', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, nome, quantidade })
  });

  const texto = await res.text();
  alert(texto);
  carregarEstoque();
}

// Função para mostrar o formulário de edição de um produto
function mostrarFormularioEdicao(id) {
  document.getElementById(`form-editar-${id}`).style.display = 'block';
}