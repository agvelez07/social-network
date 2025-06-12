'use client';

import { useEffect, useState } from 'react';
import { fetchWithTimeout } from '@/components/src/utils/fetchWithTimeout';
interface Post {
    id: number;
    content: string;
    authorName: string;
    authorId: number;
    created_at: string;
    likesCount?: number;
    commentsCount?: number;
    likedByUser: boolean;
    visibility: string;
}

interface Comment {
    id: number;
    post_id: number;
    content: string;
    created_at: string;
    authorName: string;
    authorId: number;
}

interface Props {
    userId: number;
    refresh: boolean;
}

const DEFAULT_TIMEOUT = 8000;
const dateOpts: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
};

export default function PostsFeed({ userId, refresh }: Props) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({});
    const [error, setError] = useState<string | null>(null);
    const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
    const [newComments, setNewComments] = useState<Record<number, string>>({});
    const [openComments, setOpenComments] = useState<Set<number>>(new Set());
    const [editingComment, setEditingComment] = useState<{ id: number; text: string } | null>(null);
    const [editingPost, setEditingPost] = useState<{ id: number; content: string } | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setError(null);
                setCommentsMap({});

                // carrega posts
                const res = await fetchWithTimeout(
                    'http://localhost:4000/posts',
                    { credentials: 'include' },
                    DEFAULT_TIMEOUT
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                let data: any[] = await res.json();
                data = data.map(p => ({ ...p, authorId: p.author_id }));
                setPosts(data);

                // estado inicial de likes
                const initialLiked = new Set<number>();
                data.forEach(p => p.likedByUser && initialLiked.add(p.id));
                setLikedPosts(initialLiked);

                // carrega comentários de cada post
                for (const p of data) {
                    const r = await fetchWithTimeout(
                        'http://localhost:4000/comments/' + p.id,
                        { credentials: 'include' },
                        DEFAULT_TIMEOUT
                    );
                    const body = await r.json();
                    const cmts: Comment[] = Array.isArray(body)
                        ? body
                        : Array.isArray((body as any).comments)
                            ? (body as any).comments
                            : [];
                    setCommentsMap(prev => ({ ...prev, [p.id]: cmts }));
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : String(e));
            }
        }

        if (userId) {
            fetchData();
        }
    }, [userId, refresh]);

    const toggleLike = async (postId: number) => {
        const already = likedPosts.has(postId);
        await fetchWithTimeout(
            'http://localhost:4000/likes',
            {
                method: already ? 'DELETE' : 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_type: 'post', target_id: postId }),
            },
            DEFAULT_TIMEOUT
        );
        setLikedPosts(s => {
            const n = new Set(s);
            already ? n.delete(postId) : n.add(postId);
            return n;
        });
        setPosts(ps =>
            ps.map(p =>
                p.id === postId ? { ...p, likesCount: (p.likesCount || 0) + (already ? -1 : 1) } : p
            )
        );
    };

    const toggleComments = (postId: number) => {
        setOpenComments(s => {
            const n = new Set(s);
            n.has(postId) ? n.delete(postId) : n.add(postId);
            return n;
        });
    };

    const submitComment = async (postId: number) => {
        const content = newComments[postId]?.trim();
        if (!content) return;
        await fetchWithTimeout(
            'http://localhost:4000/comments',
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId, content }),
            },
            DEFAULT_TIMEOUT
        );
        const r = await fetchWithTimeout(
            'http://localhost:4000/comments/' + postId,
            { credentials: 'include' },
            DEFAULT_TIMEOUT
        );
        const body = await r.json();
        const cmts: Comment[] = Array.isArray(body)
            ? body
            : Array.isArray((body as any).comments)
                ? (body as any).comments
                : [];
        setCommentsMap(prev => ({ ...prev, [postId]: cmts }));
        setNewComments(prev => ({ ...prev, [postId]: '' }));
    };

    const startEdit = (c: Comment) => setEditingComment({ id: c.id, text: c.content });
    const cancelEdit = () => setEditingComment(null);

    const saveEdit = async (postId: number) => {
        if (!editingComment) return;
        await fetchWithTimeout(
            'http://localhost:4000/comments',
            {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment_id: editingComment.id, content: editingComment.text }),
            },
            DEFAULT_TIMEOUT
        );
        const r = await fetchWithTimeout(
            'http://localhost:4000/comments/' + postId,
            { credentials: 'include' },
            DEFAULT_TIMEOUT
        );
        const body = await r.json();
        const cmts: Comment[] = Array.isArray(body)
            ? body
            : Array.isArray((body as any).comments)
                ? (body as any).comments
                : [];
        setCommentsMap(prev => ({ ...prev, [postId]: cmts }));
        cancelEdit();
    };

    const deleteComment = async (postId: number, commentId: number) => {
        await fetchWithTimeout(
            'http://localhost:4000/comments',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment_id: commentId }),
            },
            DEFAULT_TIMEOUT
        );
        const r = await fetchWithTimeout(
            'http://localhost:4000/comments/' + postId,
            { credentials: 'include' },
            DEFAULT_TIMEOUT
        );
        const body = await r.json();
        const cmts: Comment[] = Array.isArray(body)
            ? body
            : Array.isArray((body as any).comments)
                ? (body as any).comments
                : [];
        setCommentsMap(prev => ({ ...prev, [postId]: cmts }));
    };

    const startEditPost = (p: Post) => setEditingPost({ id: p.id, content: p.content });
    const cancelEditPost = () => setEditingPost(null);

    const saveEditPost = async (postId: number) => {
        if (!editingPost) return;
        await fetchWithTimeout(
            'http://localhost:4000/posts',
            {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId, content: editingPost.content }),
            },
            DEFAULT_TIMEOUT
        );
        setPosts(ps =>
            ps.map(p => (p.id === postId ? { ...p, content: editingPost.content } : p))
        );
        cancelEditPost();
    };

    const deletePost = async (postId: number) => {
        await fetchWithTimeout(
            'http://localhost:4000/posts',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId }),
            },
            DEFAULT_TIMEOUT
        );
        setPosts(ps => ps.filter(p => p.id !== postId));
    };

    if (error) return <div className="alert alert-danger">⚠️ {error}</div>;
    if (!posts.length) return <p className="text-center text-muted">Ainda não há posts.</p>;

    return (
        <div className="list-group">
            {posts.map(post => (
                <div key={post.id} className="list-group-item position-relative mb-4">
                    <strong className="d-block mb-1">{post.authorName}</strong>
                    <small className="text-muted">
                        Data de Criação:{' '}
                        {new Date(post.created_at)
                            .toLocaleDateString('pt-PT', dateOpts)}
                    </small>                    <div className="text-muted"><em>Visibilidade: {post.visibility}</em></div>

                    {editingPost?.id === post.id ? (
                        <>
              <textarea
                  className="form-control mb-2 mt-2"
                  value={editingPost.content}
                  onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
              />
                            <button
                                className="btn btn-success btn-sm me-1"
                                onClick={() => saveEditPost(post.id)}
                            >
                                Guardar
                            </button>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={cancelEditPost}
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="mt-2">{post.content}</p>
                            {post.authorId === userId && (
                                <div className="position-absolute top-0 end-0">
                                    <button
                                        className="btn btn-sm btn-light me-1"
                                        onClick={() => startEditPost(post)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => deletePost(post.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    <div className="d-flex gap-2 mt-2">
                        <button
                            className={`btn btn-sm ${
                                likedPosts.has(post.id) ? 'btn-dark' : 'btn-outline-secondary'
                            }`}
                            onClick={() => toggleLike(post.id)}
                        >
                            Gosto {post.likesCount || 0}
                        </button>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => toggleComments(post.id)}
                        >
                            Comentários {commentsMap[post.id]?.length || 0}
                        </button>
                    </div>

                    <div className="mt-2 d-flex gap-2">
                        <input
                            className="form-control"
                            placeholder="Escreve um comentário..."
                            value={newComments[post.id] || ''}
                            onChange={e => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => submitComment(post.id)}
                        >
                            Enviar
                        </button>
                    </div>

                    {openComments.has(post.id) && (
                        <div className="mt-3">
                            {commentsMap[post.id]?.map(c => (
                                <div key={c.id} className="border rounded p-2 mb-2 position-relative">
                                    <div>
                                        <strong>{c.authorName}</strong>
                                        {editingComment?.id === c.id ? (
                                            <textarea
                                                className="form-control mt-1 mb-2"
                                                value={editingComment.text}
                                                onChange={e => setEditingComment({ id: c.id, text: e.target.value })}
                                            />
                                        ) : (
                                            <p className="mb-0 mt-1">{c.content}</p>
                                        )}
                                        <small className="text-muted">
                                            Data de Criação:{' '}
                                            {new Date(post.created_at)
                                                .toLocaleDateString('pt-PT', dateOpts)}
                                        </small>
                                    </div>
                                    {c.authorId === userId && (
                                        <div className="position-absolute top-0 end-0">
                                            {editingComment?.id === c.id ? (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-success me-1"
                                                        onClick={() => saveEdit(post.id)}
                                                    >
                                                        Guardar
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={cancelEdit}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-light me-1"
                                                        onClick={() => startEdit(c)}
                                                    >
                                                        ⋮
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => deleteComment(post.id, c.id)}
                                                    >
                                                        Apagar
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
