"use client";

import { useRef, useEffect, forwardRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   ScrollAnimate — Clean reveal animation triggered by scroll
   Supports multiple animation types with configurable options
   ================================================================ */
export const ScrollAnimate = forwardRef(function ScrollAnimate(
    {
        children,
        animation = "fadeUp", // fadeUp | fadeLeft | fadeRight | scaleUp | clipLeft | blurReveal
        delay = 0,
        duration = 1,
        stagger = 0,
        y = 60,
        x = 0,
        start = "top 85%",
        className = "",
        style = {},
        ...rest
    },
    forwardedRef
) {
    const ref = useRef(null);
    const elRef = forwardedRef || ref;

    useEffect(() => {
        const el = typeof elRef === "object" ? elRef.current : null;
        if (!el) return;

        // Get all animatable children or the element itself
        const targets = stagger > 0 ? el.children : [el];
        if (!targets.length) return;

        const from = { opacity: 0 };
        const to = { opacity: 1, duration, delay, ease: "power3.out" };

        switch (animation) {
            case "fadeUp":
                from.y = y;
                to.y = 0;
                break;
            case "fadeLeft":
                from.x = -80;
                to.x = 0;
                break;
            case "fadeRight":
                from.x = 80;
                to.x = 0;
                break;
            case "scaleUp":
                from.scale = 0.85;
                from.y = 30;
                to.scale = 1;
                to.y = 0;
                to.ease = "back.out(1.2)";
                break;
            case "clipLeft":
                from.clipPath = "inset(0 100% 0 0)";
                to.clipPath = "inset(0 0% 0 0)";
                to.ease = "power4.inOut";
                break;
            case "blurReveal":
                from.filter = "blur(8px)";
                from.y = 20;
                to.filter = "blur(0px)";
                to.y = 0;
                break;
            default:
                from.y = y;
                to.y = 0;
        }

        gsap.fromTo(targets, from, {
            ...to,
            stagger: stagger > 0 ? stagger : 0,
            scrollTrigger: {
                trigger: el,
                start,
                toggleActions: "play none none none",
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [animation, delay, duration, stagger, y, x, start]);

    return (
        <div ref={elRef} className={className} style={{ opacity: 0, ...style }} {...rest}>
            {children}
        </div>
    );
});

/* ================================================================
   Parallax — Smooth parallax scroll effect
   ================================================================ */
export const Parallax = forwardRef(function Parallax(
    {
        children,
        speed = 0.3,
        rotation = 0,
        scale = 1,
        className = "",
        style = {},
        ...rest
    },
    forwardedRef
) {
    const ref = useRef(null);
    const elRef = forwardedRef || ref;

    useEffect(() => {
        const el = typeof elRef === "object" ? elRef.current : null;
        if (!el) return;

        const from = { y: -speed * 150, rotation: -rotation, scale: 1 / scale, opacity: 0.4 };
        const to = { y: speed * 150, rotation, scale, opacity: 1, ease: "none" };

        gsap.fromTo(el, from, {
            ...to,
            scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [speed, rotation, scale]);

    return (
        <div ref={elRef} className={className} style={style} {...rest}>
            {children}
        </div>
    );
});

/* ================================================================
   TextReveal — Characters reveal one by one following scroll
   ================================================================ */
export const TextReveal = forwardRef(function TextReveal(
    {
        children,
        delay = 0,
        staggerAmount = 0.03,
        duration = 0.6,
        ease = "back.out(1.7)",
        className = "",
        style = {},
        ...rest
    },
    forwardedRef
) {
    const ref = useRef(null);
    const elRef = forwardedRef || ref;

    useEffect(() => {
        const el = typeof elRef === "object" ? elRef.current : null;
        if (!el) return;

        // Split text into characters
        const textNodes = [];
        const walk = (node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                textNodes.push(node);
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "BR") {
                node.childNodes.forEach(walk);
            }
        };
        walk(el);

        const charSpans = [];
        textNodes.forEach((textNode) => {
            const text = textNode.textContent;
            const frag = document.createDocumentFragment();
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement("span");
                span.textContent = text[i] === " " ? " " : text[i];
                span.style.display = "inline-block";
                span.style.opacity = "0";
                span.style.transform = "translateY(100%) rotateX(-80deg)";
                span.style.transformOrigin = "bottom center";
                span.style.willChange = "transform, opacity";
                frag.appendChild(span);
                charSpans.push(span);
            }
            textNode.parentNode.replaceChild(frag, textNode);
        });

        if (charSpans.length > 0) {
            gsap.to(charSpans, {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration,
                stagger: staggerAmount,
                delay,
                ease,
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [delay, staggerAmount, duration, ease]);

    return (
        <div ref={elRef} className={className} style={style} {...rest}>
            {children}
        </div>
    );
});

/* ================================================================
   MagneticButton — Button follows cursor with magnetic effect
   ================================================================ */
export const MagneticButton = forwardRef(function MagneticButton(
    {
        children,
        strength = 0.3,
        className = "",
        style = {},
        ...rest
    },
    forwardedRef
) {
    const ref = useRef(null);
    const elRef = forwardedRef || ref;

    useEffect(() => {
        const el = typeof elRef === "object" ? elRef.current : null;
        if (!el) return;

        const handleMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, {
                x: x * strength,
                y: y * strength,
                duration: 0.4,
                ease: "power2.out",
            });
        };

        const handleMouseLeave = () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
        };

        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            el.removeEventListener("mousemove", handleMouseMove);
            el.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [strength]);

    return (
        <div
            ref={elRef}
            className={className}
            style={{ display: "inline-block", ...style }}
            {...rest}
        >
            {children}
        </div>
    );
});

/* ================================================================
   PinSection — Section pins during scroll
   ================================================================ */
export const PinSection = forwardRef(function PinSection(
    {
        children,
        className = "",
        style = {},
        ...rest
    },
    forwardedRef
) {
    const ref = useRef(null);
    const elRef = forwardedRef || ref;

    useEffect(() => {
        const el = typeof elRef === "object" ? elRef.current : null;
        if (!el) return;

        ScrollTrigger.create({
            trigger: el,
            start: "top top",
            end: "+=100%",
            pin: true,
            pinSpacing: true,
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill();
            });
        };
    }, []);

    return (
        <div ref={elRef} className={className} style={style} {...rest}>
            {children}
        </div>
    );
});

/* ================================================================
   HorizontalScroll — Horizontal scroll section
   ================================================================ */
export const HorizontalScroll = forwardRef(function HorizontalScroll(
    {
        children,
        className = "",
        style = {},
        ...rest
    },
    forwardedRef
) {
    const ref = useRef(null);
    const elRef = forwardedRef || ref;

    useEffect(() => {
        const el = typeof elRef === "object" ? elRef.current : null;
        if (!el) return;

        const scrollContainer = el.querySelector(".horizontal-scroll-container");
        if (!scrollContainer) return;

        const totalWidth = scrollContainer.scrollWidth - el.offsetWidth;

        gsap.to(scrollContainer, {
            x: -totalWidth,
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top top",
                end: `+=${totalWidth}`,
                pin: true,
                scrub: 1,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill();
            });
        };
    }, []);

    return (
        <div
            ref={elRef}
            className={className}
            style={{ overflow: "hidden", ...style }}
            {...rest}
        >
            {children}
        </div>
    );
});

/* ================================================================
   RotateOnScroll — Element rotates based on scroll
   ================================================================ */
export const RotateOnScroll = forwardRef(function RotateOnScroll(
    {
        children,
        rotation = 360,
        className = "",
        style = {},
        ...rest
    },
    forwardedRef
) {
    const ref = useRef(null);
    const elRef = forwardedRef || ref;

    useEffect(() => {
        const el = typeof elRef === "object" ? elRef.current : null;
        if (!el) return;

        gsap.to(el, {
            rotation,
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [rotation]);

    return (
        <div ref={elRef} className={className} style={style} {...rest}>
            {children}
        </div>
    );
});
