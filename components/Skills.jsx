"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { RoundedBox, Html, Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal as ScrollRevealOld } from "@/lib/scroll";
import { ScrollAnimate, Parallax } from "./GSAPAnimations";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

extend({ RoundedBoxGeometry });

const ICON = (icon) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}.svg`;

const visualMap = {
    react:            { label: "React",    color: "#5aabbd", icon: "react/react-original",             desc: "Frontend UI library",      prof: 90 },
    nextdotjs:        { label: "Next",     color: "#555555", icon: "nextjs/nextjs-original",           desc: "React meta-framework",      prof: 80 },
    vuejs:            { label: "Vue",      color: "#5a9e6f", icon: "vuejs/vuejs-original",             desc: "Progressive framework",     prof: 75 },
    html5:            { label: "HTML",     color: "#c46a3c", icon: "html5/html5-original",             desc: "Markup language",           prof: 95 },
    css3:             { label: "CSS",      color: "#3a7bbf", icon: "css3/css3-original",               desc: "Styling language",          prof: 90 },
    tailwindcss:      { label: "Tailwind", color: "#4a9eab", icon: "tailwindcss/tailwindcss-original", desc: "Utility-first CSS",         prof: 92 },
    javascript:       { label: "JS",       color: "#a88a30", icon: "javascript/javascript-original",   desc: "Core web language",         prof: 92 },
    typescript:       { label: "TS",       color: "#4a7ab5", icon: "typescript/typescript-original",   desc: "Typed JavaScript",          prof: 85 },
    laravel:          { label: "Laravel",  color: "#c43a31", icon: "laravel/laravel-original",         desc: "PHP web framework",         prof: 88 },
    php:              { label: "PHP",      color: "#6b6fa3", icon: "php/php-original",                 desc: "Backend language",          prof: 85 },
    python:           { label: "Python",   color: "#4a7a9e", icon: "python/python-original",           desc: "General-purpose language",  prof: 72 },
    nodedotjs:        { label: "Node",     color: "#4a8a4a", icon: "nodejs/nodejs-original",           desc: "Server-side JS runtime",    prof: 82 },
    mysql:            { label: "MySQL",    color: "#3a6a8a", icon: "mysql/mysql-original",             desc: "Relational database",       prof: 85 },
    postgresql:       { label: "Postgres", color: "#3a5a9e", icon: "postgresql/postgresql-original",   desc: "Advanced SQL database",     prof: 78 },
    git:              { label: "Git",      color: "#c44a32", icon: "git/git-original",                 desc: "Version control",           prof: 90 },
    docker:           { label: "Docker",   color: "#3a7ac0", icon: "docker/docker-original",           desc: "Container platform",        prof: 75 },
    visualstudiocode: { label: "VSCode",   color: "#3a8ac0", icon: "vscode/vscode-original",           desc: "Code editor",               prof: 95 },
    postman:          { label: "Postman",  color: "#c46a3c", icon: "postman/postman-original",         desc: "API testing tool",          prof: 80 },
    nginx:            { label: "Nginx",    color: "#3a7a3a", icon: "nginx/nginx-original",             desc: "Web server",                prof: 68 },
    figma:            { label: "Figma",    color: "#a84a3a", icon: "figma/figma-original",             desc: "UI design tool",            prof: 70 },
    linux:            { label: "Linux",    color: "#c9a84c", icon: "linux/linux-original",             desc: "Operating system",          prof: 78 },
    redis:            { label: "Redis",    color: "#c43a31", icon: "redis/redis-original",             desc: "In-memory cache",           prof: 65 },
    mongodb:          { label: "Mongo",    color: "#4a8a4a", icon: "mongodb/mongodb-original",         desc: "NoSQL database",            prof: 70 },
    vite:             { label: "Vite",     color: "#a84a3a", icon: "vitejs/vitejs-original",           desc: "Build tool",                prof: 85 },
};

const lucideDefaults = {
    Webhook:        { label: "API",    color: "#6b6fa3", icon: "postman/postman-original",         desc: "REST APIs",         prof: 80 },
    PenTool:        { label: "UI/UX",  color: "#a84a3a", icon: "figma/figma-original",             desc: "UI/UX Design",      prof: 75 },
    LayoutTemplate: { label: "Layout", color: "#4a9eab", icon: "tailwindcss/tailwindcss-original", desc: "Responsive design", prof: 80 },
    Layers:         { label: "Proto",  color: "#5a9e6f", icon: "vuejs/vuejs-original",             desc: "Prototyping",       prof: 70 },
    Type:           { label: "Type",   color: "#555555", icon: "typescript/typescript-original",   desc: "Typography",        prof: 65 },
    Pipette:        { label: "Color",  color: "#c46a3c", icon: "figma/figma-original",             desc: "Color theory",      prof: 65 },
};

const categoryColors = {
    frontend: "#5aabbd", backend: "#4a8a4a", tools: "#c44a32", design: "#a84a3a",
};

function mapSkill(skill) {
    const slug = skill.slug?.toLowerCase();
    const visual = visualMap[slug];
    if (visual) return { name: skill.name, ...visual, category: skill.category || "Frontend" };
    if (skill.lucide_icon && lucideDefaults[skill.lucide_icon]) {
        const d = lucideDefaults[skill.lucide_icon];
        return { name: skill.name, label: d.label, color: d.color, icon: null, desc: d.desc, prof: d.prof, category: skill.category || "Design" };
    }
    const cat = skill.category || "Frontend";
    return { name: skill.name, label: skill.name.slice(0, 6).toUpperCase(), color: categoryColors[cat.toLowerCase()] || "#5aabbd", icon: slug ? `${slug}/${slug}-original` : null, desc: cat, prof: 70, category: cat };
}

/* -- KEY CONSTANTS -- */
const KEY_SIZE       = 0.60;
const KEY_GAP        = 0.10;
const KEYCAP_TOP     = 0.13;
const CHASSIS_HEIGHT = 0.26;
const CHASSIS_PAD    = 0.30;
const COLS           = 6;

/* -- Single keycap -- */
function Key3D({ skill, position, onPopup }) {
    const meshRef  = useRef();
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);
    const [imgErr,  setImgErr]  = useState(false);

    const color   = useMemo(() => new THREE.Color(skill.color), [skill.color]);
    const darkClr = useMemo(() => new THREE.Color(skill.color).multiplyScalar(0.38), [skill.color]);
    const targetY = pressed ? -0.04 : hovered ? 0.07 : 0;

    useFrame((_, dt) => {
        if (meshRef.current)
            meshRef.current.position.y = THREE.MathUtils.lerp(
                meshRef.current.position.y, position[1] + KEYCAP_TOP + targetY, dt * 14
            );
    });

    return (
        <group position={position}>
            <mesh position={[0, KEYCAP_TOP - 0.015, 0]}>
                <boxGeometry args={[KEY_SIZE + 0.015, 0.018, KEY_SIZE + 0.015]} />
                <meshStandardMaterial color="#080810" roughness={0.95} />
            </mesh>
            <mesh position={[0, KEYCAP_TOP / 2, 0]}>
                <boxGeometry args={[KEY_SIZE, KEYCAP_TOP, KEY_SIZE]} />
                <meshStandardMaterial color={darkClr} roughness={0.55} metalness={0.12} />
            </mesh>
            <mesh
                ref={meshRef}
                position={[0, KEYCAP_TOP + 0.01, 0]}
                onPointerOver={e => { e.stopPropagation(); setHovered(true);  document.body.style.cursor = "pointer"; }}
                onPointerOut={()  => { setHovered(false);  setPressed(false); document.body.style.cursor = "default"; }}
                onPointerDown={e => { e.stopPropagation(); setPressed(true);  onPopup(skill); }}
                onPointerUp={()   => setPressed(false)}
                castShadow receiveShadow
            >
                <roundedBoxGeometry args={[KEY_SIZE - 0.02, 0.11, KEY_SIZE - 0.02, 4, 0.035]} />
                <meshStandardMaterial
                    color={hovered ? color.clone().multiplyScalar(1.22) : color}
                    roughness={0.30} metalness={0.06}
                    envMapIntensity={hovered ? 1.8 : 1.0}
                />
            </mesh>
            <Html position={[0, KEYCAP_TOP + 0.09, 0]} center distanceFactor={4}
                style={{ pointerEvents: "none", userSelect: "none" }} transform occlude={false}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: KEY_SIZE * 80 }}>
                    {skill.icon && !imgErr ? (
                        <img src={ICON(skill.icon)} alt={skill.name} draggable={false}
                            style={{ width: 24, height: 24, objectFit: "contain" }}
                            onError={() => setImgErr(true)} />
                    ) : (
                        <div style={{ width: 24, height: 24, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.8)", fontFamily: "monospace" }}>
                            {skill.label.slice(0, 2)}
                        </div>
                    )}
                    <span style={{ fontSize: 7.5, fontWeight: 800, color: "rgba(255,255,255,0.92)", textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'Courier New',monospace", textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>
                        {skill.label}
                    </span>
                </div>
            </Html>
        </group>
    );
}

/* -- Keyboard base -- */
function KeyboardChassis({ cols, rows }) {
    const w = cols * (KEY_SIZE + KEY_GAP) - KEY_GAP;
    const d = rows * (KEY_SIZE + KEY_GAP) - KEY_GAP;
    return (
        <group>
            <RoundedBox args={[w + CHASSIS_PAD * 2, CHASSIS_HEIGHT, d + CHASSIS_PAD * 2]}
                radius={0.10} smoothness={5}
                position={[0, CHASSIS_HEIGHT / 2 - 0.06, 0]} castShadow receiveShadow>
                <meshStandardMaterial color="#181820" roughness={0.68} metalness={0.18} envMapIntensity={0.6} />
            </RoundedBox>
            <RoundedBox args={[w + 0.06, 0.04, d + 0.06]}
                radius={0.05} smoothness={4}
                position={[0, CHASSIS_HEIGHT - 0.035, 0]} receiveShadow>
                <meshStandardMaterial color="#0c0c14" roughness={0.97} metalness={0} />
            </RoundedBox>
            <mesh position={[0, CHASSIS_HEIGHT, 0]}>
                <boxGeometry args={[w + CHASSIS_PAD * 2 - 0.02, 0.004, d + CHASSIS_PAD * 2 - 0.02]} />
                <meshStandardMaterial color="#28283a" roughness={0.45} metalness={0.25} transparent opacity={0.55} />
            </mesh>
        </group>
    );
}

/* -- Full keyboard -- */
function KeyboardScene({ skills, onPopup }) {
    const groupRef = useRef();

    const paddedSkills = useMemo(() => {
        const arr = [...skills];
        while (arr.length % COLS !== 0)
            arr.push({ name: "", label: "", color: "#181820", icon: null, desc: "", prof: 0, _empty: true });
        return arr;
    }, [skills]);

    const numRows = Math.ceil(paddedSkills.length / COLS);
    const kbW = COLS    * (KEY_SIZE + KEY_GAP) - KEY_GAP;
    const kbD = numRows * (KEY_SIZE + KEY_GAP) - KEY_GAP;
    const startX = -(kbW / 2) + KEY_SIZE / 2;
    const startZ = -(kbD / 2) + KEY_SIZE / 2;

    return (
        <group ref={groupRef} position={[0, 0, 0]} rotation={[-0.25, 0, 0]} scale={[1.85, 1.85, 1.85]}>
            <KeyboardChassis cols={COLS} rows={numRows} />
            {paddedSkills.map((skill, i) => {
                if (skill._empty) return null;
                const col = i % COLS;
                const row = Math.floor(i / COLS);
                const x   = startX + col * (KEY_SIZE + KEY_GAP);
                const z   = startZ + row * (KEY_SIZE + KEY_GAP);
                return (
                    <Key3D
                        key={`${row}-${col}-${skill.name}`}
                        skill={skill}
                        position={[x, 0, z]}
                        onPopup={onPopup}
                    />
                );
            })}
        </group>
    );
}

/* -- Popup card -- */
function PopupCard({ skill, onClose }) {
    if (!skill) return null;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.82, y: 20 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 1000, width: 300, backgroundColor: "#111118", border: `1px solid ${skill.color}55`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, boxShadow: `0 0 60px ${skill.color}22,0 30px 80px rgba(0,0,0,0.6)`, cursor: "pointer" }}
            onClick={onClose}
        >
            <div style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: skill.color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${skill.color}44` }}>
                {skill.icon ? <img src={ICON(skill.icon)} alt={skill.name} draggable={false} style={{ width: 36, height: 36, objectFit: "contain" }} /> : <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "monospace" }}>{skill.label}</span>}
            </div>
            <div style={{ textAlign: "center" }}>
                <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{skill.name}</div>
                <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{skill.desc}</div>
            </div>
            <div style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "#555", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>Proficiency</span>
                    <span style={{ color: skill.color, fontSize: 13, fontWeight: 700 }}>{skill.prof}%</span>
                </div>
                <div style={{ width: "100%", height: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${skill.prof}%` }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${skill.color},${skill.color}88)` }} />
                </div>
            </div>
            <span style={{ fontSize: 11, color: "#444" }}>click to close</span>
        </motion.div>
    );
}

/* -- drag cursor -- */
function DragCursor() {
    const { gl } = useThree();
    useEffect(() => {
        const el = gl.domElement;
        const dn = () => { el.style.cursor = "grabbing"; };
        const up = () => { el.style.cursor = "grab"; };
        el.addEventListener("pointerdown", dn);
        el.addEventListener("pointerup",   up);
        return () => { el.removeEventListener("pointerdown", dn); el.removeEventListener("pointerup", up); };
    }, [gl]);
    return null;
}

/* -- Zoom controller -- */
function ZoomController({ zoomLevel }) {
    const { camera } = useThree();

    useFrame(() => {
        const targetFov = 58 / zoomLevel;
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.1);
        camera.updateProjectionMatrix();
    });

    return null;
}

/* -- Main export -- */
export default function Skills({ items = [], loading = false }) {
    const [activeSkill, setActiveSkill] = useState(null);

    const [zoomLevel, setZoomLevel] = useState(0.8);

    const mappedSkills = useMemo(() => {
        let raw;
        if (items?.length > 0) {
            raw = items.map(mapSkill);
        } else {
            raw = Object.entries(visualMap).map(([, v]) => ({
                name: v.label, label: v.label, color: v.color,
                icon: v.icon,  desc: v.desc,  prof: v.prof,
            }));
        }
        /* Deduplicate by name */
        const seen = new Set();
        return raw.filter((s) => {
            if (seen.has(s.name)) return false;
            seen.add(s.name);
            return true;
        });
    }, [items]);

    return (
        <section id="skills" style={{
            position: "relative", minHeight: "100vh",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            backgroundColor: "#000",
            overflow: "visible",
            padding: 0,
        }}>
            <div style={{
                position: "absolute", top: "40%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: 800, height: 600, borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, rgba(180,160,255,0.06) 20%, rgba(80,60,180,0.04) 40%, transparent 65%)",
                pointerEvents: "none", filter: "blur(50px)", zIndex: 0,
            }} />
            <div style={{
                position: "absolute", top: "55%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: 600, height: 400, borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(255,200,150,0.06) 0%, rgba(200,150,100,0.03) 30%, transparent 60%)",
                pointerEvents: "none", filter: "blur(40px)", zIndex: 0,
            }} />

            {/* title */}
            <Parallax speed={-0.1}>
                <ScrollAnimate animation="fadeUp" delay={0.1} duration={0.9}>
                    <div style={{ textAlign: "center", marginBottom: "0.5rem", position: "relative", zIndex: 2 }}>
                        <h2 style={{ fontSize: "clamp(2.5rem,5vw,3.5rem)", fontWeight: 900, color: "#ccc", fontFamily: "'Courier New',monospace", letterSpacing: 12, textTransform: "uppercase", margin: 0, textShadow: "0 2px 0 #999,0 4px 0 #777,0 6px 12px rgba(0,0,0,0.4)" }}>
                            Skills
                        </h2>
                        <p style={{ fontSize: 14, color: "#555", letterSpacing: 4, textTransform: "uppercase", marginTop: 8, fontFamily: "'Courier New',monospace" }}>
                            Technologies & Tools
                        </p>
                        <p style={{ fontSize: 12, color: "#999", letterSpacing: "0.1em", fontFamily: "'Courier New',monospace", marginTop: 6, userSelect: "none", textShadow: "0 1px 6px rgba(0,0,0,0.9), 0 0 20px rgba(200,160,255,0.15)" }}>
                            Hold & drag to rotate · right-click + drag to pan
                        </p>
                    </div>
                </ScrollAnimate>
            </Parallax>

            {/* canvas */}
            <div style={{
                width: "100vw",
                marginLeft: "calc(50% - 50vw)",
                height: "76vh",
                minHeight: "500px",
                position: "relative",
                zIndex: 1,
                cursor: "grab",
            }}>
                <Canvas
                    shadows
                    camera={{ position: [0, 3.5, 6.5], fov: 55, near: 0.1, far: 100 }}
                    gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
                    style={{ width: "100%", height: "100%", background: "transparent" }}
                >
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.45} color="#b8c4ff" />
                        <directionalLight position={[5, 9, 5]} intensity={2.0} color="#ffffff" castShadow
                            shadow-mapSize-width={2048} shadow-mapSize-height={2048}
                            shadow-camera-far={40} shadow-camera-left={-14} shadow-camera-right={14}
                            shadow-camera-top={14} shadow-camera-bottom={-14} shadow-bias={-0.001} />
                        <directionalLight position={[-4, 5, -3]} intensity={0.45} color="#8090ff" />
                        <pointLight position={[0, 4, 2]} intensity={0.35} color="#c8a0ff" />

                        <spotLight
                            position={[0, 8, 0]}
                            angle={0.45}
                            penumbra={0.6}
                            intensity={3.5}
                            color="#ffffff"
                            castShadow={false}
                            distance={20}
                            decay={1.5}
                        />
                        <spotLight
                            position={[0, 3, -6]}
                            angle={0.5}
                            penumbra={0.8}
                            intensity={1.2}
                            color="#ff9060"
                            distance={15}
                            decay={2}
                        />

                        <KeyboardScene skills={mappedSkills} onPopup={setActiveSkill} />

                        <ContactShadows position={[0, -1.5, 0]} opacity={0.55} scale={30} blur={4} far={10} color="#000020" />
                        <Environment preset="night" />
                        <ZoomController zoomLevel={zoomLevel} />
                        <OrbitControls
                            makeDefault
                            enableDamping
                            dampingFactor={0.06}
                            rotateSpeed={0.55}
                            enableZoom={false}
                            panSpeed={0.6}
                            minPolarAngle={0.2}
                            maxPolarAngle={Math.PI / 1.6}
                            target={[0, 0, 0]}
                        />
                        <DragCursor />
                    </Suspense>
                </Canvas>
            </div>

            {/* -- Zoom slider -- */}
            <style>{`
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none;
                    width: 14px; height: 14px; border-radius: 50%;
                    background: #c8a0ff; cursor: pointer;
                    border: 2px solid rgba(255,255,255,0.2);
                    box-shadow: 0 0 8px rgba(200,160,255,0.4);
                }
                input[type="range"]::-moz-range-thumb {
                    width: 14px; height: 14px; border-radius: 50%;
                    background: #c8a0ff; cursor: pointer;
                    border: 2px solid rgba(255,255,255,0.2);
                    box-shadow: 0 0 8px rgba(200,160,255,0.4);
                }
            `}</style>
            <ScrollAnimate animation="fadeUp" delay={0.25} duration={0.7}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    marginTop: 14, position: "relative", zIndex: 2,
                }}>
                    <span style={{ fontSize: 10, color: "#555", fontFamily: "'Courier New',monospace", letterSpacing: 1, userSelect: "none" }}>-</span>
                    <input
                        type="range"
                        min="0.5"
                        max="3.5"
                        step="0.05"
                        value={zoomLevel}
                        onChange={e => setZoomLevel(parseFloat(e.target.value))}
                        style={{
                            width: 120, height: 4, appearance: "none", WebkitAppearance: "none",
                            background: `linear-gradient(to right, #c8a0ff ${((zoomLevel - 0.5) / (3.5 - 0.5)) * 100}%, rgba(255,255,255,0.08) ${((zoomLevel - 0.5) / (3.5 - 0.5)) * 100}%)`,
                            borderRadius: 2, outline: "none", cursor: "pointer",
                        }}
                    />
                    <span style={{ fontSize: 10, color: "#555", fontFamily: "'Courier New',monospace", letterSpacing: 1, userSelect: "none" }}>+</span>
                    <span style={{ fontSize: 10, color: "#666", fontFamily: "'Courier New',monospace", minWidth: 32, textAlign: "center", userSelect: "none" }}>
                        {Math.round(zoomLevel * 100)}%
                    </span>
                </div>
            </ScrollAnimate>

            <AnimatePresence>
                {activeSkill && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 999 }}
                            onClick={() => setActiveSkill(null)} />
                        <PopupCard skill={activeSkill} onClose={() => setActiveSkill(null)} />
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
