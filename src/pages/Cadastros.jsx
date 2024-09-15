import React from "react";
import { Link } from "react-router-dom";

export default function Cadastros() {

  return (
    <div className="relative p-12">
      <h2 className="text-3xl font-bold mb-12 text-center text-white">Cadastro de Dados</h2>
      <div className="flex justify-center">
        <div className="flex">
          <Link
            to="/cadastros/produtos"
            className="bg-indigo-600 text-white py-8 px-20 rounded-l-lg hover:text-gray-300 font-bold text-xl"
          >
            Produtos
          </Link>
          <Link
            to="/cadastros/fornecedores"
            className="bg-indigo-600 text-white py-8 px-20 hover:text-gray-300 font-bold text-xl"
          >
            Fornecedores
          </Link>
          <Link
            to="/cadastros/cotas"
            className="bg-indigo-600 text-white py-8 px-20 rounded-r-lg hover:text-gray-300 font-bold text-xl"
          >
            Cotas
          </Link>
        </div>
      </div>
    </div>
  );
}