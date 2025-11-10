import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/auth.service";

function RegisterPage() {
  const auth = new AuthService();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validarFormulario = () => {
    if (!usuario || !senha || !confirmarSenha) {
      setError("Todos os campos são obrigatórios.");
      return false;
    }
    if (senha !== confirmarSenha) {
      setError("As senhas não conferem.");
      return false;
    }
    setError("");
    return true;
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);

    let dados = {
      usuario: usuario,
      senha: senha,
    };

    try {
      const sucesso = await auth.register(dados);

      if (sucesso) {
        alert("Cadastro realizado com sucesso! Faça o login.");
        navigate("/login");
      } else {
        setError("Erro ao realizar o cadastro. Usuário já utilizado.");
      }
    } catch (err) {
      console.log(err);
      setError("Ocorreu um erro inesperado.");
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
            Criar Nova Conta
          </h4>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Campo Usuário */}
            <div className="form-group mb-3">
              <label htmlFor="usuario" className="form-label fw-semibold">
                Usuário
              </label>
              <input
                type="text"
                id="usuario"
                className="form-control form-control-lg"
                placeholder="Escolha um nome de usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            {/* Campo Senha */}
            <div className="form-group mb-3">
              <label htmlFor="senha" className="form-label fw-semibold">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                className="form-control form-control-lg"
                placeholder="Crie uma senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {/* Campo Confirmar Senha */}
            <div className="form-group mb-3">
              <label
                htmlFor="confirmarSenha"
                className="form-label fw-semibold"
              >
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmarSenha"
                className="form-control form-control-lg"
                placeholder="Repita a senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 mt-3"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          {/* Link para voltar ao Login */}
          <div className="text-center mt-3">
            <small>
              Já tem uma conta? <Link to="/login">Faça o login</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;