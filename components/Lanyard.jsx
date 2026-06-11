"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Html, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ===== Simple Physics for Lanyard ===== */
function LanyardCard({ position = [0, 0, 0], gravity = [0, -40, 0], frontImage, backImage }) {
    const groupRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [flipped, setFlipped] = useState(false);

    // Simple spring physics
    const velocity = useRef(new THREE.Vector3());
    const targetRotation = useRef(new THREE.Euler());

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Apply gravity
        velocity.current.y += gravity[1] * delta;

        // Damping
        velocity.current.multiplyScalar(0.95);

        // Mouse influence when hovered
        if (hovered) {
            const mouse = state.mouse;
            targetRotation.current.x = mouse.y * 0.3;
            targetRotation.current.y = mouse.x * 0.3;
        } else {
            targetRotation.current.x = 0;
            targetRotation.current.y = flipped ? Math.PI : 0;
        }

        // Smooth rotation
        groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.1;
        groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.1;

        // Subtle swaying
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Lanyard string */}
            <mesh position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Lanyard clip */}
            <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[0.15, 0.1, 0.05]} />
                <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Card */}
            <group
                position={[0, -0.2, 0]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => setFlipped(!flipped)}
            >
                {/* Card body */}
                <mesh castShadow>
                    <boxGeometry args={[1.4, 0.9, 0.02]} />
                    <meshStandardMaterial
                        color={hovered ? "#2a2a3a" : "#1a1a2a"}
                        roughness={0.3}
                        metalness={0.1}
                    />
                </mesh>

                {/* Front face - image */}
                <Html
                    position={[0, 0, 0.02]}
                    center
                    style={{ pointerEvents: "none" }}
                    transform
                    occlude={false}
                >
                    <div style={{
                        width: 140,
                        height: 90,
                        borderRadius: 8,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: frontImage ? "transparent" : "linear-gradient(135deg, #1a1a2a, #2a2a3a)",
                    }}>
                        {frontImage ? (
                            <img
                                src={frontImage}
                                alt="Card front"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <div style={{
                                textAlign: "center",
                                color: "#888",
                                fontSize: 10,
                                fontFamily: "'Courier New', monospace",
                            }}>
                                <div style={{ fontSize: 24, marginBottom: 4 }}>📸</div>
                                <div>Dzaky Al Fauzy</div>
                                <div style={{ fontSize: 8, marginTop: 2 }}>Full-Stack Developer</div>
                            </div>
                        )}
                    </div>
                </Html>
            </group>
        </group>
    );
}

/* ===== Main Lanyard Component ===== */
export default function Lanyard({
    position = [0, 0, 20],
    gravity = [0, -40, 0],
    frontImage,
    backImage,
    className = "",
}) {
    return (
        <div className={className} style={{ width: "100%", height: "100%" }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[0, 2, 3]} intensity={0.5} color="#c8a0ff" />

                <LanyardCard
                    position={position}
                    gravity={gravity}
                    frontImage={frontImage}
                    backImage={backImage}
                />

                <Environment preset="night" />
            </Canvas>
        </div>
    );
}
