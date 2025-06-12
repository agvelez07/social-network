'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUser } from '@/components/auth/useAuthUser';
import ProfileCard from '@/components/Profile/ProfileCard';
import ProfilePosts from '@/components/Profile/ProfilePosts';
import ProfileInformation from '@/components/Profile/ProfileInformation';

interface Post {
    id: number;
    content: string;
    visibility: 'public' | 'friends';
    created_at: string;
}

export default function MyProfilePage() {
    const user = useAuthUser();          // { id, username, display_name, ... } | null | false
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // 1) Redireciona se não estiveres autenticado
    useEffect(() => {
        if (user === null) return;           // ainda a carregar perfil
        if (!user) router.replace('/auth/login');
    }, [user, router]);

    // 2) Busca os teus posts usando o teu próprio ID
    useEffect(() => {
        if (!user) return;
        fetch(`http://localhost:4000/users/${user.id}/posts`, {
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json() as Promise<Post[]>;
            })
            .then(data => setPosts(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    if (user === null || loading) {
        return <div className="text-center py-5">Carregando perfil…</div>;
    }

    return (
        <div className="row">
            <div className="col-md-8">
                {/* Passas isFriend=true pois é o teu próprio perfil */}
                <ProfileCard
                    user={{
                        id: user.id,
                        username: user.username,
                        display_name: user.display_name,
                        created_at: user.created_at,
                        isFriend: true
                    }}
                />

                <ProfilePosts posts={posts} />
            </div>
            <div className="col-md-4">
                <ProfileInformation user={user} />
            </div>
        </div>
    );
}
