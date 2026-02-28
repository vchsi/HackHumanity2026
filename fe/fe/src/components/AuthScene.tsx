import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function LowPolyLock() {
    return (
        <group position={[0.4, -0.4, 0.1]} scale={0.8} rotation={[0.1, 0, 0.2]}>
            {/* Lock Body - Fall Orange */}
            <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[0.5, 0.4, 0.15]} />
                <meshStandardMaterial color="#D9734E" roughness={0.7} metalness={0.2} />
            </mesh>

            {/* Keyhole - Dark Brown */}
            <mesh position={[0, -0.2, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
                <meshStandardMaterial color="#4A3424" roughness={0.9} />
            </mesh>
            <mesh position={[0, -0.28, 0.08]}>
                <boxGeometry args={[0.06, 0.12, 0.02]} />
                <meshStandardMaterial color="#4A3424" roughness={0.9} />
            </mesh>

            {/* Silver/Steel Shackle */}
            <mesh position={[0, 0.05, 0]}>
                <torusGeometry args={[0.15, 0.05, 16, 32, Math.PI]} />
                <meshStandardMaterial color="#A8A29E" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Shackle Legs */}
            <mesh position={[-0.15, -0.05, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
                <meshStandardMaterial color="#A8A29E" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0.15, -0.05, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
                <meshStandardMaterial color="#A8A29E" metalness={0.6} roughness={0.4} />
            </mesh>
        </group>
    );
}

function MiniDocument() {
    return (
        <group rotation={[-0.15, 0.15, 0]}>
            {/* Front Side */}
            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[1.6, 2.2]} />
                <meshStandardMaterial color="#FAF1EB" roughness={0.9} />
            </mesh>

            {/* Back Side */}
            <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[1.6, 2.2]} />
                <meshStandardMaterial color="#FAF1EB" roughness={0.9} />
            </mesh>

            {/* Document Headers / Lines to match SaaS theme */}
            <mesh position={[0, 0.8, 0.02]}>
                <planeGeometry args={[1.3, 0.15]} />
                <meshStandardMaterial color="#5A4231" roughness={0.9} />
            </mesh>

            <mesh position={[0, 0.5, 0.02]}>
                <planeGeometry args={[1.3, 0.06]} />
                <meshStandardMaterial color="#8A6B53" roughness={0.9} />
            </mesh>

            <mesh position={[-0.15, 0.35, 0.02]}>
                <planeGeometry args={[1.0, 0.06]} />
                <meshStandardMaterial color="#8A6B53" roughness={0.9} />
            </mesh>

            <mesh position={[0.05, 0.2, 0.02]}>
                <planeGeometry args={[1.2, 0.06]} />
                <meshStandardMaterial color="#8A6B53" roughness={0.9} />
            </mesh>
        </group>
    );
}

export default function AuthScene() {
    return (
        <div className="absolute inset-0 z-10 bg-[#F2E3D5] flex items-center justify-center overflow-hidden">
            <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[3, 5, 2]} intensity={1.5} castShadow />

                <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
                    <MiniDocument />
                    <LowPolyLock />
                </Float>
            </Canvas>
            {/* Soft radial overlay so the 3D model looks cleanly nested without harsh edges */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#F2E3D5_100%)] pointer-events-none" />
        </div>
    );
}
