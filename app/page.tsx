'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "@/components/Header/Navbar";
import SidebarLeft from "@/components/Home/SidebarLeft";
import SidebarRight from "@/components/Home/SidebarRight";
import Feed from "@/components/Home/Feed";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
    return (
        <ProtectedRoute>
            <Navbar />
            <div className="container-fluid mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-3 d-none d-md-block">
                        <SidebarLeft />
                    </div>
                    <div className="col-md-6">
                        <Feed />
                    </div>
                    <div className="col-md-3 d-none d-md-block">
                        <SidebarRight />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
