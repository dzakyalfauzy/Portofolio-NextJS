"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, useScroll, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Github, Linkedin, Instagram } from "./Icons";
import { ScrollAnimate, Parallax, TextReveal, MagneticButton } from "./GSAPAnimations";
import "@/lib/css/hero.css";

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.9, ease: "easeOut" },
    },
};

const imgPath = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return path;
};

const PROFILE_PHOTO = "/images/Foto_Profile.png";

const socials = [
    { icon: Github, href: "https://github.com/dzakyalfauzy", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/dzaky-al-fauzy-78a647409/", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/dzakyalfauzii", label: "Instagram" },
    { icon: Mail, href: "mailto:dzakyalfauzyy@gmail.com", label: "Email" },
];

const roles = [
    "Full-Stack Developer",
    "UI/UX Designer",
    "Creative Coder",
    "Problem Solver",
];

/* ===== Rotating Text Slider ===== */
function RotatingText() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % roles.length);
        }, 2800);
        return () => clearInterval(timer);
    }, []);

    return (
        <span className="hero__role-slider">
            <AnimatePresence mode="wait">
                <motion.span
                    key={index}
                    initial={{ y: 24, opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -24, opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="hero__role-text"
                >
                    {roles[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

/* ===== 3D Mouse Tracking Tilt ===== */
function TiltPortrait({ children }) {
    const ref = useRef(null);
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), {
        stiffness: 200,
        damping: 20,
    });
    const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), {
        stiffness: 200,
        damping: 20,
    });

    /* Dynamic drop-shadow opposite to tilt direction */
    const shadowX = useSpring(useTransform(x, [0, 1], [12, -12]), {
        stiffness: 200,
        damping: 20,
    });
    const shadowY = useSpring(useTransform(y, [0, 1], [-8, 8]), {
        stiffness: 200,
        damping: 20,
    });
    const dropShadow = useTransform(
        [shadowX, shadowY],
        ([sx, sy]) => `drop-shadow(${sx}px ${sy}px 28px rgba(79,70,229,0.18))`
    );

    const handleMouseMove = (e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left) / rect.width);
        y.set((e.clientY - rect.top) / rect.height);
    };

    const handleMouseLeave = () => {
        x.set(0.5);
        y.set(0.5);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                rotateX,
                rotateY,
                filter: dropShadow,
                transformStyle: "preserve-3d",
            }}
            className="hero__tilt-container"
        >
            {children}
        </motion.div>
    );
}

export default function Hero() {
    const sectionRef = useRef(null);

    /* Entrance: Hero slides up from below as it enters viewport */
    const { scrollYProgress: enterProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "start 0.3"],
    });
    const heroY = useTransform(enterProgress, [0, 1], [80, 0]);
    const heroOp = useTransform(enterProgress, [0, 0.6], [0, 1]);

    /* Scroll parallax */
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });
    const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const portraitY = useTransform(scrollYProgress, [0, 1], [0, -120]);
    const portraitScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.92]);
    const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

    return (
        <section id="home" ref={sectionRef} className="hero" style={{ position: "relative", zIndex: 100 }}>
            <motion.div
                style={{ y: heroY, opacity: heroOp }}
            >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="layout-shell hero__inner"
            >
                <motion.div className="hero__content" style={{ y: contentY, opacity: contentOpacity }}>

                    <ScrollAnimate animation="clipLeft" duration={1.2}>
                        <motion.h1 variants={fadeUp} className="hero__title">
                            Hi, I&apos;m{" "}
                            <span className="hero__name-wrap">
                                <span className="hero__name">Dzaky Al Fauzy</span>
                                <span className="hero__name-line" aria-hidden />
                            </span>
                            <br />
                            <RotatingText />
                        </motion.h1>
                    </ScrollAnimate>

                    <ScrollAnimate animation="fadeUp" delay={0.2} duration={1}>
                        <motion.p variants={fadeUp} className="hero__sub">
                            I craft high performance digital experiences from elegant interfaces to robust back-end
                            systems. Focused on clean code, delightful UX, and products that scale.
                        </motion.p>
                    </ScrollAnimate>

                    <ScrollAnimate animation="scaleUp" delay={0.4}>
                    <motion.div variants={fadeUp} className="hero__ctas">
                        <MagneticButton strength={0.2}>
                            <motion.a
                                href="#projects"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="hero__cta-primary"
                            >
                                <span>View Projects</span>
                                <ArrowRight size={18} className="hero__cta-arrow" />
                            </motion.a>
                        </MagneticButton>

                        <MagneticButton strength={0.2}>
                            <motion.a
                                href="#contact"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="hero__cta-secondary"
                            >
                                <Mail size={17} />
                                <span>Contact Me</span>
                            </motion.a>
                        </MagneticButton>
                    </motion.div>
                    </ScrollAnimate>

                    <ScrollAnimate animation="fadeUp" delay={0.6} duration={0.9}>
                    <motion.div variants={fadeUp} className="hero__social-wrap">
                        <span className="hero__social-heading">Find me on</span>
                        <div className="hero__social-row">
                            {socials.map(({ icon: Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    whileHover={{ scale: 1.08, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="hero__social-link"
                                >
                                    <Icon size={17} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                    </ScrollAnimate>
                </motion.div>

                <motion.div variants={fadeIn} className="hero__visual" style={{ y: portraitY, scale: portraitScale }}>
                    <Parallax speed={-0.2}>
                    <div className="hero__portrait-wrap">
                        <TiltPortrait>
                            <div className="hero__portrait-glow" aria-hidden />
                            <motion.div
                                className="hero__portrait"
                            >
                                <img
                                    src={imgPath(PROFILE_PHOTO)}
                                    alt="Dzaky Al Fauzy"
                                    className="hero__portrait-img"
                                    width={520}
                                    height={680}
                                    loading="eager"
                                    decoding="async"
                                />
                            </motion.div>
                            <div className="hero__portrait-overlay">
                                <div className="hero__portrait-meta">
                                    <p className="hero__card-name">Dzaky Al Fauzy</p>
                                    <p className="hero__card-role">Full-Stack Developer</p>
                                </div>
                                <div className="hero__stats hero__stats--overlay">
                                    {[
                                        { label: "Projects", value: "7+" },
                                        { label: "Clients", value: "5+" },
                                        { label: "Years", value: "2+" },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="hero__stat">
                                            <span className="hero__stat-value">{value}</span>
                                            <span className="hero__stat-label">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TiltPortrait>
                    </div>
                    </Parallax>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                style={{ opacity: scrollIndicatorOpacity }}
                className="hero__scroll"
            >
                <span className="hero__scroll-text">Scroll</span>
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="hero__scroll-line"
                />
            </motion.div>
            </motion.div>
        </section>
    );
}
