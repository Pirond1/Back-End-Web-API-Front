import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TarefaService from "../../services/tarefa.service";
import AuthService from "../../services/auth.service";
import "./tarefa-page.css";

function TarefaPage() {
    const service = new TarefaService();
    const auth = new AuthService();
    const navigate = useNavigate();

    const handleCadastrar = () => {
        navigate("tarefa/cadastro");
    };

    const [mesAtual, setMesAtual] = useState(new Date());

    const [diasDoMes, setDiasDoMes] = useState([]);

    const [tarefasAgrupadas, setTarefasAgrupadas] = useState({});

    useEffect(() => {
        listarTarefas();
    }, []);

    useEffect(() => {
        gerarCalendario(mesAtual);
    }, [mesAtual, tarefasAgrupadas]);

    async function listarTarefas() {
        try {
        const response = await service.listar();
        const tarefas = response.data || [];

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
                <div style={{ position: "absolute", right: 0 }}>
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
                            {celula.tarefas.map((tarefa) => (
                            <div key={tarefa.id} className="task-item">
                                {/* 1. Título da Tarefa */}
                                <div className="task-title">{tarefa.titulo}</div>
                                
                                {/* 2. Tipo da Tarefa (NOVO) */}
                                {/* Usamos 'tarefa.tipotarefa &&' para evitar erros
                                    se o tipo for nulo */}
                                {tarefa.tipotarefa && (
                                <div className="task-type">
                                    {/* O '?' (optional chaining) previne erro
                                        se tipotarefa for nulo */}
                                    {tarefa.tipotarefa?.nome}
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                    )}
                </div>
                ))}
            </div>
        </div>
    );
}

export default TarefaPage;