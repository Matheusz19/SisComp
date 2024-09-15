import React, { useContext, useState, useEffect } from "react";
import DataTableComponent from "../components/DataTable";
import { AppContext } from "../components/Context";
import { ref, remove } from "firebase/database";
import { db } from "../components/FirebaseConfig";

export default function Requisicoes() {
  const { requisicoes, setRequisicoes, user, cotas } = useContext(AppContext);
  const [selectedRequisicaoId, setSelectedRequisicaoId] = useState(null);

  const getStatusRequisicao = (requisicaoId) => {
    const cotaCount = cotas.filter(cota => cota.requisicaoId === requisicaoId).length;

    if (cotaCount === 0) return "Aberta";
    if (cotaCount < 3) return "Em Cotação";
    return "Cotada";
  };

  const filteredRequisicoes = user.role === "administrador"
    ? requisicoes
    : requisicoes.filter(req => req.userId === user?.uid);

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
      name: "Status",
      selector: (row) => getStatusRequisicao(row.id),
      sortable: true,
    },
    {
      name: "",
      cell: (row) => (
        <button
          onClick={() => toggleCotas(row.id)}
          className="bg-indigo-600 text-white p-2 rounded-md"
        >
          Cotações
        </button>
      ),
    },
  ];

  const toggleCotas = (id) => {
    console.log("ID da requisição selecionada:", id);
    setSelectedRequisicaoId(prevId => (prevId === id ? null : id));
  };

  const handleDelete = (id) => {
    console.log("Deletando a requisição com ID:", id);
    const requisicaoRef = ref(db, `requisicoes/${id}`);
    remove(requisicaoRef)
      .then(() => {
        console.log("Requisição deletada do Firebase");
        setRequisicoes((prevRequisicoes) => prevRequisicoes.filter((requisicao) => requisicao.id !== id));
      })
      .catch((error) => {
        console.error("Erro ao remover requisição: ", error);
      });
  };

  return (
    <div className="p-12">
      <h2 className="text-2xl font-bold mb-12 text-center text-white">Requisições</h2>
      <DataTableComponent data={filteredRequisicoes} columns={columns} onDelete={handleDelete} />

      {selectedRequisicaoId && (
        <div className="mt-8 p-4 border rounded-md bg-white text-black">
          <h3 className="text-xl font-bold mb-4">Cotações</h3>
          <ul>
            {cotas
              .filter(cota => cota.requisicaoId === selectedRequisicaoId)
              .map(cota => (
                <li key={cota.id} className="mb-4 p-4 border-b">
                  <div><strong>Nome do Produto:</strong> {cota.produto.nome}</div>
                  <div><strong>Descrição:</strong> {cota.produto.descricao}</div>
                  <div><strong>Fornecedor:</strong> {cota.fornecedor.nomeF}</div>
                  <div><strong>Contatos:</strong> {cota.fornecedor.contato.join(', ')}</div>
                  <div><strong>Data:</strong> {cota.data}</div>
                  <div><strong>Quantidade:</strong> {cota.quantidade}</div>
                  <div><strong>Valor:</strong> {cota.value}</div>
                </li>
              ))
            }
            {cotas.filter(cota => cota.requisicaoId === selectedRequisicaoId).length === 0 && (
              <p>Nenhuma cotação encontrada para esta requisição.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}