import React from 'react';

export default function Navbar() {
    return (
        <nav className="navbar navbar-light bg-white shadow-sm px-3" style={{ height: "56px" }}>
            <div className="container-fluid">
                <div className="row w-100 align-items-center">

                    <div className="col-3 d-flex align-items-center">
                        <a className="navbar-brand me-3" href="./index.html">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="#1877F2" width="40" height="40">
                                <path d="M18 0C8.059 0 0 8.059 0 18c0 8.991 6.582 16.436 15.188 17.816v-12.6h-4.57v-5.216h4.57V14.34c0-4.517 2.692-7.012 6.825-7.012 1.976 0 4.042.352 4.042.352v4.447h-2.278c-2.243 0-2.942 1.394-2.942 2.824v3.388h5.002l-.8 5.216h-4.202v12.6C29.418 34.436 36 26.991 36 18 36 8.059 27.941 0 18 0z" />
                            </svg>
                        </a>
                        <div className="position-relative w-100">
                            <input type="text" className="form-control rounded-pill ps-5 search-input" placeholder="Pesquisar no Facebook" />
                            <i className="fas fa-search position-absolute search-icon"></i>
                        </div>
                    </div>

                    {/* Ícones centrais */}
                    <div className="col-6 d-flex justify-content-center">
                        <ul className="nav align-items-center" style={{ gap: "10px" }}>
                            <li className="nav-item"><a className="nav-link active" href="/"><i className="fas fa-home"></i></a></li>
                            <li className="nav-item"><a className="nav-link" href="/watch"><i className="fas fa-tv"></i></a></li>
                            <li className="nav-item"><a className="nav-link" href="/marketplace"><i className="fas fa-store"></i></a></li>
                            <li className="nav-item"><a className="nav-link" href="/groups"><i className="fas fa-users"></i></a></li>
                            <li className="nav-item"><a className="nav-link" href="/gaming"><i className="fas fa-gamepad"></i></a></li>
                        </ul>
                    </div>

                    {/* Ícones à direita */}
                    <div className="col-3 d-flex justify-content-end align-items-center" style={{ gap: "15px" }}>
                        <a href="#" className="btn btn-light rounded-circle"><i className="fas fa-plus"></i></a>
                        <a href="#" className="btn btn-light rounded-circle"><i className="fab fa-facebook-messenger"></i></a>
                        <a href="#" className="btn btn-light rounded-circle"><i className="fas fa-bell"></i></a>
                        <a href="./profile.html" className="btn btn-light rounded-circle">
                            <img src="https://i.pravatar.cc/150?img=6" width="32" height="32" className="rounded-circle" alt="Perfil" />
                        </a>
                    </div>

                </div>
            </div>
        </nav>
    );
}
