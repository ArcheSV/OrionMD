import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const Stars: React.FC = () => {
    const ref = useRef<any>();

    const [sphere] = useState(() =>
        random.inSphere(new Float32Array(5000), { radius: 1.5 })
    );
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 20;
            ref.current.rotation.y -= delta / 30;
            const targetRotationY = state.mouse.x * 0.2;
            const targetRotationX = state.mouse.y * 0.2;
            ref.current.rotation.y += (targetRotationY - ref.current.rotation.y) * 0.02;
            ref.current.rotation.x += (targetRotationX - ref.current.rotation.x) * 0.02;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const Background3D: React.FC = () => {
    return (
        <div id="canvas-container">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars />
            </Canvas>
        </div>
    );
};

export default Background3D;