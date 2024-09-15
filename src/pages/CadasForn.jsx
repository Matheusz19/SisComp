import React, { useState, useEffect } from "react";
import { db, ref, push, onValue, update, remove } from "../components/FirebaseConfig";
import DataTableComponent from "../components/DataTable";

export default function CadasForn() {
  const [nomeFornecedor, setNomeFornecedor] = useState("");
  const [contatoPrincipal, setContatoPrincipal] = useState("");
  const [contatoAlternativo, setContatoAlternativo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [editingFornecedorId, setEditingFornecedorId] = useState(null);

  useEffect(() => {
    const fornecedoresRef = ref(db, "fornecedores");
    onValue(fornecedoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fornecedoresArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setFornecedores(fornecedoresArray);
      }
    });
  }, []);

  const addFornecedor = () => {
    if (!nomeFornecedor || !contatoPrincipal) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const newFornecedor = {
      nome: nomeFornecedor,
      contatoPrincipal,
      contatoAlternativo,
      criadoEm: new Date(),
    };

    if (editingFornecedorId) {
      const fornecedorRef = ref(db, `fornecedores/${editingFornecedorId}`);
      update(fornecedorRef, newFornecedor)
        .then(() => {
          setMensagem("Fornecedor atualizado com sucesso!");
          clearForm();
        })
        .catch((error) => {
          setMensagem("Erro ao atualizar fornecedor. Tente novamente.");
        });
    } else {
      const fornecedoresRef = ref(db, "fornecedores");
      push(fornecedoresRef, newFornecedor)
        .then(() => {
          setMensagem("Fornecedor adicionado com sucesso!");
          clearForm();
        })
        .catch((error) => {
          setMensagem("Erro ao adicionar fornecedor. Tente novamente.");
        });
    }
  };

  const handleDelete = (id) => {
    console.log("Deletando item com ID:", id);
    const fornecedorRef = ref(db, `fornecedores/${id}`);
    remove(fornecedorRef)
      .then(() => {
        console.log("Item deletado do firebase");
        setFornecedores((prevFornecedores) => prevFornecedores.filter((fornecedor) => fornecedor.id !== id));
      })
      .catch((error) => {
        console.error("Erro ao remover item: ", error);
      });
  };

  const handleEdit = (id) => {
    const fornecedor = fornecedores.find((f) => f.id === id);
    if (fornecedor) {
      setNomeFornecedor(fornecedor.nome);
      setContatoPrincipal(fornecedor.contatoPrincipal);
      setContatoAlternativo(fornecedor.contatoAlternativo || "");
      setEditingFornecedorId(id);
      setMensagem("");
    }
  };

  const clearForm = () => {
    setNomeFornecedor("");
    setContatoPrincipal("");
    setContatoAlternativo("");
    setEditingFornecedorId(null);
  };

  const columns = [
    {
      name: "Nome",
      selector: (row) => row.nome,
      sortable: true,
    },
    {
      name: "Contato Principal",
      selector: (row) => row.contatoPrincipal,
      sortable: true,
    },
    {
      name: "Contato Alternativo",
      selector: (row) => row.contatoAlternativo || "-",
      sortable: true,
    },
    {
      name: "",
      cell: (row) => (
        <button
          onClick={() => handleEdit(row.id)}
          className="bg-indigo-600  text-white p-2 rounded"
        >
          Editar
        </button>
      ),
    },
  ];

  return (
    <div className="p-12">
      <h2 className="text-2xl font-bold mb-12 text-center text-white">
        Cadastro de Fornecedores
      </h2>
      <input
        type="text"
        placeholder="Nome do Fornecedor"
        value={nomeFornecedor}
        onChange={(e) => setNomeFornecedor(e.target.value)}
        className="border p-3 mb-3 rounded-md w-full"
      />
      <input
        type="text"
        placeholder="Contato Principal"
        value={contatoPrincipal}
        onChange={(e) => setContatoPrincipal(e.target.value)}
        className="border p-3 mb-3 rounded-md w-full"
      />
      <input
        type="text"
        placeholder="Contato Alternativo (opcional)"
        value={contatoAlternativo}
        onChange={(e) => setContatoAlternativo(e.target.value)}
        className="border p-3 mb-3 rounded-md w-full"
      />
      <button
        onClick={addFornecedor}
        className="bg-indigo-600 rounded-md text-white p-3 w-full mt-4 hover:text-gray-300 font-bold text-xl"
      >
        {editingFornecedorId ? "Atualizar Fornecedor" : "Adicionar Fornecedor"}
      </button>
      {mensagem && (
        <p className="text-center mt-4 text-green-500 font-bold">{mensagem}</p>
      )}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 text-white">Fornecedores Cadastrados</h3>
        <DataTableComponent data={fornecedores} columns={columns} onDelete={handleDelete} />
      </div>
    </div>
  );
}