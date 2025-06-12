'use client';
import BootstrapClient from "@/components/BootstrapClient";

export default function BootstrapWrapper({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <BootstrapClient />
            {children}
        </>
    );
}
