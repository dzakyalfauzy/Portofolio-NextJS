"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const cursorDotRef = useRef(null);
    const cursorTextRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const dot = cursorDotRef.current;
        const text = cursorTextRef.current;
        if (!cursor || !dot) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, ease: "power2.out" });
        };

        const handleMouseDown = () => {
            gsap.to(cursor, { scale: 0.8, duration: 0.2, ease: "power2.out" });
        };

        const handleMouseUp = () => {
            gsap.to(cursor, { scale: 1, duration: 0.2, ease: "power2.out" });
        };

        const handleMouseEnter = () => {
            gsap.to(cursor, { opacity: 1, duration: 0.3 });
            gsap.to(dot, { opacity: 1, scale: 1, duration: 0.3 });
        };

        const handleMouseLeave = () => {
            gsap.to(cursor, { opacity: 0, duration: 0.3 });
            gsap.to(dot, { opacity: 0, scale: 0, duration: 0.3 });
        };

        // Hover effects for interactive elements
        const handleElementEnter = (e) => {
            const el = e.currentTarget;
            const cursorText = el.getAttribute("data-cursor");
            gsap.to(cursor, { scale: 2, duration: 0.3, ease: "power2.out" });
            if (cursorText && text) {
                text.textContent = cursorText;
                gsap.to(text, { opacity: 1, scale: 1, duration: 0.2 });
            }
        };

        const handleElementLeave = () => {
            gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out" });
            if (text) {
                gsap.to(text, { opacity: 0, scale: 0.5, duration: 0.2 });
            }
        };

        // Animation loop for smooth cursor following
        const animate = () => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            gsap.set(cursor, { x: cursorX, y: cursorY });
            requestAnimationFrame(animate);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseenter", handleMouseEnter);
        document.addEventListener("mouseleave", handleMouseLeave);

        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll("a, button, [data-cursor]");
        interactiveElements.forEach((el) => {
            el.addEventListener("mouseenter", handleElementEnter);
            el.addEventListener("mouseleave", handleElementLeave);
        });

        animate();

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.removeEventListener("mouseleave", handleMouseLeave);
            interactiveElements.forEach((el) => {
                el.removeEventListener("mouseenter", handleElementEnter);
                el.removeEventListener("mouseleave", handleElementLeave);
            });
        };
    }, []);

    return (
        <>
            {/* Main cursor ring */}
            <div
                ref={cursorRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: 40,
                    height: 40,
                    border: "1.5px solid rgba(255, 255, 255, 0.5)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 9999,
                    transform: "translate(-50%, -50%)",
                    transition: "width 0.3s, height 0.3s, border-color 0.3s",
                    mixBlendMode: "difference",
                }}
            >
                <span
                    ref={cursorTextRef}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) scale(0.5)",
                        opacity: 0,
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#fff",
                        whiteSpace: "nowrap",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        pointerEvents: "none",
                    }}
                />
            </div>

            {/* Cursor dot */}
            <div
                ref={cursorDotRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: 6,
                    height: 6,
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 9999,
                    transform: "translate(-50%, -50%)",
                    mixBlendMode: "difference",
                }}
            />

            {/* Hide default cursor */}
            <style>{`
                * { cursor: none !important; }
                @media (max-width: 768px) {
                    * { cursor: auto !important; }
                    .custom-cursor { display: none !important; }
                }
            `}</style>
        </>
    );
}
