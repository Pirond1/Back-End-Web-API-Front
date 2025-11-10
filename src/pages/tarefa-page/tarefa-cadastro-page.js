import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TarefaService from "../../services/tarefa.service";
import TipoTarefaService from "../../services/tipotarefa.service";

function TarefaCadastroPage() {
  const navigate = useNavigate();
  const tarefaService = new TarefaService();
  const tipoService = new TipoTarefaService();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [status, setStatus] = useState(false);
  const [idTipoTarefa, setIdTipoTarefa] = useState("");

  const [tiposTarefa, setTiposTarefa] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarTipos() {
      try {
        const response = await tipoService.listar();
        setTiposTarefa(response.data || []);
      } catch (err) {
        console.error(err);
        setError("Falha ao carregar os tipos de tarefa.");
      }
    }
    carregarTipos();
  }, []);

  const validarFormulario = () => {
    if (!titulo || titulo.trim().length === 0) {
      setError("O campo 'Título' é obrigatório.");
      return false;
    }
    if (!idTipoTarefa) {
      setError("O 'Tipo da Tarefa' é obrigatório.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);

    const payload = {
      id: 0,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      status: status,
      dataVencimento: dataVencimento || null,
      idTipoTarefa: parseInt(idTipoTarefa),
    };

    try {
      await tarefaService.salvar(payload);
      alert("Tarefa cadastrada com sucesso!");
      navigate("/tarefa");
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao salvar a tarefa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h4 className="mb-4">Cadastrar Nova Tarefa</h4>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="titulo" className="form-label">
            Título *
          </label>
          <input
            id="titulo"
            type="text"
            className="form-control"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descricao" className="form-label">
            Descrição
          </label>
          <textarea
            id="descricao"
            className="form-control"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            maxLength={1000}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="dataVencimento" className="form-label">
              Data de Vencimento
            </label>
            <input
              id="dataVencimento"
              type="date"
              className="form-control"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="tipo" className="form-label">
              Tipo da Tarefa *
            </label>
            <select
              id="tipo"
              className="form-select"
              value={idTipoTarefa}
              onChange={(e) => setIdTipoTarefa(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione um tipo...
              </option>
              {tiposTarefa.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3 form-check">
          <input
            id="status"
            type="checkbox"
            className="form-check-input"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="status">
            Marcar como concluída
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Salvando..." : "Cadastrar Tarefa"}
        </button>
      </form>
    </div>
  );
}

export default TarefaCadastroPage;