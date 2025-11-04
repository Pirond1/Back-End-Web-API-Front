import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";

function LoginPage() {
  const auth = new AuthService();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");


  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    let dados = {
      usuario: usuario,
      senha: senha,
    };

    try {
      const sucesso = await auth.authenticate(dados);

      if (sucesso) {
        navigate("/home");
      } else {
        setError("Usuário ou senha inválidos.");
      }
    } catch (err) {
      console.log(err);
      setError("Ocorreu um erro ao tentar fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card shadow-lg rounded-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-body p-4">
          <h4 className="text-center mb-4 text-primary fw-bold">
            Login no Sistema
          </h4>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label htmlFor="usuario" className="form-label fw-semibold">
                Usuário
              </label>
              <input
                type="text"
                id="usuario"
                className="form-control form-control-lg"
                placeholder="Digite seu usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="senha" className="form-label fw-semibold">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                className="form-control form-control-lg"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 mt-3"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;