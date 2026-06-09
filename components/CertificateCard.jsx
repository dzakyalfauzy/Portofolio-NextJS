"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Award, Building2, Calendar, Hash, ExternalLink, Sparkles } from "lucide-react";

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

export default function CertificateCard({ certificate, index = 0, isWide = false }) {
    const {
        title, issuer, image, image_path, date,
        credential, skills, verifyUrl, verify_url,
    } = certificate;

    const tags = Array.isArray(skills) ? skills : [];
    const displayImage = image_path || image;
    const displayVerifyUrl = verify_url || verifyUrl;

    const [imgError, setImgError] = useState(false);

    const handleMouseMove = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (y - 0.5) * -8;
        const rotateY = (x - 0.5) * 8;
        e.currentTarget.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }, []);

    const handleMouseLeave = useCallback((e) => {
        e.currentTarget.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    }, []);

    return (
        <motion.article
            variants={reveal3D}
            whileHover={{ y: -4 }}
            className={isWide ? "cert-bento__item cert-bento__item--wide" : "cert-bento__item"}
        >
            <div
                className="cert-bento__card group"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Certificate image as background */}
                {displayImage && !imgError ? (
                    <img
                        src={displayImage}
                        alt={`${title} certificate`}
                        className="cert-bento__bg-img"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="cert-bento__bg-fallback" aria-hidden />
                )}

                {/* Gradient overlay for text readability */}
                <div className="cert-bento__overlay" aria-hidden />

                {/* Header row */}
                <div className="cert-bento__top">
                    <div className="cert-bento__award-wrap">
                        <Award className="cert-bento__award-icon" size={isWide ? 22 : 18} strokeWidth={1.5} />
                    </div>
                    <span className="cert-bento__date">
                        <Calendar size={12} strokeWidth={1.5} />
                        {date}
                    </span>
                </div>

                {/* Title + Issuer */}
                <h3 className="cert-bento__title">{title}</h3>
                <p className="cert-bento__issuer">
                    <Building2 size={14} strokeWidth={1.5} />
                    <span>{issuer}</span>
                </p>

                {/* Credential ID */}
                {credential && (
                    <p className="cert-bento__credential">
                        <Hash size={12} strokeWidth={1.5} />
                        <span>{credential}</span>
                    </p>
                )}

                {/* Skills / Tags */}
                {tags.length > 0 && (
                    <div className="cert-bento__tags">
                        {tags.map((tag) => (
                            <span key={tag} className="cert-bento__tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Verify button */}
                {displayVerifyUrl && (
                    <div className="cert-bento__actions">
                        <motion.a
                            href={displayVerifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="cert-bento__verify-btn"
                        >
                            <Sparkles size={14} strokeWidth={1.5} />
                            <span>Verify</span>
                            <ExternalLink size={13} strokeWidth={1.5} />
                        </motion.a>
                    </div>
                )}
            </div>
        </motion.article>
    );
}
