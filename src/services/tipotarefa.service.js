import api from "./api.service";

export default class TipoTarefaService {
  async listar() {
    return api.get("/api/tipotarefa");
  }

  async selecionar(id) {
    return api.get(`/api/tipotarefa/${id}`);
  }

  async salvar(payload) {
    return api.post("/api/tipotarefa", payload);
  }

  async atualizar(id, payload) {
    return api.put(`/api/tipotarefa/${id}`, payload);
  }

  async deletar(id) {
    return api.delete(`/api/tipotarefa/${id}`);
  }
}