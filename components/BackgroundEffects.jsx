"use client";

import React from "react";
import { motion } from "framer-motion";
import "@/lib/css/background-effects.css";

/**
 * BackgroundEffects component
 * Adds a premium, cyberpunk-minimalist layer with animated blobs and particles.
 */
export default function BackgroundEffects() {
    const particles = Array.from({ length: 20 });

    return (
        <div className="bgfx">
            <motion.div
                animate={{
                    x: [0, 50, -30, 0],
                    y: [0, -40, 60, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="bgfx__blob bgfx__blob--1"
            />
            <motion.div
                animate={{
                    x: [0, -60, 40, 0],
                    y: [0, 50, -30, 0],
                    scale: [1, 0.85, 1.15, 1],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                className="bgfx__blob bgfx__blob--2"
            />
            <motion.div
                animate={{
                    x: [0, 30, -50, 0],
                    y: [0, -20, 40, 0],
                    scale: [1, 1.1, 0.95, 1],
                }}
                transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
                className="bgfx__blob bgfx__blob--3"
            />

            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: Math.random() * 0.3,
                        scale: Math.random() * 0.5 + 0.5,
                    }}
                    animate={{
                        y: ["-10%", "110%"],
                        opacity: [0, 0.2, 0],
                    }}
                    transition={{
                        duration: Math.random() * 15 + 10,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: "linear",
                    }}
                    className="bgfx__particle"
                />
            ))}

            <div className="bgfx__noise">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
            </div>
        </div>
    );
}
