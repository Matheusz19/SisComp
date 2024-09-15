import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CriarConta from "./pages/CriarConta";
import Home from "./pages/Home";
import Cotacoes from "./pages/Cotacoes";
import Cadastros from "./pages/Cadastros";
import CadasCota from "./pages/CadasCota";
import CadasProd from "./pages/CadasProd";
import CadasForn from "./pages/CadasForn";
import Requisicoes from "./pages/Requisicoes";
import Requisitar from "./pages/Requisitar";
import Admin from "./pages/Admin";
import { AppProvider } from "./components/Context";
import { auth, db } from "./components/FirebaseConfig";
import { ref, onValue } from "firebase/database";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const roleRef = ref(db, `users/${userId}/role`);
        
        const unsubscribe = onValue(roleRef, (snapshot) => {
          const newRole = snapshot.val();
          if (newRole !== role) {
            setRole(newRole);
          }
        });

        return () => unsubscribe();
      }
    }
  }, [isAuthenticated]);

  return (
    <AppProvider>
      <Router basename="/">
        <div className="mx-auto">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route
                  path="/"
                  element={<Login onLogin={() => setIsAuthenticated(true)} />}
                />
                <Route path="/criarconta" element={<CriarConta />} />
              </>
            ) : (
              <Route
                path="*"
                element={
                  <div className="bg-img">
                    <Routes>
                      <Route
                        path="/home"
                        element={
                          role === "colaborador" || role === "administrador" ? (
                            <Home setIsAuthenticated={setIsAuthenticated} role={role} />
                          ) : (
                            <Navigate to="/" />
                          )
                        }
                      />
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
                }
              />
            )}
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}
