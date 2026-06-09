"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Github, Linkedin, Instagram } from "./Icons";
import { ScrollReveal as ScrollRevealOld } from "@/lib/scroll";
import { ScrollAnimate, Parallax } from "./GSAPAnimations";
import { sendMessage } from "@/lib/supabase-api";
import "@/lib/css/contact.css";

export default function Contact() {
    const sectionRef = useRef(null);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !message.trim()) {
            setError("All fields are required.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await sendMessage(email, message);
            setSuccess(true);
            setEmail("");
            setMessage("");
        } catch (err) {
            console.error("Contact submit error:", err);
            const msg = err.response?.data?.message || "Something went wrong. Please try again later.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" ref={sectionRef} className="contact">
            <div className="contact__ambient" aria-hidden>
                <div className="contact__glow contact__glow--tr" />
                <div className="contact__glow contact__glow--bl" />
            </div>

            <div className="layout-shell">
                <ScrollAnimate className="contact__intro">
                    <h2 className="contact__title">
                        Ready to start a{" "}
                        <span className="contact__title-accent">new project?</span>
                    </h2>
                </ScrollAnimate>

                <div className="contact__grid">
                    <ScrollAnimate animation="fadeRight">
                        <div className="contact__info">
                            <div className="contact__info-text">
                                <h3 className="contact__subtitle">Let&apos;s connect</h3>
                                <p className="contact__description">
                                    I&apos;m currently open to new opportunities and collaborations. Feel free to reach out for a project or just a quick chat!
                                </p>
                            </div>

                            <div className="contact__socials">
                            {[
                                { icon: Github, href: "https://github.com", label: "GitHub" },
                                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                                { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
                            ].map(({ icon: Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="contact__social-link"
                                >
                                    <Icon size={19} className="contact__social-icon" />
                                    <span className="contact__social-label">{label}</span>
                                </motion.a>
                            ))}
                        </div>
                        </div>
                    </ScrollAnimate>

                    <ScrollAnimate animation="fadeLeft" delay={0.2}>
                        <div className="contact__form-shell">
                        <div className="contact__form-inner">
                            <form onSubmit={handleSubmit} className="contact__form">
                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400"
                                    >
                                        <CheckCircle2 size={16} className="shrink-0" />
                                        <span>Thank you! Your message has been sent successfully.</span>
                                    </motion.div>
                                )}

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mb-4 flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-500"
                                    >
                                        <AlertCircle size={16} className="shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                <div className="contact__field">
                                    <label htmlFor="contact-email" className="contact__label">
                                        Email Address
                                    </label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        required
                                        placeholder="email@example.com"
                                        className="contact__input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="contact__field">
                                    <label htmlFor="contact-message" className="contact__label">
                                        Message
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        rows={5}
                                        required
                                        placeholder="Tell me about your project..."
                                        className="contact__textarea"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <motion.button
                                    whileHover={loading ? {} : { scale: 1.02 }}
                                    whileTap={loading ? {} : { scale: 0.98 }}
                                    type="submit"
                                    className="contact__submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 size={18} className="contact__submit-icon animate-spin" />
                                    ) : (
                                        <Send size={18} className="contact__submit-icon" />
                                    )}
                                    <span>{loading ? "Sending..." : "Send Message"}</span>
                                </motion.button>
                            </form>
                        </div>
                        </div>
                    </ScrollAnimate>
                </div>
            </div>
        </section>
    );
}
