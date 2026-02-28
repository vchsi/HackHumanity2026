import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function LeasePaper() {
    // A tiny procedural texture that looks like contact lines for housing
    const texture = useMemo(() => {
        const w = 512, h = 512;
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        // Warm paper background to fit "fall warm chill" theme
        ctx.fillStyle = "#FAF1EB";
        ctx.fillRect(0, 0, w, h);

        // Deep brown "Lease Agreement" header bar
        ctx.fillStyle = "#5A4231";
        ctx.fillRect(40, 40, w - 80, 60);

        // lighter brown lines representing text paragraphs
        ctx.fillStyle = "#8A6B53";
        let y = 140;
        for (let i = 0; i < 12; i++) {
            const len = i % 3 === 0 ? 320 : 400;
            ctx.fillRect(60, y, len, 14);
            y += 32;
        }

        // highlights (risk / crucial terms signatures in fall orange) 
        ctx.fillStyle = "rgba(217, 115, 78, 0.35)"; // #D9734E with opacity
        ctx.fillRect(52, 260, 360, 34);
        ctx.fillStyle = "rgba(217, 115, 78, 0.20)";
        ctx.fillRect(52, 340, 360, 34);

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 4;
        tex.needsUpdate = true;
        return tex;
    }, []);

    return (
        <group rotation={[-0.15, 0.2, 0]}>
            {/* Front side showing the text */}
            <mesh position={[0, 0, 0.001]}>
                <planeGeometry args={[1.8, 2.3]} />
                <meshStandardMaterial map={texture} roughness={0.9} metalness={0.0} />
            </mesh>
            {/* Back side showing plain white/warm paper */}
            <mesh position={[0, 0, -0.001]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[1.8, 2.3]} />
                <meshStandardMaterial color="#FAF1EB" roughness={0.9} metalness={0.0} />
            </mesh>
        </group>
    );
}

function Lens() {
    const g = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (!g.current) return;

        // scanning motion over the "contract"
        g.current.position.x = Math.sin(t * 0.8) * 0.55;
        g.current.position.y = 0.1 + Math.sin(t * 0.6) * 0.08;
        g.current.rotation.z = -0.35 + Math.sin(t * 0.5) * 0.08;
    });

    return (
        <group ref={g} position={[0.3, -0.2, 0.35]}>
            {/* ring (dark brown) */}
            <mesh>
                <torusGeometry args={[0.38, 0.05, 24, 64]} />
                <meshStandardMaterial color="#4A3424" metalness={0.3} roughness={0.4} />
            </mesh>

            {/* glass */}
            <mesh position={[0, 0, 0.03]}>
                <circleGeometry args={[0.33, 64]} />
                <meshPhysicalMaterial
                    transparent
                    opacity={0.35}
                    roughness={0.1}
                    metalness={0.0}
                    transmission={0.9}
                    thickness={0.4}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* handle (light brown) - Rotated and positioned to correctly attach tangentially */}
            <mesh position={[0.59, -0.59, 0]} rotation={[0, 0, 0.785]}>
                <cylinderGeometry args={[0.06, 0.06, 0.9, 24]} />
                <meshStandardMaterial color="#8A6B53" roughness={0.5} />
            </mesh>

            {/* fall orange accent tip */}
            <mesh position={[0.83, -0.83, 0]} rotation={[0, 0, 0.785]}>
                <cylinderGeometry args={[0.07, 0.07, 0.22, 24]} />
                <meshStandardMaterial color="#D9734E" roughness={0.4} />
            </mesh>
        </group>
    );
}

export default function LeaseScene() {
    return (
        <div className="absolute inset-0 z-10 bg-[#F2E3D5]">
            <Canvas camera={{ position: [0, 0.3, 3.2], fov: 45 }}>
                <ambientLight intensity={0.9} />
                <directionalLight position={[3, 3, 3]} intensity={1.2} />
                <Float speed={1} rotationIntensity={0.35} floatIntensity={0.5}>
                    <LeasePaper />
                    <Lens />
                </Float>
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    );
}
