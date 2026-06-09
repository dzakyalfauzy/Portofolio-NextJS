"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Folder, ChevronLeft, ChevronRight } from "lucide-react";
import { Github } from "./Icons";
import { ScrollReveal as ScrollRevealOld } from "@/lib/scroll";
import { ScrollAnimate, Parallax } from "./GSAPAnimations";
import "@/lib/css/projects.css";

/* ===== Obsidian Canvas Reveal Variants ===== */
const revealEase = [0.16, 1, 0.3, 1];

const reveal3D = {
    hidden: {
        opacity: 0, y: 60, rotateX: -15,
        scale: 0.95, filter: "blur(4px)",
    },
    visible: {
        opacity: 1, y: 0, rotateX: 0,
        scale: 1, filter: "blur(0px)",
        transition: { duration: 0.6, ease: revealEase },
    },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const themeColorMap = { violet: "indigo", purple: "indigo", fuchsia: "rose" };
const getColor = (project) => themeColorMap[project?.color] || project?.color || "indigo";

/* ======================== FEATURED (HERO) ======================== */

function FeaturedHero({ project, onViewDetail }) {
    if (!project) return null;
    const c = getColor(project);
    const hasImage = !!(project.thumbnail || project.image_path);

    return (
        <motion.div
            key={project.id || project.title}
            variants={reveal3D}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)", transition: { duration: 0.3, ease: revealEase } }}
            style={{ perspective: 1200 }}
            className={`projects__hero projects__hero--${c}`}
        >
            <div className="projects__hero-media">
                <div className={`projects__media-grad projects__media-grad--${c}`} />
                <div className="projects__media-grid" aria-hidden />
                {hasImage ? (
                    <img
                        src={project.thumbnail || project.image_path}
                        alt={project.title}
                        className="projects__hero-img"
                    />
                ) : (
                    <div className="projects__media-icon-wrap projects__media-icon-wrap--featured">
                        <div className={`projects__media-icon projects__media-icon--${c} projects__media-icon--featured`}>
                            <Folder size={48} />
                        </div>
                    </div>
                )}
                <div className={`projects__media-glow projects__media-glow--${c}`} aria-hidden />
            </div>

            <div className="projects__hero-body">
                <h3 className="projects__hero-title">{project.title}</h3>
                <p className="projects__hero-desc">{project.description}</p>
                <div className="projects__tags projects__tags--left">
                    {Array.isArray(project.tags) && project.tags.map((tech) => (
                        <span key={tech} className="projects__tag">{tech}</span>
                    ))}
                </div>
                <div className="projects__actions projects__actions--left">
                    <motion.button
                        onClick={() => onViewDetail(project)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="projects__btn-primary"
                        style={{ cursor: "pointer" }}
                    >
                        <ExternalLink size={16} />
                        <span>View Details</span>
                    </motion.button>
                    {project.github && (
                        <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="projects__btn-secondary"
                        >
                            <Github size={16} />
                            <span>Code</span>
                        </motion.a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ======================== THUMBNAIL CARD ======================== */

function ThumbnailCard({ project, isActive, onClick, index }) {
    const c = getColor(project);
    const hasImage = !!(project.thumbnail || project.image_path);

    return (
        <motion.div
            variants={reveal3D}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className={`projects__thumb ${isActive ? "projects__thumb--active" : ""}`}
        >
            <div className={`projects__thumb-media projects__thumb-media--${c}`}>
                <div className={`projects__media-grad projects__media-grad--${c}`} />
                {hasImage ? (
                    <img src={project.thumbnail || project.image_path} alt={project.title} className="projects__thumb-img" />
                ) : (
                    <div className="projects__thumb-icon">
                        <Folder size={20} />
                    </div>
                )}
            </div>
            <div className="projects__thumb-info">
                <h4 className="projects__thumb-title">{project.title}</h4>
                <div className="projects__thumb-tags">
                    {Array.isArray(project.tags) && project.tags.slice(0, 3).map((tech) => (
                        <span key={tech} className="projects__thumb-tag">{tech}</span>
                    ))}
                </div>
            </div>
            {isActive && (
                <motion.div
                    layoutId="thumb-indicator"
                    className="projects__thumb-indicator"
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
            )}
        </motion.div>
    );
}

/* ======================== SKELETON ======================== */

function ProjectSkeleton() {
    return (
        <div className="projects__hero" style={{ pointerEvents: "none" }}>
            <div className="projects__hero-media">
                <div className="skeleton" style={{ width: "100%", height: "100%" }} />
            </div>
            <div className="projects__hero-body" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="skeleton" style={{ height: "28px", width: "50%" }} />
                <div className="skeleton" style={{ height: "48px", width: "100%" }} />
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <div className="skeleton" style={{ height: "18px", width: "60px", borderRadius: "4px" }} />
                    <div className="skeleton" style={{ height: "18px", width: "80px", borderRadius: "4px" }} />
                </div>
            </div>
        </div>
    );
}

/* ======================== MAIN COMPONENT ======================== */

export default function Projects({ items = [], loading = false }) {
    const sectionRef = useRef(null);
    const carouselRef = useRef(null);
    const router = useRouter();
    const [activeProject, setActiveProject] = useState(items[0] || null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const handleViewDetail = (project) => {
        router.push(`/project/${project.id}`);
    };

    useEffect(() => {
        if (items.length > 0 && !activeProject) {
            setActiveProject(items[0]);
        }
    }, [items]);

    const checkCarouselScroll = () => {
        const el = carouselRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };

    const scrollCarousel = (direction) => {
        const el = carouselRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.6;
        el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <section id="projects" ref={sectionRef} className="projects">
            <div className="projects__ambient" aria-hidden>
                <div className="projects__glow-tr" />
                <div className="projects__glow-bl" />
            </div>

            <div className="layout-shell">
                {/* ===== HEADER ===== */}
                <ScrollAnimate animation="fadeUp">
                    <span className="projects__eyebrow">Projects</span>
                    <h2 className="projects__title">
                        Featured <span className="projects__title-accent">work</span>
                    </h2>
                    <p className="projects__lead">
                        A selection of projects I&apos;ve built — from full-stack apps to polished front-end experiences.
                    </p>
                </ScrollAnimate>

                {loading ? (
                    <ProjectSkeleton />
                ) : (
                    <>
                        {/* ===== HERO / FEATURED ===== */}
                        <ScrollRevealOld>
                            <AnimatePresence mode="wait">
                                <FeaturedHero project={activeProject} onViewDetail={handleViewDetail} />
                            </AnimatePresence>
                        </ScrollRevealOld>

                        {/* ===== THUMBNAIL CAROUSEL (staggered 3D reveal) ===== */}
                        {items.length > 1 && (
                            <div className="projects__carousel-wrap">
                                {canScrollLeft && (
                                    <button
                                        className="projects__carousel-btn projects__carousel-btn--left"
                                        onClick={() => scrollCarousel("left")}
                                        aria-label="Scroll left"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                )}

                                <div
                                    ref={carouselRef}
                                    className="projects__carousel"
                                    onScroll={checkCarouselScroll}
                                >
                                    {items.map((project, i) => (
                                        <ThumbnailCard
                                            key={project.id || project.title}
                                            project={project}
                                            index={i}
                                            isActive={activeProject?.id === project.id}
                                            onClick={() => setActiveProject(project)}
                                        />
                                    ))}
                                </div>

                                {canScrollRight && (
                                    <button
                                        className="projects__carousel-btn projects__carousel-btn--right"
                                        onClick={() => scrollCarousel("right")}
                                        aria-label="Scroll right"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
