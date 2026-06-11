"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, Calendar, MapPin, Users, Terminal, ChevronLeft, ChevronRight } from "lucide-react";

import { ScrollReveal as ScrollRevealOld } from "@/lib/scroll";
import { ScrollAnimate } from "./GSAPAnimations";
import "@/lib/css/experience.css";

const defaultExperiences = [
    {
        id: 'emub',
        title: "Staff Ahli Kementerian PSDM",
        company: "Eksekutif Mahasiswa Universitas Brawijaya",
        location: "Universitas Brawijaya",
        duration: "2024 – 2025",
        description: "Mengelola sumber daya mahasiswa tingkat universitas, koordinasi modul kepemimpinan nasional, dan eksekusi media kreatif.",
        prokers: [
            "LKMM-TL NASIONAL (Wakil Ketua Pelaksana)",
            "Garasi Brawijaya (WaCo Creative Design Media)",
            "PKO & Silabus (Staff Creative)",
            "Next Brawijaya (Team Creative)",
            "Internal PSDM 2025 (Team Creative)",
            "Pancasila (Team Creative)",
            "Tangan Brawijaya (PJ Fakultas Vokasi)"
        ],
        images: [],
        current: true
    },
    {
        id: 'penalaran',
        title: "Wakil Ketua Departemen Pengembangan Keilmiahan dan Daya Kritis Mahasiswa",
        company: "UAM Penalaran Vokasi",
        location: "Fakultas Vokasi UB",
        duration: "2023 – 2024",
        description: "Mengarahkan iklim ilmiah mahasiswa vokasi, mengontrol kualitas kompetisi karya tulis, dan memimpin berjalannya program kerja penalaran.",
        prokers: [
            "FOURSVIA (Wakil Ketua Pelaksana)",
            "PKM BOOST (Steering Committee)",
            "VOCUS (Steering Committee)"
        ],
        images: [],
        current: false
    },
    {
        id: 'hmpsti',
        title: "Staff Departemen Riset dan Teknologi",
        company: "HMPSTI Vokasi UB",
        location: "Malang, ID",
        duration: "2022 – 2023",
        description: "Bertanggung jawab atas manajemen rangkaian event IT prodi, serta berkontribusi dalam menyambut mahasiswa baru.",
        prokers: [
            "Tech Bridge Academy (Wakil Ketua Pelaksana)",
            "Tech Fair (Wakil Ketua Pelaksana)",
            "Tech Hunt (Wakil Ketua Pelaksana)",
            "PKKMB Prodi TI (Co Acara)"
        ],
        images: [],
        current: false
    }
];

function ImageCarousel({ images, company }) {
    const scrollRef = useRef(null);
    const [failedImages, setFailedImages] = useState(new Set());
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const validImages = images.filter((_, i) => !failedImages.has(i));

    // Check scroll state on mount dan saat images load
    useEffect(() => {
        const timer = setTimeout(() => checkScroll(), 100);
        return () => clearTimeout(timer);
    }, [validImages.length]);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };

    const scrollTo = (direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const width = el.clientWidth;
        el.scrollBy({ left: direction === 'left' ? -width : width, behavior: 'smooth' });
    };

    const handleImageError = (index) => {
        setFailedImages(prev => new Set([...prev, index]));
    };

    if (validImages.length === 0) return null;

    return (
        <div className="experience-carousel">
            <div
                ref={scrollRef}
                className="experience-carousel__track"
                onScroll={checkScroll}
            >
                {images.map((src, i) => (
                    failedImages.has(i) ? null : (
                        <div key={i} className="experience-carousel__slide">
                            <img
                                src={src}
                                alt={`${company} ${i + 1}`}
                                className="experience-carousel__img"
                                onError={() => handleImageError(i)}
                            />
                        </div>
                    )
                ))}
            </div>
            {validImages.length > 1 && (
                <>
                    {canScrollLeft && (
                        <button
                            className="experience-carousel__btn experience-carousel__btn--left"
                            onClick={() => scrollTo('left')}
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}
                    {canScrollRight && (
                        <button
                            className="experience-carousel__btn experience-carousel__btn--right"
                            onClick={() => scrollTo('right')}
                            aria-label="Next image"
                        >
                            <ChevronRight size={18} />
                        </button>
                    )}
                    <div className="experience-carousel__dots">
                        {validImages.length > 0 && images.map((_, i) => {
                            if (failedImages.has(i)) return null;
                            return <span key={i} className="experience-carousel__dot" />;
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

function TimelineItem({ exp, index }) {
    const isCurrent = exp.current === 1 || exp.current === true || exp.is_current === 1 || exp.is_current === true;
    const durationText = exp.duration || `${exp.start_date} – ${exp.end_date || 'Present'}`;

    const images = Array.isArray(exp.images)
        ? exp.images
        : exp.image_path
            ? [exp.image_path]
            : [];
    const hasImages = images.length > 0;

    const FallbackIcon = index % 3 === 0 ? Users : index % 3 === 1 ? Terminal : Briefcase;
    const isReverse = index % 2 !== 0;

    return (
        <ScrollAnimate
            animation={isReverse ? "fadeRight" : "fadeLeft"}
            delay={index * 0.15}
            className={`experience-item ${isReverse ? "reverse" : ""}`}
        >
            {/* Timeline center line node */}
            <div className="experience-item__timeline-node">
                <div className={`experience-item__node-dot ${isCurrent ? "active" : ""}`} />
            </div>

            {/* Info Box */}
            <div className="experience-item__info">
                <motion.div whileHover={{ y: -4 }} className="experience-item__card">
                    {isCurrent && (
                        <div className="experience-item__badge-row">
                            <span className="experience-item__badge">
                                <span className="experience-item__badge-dot" />
                                Current
                            </span>
                        </div>
                    )}

                    <h3 className="experience-item__title">{exp.title}</h3>
                    <div className="experience-item__meta">
                        <span className="experience-item__company">
                            <Briefcase size={13} />
                            {exp.company}
                        </span>
                        <span className="experience-item__muted">
                            <MapPin size={12} />
                            {exp.location}
                        </span>
                        <span className="experience-item__muted">
                            <Calendar size={12} />
                            {durationText}
                        </span>
                    </div>

                    <p className="experience-item__desc">{exp.description}</p>

                    {Array.isArray(exp.tags) && exp.tags.length > 0 && (
                        <div className="experience-item__prokers">
                            <h4 className="experience-item__prokers-title">Programs & Roles:</h4>
                            <div className="experience-item__proker-tags">
                                {exp.tags.map((tag) => (
                                    <span key={tag} className="experience-item__proker-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Photo/Visual Box */}
            <div className="experience-item__media-container">
                <div className="experience-item__media-inner">
                    {hasImages ? (
                        <ImageCarousel images={images} company={exp.company} />
                    ) : (
                        <div className="experience-item__placeholder">
                            <FallbackIcon size={40} className="experience-item__placeholder-icon" />
                            <span className="experience-item__placeholder-text">{exp.company}</span>
                        </div>
                    )}
                </div>
            </div>
        </ScrollAnimate>
    );
}

function ExperienceSkeleton() {
    return (
        <div className="experience-item" style={{ pointerEvents: 'none' }}>
            <div className="experience-item__card space-y-4">
                <div className="skeleton" style={{ height: '24px', width: '50%' }} />
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div className="skeleton" style={{ height: '14px', width: '100px' }} />
                    <div className="skeleton" style={{ height: '14px', width: '80px' }} />
                    <div className="skeleton" style={{ height: '14px', width: '120px' }} />
                </div>
                <div className="skeleton" style={{ height: '40px', width: '100%' }} />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div className="skeleton" style={{ height: '20px', width: '60px', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ height: '20px', width: '80px', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ height: '20px', width: '50px', borderRadius: '4px' }} />
                </div>
            </div>
        </div>
    );
}

function dedup(arr) {
    const seen = new Set();
    return arr.filter((item) => {
        const key = item.id || item.title;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

export default function Experience({ items = [], loading = false }) {
    const sectionRef = useRef(null);
    // Pakai data Supabase jika ada, fallback ke defaultExperiences
    const displayItems = items && items.length > 0 ? items : defaultExperiences;

    return (
        <section id="experience" ref={sectionRef} className="experience">
            <div className="layout-shell">
                {/* ===== HEADER ===== */}
                <ScrollRevealOld className="experience__header">
                    <span className="experience__eyebrow">Experience</span>
                    <h2 className="experience__title">
                        My <span className="experience__title-accent">journey</span>
                    </h2>
                    <p className="experience__lead">
                        A timeline of roles, challenges, and growth across different teams and projects.
                    </p>
                </ScrollRevealOld>

                {/* ===== TIMELINE ===== */}
                <div className="experience__timeline">
                    <div className="experience__timeline-line" />
                    {loading ? (
                        <>
                            <ExperienceSkeleton />
                            <ExperienceSkeleton />
                        </>
                    ) : (
                        displayItems.map((exp, i) => (
                            <TimelineItem
                                key={exp.id || `${exp.company}-${exp.title}-${i}`}
                                exp={exp}
                                index={i}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
