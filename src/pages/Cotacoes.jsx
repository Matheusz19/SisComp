import React, { useContext } from "react";
import DataTableComponent from "../components/DataTable";
import { AppContext } from "../components/Context";
import { ref, remove } from "firebase/database";
import { db } from "../components/FirebaseConfig";

export default function Cotacoes() {
  const { cotas, setCotas } = useContext(AppContext);

  const columns = [
    {
      name: "Nome do Produto",
      selector: (row) => row.produto?.nome || "-",
      sortable: true,
    },
    {
      name: "Descrição do Produto",
      selector: (row) => row.produto?.descricao || "-",
      sortable: true,
    },
    {
      name: "Nome do Fornecedor",
      selector: (row) => row.fornecedor?.nomeF || "-",
      sortable: true,
    },
    {
      name: "Contato do Fornecedor",
      selector: (row) => row.fornecedor?.contato?.join(", ") || "-",
      sortable: true,
    },
    {
      name: "Data da Cotação",
      selector: (row) => row.data || "-",
      sortable: true,
    },
    {
      name: "Quantidade",
      selector: (row) => row.quantidade || "-",
      sortable: true,
    },
    {
      name: "Valor",
      selector: (row) => row.value || "-",
      sortable: true,
    },
  ];

  const handleDelete = (id) => {
    console.log("Deletando cotação com ID:", id);
    const cotaRef = ref(db, `cotas/${id}`);
    remove(cotaRef)
      .then(() => {
        console.log("Cotação deletada do firebase");
        setCotas((prevCotas) => prevCotas.filter((cota) => cota.id !== id));
      })
      .catch((error) => {
        console.error("Erro ao remover cotação: ", error);
      });
  };


  return (
    <div className="p-12">
      <h2 className="text-2xl font-bold mb-12 text-center text-white">Cotações</h2>
      <DataTableComponent data={cotas} columns={columns} onDelete={handleDelete} />
    </div>
  );
}