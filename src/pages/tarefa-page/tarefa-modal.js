import React, { useState, useEffect } from "react";
import TarefaService from "../../services/tarefa.service";
import TipoTarefaService from "../../services/tipotarefa.service";
import AuthService from "../../services/auth.service";

function TarefaModal({ tarefa, onClose, onSave, onDelete }) {
  const tipoService = new TipoTarefaService();
  const auth = new AuthService();

  const [titulo, setTitulo] = useState(tarefa.titulo);
  const [descricao, setDescricao] = useState(tarefa.descricao);
  const [dataVencimento, setDataVencimento] = useState(
    tarefa.dataVencimento ? tarefa.dataVencimento.split("T")[0] : ""
  );
  const [status, setStatus] = useState(tarefa.status);
  const [idTipoTarefa, setIdTipoTarefa] = useState(tarefa.idTipoTarefa);
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
      }
    }
    carregarTipos();
  }, []);

  useEffect(() => {
    if (tarefa) {
      setTitulo(tarefa.titulo);
      setDescricao(tarefa.descricao);
      setDataVencimento(
        tarefa.dataVencimento ? tarefa.dataVencimento.split("T")[0] : ""
      );
      setStatus(tarefa.status);
      setIdTipoTarefa(tarefa.idTipoTarefa);
    }
  }, [tarefa]);

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
      id: tarefa.id,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      status: status,
      dataVencimento: dataVencimento || null,
      idTipoTarefa: parseInt(idTipoTarefa),
    };

    await onSave(payload);
    setLoading(false);
  };


  const handleExcluir = async () => {
    setLoading(true);
    await onDelete(tarefa.id);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="d-flex align-items-center">
            <h5 className="modal-title me-3">Detalhes da Tarefa</h5>
            
            {status ? (
              <span className="badge bg-success">Concluída</span>
            ) : (
              <span className="badge bg-secondary">Pendente</span>
            )}
            
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          ></button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Título */}
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

            {/* Descrição */}
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

            {/* Linha com Data e Tipo */}
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
                    Selecione...
                  </option>
                  {tiposTarefa.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Checkbox (com o texto dinâmico) */}
            <div className="mb-3 form-check">
                <input
                    id="status"
                    type="checkbox"
                    className="form-check-input"
                    checked={status} // Controlado pelo estado 'status'
                    onChange={(e) => setStatus(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="status">
                    Marcar como concluída
                </label>
            </div>
          </form>
        </div>

        {/* Rodapé (Botões) */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-danger me-auto"
            onClick={handleExcluir}
            disabled={loading}
          >
            Excluir
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TarefaModal;