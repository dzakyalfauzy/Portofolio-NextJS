"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import Hero from "./Hero";

const TOTAL = 190;
const PREFIX = "/sequence/ezgif-frame-";
const EXT = ".png";

/* ================================================================
   WelcomeScreen — Animasi typing + slide + line expand
   ================================================================ */
function WelcomeScreen({ welcomeOp, welcomeY, welcomePointer, welcomeVisibility }) {
    const containerRef = useRef(null);
    const welcomeToRef = useRef(null);
    const myPortfolioRef = useRef(null);
    const lineRef = useRef(null);
    const scrollHintRef = useRef(null);
    const chevronRef = useRef(null);
    const [welcomeToText, setWelcomeToText] = useState("");
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.5 });

        // 1. Typing "WELCOME TO" character by character
        const text = "WELCOME TO";
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex <= text.length) {
                setWelcomeToText(text.slice(0, charIndex));
                charIndex++;
            } else {
                clearInterval(typeInterval);

                // 2. After typing done, slide "MY PORTFOLIO" from below
                gsap.fromTo(myPortfolioRef.current,
                    { y: 80, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
                );

                // 3. Expand glowing line from center
                gsap.fromTo(lineRef.current,
                    { scaleX: 0 },
                    { scaleX: 1, duration: 0.6, ease: "power2.out", delay: 0.3 }
                );

                // 4. Fade in scroll hint
                gsap.fromTo(scrollHintRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.5 }
                );

                // 5. Fade in chevrons
                gsap.fromTo(chevronRef.current,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.7 }
                );
            }
        }, 60);

        // Cursor blink
        const cursorBlink = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 530);

        return () => {
            clearInterval(typeInterval);
            clearInterval(cursorBlink);
        };
    }, []);

    return (
        <motion.div
            ref={containerRef}
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 15,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000",
                opacity: welcomeOp,
                y: welcomeY,
                pointerEvents: welcomePointer,
                visibility: welcomeVisibility,
            }}
        >
            {/* Vertical line */}
            <div style={{
                width: "1px",
                height: "80px",
                background: "linear-gradient(to bottom, transparent, rgba(239,68,68,0.6))",
                marginBottom: "2rem",
            }} />

            {/* Portfolio — 2026 */}
            <p style={{
                fontSize: "0.7rem", fontWeight: 500,
                color: "rgba(239,68,68,0.55)", letterSpacing: "0.35em",
                textTransform: "uppercase", fontFamily: "'Courier New', monospace",
                margin: "0 0 1.2rem 0",
            }}>
                Portfolio — 2026
            </p>

            {/* WELCOME TO — Typing animation */}
            <h1 ref={welcomeToRef} style={{
                fontSize: "clamp(3rem, 8vw, 6.5rem)", fontWeight: 900,
                color: "rgba(255,255,255,0.92)", letterSpacing: "0.04em",
                lineHeight: 1.1, margin: 0, textTransform: "uppercase",
                fontFamily: "'Bebas Neue', sans-serif", textAlign: "center",
                minHeight: "1.1em",
            }}>
                {welcomeToText}
                <span style={{
                    opacity: showCursor ? 1 : 0,
                    color: "#EF4444",
                    marginLeft: 2,
                    transition: "opacity 0.1s",
                }}>|</span>
            </h1>

            {/* MY PORTFOLIO — Slides up from below */}
            <h1 ref={myPortfolioRef} style={{
                fontSize: "clamp(3rem, 8vw, 6.5rem)", fontWeight: 900,
                letterSpacing: "0.04em", lineHeight: 1.1, margin: "0 0 2rem 0",
                textTransform: "uppercase", fontFamily: "'Bebas Neue', sans-serif",
                textAlign: "center",
                background: "linear-gradient(90deg, #EF4444, #F97316)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                opacity: 0,
            }}>
                My Portfolio
            </h1>

            {/* Glowing line — expands from center */}
            <div ref={lineRef} style={{
                width: "200px", height: "3px",
                background: "linear-gradient(90deg, transparent, #EF4444, #F97316, transparent)",
                marginBottom: "2rem",
                transform: "scaleX(0)",
                boxShadow: "0 0 20px rgba(239,68,68,0.5), 0 0 40px rgba(249,115,22,0.3)",
            }} />

            {/* Scroll hint — fades in */}
            <p ref={scrollHintRef} style={{
                fontSize: "clamp(0.75rem, 1.5vw, 0.9rem)", color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.25em", textTransform: "uppercase",
                fontFamily: "'Courier New', monospace", margin: "0 0 3.5rem 0", textAlign: "center",
                opacity: 0,
            }}>
                Scroll slowly downward to begin
            </p>

            {/* Chevrons */}
            <div ref={chevronRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: 0 }}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{ opacity: [0.15, 1, 0.15], y: [0, 6, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.18 }}
                    >
                        <ChevronDown
                            size={i === 2 ? 28 : i === 1 ? 24 : 20}
                            color={i === 2 ? "#F97316" : i === 1 ? "rgba(239,68,68,0.65)" : "rgba(239,68,68,0.3)"}
                            strokeWidth={2}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
const START_FRAME = 2;

function drawCover(ctx, canvas, img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;
    let w, h, x, y;
    if (canvasRatio > imgRatio) {
        w = canvas.width; h = canvas.width / imgRatio; x = 0; y = (canvas.height - h) / 2;
    } else {
        w = canvas.height * imgRatio; h = canvas.height; x = (canvas.width - w) / 2; y = 0;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, w, h);
}

export default function IntroSequence() {
    const masterRef = useRef(null);
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);
    const lastFrameRef = useRef(-1);
    const rafRef = useRef(null);

    const [isReady, setIsReady] = useState(false);
    const [frame0Ready, setFrame0Ready] = useState(false);

    const updateCanvasSize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
    }, []);

    /* -- Preload Frame 02 (frame 01 doesn't exist) -- */
    useEffect(() => {
        updateCanvasSize();
        const first = new Image();
        first.src = `${PREFIX}002${EXT}`;

        first.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (canvas && ctx) {
                updateCanvasSize();
                drawCover(ctx, canvas, first);
                lastFrameRef.current = 0;
                imagesRef.current[0] = first;
                setFrame0Ready(true);
            }
        };
        first.onerror = () => {
            console.error("Gagal memuat frame pertama.");
            setFrame0Ready(true);
        };
    }, [updateCanvasSize]);

    /* -- Preload Sisa Frame -- */
    useEffect(() => {
        if (!frame0Ready) return;
        const imgs = imagesRef.current;
        let loaded = 1;
        for (let i = 1; i < TOTAL; i++) {
            const padded = String(i + START_FRAME).padStart(3, "0");
            const img = new Image();
            img.src = `${PREFIX}${padded}${EXT}`;
            img.onload = img.onerror = () => {
                imgs[i] = img;
                loaded++;
                if (loaded === TOTAL) setIsReady(true);
            };
            imgs[i] = img;
        }
    }, [frame0Ready]);

    /* -- Handle Window Resize -- */
    useEffect(() => {
        const onResize = () => {
            updateCanvasSize();
            const idx = Math.max(0, lastFrameRef.current);
            const img = imagesRef.current[idx];
            if (img) {
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext("2d");
                if (canvas && ctx) drawCover(ctx, canvas, img);
            }
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [updateCanvasSize]);

    /* -- Scroll Setup -- */
    const { scrollYProgress } = useScroll({
        target: masterRef,
        offset: ["start start", "end end"],
    });

    // -- TIMELINE ANIMASI (Teratur & Anti Tumpang Tindih) --

    // 1. Welcome Screen: Hilang di awal scroll (0.0 -> 0.08)
    const welcomeOp = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
    const welcomeY = useTransform(scrollYProgress, [0, 0.08], [0, -100]);
    // Mencegah Welcome Screen memblokir klik/interaksi saat sudah transparan
    const welcomePointer = useTransform(scrollYProgress, (v) => v > 0.08 ? "none" : "auto");
    const welcomeVisibility = useTransform(scrollYProgress, (v) => v > 0.09 ? "hidden" : "visible");

    // 2. Jalannya Gambar Sequence: Berputar dari scroll 0.08 sampai 0.80
    const frameIndex = useTransform(scrollYProgress, [0.08, 0.80], [0, TOTAL - 1]);

    // 3. Teks Overlay Dzaky: Muncul setelah welcome screen bersih (0.15 -> 0.72)
    const textOp = useTransform(scrollYProgress, [0.15, 0.23, 0.60, 0.72], [0, 1, 1, 0]);
    const textY  = useTransform(scrollYProgress, [0.15, 0.23, 0.60, 0.72], [60, 0, 0, -40]);

    // 4. Petunjuk Abyss: Muncul di akhir video (0.75 -> 0.82)
    const hintOp = useTransform(scrollYProgress, [0.75, 0.82], [0, 1]);
    const hintY  = useTransform(scrollYProgress, [0.75, 0.82], [10, 0]);

    // 5. Hero Section: Meluncur naik menutup sequence di paling akhir (0.85 -> 1.0)
    const heroY = useTransform(scrollYProgress, [0.85, 1.0], ["100vh", "0vh"]);

    /* -- Loop Rerender Canvas via Scroll -- */
    useEffect(() => {
        const unsub = frameIndex.on("change", (val) => {
            const idx = Math.round(Math.max(0, Math.min(TOTAL - 1, val)));
            if (idx === lastFrameRef.current) return;
            lastFrameRef.current = idx;

            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext("2d");
                const img = imagesRef.current[idx];

                if (canvas && ctx && img && img.complete) {
                    drawCover(ctx, canvas, img);
                }
            });
        });
        return () => {
            unsub();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [frameIndex]);

    return (
        <div
            ref={masterRef}
            style={{ position: "relative", height: "500vh", backgroundColor: "#000" }}
        >
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    width: "100%",
                    overflow: "hidden",
                    backgroundColor: "#000",
                }}
            >
                {/* LAYER 1: Canvas Rangkaian Foto */}
                <canvas
                    ref={canvasRef}
                    style={{
                        display: "block",
                        position: "absolute",
                        top: 0, left: 0,
                        width: "100%", height: "100%",
                        zIndex: 1,
                        backgroundColor: "#000",
                    }}
                />

                {/* LAYER 2: Welcome Screen */}
                <WelcomeScreen welcomeOp={welcomeOp} welcomeY={welcomeY} welcomePointer={welcomePointer} welcomeVisibility={welcomeVisibility} />

                {/* LAYER 3: Teks Overlay Dzaky & Petunjuk Abyss */}
                <div style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
                    }} />

                    {/* Nama Intro */}
                    <motion.div
                        style={{
                            position: "absolute", inset: 0,
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "flex-end",
                            paddingBottom: "15vh", padding: "2rem", textAlign: "center",
                            opacity: textOp, y: textY,
                        }}
                    >
                        <p style={{
                            fontSize: "clamp(3.5rem, 7.5vw, 7rem)", fontWeight: 900,
                            color: "rgba(255,255,255,0.85)", letterSpacing: "0.05em",
                            lineHeight: 1.2, maxWidth: "48rem", margin: 0, textTransform: "uppercase",
                            fontFamily: "'Bebas Neue', sans-serif",
                            textShadow: "0 0 10px rgba(239,68,68,0.4)",
                        }}>
                            <span style={{ color: "#EF4444" }}>This</span> is Me{" "}
                            <span style={{ color: "#F97316" }}>Dzaky</span>
                        </p>
                    </motion.div>

                    {/* Hint Menuju Hero */}
                    <motion.div
                        style={{
                            position: "absolute", bottom: "2.5rem", left: 0, right: 0,
                            display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem",
                            opacity: hintOp, y: hintY,
                        }}
                    >
                        <p style={{
                            fontWeight: 600, color: "rgba(239,68,68,0.6)",
                            letterSpacing: "0.35em", textTransform: "uppercase", margin: 0,
                            fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem",
                        }}>
                            Descend Into The Abyss
                        </p>
                        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
                            <ChevronDown size={22} color="rgba(239,68,68,0.5)" />
                        </motion.div>
                    </motion.div>
                </div>

                {/* LAYER 4: Komponen Hero (Meluncur Paling Atas di Akhir Scroll) */}
                <motion.div
                    style={{
                        position: "absolute", top: 0, left: 0,
                        width: "100%", height: "100vh",
                        zIndex: 20, // Di atas segalanya saat slide up selesai
                        y: heroY,
                    }}
                >
                    <Hero />
                </motion.div>
            </div>
        </div>
    );
}
