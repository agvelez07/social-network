'use client';
import { useState } from "react";
import PostsFeed from "./PostsFeed";
import PostComposerModal from "./PostComposerModal";

export default function Feed() {
    const userId = 1;
    const [refreshPosts, setRefreshPosts] = useState(false);

    const handlePostCreated = () => {
        setRefreshPosts(true);
        setTimeout(() => setRefreshPosts(false), 100); // trigger reload
    };

    return (
        <div>
            <PostComposerModal userId={userId} onPostCreated={handlePostCreated} />

            <div className="card mb-3 rounded-4">
                <div className="card-body d-flex align-items-center gap-2">
                    <img src="https://i.pravatar.cc/150?img=6" width="32" height="32" className="rounded-circle" alt="User" />
                    <button
                        className="form-control rounded-pill text-start text-muted"
                        data-bs-toggle="modal"
                        data-bs-target="#postModal"
                    >
                        No que estás a pensar, User1?
                    </button>
                </div>
            </div>

            <PostsFeed userId={userId} refresh={refreshPosts} />
        </div>
    );
}
