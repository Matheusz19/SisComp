import React, { useState, useEffect } from "react";
import { db, ref, push, onValue, update, remove } from "../components/FirebaseConfig";
import DataTableComponent from "../components/DataTable";

export default function CadasProd() {
  const [nomeProduto, setNomeProduto] = useState("");
  const [descricaoProduto, setDescricaoProduto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [editingProdutoId, setEditingProdutoId] = useState(null);

  useEffect(() => {
    const produtosRef = ref(db, "produtos");

    const unsubscribe = onValue(produtosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const produtosArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setProdutos(produtosArray);
      } else {
        setProdutos([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addProduto = () => {
    if (!nomeProduto || !descricaoProduto) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const newProduto = {
      nome: nomeProduto,
      descricao: descricaoProduto,
      criadoEm: new Date(),
    };

    if (editingProdutoId) {
      const produtoRef = ref(db, `produtos/${editingProdutoId}`);
      update(produtoRef, newProduto)
        .then(() => {
          setMensagem("Produto atualizado com sucesso!");
          clearForm();
        })
        .catch((error) => {
          setMensagem("Erro ao atualizar produto. Tente novamente.");
        });
    } else {
      const produtosRef = ref(db, "produtos");
      push(produtosRef, newProduto)
        .then(() => {
          setMensagem("Produto adicionado com sucesso!");
          clearForm();
        })
        .catch((error) => {
          setMensagem("Erro ao adicionar produto. Tente novamente.");
        });
    }
  };

  const handleDelete = (id) => {
    console.log("Deletando item com ID:", id);
    const produtoRef = ref(db, `produtos/${id}`);
    remove(produtoRef)
      .then(() => {``
        console.log("Item deletado do firebase");
        setProdutos((prevProdutos) => prevProdutos.filter((produto) => produto.id !== id));
      })
      .catch((error) => {
        console.error("Erro ao remover item: ", error);
      });
  };


  const handleEdit = (id) => {
    const produto = produtos.find((p) => p.id === id);
    if (produto) {
      setNomeProduto(produto.nome);
      setDescricaoProduto(produto.descricao);
      setEditingProdutoId(id);
      setMensagem("");
    }
  };

  const clearForm = () => {
    setNomeProduto("");
    setDescricaoProduto("");
    setEditingProdutoId(null);
  };

  const columns = [
    {
      name: "Nome",
      selector: (row) => row.nome,
      sortable: true,
    },
    {
      name: "Descrição",
      selector: (row) => row.descricao,
      sortable: true,
    },
    {
      name: "",
      cell: (row) => (
          <button
            onClick={() => handleEdit(row.id)}
            className="bg-indigo-600 text-white p-2 rounded mr-2"
          >
            Editar
          </button>
      ),
    },
  ];

  return (
    <div className="p-12">
      <h2 className="text-2xl font-bold mb-12 text-center text-white">
        Cadastro de Produtos
      </h2>
      <input
        type="text"
        placeholder="Nome do Produto"
        value={nomeProduto}
        onChange={(e) => setNomeProduto(e.target.value)}
        className="border p-3 mb-3 rounded-md w-full"
      />
      <input
        type="text"
        placeholder="Descrição do Produto"
        value={descricaoProduto}
        onChange={(e) => setDescricaoProduto(e.target.value)}
        className="border p-3 mb-3 rounded-md w-full"
      />
      <button
        onClick={addProduto}
        className="bg-indigo-600 rounded-md text-white p-3 w-full mt-4 hover:text-gray-300 font-bold text-xl"
      >
        {editingProdutoId ? "Atualizar Produto" : "Adicionar Produto"}
      </button>
      {mensagem && (
        <p className="text-center mt-4 text-green-500 font-bold">{mensagem}</p>
      )}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 text-white">Produtos Cadastrados</h3>
        <DataTableComponent data={produtos} columns={columns} onDelete={handleDelete} />
      </div>
    </div>
  );
}