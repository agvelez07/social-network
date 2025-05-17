'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('http://localhost:4000/users/profile', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (res.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    router.push('/auth/login');
                }
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
                setIsAuthenticated(false);
                router.push('/auth/login');
            }
        };

        checkAuth();
    }, [router]);

    // Enquanto verifica
    if (isAuthenticated === null) {
        return <p className="text-center mt-5">A verificar autenticação...</p>;
    }

    // Autenticado
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // Não autenticado (redirecionado)
    return null;
}
