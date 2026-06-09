"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Calendar, Layers } from "lucide-react";
import { Github } from "./Icons";
import { ScrollReveal as ScrollRevealOld } from "@/lib/scroll";
import { getProject } from "@/lib/supabase-api";

export default function ProjectDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        getProject(id)
            .then((data) => {
                setProject(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load project:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a" }}>
                <div className="skeleton" style={{ width: 200, height: 20 }} />
            </div>
        );
    }

    if (!project) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a", color: "#666" }}>
                <p>Project not found</p>
                <button onClick={() => router.push("/")} style={{ marginTop: 16, color: "#EF4444", cursor: "pointer", background: "none", border: "none" }}>
                    ← Back to Home
                </button>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", padding: "2rem" }}>
            <div className="layout-shell" style={{ maxWidth: 900, margin: "0 auto" }}>
                <motion.button
                    onClick={() => {
                        router.push("/#projects");
                        // Wait for navigation then scroll
                        setTimeout(() => {
                            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                    }}
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        display: "flex", alignItems: "center", gap: 8,
                        marginBottom: "2rem", padding: "0.5rem 1rem",
                        borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.04)", color: "#a1a1aa",
                        fontSize: "0.875rem", cursor: "pointer",
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </motion.button>

                <ScrollRevealOld>
                    <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#f5f5f5", marginBottom: "1rem" }}>
                        {project.title}
                    </h1>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem", color: "#888", fontSize: "0.875rem" }}>
                        {project.date && (
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <Calendar size={14} /> {project.date}
                            </span>
                        )}
                        {project.category && (
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <Layers size={14} /> {project.category}
                            </span>
                        )}
                    </div>

                    {project.thumbnail && (
                        <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: "2rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                            <img src={project.thumbnail} alt={project.title} style={{ width: "100%", height: "auto", display: "block" }} />
                        </div>
                    )}

                    <div style={{ color: "#a1a1aa", fontSize: "1rem", lineHeight: 1.8, marginBottom: "2rem" }}>
                        {project.description}
                    </div>

                    {project.tags && project.tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "2rem" }}>
                            {project.tags.map((tag) => (
                                <span key={tag} style={{
                                    padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem",
                                    background: "rgba(255,255,255,0.06)", color: "#888",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div style={{ display: "flex", gap: 12 }}>
                        {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "0.75rem 1.5rem", borderRadius: 10,
                                border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                                color: "#a1a1aa", fontSize: "0.875rem", textDecoration: "none",
                            }}>
                                <Github size={16} /> Source Code
                            </a>
                        )}
                        {project.live_url && (
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer" style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "0.75rem 1.5rem", borderRadius: 10,
                                background: "linear-gradient(135deg, #EF4444, #F97316)",
                                color: "#fff", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none",
                            }}>
                                <ExternalLink size={16} /> Live Demo
                            </a>
                        )}
                    </div>
                </ScrollRevealOld>
            </div>
        </div>
    );
}
