
const estadoSelect = document.getElementById("estado");
const cidadeSelect = document.getElementById("cidade");
const filtroCidade = document.getElementById("filtroCidade");
const quantidadeCidades = document.getElementById("quantidadeCidades");
const formInscricao = document.getElementById("formInscricao");
const mensagem = document.getElementById("mensagem");

let cidades = [];

async function carregarEstados() {
    try {
        const resposta = await fetch(
            "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os estados.");
        }

        const estados = await resposta.json();

        estadoSelect.innerHTML =
            '<option value="">Selecione um estado</option>';

        estados.forEach((estado) => {
            const option = document.createElement("option");

            option.value = estado.sigla;
            option.textContent = estado.nome;

            estadoSelect.appendChild(option);
        });

    } catch (erro) {
        estadoSelect.innerHTML =
            '<option value="">Erro ao carregar estados</option>';

        mostrarMensagem(erro.message, "erro");
    }
}

async function carregarCidades(uf) {
    cidades = [];

    cidadeSelect.innerHTML =
        '<option value="">Carregando...</option>';

    cidadeSelect.disabled = true;
    filtroCidade.disabled = true;
    filtroCidade.value = "";

    quantidadeCidades.textContent = "Carregando cidades...";
    mensagem.textContent = "";
    mensagem.className = "";

    try {
        const resposta = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar as cidades.");
        }

        cidades = await resposta.json();

        quantidadeCidades.textContent =
            `Este estado possui ${cidades.length} cidades.`;

        atualizarListaCidades(cidades);

        cidadeSelect.disabled = false;
        filtroCidade.disabled = false;

    } catch (erro) {
        cidadeSelect.innerHTML =
            '<option value="">Erro ao carregar cidades</option>';

        quantidadeCidades.textContent =
            "Não foi possível carregar as cidades.";

        mostrarMensagem(erro.message, "erro");
    }
}

function atualizarListaCidades(lista) {
    cidadeSelect.innerHTML = "";

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione uma cidade";

    cidadeSelect.appendChild(opcaoInicial);

    lista.forEach((cidade) => {
        const option = document.createElement("option");

        option.value = cidade.nome;
        option.textContent = cidade.nome;

        cidadeSelect.appendChild(option);
    });

    if (lista.length === 0) {
        opcaoInicial.textContent = "Nenhuma cidade encontrada";
    }
}

estadoSelect.addEventListener("change", () => {
    mensagem.textContent = "";
    mensagem.className = "";

    if (estadoSelect.value === "") {
        cidades = [];

        cidadeSelect.innerHTML =
            '<option value="">Selecione primeiro um estado</option>';

        cidadeSelect.disabled = true;
        filtroCidade.disabled = true;
        filtroCidade.value = "";

        quantidadeCidades.textContent = "Selecione um estado.";

        return;
    }

    carregarCidades(estadoSelect.value);
});

filtroCidade.addEventListener("input", () => {
    const termo = filtroCidade.value
        .trim()
        .toLocaleLowerCase("pt-BR");

    const cidadesFiltradas = cidades.filter((cidade) =>
        cidade.nome.toLocaleLowerCase("pt-BR").includes(termo)
    );

    atualizarListaCidades(cidadesFiltradas);
});

formInscricao.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const cidade = cidadeSelect.value;
    const uf = estadoSelect.value;

    if (!nome || !email || !cidade || !uf) {
        mostrarMensagem(
            "Preencha todos os campos antes de se inscrever.",
            "erro"
        );

        return;
    }

    mostrarMensagem(
        `${nome}, de ${cidade}/${uf}, inscrito com sucesso!`,
        "sucesso"
    );
});

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = tipo;
}

carregarEstados();
