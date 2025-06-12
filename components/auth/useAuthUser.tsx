'use client';

import { useState, useEffect } from 'react';
import { AuthUser } from '@/types/auth';

export function useAuthUser(): AuthUser | null {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('http://localhost:4000/users/profile', {
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Erro ao obter perfil do utilizador');
                const data: AuthUser = await res.json();
                setUser(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchUser();
    }, []);

    return user;
}
