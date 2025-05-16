'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RegisterForm() {
    const [gender, setGender] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const firstName = (formData.get("first_name") as string)?.toLowerCase().replace(/\s+/g, '') || '';
        const lastName = (formData.get("last_name") as string)?.toLowerCase().replace(/\s+/g, '') || '';
        const displayName = `${formData.get("first_name")} ${formData.get("last_name")}`;

        const payload = {
            first_name: formData.get("first_name"),
            username: `${firstName}.${lastName}`,
            last_name: formData.get("last_name"),
            password: formData.get("password"),
            email: formData.get("email"),
            gender: formData.get("gender"),
            birthday_date: formData.get("birthday_date"),
            display_name: displayName,
            address: "-",
            phone_number: "-",
            age: 18
        };

        const response = await fetch("http://localhost:4000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            window.alert("Conta criada com sucesso!");
            router.push('/auth/login'); // <-- Agora funciona
        } else {
            window.alert(result.error || "Erro ao registar.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow p-5" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="text-center mb-4">
                    <h3><i className="bi bi-facebook me-2 text-primary"></i>Facebook</h3>
                    <p className="text-muted">Cria a tua conta</p>
                </div>

                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <input name="first_name" type="text" className="form-control" placeholder="Nome próprio" required />
                    </div>

                    <div className="mb-3">
                        <input name="last_name" type="text" className="form-control" placeholder="Apelido" required />
                    </div>

                    <div className="mb-3">
                        <input name="email" type="email" className="form-control" placeholder="Email" required />
                    </div>

                    <div className="mb-3">
                        <input name="password" type="password" className="form-control" placeholder="Palavra-passe nova" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Data de nascimento</label>
                        <input name="birthday_date" type="date" className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Género</label>
                        <div className="d-flex gap-3">
                            <div className="form-check">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Feminino"
                                    className="form-check-input"
                                    checked={gender === 'Feminino'}
                                    onChange={() => setGender('Feminino')}
                                />
                                <label className="form-check-label">Feminino</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Masculino"
                                    className="form-check-input"
                                    checked={gender === 'Masculino'}
                                    onChange={() => setGender('Masculino')}
                                />
                                <label className="form-check-label">Masculino</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Outro"
                                    className="form-check-input"
                                    checked={gender === 'Outro'}
                                    onChange={() => setGender('Outro')}
                                />
                                <label className="form-check-label">Outro</label>
                            </div>
                        </div>
                    </div>

                    <div className="d-grid mt-4">
                        <button type="submit" className="btn btn-success">Regista-te</button>
                    </div>
                </form>

                <hr />

                <div className="text-center">
                    <p>Já tens conta?</p>
                    <button className="btn btn-outline-primary" onClick={() => router.push('/auth/login')}>
                        Iniciar sessão
                    </button>
                </div>
            </div>
        </div>
    );
}
