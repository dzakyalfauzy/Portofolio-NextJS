"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getPortfolioData } from "@/lib/supabase-api";
import IntroSequence from "@/components/IntroSequence";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certificates from "@/components/Certificates";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/* Register GSAP plugins at the top level */
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const [data, setData] = useState<{
        projects: any[];
        certificates: any[];
        experiences: any[];
        skills: any[];
    }>({
        projects: [],
        certificates: [],
        experiences: [],
        skills: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPortfolioData()
            .then((res) => {
                setData(res);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load portfolio data:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const hash = window.location.hash?.replace(/^#/, "");
        if (!hash) return;
        const t = window.setTimeout(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }, 80);
        return () => window.clearTimeout(t);
    }, []);

    return (
        <>
            <IntroSequence />
            <About />
            <Skills items={data.skills as any} loading={loading} />
            <Projects items={data.projects as any} loading={loading} />
            <Certificates items={data.certificates as any} loading={loading} />
            <Experience items={data.experiences as any} loading={loading} />
            <Contact />
            <Footer />
        </>
    );
}
