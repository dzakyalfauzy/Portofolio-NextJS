"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Github, Linkedin, Instagram } from "./Icons";
import { ScrollReveal as ScrollRevealOld } from "@/lib/scroll";
import { ScrollAnimate } from "./GSAPAnimations";
import "@/lib/css/footer.css";

const navLinks = [
    { label: "Home", to: "/", hash: "" },
    { label: "About", to: "/", hash: "#about" },
    { label: "Services", to: "/", hash: "#services" },
    { label: "Projects", to: "/", hash: "#projects" },
    { label: "Certificates", to: "/", hash: "#certificates" },
];

const socials = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="footer">
            <div className="layout-shell footer__shell">
                <ScrollAnimate animation="fadeUp" delay={0.1} duration={0.8}>
                    <div className="footer__row">
                        <div className="footer__brand-block">
                            <motion.div
                                className="footer__brand"
                                whileHover={{ x: 2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="footer__logo">
                                    <span className="footer__logo-text">D</span>
                                </div>
                                <span className="footer__name">Dzaky Al Fauzy</span>
                            </motion.div>

                            <nav className="footer__nav">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <Link href={`${link.to}${link.hash}`}>
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>
                        </div>

                        <div className="footer__socials">
                            {socials.map(({ icon: Icon, href, label }, i) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer__social"
                                    aria-label={label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>

                        <motion.button
                            type="button"
                            onClick={scrollToTop}
                            className="footer__top"
                            aria-label="Back to top"
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="footer__top-circle">
                                <ArrowUp size={20} />
                            </div>
                            <span className="footer__top-label">Top</span>
                        </motion.button>
                    </div>
                </ScrollAnimate>

                <ScrollAnimate animation="fadeUp" delay={0.25} duration={0.8}>
                    <div className="footer__bottom">
                        <p className="footer__copyright">
                            &copy; {currentYear} Dzaky Al Fauzy. All rights reserved.
                        </p>
                        <div className="footer__legal">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                        </div>
                    </div>
                </ScrollAnimate>
            </div>

            <div className="footer__accent-line" aria-hidden />
        </footer>
    );
}
