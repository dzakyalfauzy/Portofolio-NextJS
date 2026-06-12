"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Download, Briefcase, Code2, Users, Coffee } from "lucide-react";
import { ScrollReveal as ScrollRevealOld } from "@/lib/scroll";
import { ScrollAnimate, Parallax, MagneticButton } from "./GSAPAnimations";
import Lanyard from "./Lanyard";
import "@/lib/css/about.css";

const stats = [
    { icon: Briefcase, value: "2+", label: "Years Exp." },
    { icon: Code2, value: "7+", label: "Projects" },
    { icon: Users, value: "5+", label: "Clients" },
    { icon: Coffee, value: "1k+", label: "Coffees" },
];

const highlights = [
    {
        title: "Front-End Development",
        description:
            "Building responsive, accessible UIs with React, Next.js, and modern CSS frameworks.",
    },
    {
        title: "Back-End Engineering",
        description:
            "Designing scalable APIs and services with Laravel, Node.js, and relational databases.",
    },
    {
        title: "UI / UX Design",
        description:
            "Creating intuitive user experiences with a focus on usability and visual polish.",
    },
];

/* ===== Draggable ID Card with 3D Tilt ===== */
function IDCard() {
    const cardRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    const rotateX = useSpring(useTransform(mouseY, [0, 1], [10, -10]), {
        stiffness: 300, damping: 30,
    });
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), {
        stiffness: 300, damping: 30,
    });

    const handleMouseMove = useCallback((e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
    }, [mouseX, mouseY]);

    const handleMouseLeave = useCallback(() => {
        mouseX.set(0.5);
        mouseY.set(0.5);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            ref={cardRef}
            className="about__id-card"
            drag
            dragConstraints={{ top: -60, bottom: 60, left: -60, right: 60 }}
            dragElastic={0.15}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 800,
                rotateX: isDragging ? 0 : rotateX,
                rotateY: isDragging ? 0 : rotateY,
                transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98, cursor: "grabbing" }}
        >
            <div className="about__id-lanyard">
                <div className="about__id-lanyard-ring" />
                <div className="about__id-lanyard-string" />
            </div>

            <div className="about__id-photo-area">
                <img
                    src="/images/foto_aboutme.png"
                    alt="Dzaky Al Fauzy"
                    className="about__id-photo"
                    draggable={false}
                />
            </div>

            <div className="about__id-info">
                <p className="about__id-name">Dzaky Al Fauzy</p>
                <p className="about__id-role">Full-Stack Developer</p>
                <div className="about__id-divider" />
                <p className="about__id-org">Universitas Brawijaya</p>
            </div>

            <div className="about__id-drag-hint">
                <GripVertical size={14} />
                <span>Drag me</span>
            </div>

            <div className="about__id-corner about__id-corner--tl" />
            <div className="about__id-corner about__id-corner--tr" />
            <div className="about__id-corner about__id-corner--bl" />
            <div className="about__id-corner about__id-corner--br" />
        </motion.div>
    );
}

export default function About() {
    const sectionRef = useRef(null);

    return (
        <section id="about" ref={sectionRef} className="about">
            <div className="about__ambient" aria-hidden>
                <div className="about__ambient-glow" />
            </div>

            <div className="layout-shell max-w-7xl mx-auto px-10 md:px-12 py-16 md:py-20">
                <ScrollRevealOld className="about__header">
                    <span className="about__eyebrow">About Me</span>
                    <h2 className="about__title">
                        Passionate about crafting{" "}
                        <span className="about__title-accent">digital experiences</span>
                    </h2>
                </ScrollRevealOld>

                <div className="about__grid">
                    <div className="about__col-visual">
                        <div className="about__id-card-container" style={{ width: "100%", height: "700px", marginTop: "-100px" }}>
                            <Lanyard
                                position={[0, -1, 20]}
                                gravity={[0, -40, 0]}
                                fov={18}
                                transparent={true}
                                frontImage="/images/foto_aboutme.png"
                            />
                        </div>

                        <div className="about__stats">
                            {stats.map(({ icon: Icon, value, label }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    whileHover={{ y: -3, scale: 1.03 }}
                                    className="about__stat"
                                >
                                    <Icon size={14} />
                                    <span className="about__stat-value">{value}</span>
                                    <span className="about__stat-label">{label}</span>
                                </motion.div>
                            ))}
                        </div>

                        <ScrollAnimate animation="fadeUp" delay={0.3}>
                            <div className="about__cv-wrap">
                                <MagneticButton strength={0.15}>
                                    <motion.a
                                        href="https://dfuprxqhyvpelekncuzv.supabase.co/storage/v1/object/public/portfolio/cv/CV%20Dzaky%20Alfauzy%20Naw-waf%20Inggris.pdf"
                                        download
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="about__cv"
                                    >
                                        <Download size={18} />
                                        <span>Download CV</span>
                                    </motion.a>
                                </MagneticButton>
                            </div>
                        </ScrollAnimate>
                    </div>

                    <div className="about__col-text">
                        <ScrollAnimate animation="blurReveal">
                            <div className="about__bio flex flex-col gap-6">
                                <p className="about__bio-lead leading-relaxed">
                                    I&apos;m a full-stack developer with over 2 years of experience building modern web
                                    applications. I specialize in creating performant, accessible, and visually stunning
                                    digital products that solve real-world problems.
                                </p>
                                <p className="about__bio-muted leading-relaxed">
                                    When I&apos;m not coding, you&apos;ll find me exploring new technologies, contributing to
                                    open-source, or sketching UI concepts. I believe great software is built at the
                                    intersection of clean engineering and thoughtful design.
                                </p>
                            </div>
                        </ScrollAnimate>

                        <ScrollAnimate animation="fadeRight" delay={0.2}>
                        <div className="about__highlights">
                            {highlights.map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    whileHover={{ y: -2 }}
                                    className="about__highlight"
                                >
                                    <div className="about__highlight-inner">
                                        <span className="about__highlight-num">{i + 1}</span>
                                        <div className="about__highlight-body">
                                            <h3 className="about__highlight-title">{item.title}</h3>
                                            <p className="about__highlight-desc">{item.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        </ScrollAnimate>
                    </div>
                </div>
            </div>
        </section>
    );
}
