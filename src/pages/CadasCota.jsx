import React, { useContext, useState, useEffect } from "react";
import DataTableComponent from "../components/DataTable";
import { AppContext } from "../components/Context";
import { db, ref, push } from "../components/FirebaseConfig";

export default function CadasCota() {
  const { requisicoes, setCotas, fornecedores, cotas } = useContext(AppContext);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState("");
  const [fornecedorContatos, setFornecedorContatos] = useState([]);
  const [cotaData, setCotaData] = useState("");
  const [cotaQuantidade, setCotaQuantidade] = useState("");
  const [cotaValor, setCotaValor] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [primeiraCotaAdicionada, setPrimeiraCotaAdicionada] = useState(false); // Nova variável

  const columns = [
    {
      name: "Nome do Produto",
      selector: (row) => row.produto?.nome || "-",
      sortable: true,
    },
    {
      name: "Quantidade",
      selector: (row) => row.quantidade || "-",
      sortable: true,
    },
    {
      name: "Observação",
      selector: (row) => row.observacao || "-",
      sortable: true,
    },
    {
      name: "",
      cell: (row) => (
        <button
          onClick={() => handleCotar(row)}
          className="bg-indigo-600 text-white rounded-md p-2 hover:bg-indigo-700"
        >
          Cotar
        </button>
      ),
    },
  ];

  const handleCotar = (requisicao) => {
    setProdutoSelecionado(requisicao);
    setFornecedorSelecionado("");
    setFornecedorContatos([]);
    setShowForm(true);
    setMensagem("");
    setPrimeiraCotaAdicionada(false);
  };

  useEffect(() => {
    const fornecedor = fornecedores.find((f) => f.id === fornecedorSelecionado);
    if (fornecedor) {
      const contatos = [
        fornecedor.contatoPrincipal,
        fornecedor.contatoAlternativo,
      ].filter(Boolean);
      setFornecedorContatos(contatos);
    } else {
      setFornecedorContatos([]);
    }
  }, [fornecedorSelecionado, fornecedores]);

  const addCota = () => {
    if (!produtoSelecionado || !fornecedorSelecionado || !cotaData || !cotaQuantidade || !cotaValor) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const produto = produtoSelecionado.produto;
    const fornecedor = fornecedores.find((f) => f.id === fornecedorSelecionado);

    const newCota = {
      produto: { nome: produto?.nome, descricao: produto?.descricao },
      fornecedor: { nomeF: fornecedor.nome, contato: fornecedorContatos },
      data: cotaData,
      quantidade: cotaQuantidade,
      value: cotaValor,
      requisicaoId: produtoSelecionado.id,
    };

    const cotasRef = ref(db, "cotas");
    push(cotasRef, newCota)
      .then(() => {
        setMensagem("Cotação adicionada com sucesso!");
        setPrimeiraCotaAdicionada(true);
      })
      .catch(() => {
        setMensagem("Erro ao adicionar cotação. Tente novamente.");
      });
  };

  const handleAddNewCota = () => {
    setCotaData("");
    setCotaQuantidade("");
    setCotaValor("");
    setMensagem("");
    setPrimeiraCotaAdicionada(false);
  };

  return (
    <div className="p-12">
      <h2 className="text-2xl font-bold mb-12 text-center text-white">Cadastro de Cotas</h2>
      <h3 className="text-2xl font-bold mb-12 text-white">Requisições</h3>
      <DataTableComponent data={requisicoes} columns={columns} />

      {showForm && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-12 text-white">Cotação</h3>
          <div>
            <input
              type="text"
              value={produtoSelecionado?.produto?.nome || ""}
              readOnly
              className="border p-3 mb-3 rounded-md w-full bg-gray-100"
            />
          </div>
          <select
            value={fornecedorSelecionado}
            onChange={(e) => setFornecedorSelecionado(e.target.value)}
            className="border p-3 mb-3 rounded-md w-full text-black"
          >
            <option value="" disabled>
              Selecione o Fornecedor
            </option>
            {fornecedores.map((fornecedor) => (
              <option className="text-black" key={fornecedor.id} value={fornecedor.id}>
                {fornecedor.nome}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantidade"
            value={cotaQuantidade}
            onChange={(e) => setCotaQuantidade(e.target.value)}
            className="border p-3 mb-3 rounded-md w-full"
          />
          <input
            type="number"
            placeholder="Valor final"
            value={cotaValor}
            onChange={(e) => setCotaValor(e.target.value)}
            className="border p-3 mb-3 rounded-md w-full"
          />
          <input
            type="date"
            value={cotaData}
            onChange={(e) => setCotaData(e.target.value)}
            className="border p-3 mb-3 rounded-md w-full"
          />

          {!primeiraCotaAdicionada ? (
            <button
              onClick={addCota}
              className="bg-indigo-600 rounded-md text-white p-3 w-full mt-4 hover:text-gray-300 font-bold text-xl"
            >
              Adicionar Cota
            </button>
          ) : (
            <button
              onClick={handleAddNewCota}
              className="bg-indigo-600 rounded-md text-white p-3 w-full mt-4 hover:text-gray-300 font-bold text-xl"
            >
              Adicionar Nova Cota
            </button>
          )}

          {mensagem && (
            <p className="text-center mt-4 text-green-500 font-bold">{mensagem}</p>
          )}
        </div>
      )}
    </div>
  );
}