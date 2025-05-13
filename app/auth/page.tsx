import 'bootstrap/dist/css/bootstrap.min.css';

export default function Profile() {

    return (
        <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
            <div className="text-center mb-4">
                <h3><i className="bi bi-facebook me-2 text-primary"></i>Facebook</h3>
                <p className="text-muted">Entra na tua conta</p>
            </div>

            <form action="index.html" method="POST">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email ou Telefone</label>
                    <input type="email" className="form-control" id="email" placeholder="pedro_pwbd@portalegre.com" />
                </div>

                <div className="mb-3">
                    <label htmlFor="senha" className="form-label">Palavra-passe</label>
                    <input type="password" className="form-control" id="senha" placeholder="••••••••••••••••••" />
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
