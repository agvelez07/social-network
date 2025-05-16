'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoginForm() {
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const payload = {
            email: formData.get("email"),
            password: formData.get("password")
        };

        const response = await fetch("http://localhost:4000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            localStorage.setItem("authUser", JSON.stringify(result));
            router.push('/');
        } else {
            window.alert(result.error || "Erro ao fazer login.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow p-5" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="text-center mb-4">
                    <h3><i className="bi bi-facebook me-2 text-primary"></i>Facebook</h3>
                    <p className="text-muted">Entra na tua conta</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" id="email" required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Palavra-passe</label>
                        <input type="password" name="password" className="form-control" id="password" required />
                    </div>

                    <div className="d-grid mb-3">
                        <button type="submit" className="btn btn-primary">Entrar</button>
                    </div>

                    <div className="text-center">
                        <a href="#" className="text-decoration-none">Esqueceste-te da palavra-passe?</a>
                    </div>
                </form>

                <hr />

                <div className="text-center">
                    <p>Ainda não tens conta?</p>
                    <button className="btn btn-success" onClick={() => router.push('/auth/register')}>
                        Criar nova conta
                    </button>
                </div>
            </div>
        </div>
    );
}
