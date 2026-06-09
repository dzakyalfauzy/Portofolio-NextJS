"use client";

import React from "react";
import { motion } from "framer-motion";
import { Palette, Globe, Layout, Server } from "lucide-react";
import "@/lib/css/services.css";

const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
});

const services = [
    {
        title: "Web Development",
        description:
            "Building fast, secure, and SEO-friendly websites using modern frameworks and performance optimization techniques.",
        icon: Globe,
        color: "emerald",
    },
    {
        title: "UI/UX Design",
        description:
            "Crafting intuitive and engaging user interfaces with a focus on accessibility, usability, and modern aesthetics.",
        icon: Palette,
        color: "indigo",
    },
    {
        title: "Frontend Development",
        description:
            "Developing responsive and interactive web applications with React, Tailwind CSS, and sophisticated animations.",
        icon: Layout,
        color: "sky",
    },
    {
        title: "Backend Development",
        description:
            "Architecting robust server-side logic, API integrations, and database management systems that scale.",
        icon: Server,
        color: "rose",
    },
];

export default function Services() {
    return (
        <section id="services" className="services">
            <div className="services__bg-tr" aria-hidden />
            <div className="services__bg-bl" aria-hidden />

            <div className="layout-shell">
                <div className="services__header">
                    <motion.span
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp(0)}
                        className="services__eyebrow"
                    >
                        Capabilities
                    </motion.span>
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp(0.1)}
                        className="services__title"
                    >
                        Services I <span className="services__title-accent">provide</span>
                    </motion.h2>
                    <motion.p
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp(0.2)}
                        className="services__lead"
                    >
                        Helping brands and businesses bring their ideas to life through high-quality development and
                        design.
                    </motion.p>
                </div>

                <div className="services__grid">
                    {services.map((service, i) => (
                        <motion.div
                            key={service.title}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp(0.1 * i)}
                            whileHover={{ y: -6 }}
                            className="services__card"
                        >
                            <div className={`services__glow services__glow--${service.color}`} aria-hidden />
                            <div className="services__card-inner">
                                <div className={`services__icon services__icon--${service.color}`}>
                                    <service.icon size={26} strokeWidth={1.5} />
                                </div>
                                <h3 className="services__card-title">{service.title}</h3>
                                <p className="services__card-desc">{service.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
