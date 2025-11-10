import api from "./api.service";

export default class TarefaService {
  async listar(tipoId) {
    let url = "/api/tarefa"
    if(tipoId){
      url += `?idTipoTarefa=${tipoId}`
    }
    return api.get(url);
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