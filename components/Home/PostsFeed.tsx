'use client';
import React, { useEffect, useState } from "react";

interface Post {
    id: number;
    author_id: number;
    content: string;
    created_at: string;
    image_url?: string;
    likesCount?: number;
    commentsCount?: number;
}

interface Comment {
    id: number;
    post_id: number;
    author_id: number;
    content: string;
    created_at: string;
}

interface PostsFeedProps {
    userId: number;
    refresh?: boolean;
}

export default function PostsFeed({ userId, refresh }: PostsFeedProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({});
    const [newComments, setNewComments] = useState<Record<number, string>>({});
    const [openPosts, setOpenPosts] = useState<Set<number>>(new Set());
    const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:4000/posts/${userId}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Erro ao buscar os posts");
                const data: Post[] = await response.json();
                setPosts(data);
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar os posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [userId, refresh]);

    const toggleComments = async (postId: number) => {
        const isOpen = openPosts.has(postId);
        const newOpenPosts = new Set(openPosts);
        if (isOpen) {
            newOpenPosts.delete(postId);
        } else {
            newOpenPosts.add(postId);
            if (!commentsMap[postId]) {
                try {
                    const response = await fetch(`http://localhost:4000/comments/${postId}`, {
                        method: "GET",
                        credentials: "include",
                    });
                    if (!response.ok) throw new Error("Erro ao buscar comentários");
                    const comments: Comment[] = await response.json();
                    setCommentsMap((prev) => ({ ...prev, [postId]: comments }));
                } catch (err) {
                    console.error(err);
                }
            }
        }
        setOpenPosts(newOpenPosts);
    };

    const handleCommentChange = (postId: number, value: string) => {
        setNewComments((prev) => ({ ...prev, [postId]: value }));
    };

    const submitComment = async (postId: number) => {
        const content = newComments[postId];
        if (!content?.trim()) return;

        try {
            const response = await fetch(`http://localhost:4000/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    post_id: postId,
                    author_id: userId,
                    content: content.trim(),
                }),
            });

            if (!response.ok) throw new Error("Erro ao enviar comentário");

            const newComment: Comment = {
                id: Date.now(),
                post_id: postId,
                author_id: userId,
                content,
                created_at: new Date().toISOString(),
            };

            setCommentsMap((prev) => ({
                ...prev,
                [postId]: [...(prev[postId] || []), newComment],
            }));

            setNewComments((prev) => ({ ...prev, [postId]: "" }));

            // Incrementar o contador localmente
            setPosts((prev) => prev.map(p =>
                p.id === postId ? { ...p, commentsCount: (p.commentsCount ?? 0) + 1 } : p
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const toggleLike = (postId: number) => {
        const alreadyLiked = likedPosts.has(postId);
        const newLikedPosts = new Set(likedPosts);
        if (alreadyLiked) {
            newLikedPosts.delete(postId);
        } else {
            newLikedPosts.add(postId);
        }
        setLikedPosts(newLikedPosts);
        setPosts((prev) => prev.map(p =>
            p.id === postId ? {
                ...p,
                likesCount: (p.likesCount ?? 0) + (alreadyLiked ? -1 : 1)
            } : p
        ));
    };

    if (loading) return <p>A carregar posts...</p>;
    if (error) return <p>{error}</p>;
    if (posts.length === 0) return <p>Sem publicações.</p>;

    return (
        <>
            {posts.map((post) => (
                <div key={post.id} className="card mb-3 rounded-4 overflow-hidden">
                    <div className="card-header d-flex align-items-center bg-white border-0 rounded">
                        <img
                            src={`https://i.pravatar.cc/40?u=${post.author_id}`}
                            className="rounded-circle me-2"
                            alt="user"
                        />
                        <div>
                            <strong>{post.author_id}</strong><br />
                            <small className="text-muted">
                                {new Date(post.created_at).toLocaleString("pt-PT")} · <i className="bi bi-globe2"></i>
                            </small>
                        </div>
                    </div>

                    <div className="card-body pt-0">
                        <p><strong>{post.content}</strong></p>
                    </div>

                    {post.image_url && (
                        <img src={post.image_url} className="img-fluid" alt="post" />
                    )}

                    <div className="card-footer d-flex justify-content-around bg-white border-0 px-3">
                        <button
                            className={`btn ${likedPosts.has(post.id) ? 'btn-dark' : 'btn-transparent'}`}
                            onClick={() => toggleLike(post.id)}
                        >
                            <i className="bi bi-hand-thumbs-up"></i> Gosto {post.likesCount ?? 0}
                        </button>
                        <button className="btn btn-transparent" onClick={() => toggleComments(post.id)}>
                            <i className="bi bi-chat-left-text"></i> Comentários {post.commentsCount ?? 0}
                        </button>
                        <button className="btn btn-transparent">
                            <i className="bi bi-share"></i> Partilhar
                        </button>
                    </div>

                    <div className={`collapse ${openPosts.has(post.id) ? 'show' : ''}`}>
                        <div className="card-body border-top">
                            {commentsMap[post.id]?.length ? (
                                commentsMap[post.id].map(comment => (
                                    <div key={comment.id} className="mb-2">
                                        <small><strong>{comment.author_id}</strong> — {new Date(comment.created_at).toLocaleString("pt-PT")}</small>
                                        <p className="mb-1">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted mb-2">Sem comentários.</p>
                            )}

                            <div className="d-flex mt-2">
                                <input
                                    className="form-control me-2"
                                    placeholder="Escreve um comentário..."
                                    value={newComments[post.id] || ""}
                                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={() => submitComment(post.id)}>
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}