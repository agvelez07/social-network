export default function ProfilePosts() {
    return (
        <>
            <div className="col-md-8">
                <div className="card mb-3">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <strong>Publicações</strong>
                        <button className="btn btn-light btn-sm"><i className="bi bi-sliders me-1"></i>Filtros</button>
                    </div>
                </div>

                <div className="card mb-3">
                    <div className="card-header d-flex align-items-center bg-white border-0">
                        <img src="https://i.pravatar.cc/40?img=10" className="rounded-circle me-2"/>
                        <div>
                            <strong>User1 <i className="bi bi-patch-check-fill text-primary"></i></strong><br/>
                            <small className="text-muted">14 de julho de 2024 · <i className="bi bi-globe"></i></small>
                        </div>
                    </div>
                    <div className="card-body pt-0">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae adipisci dolor rem perferendis
                            illum magnam perspiciatis!!</p>
                        <img src="https://picsum.photos/1200/800" className="img-fluid rounded"/>
                    </div>
                    <div className="card-footer d-flex justify-content-around bg-white border-0 px-3">
                        <button className="btn btn-transparent d-flex align-items-center gap-2 px-4 py-2 rounded">
                            <i className="bi bi-hand-thumbs-up"></i> Gosto
                        </button>
                        <button className="btn btn-transparent d-flex align-items-center gap-2 px-4 py-2 rounded">
                            <i className="bi bi-chat-left-text"></i> Comentar
                        </button>
                        <button className="btn btn-transparent d-flex align-items-center gap-2 px-4 py-2 rounded">
                            <i className="bi bi-share"></i> Partilhar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
