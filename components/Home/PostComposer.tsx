'use client';
import React from 'react';


export default function PostComposer() {


    return (
        <div className="card mb-3 rounded-4">
            <div className="card-body">
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="text"
                        className="form-control rounded-pill"
                        placeholder={`No que estás a pensar ?`}
                    />
                </div>
                <div className="mt-3 d-flex justify-content-around text-secondary">
          <span>
            <i className="fas fa-video text-danger me-2"></i>Vídeo em direto
          </span>
                    <span>
            <i className="fas fa-image text-success me-2"></i>Foto/vídeo
          </span>
                    <span>
            <i className="fas fa-smile text-warning me-2"></i>A sentir-me
          </span>
                </div>
            </div>
        </div>
    );
}
