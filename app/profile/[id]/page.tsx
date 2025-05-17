'use client';

import { notFound } from "next/navigation";
import Navbar from "@/components/Header/Navbar";
import ProfileCard from "@/components/Profile/ProfileCard";
import ProfileInformation from "@/components/Profile/ProfileInformation";
import 'bootstrap/dist/css/bootstrap.min.css';

type Props = {
    params: {
        id: string;
    };
};

export default function Profile({ params }: Props) {
    const { id } = params;

    const allowedIds = ["1", "2", "3"];

    if (!allowedIds.includes(id)) {
        notFound();
    }

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <ProfileCard />
                <div className="col-md-4">
                    <ProfileInformation />
                </div>
            </div>
        </>
    );
}
