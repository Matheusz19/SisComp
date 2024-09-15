import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../components/FirebaseConfig";
import { ref, set } from "firebase/database"; 
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function CriarConta() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;

      await set(ref(db, 'users/' + user.uid), {
        email: user.email,
        role: "colaborador"
      });

      setSuccessMessage("Conta criada com sucesso! Redirecionando para o login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      if (error.code.includes("auth")) {
        setError("Erro ao criar conta: " + error.message);
      } else {
        setError("Erro ao salvar função: " + error.message);
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-500'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-96'>
        <h2 className='text-2xl font-bold mb-8 text-center'>Criar Conta</h2>
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-6'
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-6'
        />
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-6'
        />
        <button
          onClick={handleCreateAccount}
          className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Criar Conta
        </button>
        {error && <div className="mt-2 text-red-500">{error}</div>}
        {successMessage && <div className="mt-2 text-green-500">{successMessage}</div>}
      </div>
    </div>
  );
}