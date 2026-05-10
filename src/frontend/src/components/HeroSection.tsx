import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { ArrowRight, BookOpen, Building2, Package, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { AdminBanner } from "../types/admin";

// ─── Trust Badges & Benefits ───────────────────────────────────────────────


const benefits = [
  {
    icon: Zap,
    title: "Easy Learning",
    desc: "Step-by-step guides for every skill level",
    color: "#3BBFBF",
  },
  {
    icon: Package,
    title: "Affordable Labs",
    desc: "Flexible pricing for every school budget",
    color: "#F47B20",
  },
  {
    icon: Building2,
    title: "School Support",
    desc: "Dedicated training and curriculum alignment",
    color: "#3BBFBF",
  },
  {
    icon: BookOpen,
    title: "Complete Solutions",
    desc: "Hardware, software, curriculum — all included",
    color: "#F47B20",
  },
];

// ─── Cinematic Video Background ────────────────────────────────────────────

function CinematicBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Base dark navy */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 0%, oklch(0.12 0.06 243) 0%, oklch(0.08 0.04 243) 45%, oklch(0.10 0.03 243) 100%)",
        }}
      />
      {/* Cinematic sweep layer 1 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 20% 30%, oklch(0.38 0.14 243 / 0.55) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 75% 70%, oklch(0.22 0.08 195 / 0.40) 0%, transparent 55%)",
          backgroundSize: "200% 200%",
          animation: "cinematicSweep 18s ease-in-out infinite",
          willChange: "background-position",
        }}
      />
      {/* Cinematic sweep layer 2 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 45% at 80% 20%, oklch(0.58 0.14 48 / 0.22) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 15% 75%, oklch(0.28 0.08 220 / 0.30) 0%, transparent 60%)",
          backgroundSize: "220% 220%",
          animation: "cinematicSweep2 24s ease-in-out infinite",
          willChange: "background-position",
        }}
      />
      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(2, 6, 18, 0.52)" }}
      />
      {/* Subtle scan-line shimmer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ─── Particle System ───────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

function ParticleField({ count = 70 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  const COLORS = ["rgba(46,109,164,", "rgba(59,191,191,", "rgba(244,123,32,"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const makeParticle = (yOverride?: number): Particle => ({
      x: Math.random() * canvas.width,
      y: yOverride !== undefined ? yOverride : Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.5 + 0.15),
      size: Math.random() * 3 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2,
    });

    particlesRef.current = Array.from({ length: count }, () => makeParticle());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = particlesRef.current;

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.18;
            ctx.strokeStyle = `rgba(46,109,164,${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 2.5,
        );
        grad.addColorStop(0, `${p.color}${p.alpha})`);
        grad.addColorStop(1, `${p.color}0)`);
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) Object.assign(p, makeParticle(canvas.height + 10));
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
      tabIndex={-1}
      aria-label="decorative particle animation"
    />
  );
}

// ─── Shop Now Button with Ripple ───────────────────────────────────────────

function ShopNowButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label?: string;
}) {
  const [ripples, setRipples] = useState<number[]>([]);
  const rippleKey = useRef(0);

  const triggerRipple = () => {
    const key = ++rippleKey.current;
    setRipples((prev) => [...prev, key]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((k) => k !== key));
    }, 700);
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
      <Button
        size="lg"
        onClick={() => {
          triggerRipple();
          onClick();
        }}
        onMouseEnter={triggerRipple}
        className="relative text-white font-semibold text-base px-8 h-12 border-0 transition-smooth overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #F47B20 0%, #F5A623 100%)",
          boxShadow:
            "0 0 30px rgba(244,123,32,0.55), 0 4px 18px rgba(244,123,32,0.3)",
        }}
        data-ocid="hero-shop-btn"
      >
        {ripples.map((key, idx) => (
          <span
            key={key}
            className="absolute rounded-full pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              width: "60px",
              height: "60px",
              marginTop: "-30px",
              marginLeft: "-30px",
              background:
                idx % 3 === 0
                  ? "rgba(255,180,80,0.55)"
                  : idx % 3 === 1
                    ? "rgba(244,123,32,0.45)"
                    : "rgba(255,140,30,0.35)",
              animation: `${idx % 3 === 0 ? "rippleGlow" : idx % 3 === 1 ? "rippleGlow2" : "rippleGlow3"} 0.65s ease-out forwards`,
              animationDelay: `${idx * 0.08}s`,
            }}
          />
        ))}
        <span className="relative z-10 flex items-center">
          {label ?? "Shop Now"}
          <ArrowRight className="ml-2 w-4 h-4" />
        </span>
      </Button>
    </motion.div>
  );
}

// ─── 3D Robot Scene ────────────────────────────────────────────────────────

function RobotModel() {
  const groupRef = useRef<THREE.Group>(null!);
  const leftEyeRef = useRef<THREE.Mesh>(null!);
  const rightEyeRef = useRef<THREE.Mesh>(null!);
  const chestGlowRef = useRef<THREE.Mesh>(null!);

  const metalDark = new THREE.MeshStandardMaterial({
    color: "#0d2240",
    metalness: 0.92,
    roughness: 0.08,
  });
  const metalMid = new THREE.MeshStandardMaterial({
    color: "#1a3a5c",
    metalness: 0.88,
    roughness: 0.12,
  });
  const metalLight = new THREE.MeshStandardMaterial({
    color: "#1e4a72",
    metalness: 0.8,
    roughness: 0.18,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: "#2a5080",
    metalness: 0.95,
    roughness: 0.05,
  });
  const darkPanel = new THREE.MeshStandardMaterial({
    color: "#050f1f",
    metalness: 0.7,
    roughness: 0.3,
  });

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (groupRef.current) {

      // Robot Size Fixing
       groupRef.current.rotation.y = elapsed * 0.25;
      groupRef.current.position.y = -0.45 + Math.sin(elapsed * 0.55) * 0.12;
    }
    const eyeIntensity = Math.sin(elapsed * 2) * 0.5 + 2.5;
    if (leftEyeRef.current)
      (
        leftEyeRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = eyeIntensity;
    if (rightEyeRef.current)
      (
        rightEyeRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = eyeIntensity;
    if (chestGlowRef.current)
      (
        chestGlowRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = Math.sin(elapsed * 1.2) * 0.4 + 1.5;
  });

  return (
    <group ref={groupRef} position={[0, -0.45, 0]} scale={[0.92, 0.92, 0.92]}>
      {/* HEAD */}
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
        <sphereGeometry args={[0.085, 16, 16]} />
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
        <sphereGeometry args={[0.085, 16, 16]} />
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
        <sphereGeometry args={[0.075, 16, 16]} />
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

      {/* NECK */}
      <mesh position={[0, 1.56, 0]} material={metalDark}>
        <cylinderGeometry args={[0.18, 0.22, 0.3, 12]} />
      </mesh>

      {/* TORSO */}
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
        <mesh
          key={`r${y}`}
          position={[0.62, 0.6 + y, 0.1]}
          material={metalLight}
        >
          <boxGeometry args={[0.08, 0.05, 0.3]} />
        </mesh>
      ))}

      {/* SHOULDER PADS */}
      <mesh position={[-0.78, 1.28, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.78, 1.28, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ARMS */}
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

      {/* LEGS / LOWER TORSO */}
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
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial
          color="#2a5080"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      <mesh position={[0.28, -0.5, 0.16]}>
        <sphereGeometry args={[0.1, 12, 12]} />
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

function RobotScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 6.0], fov: 36 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[2, 3, 2]}
        color="#4a90d9"
        intensity={1.8}
        castShadow
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
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────

interface HeroSectionProps {
  onShopNow: () => void;
  onExploreLabs: () => void;
  banners?: AdminBanner[];
  loading?: boolean;
}

export function HeroSection({
  onShopNow,
  onExploreLabs,
  banners = [],
  loading = false,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : -40]);
  const robotY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : -80]);
  const bgOrbY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isMobile ? 0 : -120],
  );

  // Use first active hero-type banner if available
  // Only an active banner of type "banner" will override the default heading
  const heroBanner = !loading
    ? banners.find((b) => b.isActive && b.type === "banner")
    : undefined;

  const headline = heroBanner?.title ?? null;
  const subtext = heroBanner?.description ?? null;
  const ctaLabel = heroBanner?.ctaText ?? undefined;

  // Split headline into words for gradient treatment if banner provides one
  const headlineWords = headline ? headline.split(" ") : null;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col overflow-hidden pt-20 lg:pt-24"
    >
      <CinematicBackground />

      {/* ── Static depth gradient overlays ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 8% 30%, oklch(0.45 0.12 243 / 0.28) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 92% 40%, oklch(0.71 0.17 48 / 0.22) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 40% 45% at 25% 65%, oklch(0.70 0.13 195 / 0.14) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ── Floating parallax orbs ── */}
      <motion.div
        style={{ y: bgOrbY, zIndex: 1 }}
        className="absolute top-12 -left-16 pointer-events-none"
      >
        <div
          className="w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(46,109,164,0.22) 0%, transparent 70%)",
            filter: "blur(48px)",
          }}
        />
      </motion.div>
      <motion.div
        style={{ y: bgOrbY, zIndex: 1 }}
        className="absolute top-24 right-20 pointer-events-none"
      >
        <div
          className="w-64 h-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,191,191,0.14) 0%, transparent 70%)",
            filter: "blur(36px)",
          }}
        />
      </motion.div>
      <motion.div
        style={{ y: bgOrbY, zIndex: 1 }}
        className="absolute bottom-40 left-1/4 pointer-events-none"
      >
        <div
          className="w-72 h-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(244,123,32,0.12) 0%, transparent 70%)",
            filter: "blur(52px)",
          }}
        />
      </motion.div>

      {/* ── Particle field ── */}
      <ParticleField count={isMobile ? 35 : 70} />

      {/* ── Main content grid ── */}
      <div
        className="relative flex-1 flex items-center pt-24 pb-12 px-4"
        style={{ zIndex: 10 }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
            {/* LEFT: Text content */}
            <motion.div
              style={{ y: textY }}
              className="w-full lg:w-[55%] space-y-8"
            >
              {/* Brand badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Badge
                  className="border px-4 py-1.5 text-xs font-semibold tracking-widest uppercase"
                  style={{
                    background: "rgba(244,123,32,0.12)",
                    color: "#F5A623",
                    borderColor: "rgba(244,123,32,0.35)",
                  }}
                >
                  India's Best STEM Robotics Brand
                </Badge>
              </motion.div>

              {/* Headline — banner override or default */}
              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.12,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="font-display font-black leading-[1.02] tracking-tight"
              >
                {headlineWords ? (
                  headlineWords.map((word, idx) => (
                    <span
                      key={word}
                      className="block text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4.2rem]"
                      style={
                        idx === headlineWords.length - 1
                          ? {
                              background:
                                "linear-gradient(135deg, #F47B20 0%, #F5A623 50%, #FF6B35 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                              filter:
                                "drop-shadow(0 0 28px rgba(244,123,32,0.45))",
                            }
                          : {
                              color: "white",
                              textShadow: "0 2px 32px rgba(46,109,164,0.4)",
                            }
                      }
                    >
                      {word}
                    </span>
                  ))
                ) : (
                  <>
                    <span
                      className="block text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] text-white"
                      style={{ textShadow: "0 2px 32px rgba(46,109,164,0.4)" }}
                    >
                      Build.
                    </span>
                    <span
                      className="block text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] text-white"
                      style={{ textShadow: "0 2px 32px rgba(46,109,164,0.4)" }}
                    >
                      Code.
                    </span>
                    <span
                      className="block text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4.2rem]"
                      style={{
                        background:
                          "linear-gradient(135deg, #F47B20 0%, #F5A623 50%, #FF6B35 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 0 28px rgba(244,123,32,0.45))",
                      }}
                    >
                      Innovate.
                    </span>
                  </>
                )}
              </motion.h1>

              {/* Separator line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
                className="origin-left"
              >
                <div
                  className="h-px w-24"
                  style={{
                    background: "linear-gradient(90deg, #F47B20, transparent)",
                  }}
                />
              </motion.div>

              {/* Subheading — banner override or default */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="text-lg sm:text-xl leading-[1.8] max-w-[480px]"
                style={{ color: "rgba(255,255,255,0.88)" }}
              >
                {subtext ??
                  "Premium robotics kits and complete STEM lab solutions for schools, students, and makers. From first robot to full innovation center."}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.45,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2"
              >
                <ShopNowButton onClick={onShopNow} label={ctaLabel} />
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={onExploreLabs}
                    className="text-white bg-white/5 backdrop-blur-sm text-base px-8 h-12 transition-smooth hover:bg-white/12 hover:border-white/40"
                    style={{ borderColor: "rgba(255,255,255,0.2)" }}
                    data-ocid="hero-labs-btn"
                  >
                    Explore Labs
                  </Button>
                </motion.div>
              </motion.div>

              {/* Trust badges removed */}
            </motion.div>

            {/* RIGHT: 3D Robot Visual (desktop) */}
            <motion.div
              style={{ y: robotY }}
              className="hidden lg:flex w-full lg:w-[45%] items-center justify-center relative"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 1.0,
                  delay: 0.25,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative w-full max-w-[480px]"
              >
                <motion.div
                  animate={{ scale: [1.0, 1.08, 1.0] }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="absolute pointer-events-none"
                  style={{
                    inset: "-20px",
                    background:
                      "radial-gradient(circle, rgba(244,123,32,0.28) 0%, rgba(244,123,32,0.12) 40%, transparent 70%)",
                    filter: "blur(60px)",
                    zIndex: 0,
                  }}
                />
                <div
                  className="absolute pointer-events-none"
                  style={{
                    inset: "20px",
                    background:
                      "radial-gradient(circle, rgba(46,109,164,0.35) 0%, transparent 60%)",
                    filter: "blur(40px)",
                    zIndex: 0,
                  }}
                />
                <div
                  className="relative"
                  style={{
                    height: "680px",
                    zIndex: 1,
                    filter:
                      "drop-shadow(0 24px 64px rgba(244,123,32,0.18)) drop-shadow(0 8px 32px rgba(46,109,164,0.25))",
                  }}
                >
                  <React.Suspense
                    fallback={
                      <div className="flex items-center justify-center h-full">
                        <div
                          className="w-16 h-16 rounded-full animate-pulse"
                          style={{ background: "rgba(46,109,164,0.3)" }}
                        />
                      </div>
                    }
                  >
                    <RobotScene />
                  </React.Suspense>
                </div>

                <div
                  className="absolute pointer-events-none"
                  style={{
                    bottom: "40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "200px",
                    height: "20px",
                    background:
                      "radial-gradient(ellipse, rgba(244,123,32,0.35) 0%, transparent 70%)",
                    filter: "blur(10px)",
                    zIndex: 0,
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Mobile: 3D Robot (compact) */}
            <div className="flex lg:hidden w-full justify-center mt-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.85, delay: 0.5 }}
                className="relative w-full max-w-[300px]"
              >
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(244,123,32,0.22) 0%, transparent 70%)",
                    filter: "blur(30px)",
                    zIndex: 0,
                  }}
                />
                <div
                  style={{ height: "300px", position: "relative", zIndex: 1 }}
                >
                  <React.Suspense fallback={null}>
                    <RobotScene />
                  </React.Suspense>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Benefits strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.75 }}
        className="relative backdrop-blur-lg"
        style={{
          zIndex: 10,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(0,0,0,0.32)",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #2E6DA4 30%, #F47B20 70%, transparent 100%)",
            opacity: 0.55,
          }}
        />
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.85 + i * 0.08 }}
                className="flex items-start gap-3 text-left"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: `${benefit.color}18`,
                    border: `1px solid ${benefit.color}35`,
                    boxShadow: `0 0 8px ${benefit.color}20`,
                  }}
                >
                  <benefit.icon
                    className="w-4 h-4"
                    style={{ color: benefit.color }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    {benefit.title}
                  </p>
                  <p
                    className="text-xs leading-relaxed hidden sm:block"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {benefit.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
