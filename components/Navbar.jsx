"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// 1. Tambahkan useScroll dan useMotionValueEvent ke import Framer Motion
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import "@/lib/css/navbar.css";

const sectionItems = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Skills", id: "skills" },
    { label: "Projects", id: "projects" },
    { label: "Certificates", id: "certificates" },
    { label: "Experience", id: "experience" },
];

const scrollSpyIds = [...sectionItems.map((s) => s.id), "contact"];

const desktopNavItems = [
    ...sectionItems.map((item) => ({ type: "section", ...item })),
    { type: "section", label: "Contact", id: "contact" },
];

function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", id === "home" ? "/" : `/#${id}`);
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [pathname, setPathname] = useState("/");
    const isHome = pathname === "/";

    // 2. State baru untuk nampilin/nyembunyiin Navbar
    const [showNavbar, setShowNavbar] = useState(() => !isHome);

    // 3. Ambil posisi scroll menggunakan Framer Motion
    const { scrollY } = useScroll();

    // Read pathname on client side
    useEffect(() => {
        setPathname(window.location.pathname);
    }, []);

    // Pastikan jika pindah halaman (bukan home), navbar selalu muncul
    useEffect(() => {
        if (!isHome) {
            setShowNavbar(true);
        } else {
            // Cek posisi awal saat mount kalau user kebetulan refresh di tengah jalan
            const threshold = window.innerHeight * 4;
            setShowNavbar(window.scrollY > threshold);
        }
    }, [isHome]);

    // 4. Deteksi scroll untuk nampilin/nyembunyiin Navbar (Khusus di Home)
    useMotionValueEvent(scrollY, "change", (latest) => {
        if (!isHome) return; // Kalau bukan di Home, abaikan efek sembunyi ini

        const threshold = window.innerHeight * 4; // 400vh (saat IntroSequence / Hero mau beres)

        if (latest > threshold) {
            setShowNavbar(true);
        } else {
            setShowNavbar(false);
            if (isOpen) setIsOpen(false); // (Opsional) Tutup menu mobile jika user scroll naik ke Abyss
        }
    });

    useEffect(() => {
        if (!isHome) return undefined;

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            for (let i = scrollSpyIds.length - 1; i >= 0; i--) {
                const sid = scrollSpyIds[i];
                const el = document.getElementById(sid);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 120) {
                        setActiveSection(sid);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHome]);

    const sectionLinkTo = (id) => (id === "home" ? "/" : `/#${id}`);

    const isSectionActive = (id) => isHome && activeSection === id;

    const renderNavLink = (item, layoutKey) => {
        if (item.type === "route") {
            const active = pathname === item.to;
            return (
                <li key={layoutKey}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`navbar__link ${active ? "navbar__link--active" : ""}`}
                    >
                        <Link
                            href={item.to}
                            onClick={() => setIsOpen(false)}
                            className="navbar__link-text-wrap"
                        >
                            {active && (
                                <motion.span
                                    layoutId="active-pill"
                                    className="navbar__link-pill"
                                    transition={{
                                        type: "spring",
                                        stiffness: 380,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span className="navbar__link-text">{item.label}</span>
                        </Link>
                    </motion.div>
                </li>
            );
        }

        const id = item.id;
        const active = isSectionActive(id);
        return (
            <li key={layoutKey}>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`navbar__link ${active ? "navbar__link--active" : ""}`}
                >
                    <Link
                        href={sectionLinkTo(id)}
                        onClick={(e) => {
                            if (isHome) {
                                e.preventDefault();
                                scrollToSection(id);
                            }
                            setIsOpen(false);
                        }}
                        className="navbar__link-text-wrap"
                    >
                        {active && (
                            <motion.span
                                layoutId="active-pill"
                                className="navbar__link-pill"
                                transition={{
                                    type: "spring",
                                    stiffness: 380,
                                    damping: 30,
                                }}
                            />
                        )}
                        <span className="navbar__link-text">{item.label}</span>
                    </Link>
                </motion.div>
            </li>
        );
    };

    return (
        <>
            {/* 5. Update Animasi Header untuk Slide Up/Down berdasarkan state showNavbar */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{
                    y: showNavbar ? 0 : -100, // Sembunyi naik ke -100px
                    opacity: showNavbar ? 1 : 0
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="navbar-wrap"
                style={{ pointerEvents: showNavbar ? "auto" : "none" }} // Biar gak bisa di-klik pas ngumpet
            >
                <nav className={`navbar ${scrolled ? "navbar--scrolled" : "navbar--top"}`}>
                    <div className="navbar__inner">
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="navbar__logo"
                        >
                            <Link
                                href="/"
                                onClick={(e) => {
                                    if (isHome) {
                                        e.preventDefault();
                                        scrollToSection("home");
                                    }
                                    setIsOpen(false);
                                }}
                                className="navbar__logo-inner"
                            >
                                <div className="navbar__logo-mark">
                                    <span className="navbar__logo-letter">D</span>
                                </div>
                                <span className="navbar__logo-name">Dzaky Al Fauzy</span>
                            </Link>
                        </motion.div>

                        <ul className="navbar__list">
                            {desktopNavItems.map((item, idx) =>
                                renderNavLink(item, item.type === "route" ? item.to : item.id ?? `nav-${idx}`),
                            )}
                        </ul>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            className="navbar__hire"
                        >
                            <Link
                                href="/#contact"
                                onClick={(e) => {
                                    if (isHome) {
                                        e.preventDefault();
                                        scrollToSection("contact");
                                    }
                                    setIsOpen(false);
                                }}
                                className="navbar__hire-inner"
                            >
                                Hire Me
                            </Link>
                        </motion.div>

                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.88 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="navbar__menu-btn"
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {isOpen ? (
                                    <motion.span
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        <X size={18} />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        <Menu size={18} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                key="mobile-menu"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="navbar__drawer"
                            >
                                <div className="navbar__drawer-inner">
                                    {desktopNavItems.map((item, i) => {
                                        if (item.type === "route") {
                                            const active = pathname === item.to;
                                            return (
                                                <motion.div
                                                    key={item.to}
                                                    initial={{ x: -12, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: i * 0.045, duration: 0.25 }}
                                                    className={`navbar__mobile-link ${
                                                        active ? "navbar__mobile-link--active" : ""
                                                    }`}
                                                >
                                                    <Link
                                                        href={item.to}
                                                        onClick={() => setIsOpen(false)}
                                                        className="navbar__mobile-link-inner"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </motion.div>
                                            );
                                        }
                                        const id = item.id;
                                        const active = isSectionActive(id);
                                        return (
                                            <motion.div
                                                key={id}
                                                initial={{ x: -12, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: i * 0.045, duration: 0.25 }}
                                                className={`navbar__mobile-link ${
                                                    active ? "navbar__mobile-link--active" : ""
                                                }`}
                                            >
                                                <Link
                                                    href={sectionLinkTo(id)}
                                                    onClick={(e) => {
                                                        if (isHome) {
                                                            e.preventDefault();
                                                            scrollToSection(id);
                                                        }
                                                        setIsOpen(false);
                                                    }}
                                                    className="navbar__mobile-link-inner"
                                                >
                                                    {item.label}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                    <motion.div
                                        initial={{ x: -12, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                            delay: desktopNavItems.length * 0.045,
                                            duration: 0.25,
                                        }}
                                        className="navbar__mobile-hire"
                                    >
                                        <Link
                                            href="/#contact"
                                            onClick={(e) => {
                                                if (isHome) {
                                                    e.preventDefault();
                                                    scrollToSection("contact");
                                                }
                                                setIsOpen(false);
                                            }}
                                            className="navbar__mobile-hire-inner"
                                        >
                                            Hire Me
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </nav>
            </motion.header>
        </>
    );
}
