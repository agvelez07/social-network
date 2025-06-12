'use client';
import React from 'react';

interface User {
    id: number;
    username: string;
    display_name: string;
    created_at: string;
    isFriend: boolean;
}

export default function ProfileCard({ user }: { user: User }) {
    return (
        <div className="card mb-3">
            <div className="profile-header">
                <img src="https://picsum.photos/1600/400" className="cover-photo" />
                <img src={`https://i.pravatar.cc/150?u=${user.id}`} className="profile-pic" />
            </div>
            <div className="d-flex justify-content-between align-items-center px-4 pb-3">
                <div className="profile-info">
                    <h4 className="mb-0">{user.display_name}</h4>
                    <small className="text-muted">@{user.username}</small>
                </div>
                <button className="btn btn-light">
                    {user.isFriend
                        ? 'Amigos'
                        : <><i className="bi bi-person-plus-fill me-2" /></>}
                </button>
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