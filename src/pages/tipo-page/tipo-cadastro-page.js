import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TipoTarefaService from "../../services/tipotarefa.service";

function TipoCadastroPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = new TipoTarefaService();

  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  // 6. MUDANÇA: Simplificar a validação
  const validarFormulario = () => {
    if (!nome || nome.trim().length === 0) {
      setError("O campo 'Nome' é obrigatório.");
      return false;
    }
    if (nome.length > 100) {
      setError("O 'Nome' deve ter no máximo 100 caracteres.");
      return false;
    }
    setError(null);
    return true;
  };

  const limparDados = () => {
    setNome("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      id: id ? parseInt(id) : 0,
      nome: nome.trim(),
    };

    try {
      if (modoEdicao) {
        await service.atualizar(id, payload);
      } else {
        await service.salvar(payload);
      }

      alert("Tipo de Tarefa Salvo com Sucesso!");
      navigate("/tipo");
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  async function carregarTipoTarefa() {
    try {
      setLoading(true);
      const response = await service.selecionar(id);
      const tipo = response.data;
      setNome(tipo.nome);
    } catch (err) {
      console.log(err);
      setError("Erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      setModoEdicao(true);
      carregarTipoTarefa();
    }
  }, [id]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">
          {modoEdicao ? "EDITAR TIPO DE TAREFA" : "CADASTRAR TIPO DE TAREFA"}
        </h4>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}


      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome *
          </label>
          <input
            id="nome"
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do tipo (ex: Trabalho)"
            maxLength={100}
            required
          />
          <div className="form-text">Obrigatório. Máx. 20 caracteres.</div>
        </div>


        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading
            ? "Salvando..."
            : modoEdicao
            ? "Salvar Alterações"
            : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

export default TipoCadastroPage;