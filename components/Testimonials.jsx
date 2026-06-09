"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal as ScrollRevealOld } from "@/lib/scroll";
import "@/lib/css/testimonials.css";

const testimonials = [
    {
        name: "Ahmad Rizky",
        role: "CEO, TechVenture",
        text: "Kualitas kerjanya luar biasa. Website yang dibangun sangat responsif, cepat, dan desainnya modern. Sangat puas dengan hasilnya dan akan bekerja sama lagi di project selanjutnya.",
        rating: 5,
        color: "indigo",
    },
    {
        name: "Sarah Putri",
        role: "Product Manager, StartUp ID",
        text: "Developer yang sangat profesional dan komunikatif. Selalu memberikan update progress dan hasil akhirnya bahkan melebihi ekspektasi kami. Highly recommended!",
        rating: 5,
        color: "rose",
    },
    {
        name: "Budi Santoso",
        role: "CTO, Digital Prima",
        text: "Kemampuan teknis yang sangat solid, baik di front-end maupun back-end. Problem solving-nya cepat dan kode yang ditulis bersih serta well-documented.",
        rating: 5,
        color: "indigo",
    },
    {
        name: "Diana Kusuma",
        role: "Founder, CreativeHub",
        text: "Desain UI/UX yang dihasilkan sangat elegan dan user-friendly. Proses development-nya juga tepat waktu. Terima kasih atas kerja kerasnya!",
        rating: 4,
        color: "rose",
    },
    {
        name: "Fajar Nugroho",
        role: "Marketing Director, E-Shop",
        text: "Platform e-commerce yang dibuat berhasil meningkatkan konversi kami sebesar 35%. Performanya cepat dan fitur-fiturnya lengkap sesuai kebutuhan bisnis kami.",
        rating: 5,
        color: "indigo",
    },
    {
        name: "Lisa Andriani",
        role: "Project Lead, Agency360",
        text: "Sangat detail dan teliti dalam mengerjakan setiap fitur. Responsif terhadap feedback dan selalu memberikan solusi terbaik untuk setiap tantangan teknis.",
        rating: 5,
        color: "rose",
    },
];

function TestimonialCard({ item }) {
    const c = item.color;

    return (
        <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
                if (info.offset.x < -80) item.onNext?.();
                else if (info.offset.x > 80) item.onPrev?.();
            }}
            className={`testimonials__card testimonials__card--${c}`}
        >
            <Quote size={28} className={`testimonials__quote testimonials__quote--${c}`} />
            <p className="testimonials__text">&ldquo;{item.text}&rdquo;</p>

            <div className="testimonials__stars">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={15}
                        className={
                            i < item.rating
                                ? `testimonials__star-fill testimonials__star--${c}`
                                : "testimonials__star-fill testimonials__star--empty"
                        }
                    />
                ))}
            </div>

            <div className="testimonials__footer">
                <div className={`testimonials__avatar testimonials__avatar--${c}`}>
                    {item.name.charAt(0)}
                </div>
                <div className="testimonials__meta">
                    <p className="testimonials__name">{item.name}</p>
                    <p className="testimonials__role">{item.role}</p>
                </div>
            </div>

            <div className={`testimonials__corner-glow testimonials__corner-glow--${c}`} aria-hidden />
        </motion.div>
    );
}

export default function Testimonials() {
    const sectionRef = useRef(null);
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
    }, []);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, []);

    /* Auto-play every 5s */
    useEffect(() => {
        if (paused) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [paused, next]);

    const currentTestimonial = {
        ...testimonials[current],
        onNext: next,
        onPrev: prev,
    };

    return (
        <section id="testimonials" ref={sectionRef} className="testimonials">
            <div className="layout-shell">
                <ScrollRevealOld className="testimonials__header">
                    <span className="testimonials__eyebrow">Testimoni</span>
                    <h2 className="testimonials__title">
                        Apa kata <span className="testimonials__title-accent">klien saya</span>
                    </h2>
                    <p className="testimonials__lead">
                        Feedback dan ulasan dari klien yang pernah bekerja sama dengan saya di berbagai project.
                    </p>
                </ScrollRevealOld>

                <ScrollRevealOld className="testimonials__carousel">
                    <div
                        className="testimonials__carousel-inner"
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                    >
                        {/* Navigation Arrows */}
                        <button
                            className="testimonials__nav-btn testimonials__nav-btn--prev"
                            onClick={prev}
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="testimonials__carousel-card">
                            <AnimatePresence mode="wait">
                                <TestimonialCard
                                    key={current}
                                    item={currentTestimonial}
                                />
                            </AnimatePresence>
                        </div>

                        <button
                            className="testimonials__nav-btn testimonials__nav-btn--next"
                            onClick={next}
                            aria-label="Next testimonial"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="testimonials__dots">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                className={`testimonials__dot ${i === current ? "testimonials__dot--active" : ""}`}
                                onClick={() => setCurrent(i)}
                                aria-label={`Go to testimonial ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Progress bar */}
                    <div className="testimonials__progress">
                        <motion.div
                            className="testimonials__progress-bar"
                            key={current}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: paused ? 0 : 5, ease: "linear" }}
                        />
                    </div>
                </ScrollRevealOld>
            </div>
        </section>
    );
}
