"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-Driven Animation — Smooth Scrub
 *
 * Each ScrollReveal tracks its OWN element via a wrapper div.
 * No hooks called conditionally — ref is always set before useScroll runs.
 */

const INPUT = [0, 0.15, 0.35, 0.65, 0.85, 1];

function useScrollAnim(targetRef, opts) {
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start 0.92", "end 0.08"],
    });

    const p = opts.perspective;

    const opacity = useTransform(scrollYProgress, INPUT, p
        ? [0, 0.4, 1, 1, 0.4, 0]
        : [0, 0.4, 1, 1, 0.4, 0]);
    const y = useTransform(scrollYProgress, INPUT, p
        ? [60, 20, 0, 0, -20, -40]
        : [60, 20, 0, 0, -20, -40]);
    const scale = useTransform(scrollYProgress, INPUT, p
        ? [0.96, 0.99, 1, 1, 0.99, 0.97]
        : [0.96, 0.99, 1, 1, 0.99, 0.97]);

    if (p) {
        const rotateX = useTransform(scrollYProgress, INPUT, [-6, -2, 0, 0, 2, 4]);
        return { opacity, y, scale, rotateX, willChange: "transform, opacity" };
    }

    return { opacity, y, scale, willChange: "transform, opacity" };
}

export const ScrollReveal = forwardRef(function ScrollReveal(
    { perspective = false, className, style: styleProp, children, ...rest },
    forwardedRef,
) {
    const innerRef = useRef(null);

    useImperativeHandle(forwardedRef, () => innerRef.current);

    const style = useScrollAnim(innerRef, { perspective });

    return (
        <motion.div
            ref={innerRef}
            style={{ ...style, ...(styleProp || {}) }}
            className={className}
            {...rest}
        >
            {children}
        </motion.div>
    );
});
