export default function Post() {
    return (
        <div className="card mb-3 rounded-4 overflow-hidden">
            <div className="card-header d-flex align-items-center bg-white border-0 rounded">
                <img src="https://i.pravatar.cc/40?img=36" className="rounded-circle me-2" alt="user" />
                <div>
                    <strong>User3</strong><br />
                    <small className="text-muted">40 min · <i className="fas fa-globe"></i></small>
                </div>
            </div>
            <div className="card-body pt-0">
                <p><strong>Lorem ipsum dolor sit amet consectetur adipisicing elit...</strong></p>
            </div>
            <img src="https://picsum.photos/800/400" className="img-fluid" alt="post" />
            <div className="card-footer d-flex justify-content-around bg-white border-0 px-3">
                <button className="btn btn-transparent">👍 Gosto</button>
                <button className="btn btn-transparent">💬 Comentar</button>
                <button className="btn btn-transparent">🔁 Partilhar</button>
            </div>
        </div>
    );
}
