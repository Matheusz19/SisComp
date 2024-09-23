import React, { useEffect } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Cadastros from "../pages/Cadastros";
import CadasCota from "../pages/CadasCota";
import CadasProd from "../pages/CadasProd";
import CadasForn from "../pages/CadasForn";
import Cotacoes from "../pages/Cotacoes";
import Requisitar from "../pages/Requisitar";
import Requisicoes from "../pages/Requisicoes";
import { ref, onValue } from "firebase/database";
import { auth, db } from "../components/FirebaseConfig";

export default Navigation = ({ isAuthenticated, setIsAuthenticated, role, setRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const roleRef = ref(db, `users/${userId}/role`);

        const unsubscribe = onValue(roleRef, (snapshot) => {
          const newRole = snapshot.val();
          setRole(newRole);
        });

        return () => unsubscribe();
      }
    }
  }, [isAuthenticated, navigate, setRole]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-img">
      <Routes>
        <Route path="/home" element={<Home setIsAuthenticated={setIsAuthenticated} role={role} />} />

        {role === "administrador" && (
          <>
            <Route path="/admin" element={<Admin />} />
            <Route path="/cadastros" element={<Cadastros />} />
            <Route path="/cadastros/cotas" element={<CadasCota />} />
            <Route path="/cadastros/produtos" element={<CadasProd />} />
            <Route path="/cadastros/fornecedores" element={<CadasForn />} />
            <Route path="/cotacoes" element={<Cotacoes />} />
          </>
        )}

        {role === "colaborador" && (
          <>
            <Route path="/requisitar" element={<Requisitar />} />
            <Route path="/requisicoes" element={<Requisicoes />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
};