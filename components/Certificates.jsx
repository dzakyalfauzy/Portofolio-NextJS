"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollReveal as ScrollRevealOld } from "@/lib/scroll";
import { ScrollAnimate, Parallax } from "./GSAPAnimations";
import CertificateCard from "./CertificateCard";
import "@/lib/css/certificates.css";

const INITIAL_COUNT = 6;

function CertificateSkeleton({ span2 }) {
    return (
        <div className={span2 ? "cert-bento__item cert-bento__item--wide" : "cert-bento__item"}>
            <div className="cert-bento__card" style={{ pointerEvents: "none" }}>
                <div className="skeleton" style={{ height: "20px", width: "50%", borderRadius: "4px" }} />
                <div className="skeleton" style={{ height: "14px", width: "35%", borderRadius: "4px", marginTop: "12px" }} />
                <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
                    <div className="skeleton" style={{ height: "20px", width: "50px", borderRadius: "4px" }} />
                    <div className="skeleton" style={{ height: "20px", width: "70px", borderRadius: "4px" }} />
                </div>
            </div>
        </div>
    );
}

function dedup(arr) {
    const seen = new Set();
    return arr.filter((item) => {
        const key = item.id || item.credential || item.title;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

export default function Certificates({ items = [], loading = false }) {
    const sectionRef = useRef(null);
    const [showAll, setShowAll] = useState(false);
    const uniqueItems = dedup(items);
    const visibleItems = showAll ? uniqueItems : uniqueItems.slice(0, INITIAL_COUNT);

    return (
        <section id="certificates" ref={sectionRef} className="certificates">
            <div className="layout-shell">
                {/* ===== HEADER ===== */}
                <ScrollAnimate animation="clipLeft">
                    <div className="certificates__eyebrow-wrap">
                        <span className="certificates__eyebrow">
                            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
                            Credentials
                        </span>
                    </div>
                    <h2 className="certificates__title">
                        Verified <span className="certificates__title-accent">Certificates</span>
                    </h2>
                    <p className="certificates__lead">
                        A curated record of courses and certifications across frontend, backend, design, and
                        infrastructure — built to stay transparent and verifiable.
                    </p>
                </ScrollAnimate>

                {/* ===== BENTO GRID ===== */}
                <div className="cert-bento">
                    {loading ? (
                        <>
                            <CertificateSkeleton span2 />
                            <CertificateSkeleton span2 />
                            <CertificateSkeleton />
                            <CertificateSkeleton />
                        </>
                    ) : (
                        visibleItems.map((cert, i) => (
                            <ScrollAnimate
                                key={cert.id || cert.credential}
                                animation="fadeUp"
                                delay={i * 0.1}
                                className={i < 2 ? "cert-bento__item cert-bento__item--wide" : "cert-bento__item"}
                            >
                                <CertificateCard
                                    certificate={cert}
                                    index={i}
                                    isWide={i < 2}
                                />
                            </ScrollAnimate>
                        ))
                    )}
                </div>

                {/* See More / See Less */}
                {!loading && uniqueItems.length > INITIAL_COUNT && (
                    <motion.button
                        onClick={() => setShowAll(!showAll)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            margin: "2.5rem auto 0", padding: "0.75rem 2rem",
                            borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)",
                            background: "rgba(255,255,255,0.04)", color: "#a1a1aa",
                            fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(79,70,229,0.2)"; e.currentTarget.style.color = "#EF4444"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#a1a1aa"; }}
                    >
                        <span>{showAll ? "Show Less" : `Show All (${uniqueItems.length})`}</span>
                        {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </motion.button>
                )}

                {!loading && uniqueItems.length === 0 && (
                    <p className="mt-20 text-center text-[#94a3b8]">
                        No certificates added yet.
                    </p>
                )}
            </div>
        </section>
    );
}
