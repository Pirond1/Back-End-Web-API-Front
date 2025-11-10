import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";

function Header(props) {

    const authService = new AuthService();
    const navigate = new useNavigate();
    const [usuario, setUsuario] = useState(null);
    
    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    }

    const handleTitle = () => {
        navigate("/");
    }

    useEffect(() => {
        setUsuario(authService.getUsuario())
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container-fluid">
                {/* Logo / título */}
                <a
                    className="navbar-brand fw-bold text-white d-flex align-items-center"
                    href="#"
                    onClick={handleTitle}
                >
                    <img
                        src="/logo192.png"
                        alt="Logo Gerenciador"
                        style={{height: "40px", marginRight: "10px"}}
                        className="rounded"
                    />
                    {props.title}
                </a>

                {/* Botão toggler para mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Links de navegação */}
                <div className="collapse navbar-collapse" id="navbarNav" style={{paddingRight: "10px"}}>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/tarefa" className="nav-link text-white">
                                Tarefas
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/tipo" className="nav-link text-white">
                                Tipos de tarefas
                            </Link>
                        </li>
                    </ul>

                    {/* Usuário logado */}
                    {usuario && (
                        <span className="navbar-text text-white me-3 fw-semibold">
                        Sejá bem vindo, {usuario}
                        </span>
                    )}

                    {/* Botão de logout */}
                    <button
                        className="btn btn-outline-light btn-sm"
                        onClick={handleLogout}
                    >
                        Sair
                    </button>
                </div>

                {props.children}
            </div>
        </nav>
    )
    
}

export default Header;