import React, { useEffect, useMemo, useRef, useState } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function RobotModel() {
  const groupRef = useRef<THREE.Group>(null!);
  const leftEyeRef = useRef<THREE.Mesh>(null!);
  const rightEyeRef = useRef<THREE.Mesh>(null!);
  const chestGlowRef = useRef<THREE.Mesh>(null!);

  const metalDark = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0d2240",
        metalness: 0.92,
        roughness: 0.08,
      }),
    [],
  );
  const metalMid = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a3a5c",
        metalness: 0.88,
        roughness: 0.12,
      }),
    [],
  );
  const metalLight = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1e4a72",
        metalness: 0.8,
        roughness: 0.18,
      }),
    [],
  );
  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2a5080",
        metalness: 0.95,
        roughness: 0.05,
      }),
    [],
  );
  const darkPanel = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#050f1f",
        metalness: 0.7,
        roughness: 0.3,
      }),
    [],
  );

  const sphereSegments = 12;

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.25;
      groupRef.current.position.y = -0.45 + Math.sin(elapsed * 0.55) * 0.12;
    }
    const eyeIntensity = Math.sin(elapsed * 2) * 0.5 + 2.5;
    if (leftEyeRef.current) {
      (leftEyeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        eyeIntensity;
    }
    if (rightEyeRef.current) {
      (rightEyeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        eyeIntensity;
    }
    if (chestGlowRef.current) {
      (chestGlowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        Math.sin(elapsed * 1.2) * 0.4 + 1.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.45, 0]} scale={[0.92, 0.92, 0.92]}>
      <mesh position={[0, 2.0, 0]} material={metalMid}>
        <boxGeometry args={[0.82, 0.78, 0.62]} />
      </mesh>
      <mesh position={[0, 2.28, 0.27]} material={darkPanel}>
        <boxGeometry args={[0.7, 0.14, 0.12]} />
      </mesh>
      <mesh position={[-0.22, 2.06, 0.32]} material={darkPanel}>
        <boxGeometry args={[0.26, 0.22, 0.05]} />
      </mesh>
      <mesh position={[0.22, 2.06, 0.32]} material={darkPanel}>
        <boxGeometry args={[0.26, 0.22, 0.05]} />
      </mesh>
      <mesh ref={leftEyeRef} position={[-0.22, 2.06, 0.36]}>
        <sphereGeometry args={[0.085, sphereSegments, sphereSegments]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00aaff"
          emissiveIntensity={3}
        />
      </mesh>
      <pointLight
        position={[-0.22, 2.06, 0.6]}
        color="#00d4ff"
        intensity={1.2}
        distance={1.5}
      />
      <mesh ref={rightEyeRef} position={[0.22, 2.06, 0.36]}>
        <sphereGeometry args={[0.085, sphereSegments, sphereSegments]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00aaff"
          emissiveIntensity={3}
        />
      </mesh>
      <pointLight
        position={[0.22, 2.06, 0.6]}
        color="#00d4ff"
        intensity={1.2}
        distance={1.5}
      />
      <mesh position={[0, 1.74, 0.32]} material={darkPanel}>
        <boxGeometry args={[0.5, 0.08, 0.04]} />
      </mesh>
      <mesh position={[-0.1, 1.74, 0.35]}>
        <boxGeometry args={[0.12, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#f47b20"
          emissive="#f47b20"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0.1, 1.74, 0.35]}>
        <boxGeometry args={[0.12, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#3bbfbf"
          emissive="#3bbfbf"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[-0.46, 1.98, 0.0]} material={chromeMat}>
        <boxGeometry args={[0.1, 0.5, 0.42]} />
      </mesh>
      <mesh position={[0.46, 1.98, 0.0]} material={chromeMat}>
        <boxGeometry args={[0.1, 0.5, 0.42]} />
      </mesh>
      <mesh position={[0, 2.56, 0]} material={metalLight}>
        <cylinderGeometry args={[0.025, 0.025, 0.36, 8]} />
      </mesh>
      <mesh position={[0, 2.76, 0]}>
        <sphereGeometry args={[0.075, sphereSegments, sphereSegments]} />
        <meshStandardMaterial
          color="#f47b20"
          emissive="#f47b20"
          emissiveIntensity={3}
        />
      </mesh>
      <pointLight
        position={[0, 2.76, 0]}
        color="#f47b20"
        intensity={0.8}
        distance={1.0}
      />

      <mesh position={[0, 1.56, 0]} material={metalDark}>
        <cylinderGeometry args={[0.18, 0.22, 0.3, 12]} />
      </mesh>

      <mesh position={[0, 0.78, 0]} material={metalDark}>
        <boxGeometry args={[1.15, 1.38, 0.52]} />
      </mesh>
      <mesh position={[0, 0.78, 0.27]}>
        <boxGeometry args={[1.05, 1.28, 0.04]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.32, 0.29]}>
        <boxGeometry args={[0.85, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#f47b20"
          emissive="#f47b20"
          emissiveIntensity={1.8}
        />
      </mesh>
      <mesh position={[0, 0.78, 0.29]} material={darkPanel}>
        <boxGeometry args={[0.75, 0.78, 0.04]} />
      </mesh>
      <mesh ref={chestGlowRef} position={[0, 0.92, 0.33]}>
        <boxGeometry args={[0.32, 0.32, 0.025]} />
        <meshStandardMaterial
          color="#f47b20"
          emissive="#f47b20"
          emissiveIntensity={1.5}
        />
      </mesh>
      <pointLight
        position={[0, 0.92, 0.5]}
        color="#f47b20"
        intensity={1.5}
        distance={1.5}
      />
      {([-0.2, -0.07, 0.07, 0.2] as const).map((x) => (
        <mesh key={x} position={[x, 0.46, 0.33]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial
            color={x < 0 ? "#3bbfbf" : "#f47b20"}
            emissive={x < 0 ? "#3bbfbf" : "#f47b20"}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
      {([0, 0.1, 0.2] as const).map((y) => (
        <mesh key={y} position={[-0.62, 0.6 + y, 0.1]} material={metalLight}>
          <boxGeometry args={[0.08, 0.05, 0.3]} />
        </mesh>
      ))}
      {([0, 0.1, 0.2] as const).map((y) => (
        <mesh key={`r${y}`} position={[0.62, 0.6 + y, 0.1]} material={metalLight}>
          <boxGeometry args={[0.08, 0.05, 0.3]} />
        </mesh>
      ))}

      <mesh position={[-0.78, 1.28, 0]}>
        <sphereGeometry args={[0.24, sphereSegments, sphereSegments]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.78, 1.28, 0]}>
        <sphereGeometry args={[0.24, sphereSegments, sphereSegments]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh position={[-0.82, 0.62, 0]} material={metalMid}>
        <boxGeometry args={[0.3, 0.9, 0.28]} />
      </mesh>
      <mesh position={[-0.82, 0.62, 0.15]}>
        <boxGeometry args={[0.24, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#f47b20"
          emissive="#f47b20"
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[0.82, 0.62, 0]} material={metalMid}>
        <boxGeometry args={[0.3, 0.9, 0.28]} />
      </mesh>
      <mesh position={[0.82, 0.62, 0.15]}>
        <boxGeometry args={[0.24, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#3bbfbf"
          emissive="#3bbfbf"
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[-0.82, 0.04, 0]} material={metalDark}>
        <boxGeometry args={[0.26, 0.42, 0.24]} />
      </mesh>
      <mesh position={[0.82, 0.04, 0]} material={metalDark}>
        <boxGeometry args={[0.26, 0.42, 0.24]} />
      </mesh>
      <mesh position={[-0.82, -0.24, 0]} material={chromeMat}>
        <boxGeometry args={[0.28, 0.2, 0.22]} />
      </mesh>
      <mesh position={[0.82, -0.24, 0]} material={chromeMat}>
        <boxGeometry args={[0.28, 0.2, 0.22]} />
      </mesh>

      <mesh position={[0, -0.22, 0]} material={metalDark}>
        <boxGeometry args={[0.9, 0.38, 0.46]} />
      </mesh>
      <mesh position={[-0.28, -0.82, 0]} material={metalMid}>
        <boxGeometry args={[0.3, 0.78, 0.32]} />
      </mesh>
      <mesh position={[0.28, -0.82, 0]} material={metalMid}>
        <boxGeometry args={[0.3, 0.78, 0.32]} />
      </mesh>
      <mesh position={[-0.28, -0.5, 0.16]}>
        <sphereGeometry args={[0.1, sphereSegments, sphereSegments]} />
        <meshStandardMaterial
          color="#2a5080"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      <mesh position={[0.28, -0.5, 0.16]}>
        <sphereGeometry args={[0.1, sphereSegments, sphereSegments]} />
        <meshStandardMaterial
          color="#2a5080"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      <mesh position={[-0.28, -1.28, 0.04]} material={metalDark}>
        <boxGeometry args={[0.34, 0.2, 0.42]} />
      </mesh>
      <mesh position={[0.28, -1.28, 0.04]} material={metalDark}>
        <boxGeometry args={[0.34, 0.2, 0.42]} />
      </mesh>
    </group>
  );
}

function SceneReady({ onReady }: { onReady?: () => void }) {
  const calledRef = useRef(false);
  useFrame(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    onReady?.();
  });
  return null;
}

type RobotSceneProps = {
  onReady?: () => void;
};

export default function RobotScene({ onReady }: RobotSceneProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setDpr(mobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.1, 6.0], fov: 36 }}
      style={{ background: "transparent" }}
      dpr={dpr}
      gl={{ alpha: true, antialias: !isMobile, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[2, 3, 2]}
        color="#4a90d9"
        intensity={1.6}
      />
      <pointLight
        position={[-2.5, 1, 3]}
        color="#f47b20"
        intensity={2.5}
        distance={9}
      />
      <pointLight
        position={[3, 2.5, 1]}
        color="#00d4ff"
        intensity={2}
        distance={7}
      />
      <pointLight
        position={[0, -1, 2]}
        color="#1a3a5c"
        intensity={0.8}
        distance={5}
      />
      <React.Suspense fallback={null}>
        <RobotModel />
        <Environment preset="night" />
      </React.Suspense>
      <SceneReady onReady={onReady} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}
