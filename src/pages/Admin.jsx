import React, { useState, useEffect } from "react";
import { auth, db } from "../components/FirebaseConfig";
import { ref, set, onValue, update } from "firebase/database"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import DataTableComponent from "../components/DataTable";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const colaboradoresRef = ref(db, "users");
    
    const unsubscribe = onValue(colaboradoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const colaboradoresArray = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .filter((user) => user.role === "colaborador");
        setColaboradores(colaboradoresArray);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCreateAdmin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(db, 'users/' + user.uid), {
        email: user.email,
        role: "administrador",
        blocked: false,
      });

      setSuccess("Administrador criado com sucesso!");
      setEmail("");
      setPassword("");
      setError("");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erro ao criar conta de administrador: " + err.message);

      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = (userId, blocked) => {
    const userRef = ref(db, `users/${userId}`);
    update(userRef, { blocked: !blocked });
  };

  const columns = [
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={row.blocked ? "text-red-500" : "text-green-500"}>
          {row.blocked ? "Bloqueado" : "Ativo"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "",
      cell: (row) => (
        <button
          onClick={() => handleToggleBlock(row.id, row.blocked)}
          className={`p-2 rounded ${
            row.blocked ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {row.blocked ? "Desbloquear" : "Bloquear"}
        </button>
      ),
    },
  ];

  return (
    <div className="p-12">
      <h2 className="text-3xl font-bold mb-12 text-center text-white">Gerenciamento</h2>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-12">
        <h3 className="text-xl font-bold mb-4">Adicionar Administrador</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        
        <input
          type="email"
          placeholder="Email do Administrador"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 mb-3 rounded-md w-full"
        />
        
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 mb-3 rounded-md w-full"
        />
        
        <button
          onClick={handleCreateAdmin}
          className={`bg-indigo-600 rounded-md text-white p-3 w-full mt-4 hover:bg-indigo-700 font-bold text-xl ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Criando..." : "Criar Administrador"}
        </button>
      </div>

      <div>
        <h3 className="text-3xl font-bold mb-12 text-center text-white">Colaboradores</h3>
        <DataTableComponent data={colaboradores} columns={columns} />
      </div>
    </div>
  );
}
