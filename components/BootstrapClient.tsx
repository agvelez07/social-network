'use client';
import { useEffect } from 'react';

export default function BootstrapClient() {
    useEffect(() => {
        // @ts-ignore
        import('bootstrap/dist/js/bootstrap.bundle.min.js')
            .catch(err => console.error('Falha a carregar Bootstrap JS', err));
    }, []);

    return null;
}
