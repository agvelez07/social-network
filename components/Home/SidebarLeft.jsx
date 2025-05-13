
import React from "react";

export default function SidebarLeft() {
    return (
        <div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item border-0"><i className="fas fa-user me-2"></i>User1</li>
                <li className="list-group-item border-0"><i className="fas fa-users me-2"></i>Amigos</li>
                <li className="list-group-item border-0"><i className="fas fa-clock me-2"></i>Memórias</li>
                <li className="list-group-item border-0"><i className="fas fa-bookmark me-2"></i>Guardados</li>
                <li className="list-group-item border-0"><i className="fas fa-layer-group me-2"></i>Grupos</li>
                <li className="list-group-item border-0"><i className="fas fa-video me-2"></i>Vídeo</li>
                <li className="list-group-item border-0"><i className="fas fa-store me-2"></i>Marketplace</li>
                <li className="list-group-item border-0"><i className="fas fa-rss me-2"></i>Feeds</li>
                <li className="list-group-item border-0"><i className="fas fa-chevron-down me-2"></i>Ver mais</li>
            </ul>
            <h6 className="mt-4 ps-3 text-muted">Os teus atalhos</h6>
            <ul className="list-group list-group-flush">
                <li className="list-group-item border-0"><img src="https://picsum.photos/32/39" className="rounded-circle me-2" />Grupo1</li>
                <li className="list-group-item border-0"><img src="https://picsum.photos/32/40" className="rounded-circle me-2" />Jogo1</li>
                <li className="list-group-item border-0"><img src="https://picsum.photos/32/41" className="rounded-circle me-2" />Jogo2</li>
            </ul>
        </div>
    );
}
