'use client';
import React from 'react';

interface User {
    display_name: string;
    created_at: string;
}

export default function ProfileInformation({ user }: { user: User }) {
    return (
        <div className="card mb-3 p-3">
            <h6 className="fw-bold">Apresentação</h6>
            <p>Bem-vindo ao perfil de {user.display_name}!</p>
            <p>
                <i className="bi bi-info-circle me-2" />Membro desde{' '}
                {new Date(user.created_at).toLocaleDateString('pt-PT')}
            </p>
        </div>
    );
}