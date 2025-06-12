'use client';
import React from 'react';

interface Post {
    id: number;
    content: string;
    visibility: 'public' | 'friends';
    created_at: string;
}

export default function ProfilePosts({ posts }: { posts: Post[] }) {
    if (posts.length === 0) {
        return <p className="text-center">Sem publicações para mostrar.</p>;
    }

    return (
        <>
            <div className="card mb-3">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <strong>Publicações</strong>
                    <button className="btn btn-light btn-sm">
                        <i className="bi bi-sliders me-1" />Filtros
                    </button>
                </div>
            </div>
            {posts.map(post => (
                <div key={post.id} className="card mb-3">
                    <div className="card-header d-flex align-items-center bg-white border-0">
                        <strong>
                            {post.visibility === 'public' ? '🌐 Público' : '👥 Amigos'}
                        </strong>
                        <small className="text-muted ms-auto">
                            {new Date(post.created_at).toLocaleDateString('pt-PT')}
                        </small>
                    </div>
                    <div className="card-body pt-0">
                        <p>{post.content}</p>
                    </div>
                </div>
            ))}
        </>
    );
}