import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import CriarConta from "./pages/CriarConta";
import Navigation from "./components/Navigation";
import { AppProvider } from "./components/Context";
import { auth, db } from "./components/FirebaseConfig";
import { ref, onValue } from "firebase/database";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  return (
    <AppProvider>
      <Router basename="/">
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
                <Navigation 
                  isAuthenticated={isAuthenticated} 
                  role={role} 
                  setIsAuthenticated={setIsAuthenticated} 
                  setRole={setRole}
                />
              } 
            />
          )}
        </Routes>
      </Router>
    </AppProvider>
  );
}
