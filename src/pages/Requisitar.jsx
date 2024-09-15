import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../components/Context";
import { db, ref, push, onValue, auth } from "../components/FirebaseConfig";

export default function Requisitar() {
  const { requisicoes, setRequisicoes } = useContext(AppContext);
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [requisicaoQuantidade, setRequisicaoQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const produtosRef = ref(db, "produtos");
    onValue(produtosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listaProdutos = Object.entries(data).map(([id, prod]) => ({
          id,
          ...prod,
        }));
        setProdutos(listaProdutos);
      }
    });
  }, []);

  const addRequisicao = () => {
    if (!produtoSelecionado || !requisicaoQuantidade) {
      alert("Nome do produto e quantidade são obrigatórios!");
      return;
    }

    const produto = produtos.find((p) => p.id === produtoSelecionado);

    const newRequisicao = {
      produto: { nome: produto.nome, descricao: produto.descricao },
      quantidade: requisicaoQuantidade,
      observacao: observacao || "-",
      userId: auth.currentUser?.uid,
    };

    const requisicoesRef = ref(db, "requisicoes");
    push(requisicoesRef, newRequisicao)
    .then((snapshot) => {
      const newRequisicaoId = snapshot.key;
      const requisicaoComId = { id: newRequisicaoId, ...newRequisicao };
      
      setRequisicoes((prevRequisicoes) => [
        ...prevRequisicoes.filter((req) => req.id !== newRequisicaoId),
        requisicaoComId
      ]);
  
        setMensagem("Requisição adicionada com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao adicionar requisição: ", error);
        setMensagem("Erro ao adicionar requisição. Tente novamente.");
      });
  
    setProdutoSelecionado("");
    setRequisicaoQuantidade("");
    setObservacao("");
  };

  return (
    <div className="p-12">
      <h2 className="text-2xl font-bold mb-12 text-center text-white">Cadastro de Requisições</h2>

      <select
        value={produtoSelecionado}
        onChange={(e) => setProdutoSelecionado(e.target.value)}
        className="border p-3 mb-3 rounded-md w-full text-gray-400"
      >
        <option value="" disabled>
          Selecione o Produto
        </option>
        {produtos.map((produto) => (
          <option className="text-black" key={produto.id} value={produto.id}>
            {produto.nome}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantidade"
        value={requisicaoQuantidade}
        onChange={(e) => setRequisicaoQuantidade(e.target.value)}
        className="border p-3 mb-3 rounded-md w-full"
      />
      <input
        type="text"
        placeholder="Observação (opcional)"
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
        className="border p-3 mb-3 rounded-md w-full"
      />
      <button
        onClick={addRequisicao}
        className="bg-indigo-600 rounded-md text-white p-3 w-full mt-4 hover:text-gray-300 text-xl font-bold"
      >
        Requisitar
      </button>
      {mensagem && (
        <p className="text-center mt-4 text-green-500 font-bold">{mensagem}</p>
      )}
    </div>
  );
}