import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

interface CelestialDome3DProps {
  sunAzimuth: number;
  sunElevation: number;
  compassHeading: number;
}

function Sun({ azimuth, elevation }: { azimuth: number; elevation: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const azRad = (azimuth - 90) * (Math.PI / 180);
  const elRad = elevation * (Math.PI / 180);
  const radius = 4;
  
  const x = radius * Math.cos(elRad) * Math.sin(azRad);
  const y = radius * Math.sin(elRad);
  const z = radius * Math.cos(elRad) * Math.cos(azRad);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={[x, y, z]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#ffdd00" />
      </mesh>
      <pointLight color="#ffdd00" intensity={2} distance={10} />
    </group>
  );
}

function Horizon() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <ringGeometry args={[3.9, 5, 64]} />
      <meshBasicMaterial color="#00d4ff" opacity={0.3} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function CompassRose({ heading }: { heading: number }) {
  const directions = [
    { label: 'N', angle: 0 },
    { label: 'E', angle: 90 },
    { label: 'S', angle: 180 },
    { label: 'W', angle: 270 }
  ];

  return (
    <group rotation={[0, -heading * (Math.PI / 180), 0]}>
      {directions.map(({ label, angle }) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const x = 4.5 * Math.sin(rad);
        const z = 4.5 * Math.cos(rad);
        
        return (
          <Text
            key={label}
            position={[x, 0.1, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.4}
            color={label === 'N' ? '#ff3366' : '#00d4ff'}
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        );
      })}
    </group>
  );
}

function DomeGrid() {
  const lines: JSX.Element[] = [];
  
  for (let el = 15; el <= 75; el += 15) {
    const radius = 4 * Math.cos(el * (Math.PI / 180));
    const y = 4 * Math.sin(el * (Math.PI / 180));
    
    lines.push(
      <mesh key={`el-${el}`} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.01, radius + 0.01, 64]} />
        <meshBasicMaterial color="#00d4ff" opacity={0.15} transparent />
      </mesh>
    );
  }

  for (let az = 0; az < 360; az += 30) {
    const rad = az * (Math.PI / 180);
    const points: [number, number, number][] = [];
    
    for (let el = 0; el <= 90; el += 5) {
      const elRad = el * (Math.PI / 180);
      const x = 4 * Math.cos(elRad) * Math.sin(rad);
      const y = 4 * Math.sin(elRad);
      const z = 4 * Math.cos(elRad) * Math.cos(rad);
      points.push([x, y, z]);
    }
    
    lines.push(
      <Line
        key={`az-${az}`}
        points={points}
        color="#00d4ff"
        lineWidth={1}
        opacity={0.15}
        transparent
      />
    );
  }

  return <>{lines}</>;
}

export function CelestialDome3D({ sunAzimuth, sunElevation, compassHeading }: CelestialDome3DProps) {
  return (
    <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.1} />
      
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      
      <DomeGrid />
      <Horizon />
      <CompassRose heading={compassHeading} />
      <Sun azimuth={sunAzimuth} elevation={sunElevation} />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
