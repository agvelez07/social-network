
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProfileCard from '@/components/Profile/ProfileCard';
import ProfilePosts from '@/components/Profile/ProfilePosts';
import ProfileInformation from '@/components/Profile/ProfileInformation';

const API = 'http://localhost:4000';

interface User {
    id: number;
    username: string;
    display_name: string;
    created_at: string;
    isFriend: boolean;
}
interface Post {
    id: number;
    content: string;
    visibility: 'public' | 'friends';
    created_at: string;
}

export default function OtherUserProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const [uRes, pRes] = await Promise.all([
                    fetch(`${API}/users/${id}`,       { credentials: 'include' }),
                    fetch(`${API}/users/${id}/posts`, { credentials: 'include' }),
                ]);
                if (!uRes.ok || !pRes.ok) throw new Error('Fetch falhou');
                setUser(await uRes.json());
                setPosts(await pRes.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <p className="text-center mt-4">A carregar perfil...</p>;
    if (!user)    return <p className="text-center mt-4 text-danger">Utilizador não encontrado</p>;

    return (
        <div className="row">
            <div className="col-md-8">
                <ProfileCard user={user} />
                <ProfilePosts posts={posts} />
            </div>
            <div className="col-md-4">
                <ProfileInformation user={user} />
            </div>
        </div>
    );
}
