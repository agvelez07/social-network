'use client';
import { useState } from 'react';

interface Props {
    userId: number;
    onPostCreatedAction: () => void;
}

export default function PostComposerModal({ userId, onPostCreatedAction }: Props) {
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState('public');

    const handleSubmit = async () => {
        if (!content.trim()) return;

        try {
            const response = await fetch(
                `http://localhost:4000/posts`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ content, visibility }),
                }
            );

            if (!response.ok) throw new Error('Erro ao criar post');

            setContent('');
            setVisibility('public');
            (document.getElementById('closePostModalBtn') as HTMLButtonElement)?.click();
            onPostCreatedAction();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="modal fade" id="postModal" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4">
                    <div className="modal-header">
                        <h5 className="modal-title">Criar publicação</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            id="closePostModalBtn"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <textarea
                            className="form-control mb-3"
                            placeholder="No que estás a pensar?"
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <select
                            className="form-select"
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                        >
                            <option value="public">Público</option>
                            <option value="friends">Amigos</option>
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" data-bs-dismiss="modal">
                            Cancelar
                        </button>
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            Publicar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
