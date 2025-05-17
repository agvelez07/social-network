'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface UserData {
    id: number;
    display_name: string;
    username: string;
    created_at: string;
}

export default function ProfileCard() {
    const { id } = useParams();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:4000/users/${id}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    console.error('Erro ao buscar utilizador:', res.statusText);
                }
            } catch (error) {
                console.error('Erro de rede:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUser();
    }, [id]);

    if (loading) return <p className="text-center mt-4">A carregar perfil...</p>;

    if (!user) return <p className="text-center mt-4 text-danger">Utilizador não encontrado</p>;

    return (
        <div className="card mb-3">
            <div className="profile-header">
                <img src="https://picsum.photos/1600/400" className="cover-photo" />
                <img src="https://i.pravatar.cc/150?u=user" className="profile-pic" />
                <div className="d-flex justify-content-between align-items-center px-4 pb-3">
                    <div className="profile-info">
                        <h4 className="mb-0">{user.display_name}</h4>
                        <small className="text-muted">@{user.username}</small>
                    </div>
                    <div>
                        <button className="btn btn-light">
                            <i className="bi bi-person-plus-fill me-2"></i>Adicionar Amigo
                        </button>
                    </div>
                </div>
            </div>
            <div className="border-top pt-2 px-4">
                <div className="d-flex nav-profile">
                    <a href="#" className="active">Publicações</a>
                    <a href="#">Amigos</a>
                    <a href="#">Fotos</a>
                </div>
            </div>
        </div>
    );
}
