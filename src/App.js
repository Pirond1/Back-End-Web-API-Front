import { useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/header/header.component';
import HomePage from './pages/home-page/home-page';
import LoginPage from './pages/login-page/login-page';
import TarefaPage from './pages/tarefa-page/tarefa-page';
import TarefaCadastroPage from './pages/tarefa-page/tarefa-cadastro-page';
import TipoPage from './pages/tipo-page/tipo-page';
import TipoCadastroPage  from './pages/tipo-page/tipo-cadastro-page';
import PrivateRoute from './components/private-route/private-route';

function App() {
  
  const headerRef = useRef();
  const location = useLocation();

  // Define em quais rotas o Header NÃO deve aparecer
  const rotasSemHeader = ["/login"];
  const exibirHeader = !rotasSemHeader.includes(location.pathname);

return (
    <>
      {exibirHeader && (
        <Header
          title="Gerenciador de Tarefas"
          onTitleClicked={() => console.log('Clicou no título!')}
          ref={headerRef}
        />
      )}

      <Routes>
        {/* Login sem header */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tarefa"
          element={
            <PrivateRoute>
              <TarefaPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tarefa/cadastro"
          element={
            <PrivateRoute>
              <TarefaCadastroPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tipo"
          element={
            <PrivateRoute>
              <TipoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tipo/cadastro"
          element={
            <PrivateRoute>
              <TipoCadastroPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tipo/editar/:id"
          element={
            <PrivateRoute>
              <TipoCadastroPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  // BrowserRouter aqui para permitir o useNavigate dentro de App
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
