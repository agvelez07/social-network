'use client';
import { useEffect, useState } from 'react';

export function useAuthUser() {
    const [user, setUser] = useState<{ id: number, email: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('http://localhost:4000/users/profile', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user); // vem de req.user no middleware
                }
            } catch (error) {
                console.error("Erro ao obter utilizador autenticado", error);
            }
        };

        fetchUser();
    }, []);

    return user;
}
