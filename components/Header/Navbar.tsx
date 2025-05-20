'use client';

import Link from 'next/link';
import { useAuthUser } from '@/components/auth/useAuthUser';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const user = useAuthUser();
    const router = useRouter();

    // Função para terminar sessão
    const handleLogout = async () => {
        await fetch("http://localhost:4000/auth/logout", {
            method: "POST",
            credentials: "include", // importante para enviar cookies!
        });
        // Opcional: podes limpar o estado/contexto do utilizador aqui se usares
        router.push('/auth/login'); // Redireciona para login após logout
    };

    return (
        <nav className="navbar navbar-light bg-white shadow-sm px-3" style={{ height: "56px" }}>
            <div className="container-fluid">
                <div className="row w-100 align-items-center">

                    <div className="col-3 d-flex align-items-center">
                        <a className="navbar-brand me-3" href="/">
                            {/* ... (SVG e input de pesquisa) ... */}
                        </a>
                        <div className="position-relative w-100">
                            <input type="text" className="form-control rounded-pill ps-5 search-input" placeholder="Pesquisar no Facebook" />
                            <i className="fas fa-search position-absolute search-icon"></i>
                        </div>
                    </div>

                    {/* Ícones centrais */}
                    <div className="col-6 d-flex justify-content-center">
                        {/* ... (lista de links centrais) ... */}
                    </div>

                    {/* Ícones à direita */}
                    <div className="col-3 d-flex justify-content-end align-items-center" style={{ gap: "15px" }}>
                        <div className="dropdown">
                            <button
                                className="btn btn-light rounded-circle dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <img src="..." className="rounded-circle" />
                            </button>

                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li><a className="dropdown-item" href="/profile">Perfil</a></li>
                                <li><a className="dropdown-item" href="/user">Definições</a></li>
                                <li>
                                    {/* Chama a função handleLogout no clique */}
                                    <a className="dropdown-item" href="#" onClick={handleLogout}>Terminar sessão</a>
                                </li>
                            </ul>
                        </div>
                        <a href="#" className="btn btn-light rounded-circle"><i className="fas fa-plus"></i></a>
                        <a href="#" className="btn btn-light rounded-circle"><i className="fab fa-facebook-messenger"></i></a>
                        <a href="#" className="btn btn-light rounded-circle"><i className="fas fa-bell"></i></a>
                    </div>
                </div>
            </div>
        </nav>
    );
}