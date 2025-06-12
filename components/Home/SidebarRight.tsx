'use client';

import React, { ReactElement, useEffect, useState } from 'react';

interface Birthday {
    friend_id: number;
    name: string;
    email: string;
    birthday: string;
}

interface FriendRequest {
    friendship_id: number;
    requester_id: number;
    requester_name: string;
    requester_email: string;
    requested_at: string;
}

export default function SidebarRight(): ReactElement {
    // Aniversários
    const [birthdays, setBirthdays] = useState<Birthday[]>([]);
    const [loadingBirthdays, setLoadingBirthdays] = useState(true);
    const [errorBirthdays, setErrorBirthdays] = useState<string | null>(null);

    // Pedidos de amizade
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [errorRequests, setErrorRequests] = useState<string | null>(null);

    // Carregar aniversários
    useEffect(() => {
        const fetchBirthdays = async () => {
            try {
                const res = await fetch('http://localhost:4000/friendships/birthdays/today', { credentials: 'include' });
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                if (Array.isArray(data.birthdays)) {
                    setBirthdays(data.birthdays);
                } else {
                    setBirthdays([]);
                }
            } catch (err: any) {
                setErrorBirthdays(err.message || 'Erro ao carregar aniversários');
            } finally {
                setLoadingBirthdays(false);
            }
        };
        fetchBirthdays();
    }, []);

    // Carregar pedidos de amizade
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch('http://localhost:4000/friendships/requests', { credentials: 'include' });
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                if (Array.isArray(data.requests)) {
                    setRequests(data.requests);
                } else {
                    setRequests([]);
                }
            } catch (err: any) {
                setErrorRequests(err.message || 'Erro ao carregar pedidos');
            } finally {
                setLoadingRequests(false);
            }
        };
        fetchRequests();
    }, []);

    // Aceitar pedido de amizade
    const handleAccept = async (friendship_id: number) => {
        try {
            const res = await fetch('http://localhost:4000/friendships/accept/' + friendship_id, {
                method: 'POST',
                credentials: 'include'
            });
            if (!res.ok) throw new Error(await res.text());
            setRequests(function (prev) {
                return prev.filter(function (req) {
                    return req.friendship_id !== friendship_id;
                });
            });
        } catch (err: any) {
            alert('Erro ao aceitar pedido: ' + (err.message || err));
        }
    };

    // Rejeitar pedido de amizade
    const handleReject = async (friendship_id: number) => {
        try {
            const res = await fetch('http://localhost:4000/friendships/reject/' + friendship_id, {
                method: 'POST',
                credentials: 'include'
            });
            if (!res.ok) throw new Error(await res.text());
            setRequests(function (prev) {
                return prev.filter(function (req) {
                    return req.friendship_id !== friendship_id;
                });
            });
        } catch (err: any) {
            alert('Erro ao rejeitar pedido: ' + (err.message || err));
        }
    };

    return (
        <div>
            {/* Aniversários */}
            <div className="card mb-3">
                <div className="card-body">
                    <strong>Aniversários de Hoje</strong>
                    {loadingBirthdays && <p>Carregando...</p>}
                    {errorBirthdays && <p className="text-danger">{errorBirthdays}</p>}
                    {!loadingBirthdays && !errorBirthdays && (
                        birthdays.length > 0 ? (
                            birthdays.map(function (b) {
                                return (
                                    <p key={b.friend_id}>
                                        {b.name} faz anos hoje! (
                                        {new Date(b.birthday).toLocaleDateString('pt-PT', {
                                            day: '2-digit', month: 'long'
                                        })}
                                        )
                                    </p>
                                );
                            })
                        ) : (
                            <p>Nenhum aniversariante hoje.</p>
                        )
                    )}
                </div>
            </div>

            {/* Pedidos de Amizade */}
            <div className="card">
                <div className="card-body">
                    <strong>Pedidos de Amizade Recebidos</strong>
                    {loadingRequests && <p>Carregando...</p>}
                    {errorRequests && <p className="text-danger">{errorRequests}</p>}
                    {!loadingRequests && !errorRequests && (
                        requests.length > 0 ? (
                            requests.map(function (r) {
                                return (
                                    <div key={r.friendship_id} className="d-flex align-items-center justify-content-between mb-2">
                                        <div>
                                            <span className="fw-bold">{r.requester_name}</span> <br />
                                            <small className="text-muted">{r.requester_email}</small>
                                        </div>
                                        <div>
                                            <button className="btn btn-success btn-sm me-2"
                                                    onClick={function () { handleAccept(r.friendship_id); }}>
                                                Aceitar
                                            </button>
                                            <button className="btn btn-danger btn-sm"
                                                    onClick={function () { handleReject(r.friendship_id); }}>
                                                Rejeitar
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Nenhum pedido de amizade recebido.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
