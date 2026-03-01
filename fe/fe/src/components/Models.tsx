import { useGLTF } from '@react-three/drei'

export default function Models() {
    // These will look for lease.glb and len.glb in your /public folder.
    // Note: Place lease.glb and len.glb in the public/ directory!
    const leaseModel = useGLTF('/lease.glb')
    const lenModel = useGLTF('/len.glb')

    return (
        <group>
            {/* Position the 'lease' model a bit to the left */}
            <primitive object={leaseModel.scene} position={[-1.5, 0, 0]} scale={1.5} />
            {/* Position the 'len' model a bit to the right */}
            <primitive object={lenModel.scene} position={[1.5, 0, 0]} scale={1.5} />
        </group>
    )
}
