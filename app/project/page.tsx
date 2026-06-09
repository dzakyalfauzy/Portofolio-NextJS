"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";

function ProjectPageInner() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    if (!id) {
        return (
            <div style={{
                minHeight: "100vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "1.5rem",
                backgroundColor: "#0a0a0a",
            }}>
                <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: 700 }}>No Project Selected</h1>
                <a href="/" style={{ color: "#EF4444", textDecoration: "underline" }}>Back to Home</a>
            </div>
        );
    }

    return <ProjectDetail id={id} />;
}

export default function ProjectPage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: "100vh", display: "flex", alignItems: "center",
                justifyContent: "center", backgroundColor: "#0a0a0a",
            }}>
                <span style={{ color: "#666" }}>Loading...</span>
            </div>
        }>
            <ProjectPageInner />
        </Suspense>
    );
}
