'use client';

import 'bootstrap/dist/css/bootstrap.min.css';

const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload = {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        username: formData.get("username"),
        password: formData.get("password"),
        age: Number(formData.get("age")),
        gender: formData.get("gender"),
        address: formData.get("address"),
        phone_number: formData.get("phone_number"),
        email: formData.get("email"),
        birthday_date: formData.get("birthday_date"),
        display_name: formData.get("display_name")
    };

    const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log(result);
};

export default function Profile() {
    return (
        <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
            <div className="text-center mb-4">
                <h3><i className="bi bi-facebook me-2 text-primary"></i>Facebook</h3>
                <p className="text-muted">Entra na tua conta</p>
            </div>

            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email ou Telefone</label>
                    <input type="email" name="email" className="form-control" id="email" placeholder="pwbd@ipp.pt" required />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Palavra-passe</label>
                    <input type="password" name="password" className="form-control" id="senha" placeholder="••••••••••••••••••" required />
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
                <a href="#" className="btn btn-success">Criar nova conta</a>
            </div>
        </div>
    );
}
