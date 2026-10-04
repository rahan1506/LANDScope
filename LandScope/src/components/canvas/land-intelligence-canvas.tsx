"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface LandIntelligenceCanvasProps {
  interactive?: boolean;
  intensity?: "subtle" | "medium" | "hero";
  className?: string;
  showCoordinates?: boolean;
}

export function LandIntelligenceCanvas({
  interactive = true,
  intensity = "subtle",
  className = "",
  showCoordinates = false,
}: LandIntelligenceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({
    lat: "22° 35' 18\" N",
    lng: "78° 57' 42\" E",
    alt: "528 km SSO",
    sat: "EOS-04 / RISAT-1A SAR",
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Scene & Deep Midnight Space Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, intensity === "hero" ? 0.012 : 0.022);

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 4, 42);
    camera.lookAt(0, 0, 0);

    // 3. High performance WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. Master Earth Group (positioned to the right on desktop for editorial hero balance)
    const earthGroup = new THREE.Group();
    earthGroup.position.set(isMobile ? 0 : 13.5, isMobile ? 0 : -0.5, 0);
    earthGroup.rotation.z = (23.44 * Math.PI) / 180; // Earth's true axial tilt
    scene.add(earthGroup);

    const globeRadius = intensity === "hero" ? 14 : 11.5;

    // 5. Load Real-World Earth Maps (Satellite Day & City Lights Night)
    const textureLoader = new THREE.TextureLoader();

    const earthMap = textureLoader.load("/earth-texture.jpg", () => {
      renderer.render(scene, camera);
    });
    const nightMap = textureLoader.load("/earth-night.jpg", () => {
      renderer.render(scene, camera);
    });

    earthMap.colorSpace = THREE.SRGBColorSpace;
    nightMap.colorSpace = THREE.SRGBColorSpace;

    // Real-World Earth Mesh with Day/Night Lighting
    const earthGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthMap,
      emissiveMap: nightMap,
      emissive: new THREE.Color(0x38bdf8),
      emissiveIntensity: 0.65,
      roughness: 0.65,
      metalness: 0.15,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    // Face Indian Subcontinent / Asia towards camera initially
    earthMesh.rotation.y = -Math.PI / 1.7;
    earthGroup.add(earthMesh);

    // 6. Luminous Atmospheric Fresnel Halo Glow
    const atmosphereGeo = new THREE.SphereGeometry(globeRadius * 1.025, 48, 48);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
          vec3 atmosphereColor = mix(vec3(0.23, 0.51, 0.96), vec3(0.22, 0.74, 0.97), vNormal.y * 0.5 + 0.5);
          gl_FragColor = vec4(atmosphereColor, intensity * 0.88);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphereMesh);

    // 7. Multi-Satellite Orbital Paths with Active Spacecraft Units
    const satelliteGroup = new THREE.Group();
    earthGroup.add(satelliteGroup);

    interface SatelliteOrbit {
      curve: THREE.EllipseCurve;
      tiltX: number;
      tiltZ: number;
      speed: number;
      satMesh: THREE.Mesh;
      trailMesh: THREE.Line;
    }

    const orbits: SatelliteOrbit[] = [];
    const orbitConfigs = [
      { a: globeRadius * 1.35, b: globeRadius * 1.25, tiltX: 0.85, tiltZ: 0.25, speed: 0.0035, color: 0x38bdf8 },
      { a: globeRadius * 1.62, b: globeRadius * 1.50, tiltX: -0.65, tiltZ: 0.45, speed: 0.0028, color: 0x60a5fa },
      { a: globeRadius * 1.95, b: globeRadius * 1.82, tiltX: 1.15, tiltZ: -0.35, speed: 0.0019, color: 0xf59e0b },
    ];

    orbitConfigs.forEach((cfg) => {
      // Orbit Ring
      const orbitCurve = new THREE.EllipseCurve(0, 0, cfg.a, cfg.b, 0, 2 * Math.PI, false, 0);
      const orbitPoints = orbitCurve.getPoints(120);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        orbitPoints.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.32,
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.rotation.x = cfg.tiltX;
      orbitLine.rotation.z = cfg.tiltZ;
      satelliteGroup.add(orbitLine);

      // Spacecraft Octahedron Unit
      const satGeo = new THREE.OctahedronGeometry(0.38, 0);
      const satMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satelliteGroup.add(satMesh);

      // Trailing Light Ribbon
      const trailGeo = new THREE.BufferGeometry();
      const trailPositions = new Float32Array(24 * 3);
      trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
      const trailMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.7,
      });
      const trailMesh = new THREE.Line(trailGeo, trailMat);
      satelliteGroup.add(trailMesh);

      orbits.push({
        curve: orbitCurve,
        tiltX: cfg.tiltX,
        tiltZ: cfg.tiltZ,
        speed: cfg.speed,
        satMesh,
        trailMesh,
      });
    });

    // 8. Directional Cosmic Sunlight & Atmospheric Azure Fill
    const sunLight = new THREE.DirectionalLight(0xe0f2fe, 2.4);
    sunLight.position.set(35, 18, 30);
    scene.add(sunLight);

    const blueFill = new THREE.DirectionalLight(0x2563eb, 1.4);
    blueFill.position.set(-30, -12, -20);
    scene.add(blueFill);

    const ambientLight = new THREE.AmbientLight(0x0a1628, 0.85);
    scene.add(ambientLight);

    // 9. Starfield Background Particles (Subtle cosmic background, zero blocky clusters)
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 120;
      starPositions[i + 1] = (Math.random() - 0.5) * 90;
      starPositions[i + 2] = (Math.random() - 0.5) * 90;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.2,
      transparent: true,
      opacity: 0.35,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 10. Mouse Parallax & Dynamic Resize
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 0.45;
      mouseY = y * 0.35;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // Adjust globe offset for responsiveness
      const mobile = w < 768;
      earthGroup.position.set(mobile ? 0 : 13.5, mobile ? 0 : -0.5, 0);
    };
    window.addEventListener("resize", handleResize);

    // Dynamic Coordinate Update Ticker
    let coordTick = 0;
    const coordInterval = setInterval(() => {
      coordTick++;
      const latOffset = (Math.sin(coordTick * 0.08) * 0.02).toFixed(4);
      const lngOffset = (Math.cos(coordTick * 0.08) * 0.02).toFixed(4);
      setCoords({
        lat: `22° 35' ${(18.2 + parseFloat(latOffset)).toFixed(1)}" N`,
        lng: `78° 57' ${(42.4 + parseFloat(lngOffset)).toFixed(1)}" E`,
        alt: `${(528 + Math.sin(coordTick * 0.1) * 3).toFixed(1)} km SSO`,
        sat: coordTick % 2 === 0 ? "EOS-04 / RISAT-1A SAR" : "CARTOSAT-3 HYPERSPECTRAL",
      });
    }, 2800);

    // 11. Animation Loop
    let animationFrameId: number;
    let orbitProgress = [0, 0.33, 0.66];

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        // Continuous Natural Earth Axial Rotation
        earthMesh.rotation.y += 0.0016;

        // Smooth Mouse Parallax Lerp
        targetRotY += (mouseX - targetRotY) * 0.04;
        targetRotX += (mouseY - targetRotX) * 0.04;

        earthGroup.rotation.x = targetRotX;
        earthGroup.position.y = (isMobile ? 0 : -0.5) - targetRotX * 1.5;

        // Update Satellite Positions along their Orbital Planes
        orbits.forEach((orbit, idx) => {
          orbitProgress[idx] += orbit.speed;
          const t = orbitProgress[idx] % 1;
          const pt = orbit.curve.getPoint(t);

          const v = new THREE.Vector3(pt.x, 0, pt.y);
          v.applyAxisAngle(new THREE.Vector3(1, 0, 0), orbit.tiltX);
          v.applyAxisAngle(new THREE.Vector3(0, 0, 1), orbit.tiltZ);

          orbit.satMesh.position.copy(v);
          orbit.satMesh.rotation.y += 0.02;
          orbit.satMesh.rotation.x += 0.01;
        });

        stars.rotation.y += 0.0002;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(coordInterval);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      earthMap.dispose();
      nightMap.dispose();
      scene.clear();
    };
  }, [interactive, intensity]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Precision Atmospheric Vignette: Deep Space Navy */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* Subtle Digital Cartography Grid overlay */}
      <div className="absolute inset-0 topo-grid opacity-25 pointer-events-none" />

      {/* Satellite Telemetry HUD (Optional) */}
      {showCoordinates && (
        <div className="absolute bottom-4 left-6 z-10 hidden sm:flex items-center gap-4 text-[10px] font-mono text-[#94a3b8] bg-[#060e1a]/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[rgba(59,130,246,0.2)] shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
            <span className="text-[#38bdf8] font-bold tracking-wider">ORBIT:</span>
            <span className="text-[#f8fafc]">{coords.sat}</span>
          </div>
          <span className="text-[#3b82f6]/40">|</span>
          <div>
            <span className="text-[#94a3b8]">DATUM:</span>{" "}
            <span className="text-[#f8fafc]">{coords.lat}, {coords.lng}</span>
          </div>
          <span className="text-[#3b82f6]/40">|</span>
          <div>
            <span className="text-[#94a3b8]">ALT:</span>{" "}
            <span className="text-[#f59e0b] font-semibold">{coords.alt}</span>
          </div>
        </div>
      )}
    </div>
  );
}
