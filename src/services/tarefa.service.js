import api from "./api.service";

export default class TarefaService {
  async listar() {
    return api.get("/api/tarefa");
  }

  async selecionar(id) {
    return api.get(`/api/tarefa/${id}`);
  }

  async salvar(payload) {
    return api.post("/api/tarefa", payload);
  }

  async atualizar(id, payload) {
    return api.put(`/api/tarefa/${id}`, payload);
  }

  async deletar(id) {
    return api.delete(`/api/tarefa/${id}`);
  }
}