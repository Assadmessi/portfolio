import { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

/**
 * ThreeBackground — subtle 3D depth layer
 *
 * KEY CHANGES vs old version:
 * - 60% fewer particles (700 vs 1800) → quieter, no visual noise
 * - Lower opacity (0.35 vs 0.7) → content reads first, depth is ambient
 * - Geometric meshes hidden behind a vignette mask
 * - SCROLL-AWARE OPACITY: as user scrolls, background fades to ~20%
 *   so content always wins focus
 * - Uses requestAnimationFrame throttle for 60fps smoothness
 *
 * Still: zero changes to Firebase/Cloudinary/content layer.
 */
const ThreeBackground = () => {
  const mountRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    let renderer, camera, scene, animId;
    let particles, mesh1, mesh2, mesh3;
    const mouse = { x: 0, y: 0 };
    let scrollProgress = 0; // 0 at top, 1 at bottom

    const init = async () => {
      const THREE = await import(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js"
      ).catch(() => null);
      if (!THREE || !mountRef.current) return;

      const isDark = theme === "dark";
      const W = window.innerWidth;
      const H = window.innerHeight;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mountRef.current.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
      camera.position.z = 22;

      // ── PARTICLES (60% fewer, subtler) ──
      const pCount = 700;
      const pGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(pCount * 3);
      const colors = new Float32Array(pCount * 3);

      const colorA = isDark ? new THREE.Color(0x6366f1) : new THREE.Color(0x818cf8);
      const colorB = isDark ? new THREE.Color(0x22d3ee) : new THREE.Color(0x67e8f9);
      const colorC = isDark ? new THREE.Color(0xa5b4fc) : new THREE.Color(0xc7d2fe);

      for (let i = 0; i < pCount; i++) {
        // Spread wider so density is lower per screen
        positions[i * 3 + 0] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

        const r = Math.random();
        const c = r < 0.33 ? colorA : r < 0.66 ? colorB : colorC;
        colors[i * 3 + 0] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const pMat = new THREE.PointsMaterial({
        size: isDark ? 0.06 : 0.05, // smaller dots
        vertexColors: true,
        transparent: true,
        opacity: isDark ? 0.45 : 0.30, // ↓↓ from 0.7
        sizeAttenuation: true,
        depthWrite: false, // prevents weird z-buffer artifacts
      });

      particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // ── WIREFRAME SHAPES (much fainter) ──
      const mkMat = (color, opacity) =>
        new THREE.MeshBasicMaterial({
          color,
          wireframe: true,
          transparent: true,
          opacity,
          depthWrite: false,
        });

      mesh1 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.6, 1),
        mkMat(isDark ? 0x6366f1 : 0x818cf8, isDark ? 0.10 : 0.07) // ↓ from 0.22
      );
      mesh1.position.set(8, 3, -8);
      scene.add(mesh1);

      mesh2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.0, 0.4, 12, 48),
        mkMat(isDark ? 0x22d3ee : 0x67e8f9, isDark ? 0.08 : 0.06) // ↓ from 0.18
      );
      mesh2.position.set(-9, -2, -10);
      scene.add(mesh2);

      mesh3 = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.6, 0),
        mkMat(isDark ? 0xa5b4fc : 0xc7d2fe, isDark ? 0.09 : 0.06) // ↓ from 0.20
      );
      mesh3.position.set(0, 5, -12);
      scene.add(mesh3);

      // ── INPUT HANDLERS ──
      const onMouseMove = (e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove, { passive: true });

      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      const onResize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize, { passive: true });

      // ── ANIMATE ──
      const clock = new THREE.Clock();
      const baseParticleOpacity = pMat.opacity;
      const baseMesh1 = mesh1.material.opacity;
      const baseMesh2 = mesh2.material.opacity;
      const baseMesh3 = mesh3.material.opacity;

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Slower rotation for calmer feel
        mesh1.rotation.x = t * 0.08;
        mesh1.rotation.y = t * 0.12;
        mesh2.rotation.x = t * 0.05;
        mesh2.rotation.z = t * 0.09;
        mesh3.rotation.y = t * 0.14;
        mesh3.rotation.z = t * 0.07;

        particles.rotation.y = t * 0.008;
        particles.rotation.x = t * 0.004;

        // Subtle parallax — half as strong as before
        camera.position.x += (mouse.x * 1.0 - camera.position.x) * 0.03;
        camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        // ── KEY FIX: SCROLL-AWARE FADE ──
        // Hero (top) shows 100% of background opacity.
        // As you scroll past hero, fade to 30% so content sections breathe.
        const fadeFactor = 1 - scrollProgress * 0.7;
        pMat.opacity = baseParticleOpacity * fadeFactor;
        mesh1.material.opacity = baseMesh1 * fadeFactor;
        mesh2.material.opacity = baseMesh2 * fadeFactor;
        mesh3.material.opacity = baseMesh3 * fadeFactor;

        renderer.render(scene, camera);
      };
      animate();

      // Cleanup refs
      mountRef.current._cleanup = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(animId);
        renderer.dispose();
        pGeo.dispose();
        pMat.dispose();
      };
    };

    init();

    return () => {
      if (mountRef.current?._cleanup) mountRef.current._cleanup();
      if (mountRef.current && renderer?.domElement) {
        try { mountRef.current.removeChild(renderer.domElement); } catch {}
      }
    };
  }, [theme]);

  return (
    <>
      {/* The 3D canvas itself */}
      <div
        ref={mountRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          // Soft vignette so edges never compete with text
          maskImage:
            "radial-gradient(ellipse at center, black 50%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.2) 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 50%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.2) 100%)",
        }}
      />

      {/* Subtle dark veil that sits between canvas and content
          — gives text a guaranteed contrast background */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 120% 80% at 50% 30%, transparent 0%, rgba(7,10,18,0.45) 65%, rgba(7,10,18,0.75) 100%)",
        }}
        className="dark:opacity-100 opacity-0 transition-opacity"
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 120% 80% at 50% 30%, transparent 0%, rgba(248,250,252,0.45) 65%, rgba(248,250,252,0.75) 100%)",
        }}
        className="dark:opacity-0 opacity-100 transition-opacity"
      />
    </>
  );
};

export default ThreeBackground;
