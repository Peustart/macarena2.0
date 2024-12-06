// Adicionar um ouvinte de evento para carregar os dados da tabela ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    carregarTabela();
});

// Variável para armazenar o índice do produto sendo editado
let produtoEditandoIndex = -1;

// Função que carrega os dados da tabela a partir do localStorage
function carregarTabela() {
    const tabela = document.getElementById("tabelaProdutos").getElementsByTagName('tbody')[0];
    tabela.innerHTML = ""; // Limpar a tabela antes de adicionar as novas linhas
    const produtos = JSON.parse(localStorage.getItem("produtos")) || []; // Pega os produtos armazenados

    // Adiciona cada produto à tabela
    produtos.forEach((produto, index) => {
        let row = tabela.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = produto.nome;
        row.insertCell(2).textContent = produto.descricao;
        row.insertCell(3).textContent = produto.quantidade;
        let acoes = row.insertCell(4);

        // Adicionar botão de edição
        let btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.onclick = function () {
            editarProduto(index);
        };
        acoes.appendChild(btnEditar);

        // Adicionar botão de exclusão
        let btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.onclick = function () {
            excluirProduto(index);
        };
        acoes.appendChild(btnExcluir);
    });
}

// Função para editar um produto
function editarProduto(index) {
    // Obter o produto a ser editado
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const produto = produtos[index];

    // Preencher os campos do formulário com os dados do produto
    document.querySelector('input[placeholder="Nome"]').value = produto.nome;
    document.querySelector('input[placeholder="Descrição"]').value = produto.descricao;
    document.querySelector('input[placeholder="Quantidade"]').value = produto.quantidade;

    // Armazenar o índice do produto sendo editado
    produtoEditandoIndex = index;
}

// Função que é chamada ao enviar o formulário
function enviarFormulario(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obter os valores dos campos de input
    const nome = document.querySelector('input[placeholder="Nome"]').value;
    const descricao = document.querySelector('input[placeholder="Descrição"]').value;
    const quantidade = document.querySelector('input[placeholder="Quantidade"]').value;

    // Validar os campos
    if (nome === "" || descricao === "" || quantidade === "") {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Obter os produtos do localStorage
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    // Criar o novo produto ou atualizar o existente
    const produto = {
        nome: nome,
        descricao: descricao,
        quantidade: quantidade
    };

    if (produtoEditandoIndex === -1) {
        // Se não houver índice de edição, é um novo produto
        produtos.push(produto);
    } else {
        // Caso contrário, substitui o produto existente
        produtos[produtoEditandoIndex] = produto;
        produtoEditandoIndex = -1; // Resetar a variável de índice de edição
    }

    // Armazenar novamente no localStorage
    localStorage.setItem("produtos", JSON.stringify(produtos));

    // Limpar os campos do formulário
    document.querySelector('input[placeholder="Nome"]').value = "";
    document.querySelector('input[placeholder="Descrição"]').value = "";
    document.querySelector('input[placeholder="Quantidade"]').value = "";

    // Recarregar a tabela
    carregarTabela();
}

// Função para excluir um produto
function excluirProduto(index) {
    // Obter os produtos do localStorage
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    // Remover o produto pelo índice
    produtos.splice(index, 1);

    // Atualizar o localStorage
    localStorage.setItem("produtos", JSON.stringify(produtos));

    // Recarregar a tabela
    carregarTabela();
}

// Adicionar evento de envio ao formulário
document.getElementById('formCadastro').addEventListener('submit', enviarFormulario);

