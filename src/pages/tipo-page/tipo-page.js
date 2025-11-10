import { useState, useEffect } from "react";
import TipoTarefaService from "../../services/tipotarefa.service";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";

function TipoPage() {

    const service = new TipoTarefaService();
    const navigate = useNavigate();
    const auth = new AuthService();

    const [tiposTarefa, setTiposTarefa] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCadastrar = () => {
        navigate("/tipo/cadastro");
    };

    const handleAlterar = (id) => {
        navigate(`/tipo/editar/${id}`);
    };

    const handleDeletar = async (id) => {
        if (!id) return;
        const confirmar = window.confirm(
        "Tem Certeza que Deseja Deletar este Tipo de Tarefa?"
        );

        if (confirmar) {
        try {
            setLoading(true);
            await service.deletar(id);

            alert("Tipo de Tarefa Deletado com Sucesso!");
            listar();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
        }
    };

    async function listar() {
        try {
            const response = await service.listar();
            response.data.sort((a, b) => a.nome.localeCompare(b.nome));
            setTiposTarefa(response.data || []);
        }catch (error){
            console.log(error);

            if(error.response?.status === 401){
                auth.logout();
                navigate("/login");
            }
        }
        
    }

    useEffect(() => {
        listar();
    }, []);

    return (
        <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">LISTAGEM DE TIPOS DE TAREFA</h4>

            <button
            type="button"
            onClick={handleCadastrar}
            className="btn btn-success btn-sm"
            >
            + Novo
            </button>
        </div>

        {tiposTarefa.length === 0 ? (
            <p className="text-muted text-center m-0 mt-4">
            {" "}
            Nenhum tipo de tarefa cadastrado.
            </p>
        ) : (
            <table className="table mt-4">
            <thead>
                <tr>
                <th scope="col">Nome</th>
                <th scope="col">Cor</th>
                <th scope="col" className="text-end">
                    Ação
                </th>
                </tr>
            </thead>
            <tbody>
                {tiposTarefa.map((tipo) => (
                <tr key={tipo.id}>
                    <td>{tipo.nome}</td>
                    <td><div style={{width: "24px", height: "24px", backgroundColor: tipo.cor, border: "1px solid #ccc", borderRadius: "4px"}} title={tipo.cor}></div></td>
                    <td className="text-end">
                    <button
                        type="button"
                        onClick={() => handleAlterar(tipo.id)}
                        className="btn btn-sm btn-primary me-2"
                    >
                        <i className="bi bi-pencil-square"></i> Alterar
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDeletar(tipo.id)}
                        className="btn btn-sm btn-danger"
                    >
                        <i className="bi bi-trash"></i> Deletar
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    );
}

export default TipoPage;