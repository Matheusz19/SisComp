import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../components/FirebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { ref, get } from "firebase/database";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      const userRef = ref(db, "users/" + user.uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.blocked) {
          setError("Usuário bloqueado. Entre em contato com o administrador.");
          return;
        }
        if (userData.role === "administrador" || userData.role === "colaborador") {
          onLogin();
          navigate("/home");
        } else {
          setError("Erro ao verificar a função do usuário.");
        }
      } else {
        setError("Erro ao verificar a função do usuário.");
      }
    } catch (error) {
      setError("Email e/ou senha inválidos.");
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert("Email para recuperação de senha enviado com sucesso!");
      setShowResetModal(false);
      setResetEmail("");
    } catch (error) {
      setResetError("Erro em enviar email de recuperação de senha");
      console.error("Erro ao enviar e-mail de redefinição: ", error);
    }
  };

  const redirectToSignup = () => {
    navigate("/criarconta");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-8 text-center">Realize Login</h2>
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-6"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-6"
        />
        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Entrar
        </button>
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setShowResetModal(true)}
            className="text-blue-500 hover:underline"
          >
            Esqueceu a senha?
          </button>
          <button
            onClick={redirectToSignup}
            className="text-blue-500 hover:underline"
          >
            Criar Conta
          </button>
        </div>
        {error && <div className="mt-2 text-red-500">{error}</div>}
        {showResetModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">Redefinir Senha</h3>
              <input
                type="email"
                placeholder="Digite seu email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
              />
              <button
                onClick={handlePasswordReset}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Enviar Email
              </button>
              {resetError && <div className="mt-2 text-red-500">{resetError}</div>}
              <button
                onClick={() => setShowResetModal(false)}
                className="mt-4 text-blue-500 hover:underline"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}