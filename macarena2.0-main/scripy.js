// Função para salvar os produtos no localStorage
function salvarProdutosNoLocalStorage(produtos) {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Função para carregar os produtos do localStorage
function carregarProdutosDoLocalStorage() {
    const produtosSalvos = localStorage.getItem('produtos');
    return produtosSalvos ? JSON.parse(produtosSalvos) : [];
}

// Variável para controlar se estamos editando um produto
let editandoProdutoId = null;

// Adiciona o evento ao formulário
document.getElementById("formCadastro").addEventListener("submit", function(event) {
    event.preventDefault();

    // Pega os valores dos campos do formulário
    let nome = event.target[0].value;
    let descricao = event.target[1].value;
    let quantidade = event.target[2].value;

    // Valida se os campos estão preenchidos
    if (nome === "" || descricao === "" || quantidade === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Verifica se o formulário está em modo de edição
    if (editandoProdutoId) {
        // Atualiza o produto se estiver editando
        atualizarProduto(editandoProdutoId, nome, descricao, quantidade);
    } else {
        // Cria um novo produto
        let produto = {
            id: Date.now(), // ID único usando o timestamp
            nome: nome,
            descricao: descricao,
            quantidade: quantidade
        };
        adicionarProdutoNaTabela(produto);
    }

    // Limpa os campos do formulário e desativa a edição
    event.target.reset();
    editandoProdutoId = null;
});

// Função para adicionar um produto na tabela
function adicionarProdutoNaTabela(produto) {
    // Verifica se o produto já existe na tabela (para evitar duplicação)
    let tabela = document.getElementById("tabelaProdutos").getElementsByTagName("tbody")[0];
    let linhas = tabela.getElementsByTagName("tr");
    for (let i = 0; i < linhas.length; i++) {
        let celulaId = linhas[i].cells[0];
        if (celulaId.textContent == produto.id) {
            // Produto já existe, não adicionar
            return;
        }
    }

    // Cria uma nova linha na tabela
    let novaLinha = tabela.insertRow();

    // Adiciona as células para cada dado do produto
    let celulaId = novaLinha.insertCell(0);
    let celulaNome = novaLinha.insertCell(1);
    let celulaDescricao = novaLinha.insertCell(2);
    let celulaQuantidade = novaLinha.insertCell(3);
    let celulaAcoes = novaLinha.insertCell(4);

    // Preenche as células com os dados do produto
    celulaId.textContent = produto.id;
    celulaNome.textContent = produto.nome;
    celulaDescricao.textContent = produto.descricao;
    celulaQuantidade.textContent = produto.quantidade;

    // Cria os botões de editar e excluir
    let botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Editar";
    botaoEditar.style.backgroundColor = "orange";
    botaoEditar.style.marginRight = "5px";
    botaoEditar.onclick = function() {
        editarProduto(produto.id);
    };

    let botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.style.backgroundColor = "red";
    botaoExcluir.onclick = function() {
        excluirProduto(produto.id);
    };

    // Adiciona os botões à célula de ações
    celulaAcoes.appendChild(botaoEditar);
    celulaAcoes.appendChild(botaoExcluir);

    // Adiciona o produto ao localStorage
    let produtos = carregarProdutosDoLocalStorage();
    produtos.push(produto);
    salvarProdutosNoLocalStorage(produtos);
}

// Função para editar um produto
function editarProduto(id) {
    let tabela = document.getElementById("tabelaProdutos").getElementsByTagName("tbody")[0];
    let linhas = tabela.getElementsByTagName("tr");

    for (let i = 0; i < linhas.length; i++) {
        let celulaId = linhas[i].cells[0];

        // Verifica se a linha corresponde ao ID do produto
        if (celulaId.textContent == id) {
            // Pega os dados da linha
            let nome = linhas[i].cells[1].textContent;
            let descricao = linhas[i].cells[2].textContent;
            let quantidade = linhas[i].cells[3].textContent;

            // Preenche os campos do formulário com os dados do produto
            document.getElementsByName("nome")[0].value = nome;
            document.getElementsByName("descricao")[0].value = descricao;
            document.getElementsByName("quantidade")[0].value = quantidade;

            // Guarda o ID do produto que está sendo editado
            editandoProdutoId = id;

            // Remove a linha da tabela (pois o produto será editado)
            tabela.deleteRow(i);
            break;
        }
    }
}

// Função para atualizar um produto
function atualizarProduto(id, nome, descricao, quantidade) {
    let tabela = document.getElementById("tabelaProdutos").getElementsByTagName("tbody")[0];
    let linhas = tabela.getElementsByTagName("tr");

    for (let i = 0; i < linhas.length; i++) {
        let celulaId = linhas[i].cells[0];

        if (celulaId.textContent == id) {
            // Atualiza os dados da linha com os novos valores
            linhas[i].cells[1].textContent = nome;
            linhas[i].cells[2].textContent = descricao;
            linhas[i].cells[3].textContent = quantidade;

            // Atualiza o botão de editar
            let botaoEditar = linhas[i].cells[4].getElementsByTagName("button")[0];
            botaoEditar.onclick = function() {
                editarProduto(id);
            };

            // Atualiza o produto no localStorage
            let produtos = carregarProdutosDoLocalStorage();
            let produtoIndex = produtos.findIndex(produto => produto.id === id);
            if (produtoIndex !== -1) {
                produtos[produtoIndex] = { id, nome, descricao, quantidade };
                salvarProdutosNoLocalStorage(produtos);
            }

            break;
        }
    }
}

// Função para excluir um produto
function excluirProduto(id) {
    let tabela = document.getElementById("tabelaProdutos").getElementsByTagName("tbody")[0];
    let linhas = tabela.getElementsByTagName("tr");

    for (let i = 0; i < linhas.length; i++) {
        let celulaId = linhas[i].cells[0];

        // Verifica se a linha corresponde ao ID do produto
        if (celulaId.textContent == id) {
            tabela.deleteRow(i);

            // Remove o produto do localStorage
            let produtos = carregarProdutosDoLocalStorage();
            produtos = produtos.filter(produto => produto.id !== id);
            salvarProdutosNoLocalStorage(produtos);
            break;
        }
    }
}

// Carrega os produtos ao carregar a página
window.onload = function() {
    let produtos = carregarProdutosDoLocalStorage();
    produtos.forEach(produto => {
        adicionarProdutoNaTabela(produto);
    });
};

