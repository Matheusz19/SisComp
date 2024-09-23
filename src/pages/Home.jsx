import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home({ setIsAuthenticated, role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="relative p-12">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Sair
      </button>
      <h2 className="text-3xl font-bold mb-12 text-center text-white">
        Bem-vindo ao Sistema de Compras
      </h2>
      <div className="flex justify-center">
        <div className="flex">
          {role === "colaborador" && (
            <>
              <Link
                to="/requisitar"
                className="bg-indigo-600 text-white py-8 px-20 rounded-l-lg hover:text-gray-300 font-bold text-xl"
              >
                Requisitar
              </Link>
              <Link
                to="/requisicoes"
                className="bg-indigo-600 text-white py-8 px-20 rounded-r-lg hover:text-gray-300 font-bold text-xl"
              >
                Requisições
              </Link>
            </>
          )}
          {role === "administrador" && (
            <>
              <Link
                to="/cadastros"
                className="bg-indigo-600 text-white py-8 px-20 rounded-l-lg hover:text-gray-300 font-bold text-xl"
              >
                Cadastros
              </Link>
              <Link
                to="/cotacoes"
                className="bg-indigo-600 text-white py-8 px-20 hover:text-gray-300 font-bold text-xl"
              >
                Cotações
              </Link>
              <Link
                to="/admin"
                className="bg-indigo-600 text-white py-8 px-20 rounded-r-lg hover:text-gray-300 font-bold text-xl"
              >
                Admin
              </Link>
            </>
          )}
          {role === null && <p className="text-white">Carregando...</p>}
        </div>
      </div>
    </div>
  );
}