import { Navigate } from "react-router-dom";
import AuthService from "../../services/auth.service";

const authService = new AuthService();

export default function PrivateRoute({ children }) {
  const usuario = authService.usuarioAutenticado();

  // Se não tiver usuário logado, redireciona para /login
  if (!usuario) {
    authService.logout();
    return <Navigate to="/login" replace />;
  }

  // Caso contrário, renderiza a rota normalmente
  return children;
}