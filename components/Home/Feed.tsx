'use client';
import { useState } from 'react';
import { useAuthUser } from '@/components/auth/useAuthUser';
import PostsFeed from './PostsFeed';
import PostComposerModal from './PostComposerModal';

export default function Feed() {
    const user = useAuthUser();
    const userId = user?.id;
    const userName =
        user?.display_name ||
        (user?.first_name && user?.last_name
            ? `${user.first_name} ${user.last_name}`
            : 'Usuário');

    const [refreshPosts, setRefreshPosts] = useState(false);

    const handlePostCreatedAction = () => {
        setRefreshPosts(true);
        setTimeout(() => setRefreshPosts(false), 100); // trigger reload
    };

    return (
        <div>
            {/* Só renderiza o modal se userId estiver disponível */}
            {userId && (
                <PostComposerModal
                    userId={userId}
                    onPostCreatedAction={handlePostCreatedAction}
                />
            )}

            <div className="card mb-3 rounded-4">
                <div className="card-body d-flex align-items-center gap-2">
                    <img
                        src={`https://i.pravatar.cc/150?u=${userId}`}
                        width={32}
                        height={32}
                        className="rounded-circle"
                        alt={userName}
                    />
                    <button
                        className="form-control rounded-pill text-start text-muted"
                        data-bs-toggle="modal"
                        data-bs-target="#postModal"
                    >
                        No que estás a pensar, {userName}?
                    </button>
                </div>
            </div>

            {/* Feed de posts autorizado */}
            {userId && <PostsFeed userId={userId} refresh={refreshPosts} />}
        </div>
    );
}
