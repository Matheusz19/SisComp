import React, { createContext, useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { db, auth } from './FirebaseConfig';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [requisicoes, setRequisicoes] = useState([]);
  const [cotas, setCotas] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    const requisicoesRef = ref(db, 'requisicoes');
    const cotasRef = ref(db, 'cotas');
    const fornecedoresRef = ref(db, 'fornecedores');

    const unsubscribeRequisicoes = onValue(requisicoesRef, (snapshot) => {
      const data = snapshot.val();
      const requisicoesArray = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
      setRequisicoes(requisicoesArray);
    });

    const unsubscribeCotas = onValue(cotasRef, (snapshot) => {
      const data = snapshot.val();
      const cotasArray = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
      setCotas(cotasArray);
    });

    const unsubscribeFornecedores = onValue(fornecedoresRef, (snapshot) => {
      const data = snapshot.val();
      const fornecedoresArray = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
      setFornecedores(fornecedoresArray);
    });

    return () => {
      unsubscribeRequisicoes();
      unsubscribeCotas();
      unsubscribeFornecedores();
      unsubscribeAuth();
    };
  }, []);

  return (
    <AppContext.Provider value={{ requisicoes, setRequisicoes, cotas, setCotas, fornecedores, user }}>
      {children}
    </AppContext.Provider>
  );
};
