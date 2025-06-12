'use client';
import React from 'react';
import { useAuthUser } from '@/components/auth/useAuthUser';

export default function SidebarLeft() {
    const user = useAuthUser();

    return (
        <div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item border-0">
                    <i className="fas fa-user me-2"></i>
                    {user?.display_name ?? 'Utilizador'}
                </li>

                <li className="list-group-item border-0">
                    <i className="fas fa-users me-2"></i>Amigos
                </li>
                <li className="list-group-item border-0">
                    <i className="fas fa-clock me-2"></i>Memórias
                </li>
                <li className="list-group-item border-0">
                    <i className="fas fa-bookmark me-2"></i>Guardados
                </li>
                <li className="list-group-item border-0">
                    <i className="fas fa-layer-group me-2"></i>Grupos
                </li>
                <li className="list-group-item border-0">
                    <i className="fas fa-video me-2"></i>Vídeo
                </li>
                <li className="list-group-item border-0">
                    <i className="fas fa-store me-2"></i>Marketplace
                </li>
                <li className="list-group-item border-0">
                    <i className="fas fa-rss me-2"></i>Feeds
                </li>
                <li className="list-group-item border-0">
                    <i className="fas fa-chevron-down me-2"></i>Ver mais
                </li>
            </ul>

            <h6 className="mt-4 ps-3 text-muted">Os teus atalhos</h6>
            {/* … resto inalterado … */}
        </div>
    );
}
