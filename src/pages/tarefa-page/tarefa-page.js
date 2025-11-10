import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TarefaService from "../../services/tarefa.service";
import AuthService from "../../services/auth.service";
import "./tarefa-page.css";
import TipoTarefaService from "../../services/tipotarefa.service";
import TarefaModal from "./tarefa-modal"

function TarefaPage() {
    const service = new TarefaService();
    const tipoService = new TipoTarefaService();
    const auth = new AuthService();
    const navigate = useNavigate();

    const handleCadastrar = () => {
        navigate("/tarefa/cadastro");
    };

    const [mesAtual, setMesAtual] = useState(new Date());
    const [diasDoMes, setDiasDoMes] = useState([]);
    const [tarefasAgrupadas, setTarefasAgrupadas] = useState({});
    const [tiposTarefa, setTiposTarefa] = useState([]);
    const [filtroTipoId, setFiltroTipoId] = useState("");
    const [modalAberta, setModalAberta] = useState(false);
    const [tarefaSelecionada, setTarefaSelecionada] = useState(null)
    const [hojeMeiaNoite] = useState(() => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return hoje
    })
    const [filtroStatus, setFiltroStatus] = useState("todos");

    useEffect(() => {
        listarTarefas();
    }, [mesAtual, filtroTipoId, filtroStatus]);

    useEffect(() => {
        gerarCalendario(mesAtual);
    }, [mesAtual, tarefasAgrupadas]);

    useEffect(() => {
        async function carregarTipos(){
            try {
                const response = await tipoService.listar();
                setTiposTarefa(response.data || []);
            }catch (error) {
                console.log(error)
            }
        }
        carregarTipos()
    }, [])

    async function listarTarefas() {
        try {
        const response = await service.listar(filtroTipoId);
        let tarefas = response.data || [];
        
        if (filtroStatus !== "todos"){
            tarefas = tarefas.filter((tarefa) => {
                const status = !!tarefa.status;
                let dataTarefa = parseISODate(tarefa.dataVencimento)

                if (filtroStatus == "concluidas"){
                    return status;
                }
                if (filtroStatus == "atrasadas"){
                    return !status && dataTarefa && dataTarefa < hojeMeiaNoite
                }
                if (filtroStatus == "pendentes"){
                    return !status && (!dataTarefa || dataTarefa >= hojeMeiaNoite)
                }
                return false
            });
        }  
        const agrupadas = tarefas.reduce((acc, tarefa) => {
            if (tarefa.dataVencimento) {
            const dataChave = tarefa.dataVencimento.split("T")[0];
            if (!acc[dataChave]) {
                acc[dataChave] = [];
            }
            acc[dataChave].push(tarefa);
            }
            return acc;
        }, {});

        setTarefasAgrupadas(agrupadas);
        } catch (error) {
        console.log(error);
        if (error.response?.status === 401) {
            auth.logout();
            navigate("/login");
        }
        }
    }

    function parseISODate(dateString) {
        if (!dateString) return null;
        const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
        return new Date(year, month -1, day);
    }

    function gerarCalendario(data) {
        const ano = data.getFullYear();
        const mes = data.getMonth();

        const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
        const ultimoDia = new Date(ano, mes + 1, 0).getDate();

        const dias = [];

        for (let i = 0; i < primeiroDiaSemana; i++) {
        dias.push({ key: `pad-${i}`, dia: null, dateString: null });
        }

        for (let dia = 1; dia <= ultimoDia; dia++) {
        const dataObj = new Date(ano, mes, dia);
        const dataChave = dataObj.toISOString().split("T")[0];

        dias.push({
            key: dataChave,
            dia: dia,
            dateString: dataChave,
            tarefas: tarefasAgrupadas[dataChave] || [],
        });
        }

        setDiasDoMes(dias);
    }

    const mesAnterior = () => {
        setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1, 1));
    };

    const proximoMes = () => {
        setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 1));
    };

    const handleAbrirModal = (tarefa) => {
        setTarefaSelecionada(tarefa);
        setModalAberta(true);
    }

    const handleFecharModal = () => {
        setModalAberta(false);
        setTarefaSelecionada(null);
    }

    const handleSalvarTarefa = async (tarefaEditada) => {
        try {
            await service.atualizar(tarefaEditada.id, tarefaEditada);
            handleFecharModal();
            listarTarefas();
            alert("Tarefa atualizada com sucesso!");
        }catch (error){
            console.error(error);
            alert("Erro ao atualizar a tarefa")
        }
    }

    const handleExcluirTarefa = async (tarefaId) => {
        if (window.confirm("Tem certeza que deseja excluir essa tarefa?")){
            try{
                await service.deletar(tarefaId);
                handleFecharModal();
                listarTarefas();
                alert("Tarefa excluida com sucesso!")
            }catch (error){
                console.error(error);
                alert("Erro ao excluir a tarefa")
            }
        }
    }

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-center align-items-center mb-4 position-relative">
                <div className="calendar-header">
                <button onClick={mesAnterior} className="btn btn-outline-primary">
                    &lt;
                </button>
                <h3 className="mb-0 mx-4">
                    {mesAtual.toLocaleString("pt-BR", {
                    month: "long",
                    year: "numeric",
                    })}
                </h3>
                <button onClick={proximoMes} className="btn btn-outline-primary">
                    &gt;
                </button>
                </div>
                <div style={{ position: "absolute", right: 0, display: "flex", alignItems: "center"}}>
                    <select
                        className="form-select me-2"
                        style={{width: '200px'}}
                        value={filtroTipoId}
                        onChange={(e) => setFiltroTipoId(e.target.value)}
                    >
                        <option value="">Todos os Tipos</option>
                        {tiposTarefa.map(tipo => (
                            <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                        ))}
                    </select>
                    <select
                        className="form-select me-2"
                        style={{ width: "200px" }}
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                    >
                        <option value="todos">Todos os Status</option>
                        <option value="pendentes">Pendentes</option>
                        <option value="atrasadas">Atrasadas</option>
                        <option value="concluidas">Concluídas</option>
                    </select>
                    <button
                    onClick={handleCadastrar}
                    className="btn btn-success"
                    >
                    <i className="bi bi-plus-lg"></i> + Nova Tarefa
                    </button>
                </div>
            </div>

            <div className="calendar-grid weekdays">
                <div>Dom</div>
                <div>Seg</div>
                <div>Ter</div>
                <div>Qua</div>
                <div>Qui</div>
                <div>Sex</div>
                <div>Sáb</div>
            </div>

            <div className="calendar-grid">
                {diasDoMes.map((celula) => (
                <div
                    key={celula.key}
                    className={celula.dia ? "calendar-day" : "calendar-day empty"}
                >
                    {celula.dia && <div className="day-number">{celula.dia}</div>}

                    {celula.tarefas && (
                        <div className="tasks-list">
                            {celula.tarefas.map((tarefa) => {
                                let className = "task-item";
                                const status = !!tarefa.status;
                                let dataTarefa = parseISODate(tarefa.dataVencimento)

                                if(status){
                                    className = "task-item completed";
                                }else if (dataTarefa && dataTarefa < hojeMeiaNoite){
                                    className = "task-item overdue";
                                }
                                const corTipo = tarefa.tipotarefa?.cor || "#808080"
                                return (
                                    <div key={tarefa.id} className={className} onClick={() => handleAbrirModal(tarefa)}>
                                        <div className="task-title">{tarefa.titulo}</div>

                                        {tarefa.tipotarefa && (
                                        <div className="task-type" style={{color: corTipo}}>
                                            {tarefa.tipotarefa?.nome}
                                        </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                ))}
            </div>
            {modalAberta && (
                <TarefaModal
                    tarefa={tarefaSelecionada}
                    onClose={handleFecharModal}
                    onSave={handleSalvarTarefa}
                    onDelete={handleExcluirTarefa}
                />
            )}
        </div>
    );
}

export default TarefaPage;