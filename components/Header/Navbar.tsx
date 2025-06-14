'use client';

import Link from 'next/link';
import { useAuthUser } from '@/components/auth/useAuthUser';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { User } from 'lucide-react';  // Ícone de utilizador

type FriendshipStatus = 'none' | 'pending_sent' | 'pending_received' | 'accepted';

interface Suggestion {
    id: number;
    username: string;
    display_name: string;
    friendshipStatus: FriendshipStatus;
}

export default function Navbar() {
    const user = useAuthUser();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loadingStatuses, setLoadingStatuses] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSuggestions([]);
            return;
        }
        const controller = new AbortController();
        fetch(`http://localhost:4000/users/search?name=${encodeURIComponent(searchTerm)}`, {
            credentials: 'include',
            signal: controller.signal,
        })
            .then(res => res.json())
            .then(async (data: Omit<Suggestion, "friendshipStatus">[]) => {
                setLoadingStatuses(true);
                const validStatuses: FriendshipStatus[] = ['none', 'pending_sent', 'pending_received', 'accepted'];
                const suggestionsWithStatus: Suggestion[] = await Promise.all(
                    data.map(async (s) => {
                        if (user && s.id === user.id) {
                            return { ...s, friendshipStatus: 'none' };
                        }
                        try {
                            const res = await fetch(`http://localhost:4000/friendships/status/${s.id}`, {
                                credentials: 'include'
                            });
                            const statusData = await res.json();
                            const status = validStatuses.includes(statusData.status) ? statusData.status : 'none';
                            return { ...s, friendshipStatus: status as FriendshipStatus };
                        } catch {
                            return { ...s, friendshipStatus: 'none' };
                        }
                    })
                );
                setSuggestions(suggestionsWithStatus);
                setLoadingStatuses(false);
                setShowDropdown(true);
            })
            .catch(() => {});
        return () => controller.abort();
    }, [searchTerm, user]);

    const handleAddFriend = async (friend_id: number) => {
        try {
            await fetch('http://localhost:4000/friendships/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ friend_id })
            });
            setSuggestions(prev =>
                prev.map(s => s.id === friend_id ? { ...s, friendshipStatus: 'pending_sent' } : s)
            );
        } catch {
            alert('Erro ao enviar pedido');
        }
    };

    const handleCancelRequest = async (friend_id: number) => {
        try {
            await fetch(`http://localhost:4000/friendships/request/${friend_id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            setSuggestions(prev =>
                prev.map(s => s.id === friend_id ? { ...s, friendshipStatus: 'none' } : s)
            );
        } catch {
            alert('Erro ao cancelar pedido');
        }
    };

    const handleLogout = async () => {
        await fetch('http://localhost:4000/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        router.push('/auth/login');
    };

    return (
        <nav className="navbar navbar-light bg-white shadow-sm px-3" style={{ height: '56px' }}>
            <div className="container-fluid">
                <div className="row w-100 align-items-center">
                    {/* Logo + Autocomplete Search */}
                    <div className="col-3 d-flex align-items-center position-relative" ref={containerRef}>
                        <Link href="/" className="navbar-brand me-3">
                            {/* <Logo /> */}
                        </Link>

                        <input
                            type="text"
                            className="form-control rounded-pill ps-5"
                            placeholder="Pesquisar utilizador"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onFocus={() => searchTerm && setShowDropdown(true)}
                        />
                        <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ps-3" />

                        {showDropdown && suggestions.length > 0 && (
                            <div
                                className="position-absolute bg-white border rounded shadow-sm"
                                style={{
                                    zIndex: 1000,
                                    width: '100%',
                                    maxHeight: '180px',
                                    overflowY: 'auto',
                                    top: '3rem'
                                }}
                            >
                                {loadingStatuses && <div className="px-3 py-2">A carregar...</div>}
                                {suggestions.map(s => (
                                    <div key={s.id} className="d-flex flex-column px-3 py-2 border-bottom">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="text-dark" style={{ cursor: "default" }}>
                                                <small className="text-muted">@{s.username}</small>
                                                <strong className="ms-2">{s.display_name}</strong>
                                            </div>
                                            <span>
                                                {s.friendshipStatus === 'none' && (
                                                    <button
                                                        className="btn btn-primary btn-sm ms-2"
                                                        onClick={() => handleAddFriend(s.id)}
                                                    >
                                                        Adicionar Amigo
                                                    </button>
                                                )}
                                                {s.friendshipStatus === 'pending_sent' && (
                                                    <button
                                                        className="btn btn-secondary btn-sm ms-2"
                                                        onClick={() => handleCancelRequest(s.id)}
                                                    >
                                                        Cancelar Pedido
                                                    </button>
                                                )}
                                                {s.friendshipStatus === 'accepted' && (
                                                    <span className="badge bg-success ms-2">Já são amigos</span>
                                                )}
                                                {s.friendshipStatus === 'pending_received' && (
                                                    <span className="badge bg-warning text-dark ms-2">Pedido recebido</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Central icons (omitted) */}
                    <div className="col-6 d-flex justify-content-center">{/* ... */}</div>

                    {/* Right icons */}
                    <div className="col-3 d-flex justify-content-end align-items-center" style={{ gap: '15px' }}>
                        <div className="dropdown">
                            <button
                                className="btn btn-light rounded-circle dropdown-toggle p-2"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <User className="w-6 h-6 text-gray-600" />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <Link href="/profile" className="dropdown-item">
                                        Perfil
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/user/settings" className="dropdown-item">
                                        Definições
                                    </Link>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        Terminar sessão
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <button className="btn btn-light rounded-circle">
                            <i className="fas fa-plus"></i>
                        </button>
                        <button className="btn btn-light rounded-circle">
                            <i className="fab fa-facebook-messenger"></i>
                        </button>
                        <button className="btn btn-light rounded-circle">
                            <i className="fas fa-bell"></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
