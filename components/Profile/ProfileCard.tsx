export default function ProfileCard() {
    return (
        <div className="card mb-3">
            <div className="profile-header">
                <img src="https://picsum.photos/1600/400" className="cover-photo"/>
                <img src="https://i.pravatar.cc/150?img=6" className="profile-pic"/>
                <div className="d-flex justify-content-between align-items-center px-4 pb-3">
                    <div className="profile-info">
                        <h4 className="mb-0">User1</h4>
                        <small className="text-muted">378 Amigos</small>
                    </div>
                    <div>
                        <button className="btn btn-light"><i className="bi bi-person-plus-fill me-2"></i>Adicionar
                            Amigo
                        </button>
                    </div>
                </div>
            </div>
             <div className="border-top pt-2 px-4">
                <div className="d-flex nav-profile">
                    <a href="profile.html" className="active">Publicações</a>
                    <a href="user_friends.html">Amigos</a>
                    <a href="user_photos.html">Fotos</a>
                </div>
            </div>
        </div>
    );
}
