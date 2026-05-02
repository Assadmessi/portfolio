import { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

/**
 * ThreeBackground — live 3D particle field + floating geometry
 * Uses Three.js loaded from CDN via dynamic import.
 * Completely isolated; touches nothing in Firebase / Cloudinary / content layer.
 */
const ThreeBackground = () => {
  const mountRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    let renderer, camera, scene, animId;
    let particles, mesh1, mesh2, mesh3;
    const mouse = { x: 0, y: 0 };

    const init = async () => {
      // Load Three.js from CDN (no install required)
      const THREE = await import(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js"
      ).catch(() => null);
      if (!THREE || !mountRef.current) return;

      const isDark = theme === "dark";
      const W = window.innerWidth;
      const H = window.innerHeight;

      // ── Renderer ──
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mountRef.current.appendChild(renderer.domElement);

      // ── Scene ──
      scene = new THREE.Scene();

      // ── Camera ──
      camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
      camera.position.z = 18;

      // ── PARTICLES ──
      const pCount = 1800;
      const pGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(pCount * 3);
      const colors = new Float32Array(pCount * 3);

      const colorA = isDark
        ? new THREE.Color(0x6366f1) // indigo
        : new THREE.Color(0x818cf8);
      const colorB = isDark
        ? new THREE.Color(0x22d3ee) // cyan
        : new THREE.Color(0x67e8f9);
      const colorC = isDark
        ? new THREE.Color(0xa5b4fc)
        : new THREE.Color(0xc7d2fe);

      for (let i = 0; i < pCount; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

        const r = Math.random();
        const c = r < 0.33 ? colorA : r < 0.66 ? colorB : colorC;
        colors[i * 3 + 0] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const pMat = new THREE.PointsMaterial({
        size: isDark ? 0.09 : 0.07,
        vertexColors: true,
        transparent: true,
        opacity: isDark ? 0.7 : 0.45,
        sizeAttenuation: true,
      });

      particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // ── FLOATING WIREFRAME SHAPES ──
      const mkMat = (color, opacity = 0.25) =>
        new THREE.MeshBasicMaterial({
          color,
          wireframe: true,
          transparent: true,
          opacity,
        });

      // Icosahedron
      mesh1 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.6, 1),
        mkMat(isDark ? 0x6366f1 : 0x818cf8, isDark ? 0.22 : 0.16)
      );
      mesh1.position.set(6, 2, -4);
      scene.add(mesh1);

      // Torus
      mesh2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.0, 0.5, 12, 48),
        mkMat(isDark ? 0x22d3ee : 0x67e8f9, isDark ? 0.18 : 0.12)
      );
      mesh2.position.set(-7, -1.5, -6);
      scene.add(mesh2);

      // Octahedron
      mesh3 = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.8, 0),
        mkMat(isDark ? 0xa5b4fc : 0xc7d2fe, isDark ? 0.20 : 0.14)
      );
      mesh3.position.set(0, 4, -8);
      scene.add(mesh3);

      // ── Mouse parallax ──
      const onMouseMove = (e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove, { passive: true });

      // ── Resize ──
      const onResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize, { passive: true });

      // ── Animate ──
      const clock = new THREE.Clock();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Rotate shapes
        mesh1.rotation.x = t * 0.12;
        mesh1.rotation.y = t * 0.18;
        mesh2.rotation.x = t * 0.08;
        mesh2.rotation.z = t * 0.14;
        mesh3.rotation.y = t * 0.22;
        mesh3.rotation.z = t * 0.10;

        // Drift particles
        particles.rotation.y = t * 0.012;
        particles.rotation.x = t * 0.006;

        // Mouse parallax on camera
        camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.04;
        camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };
      animate();

      // Store cleanup refs
      mountRef.current._cleanup = () => {
        window.removeEventListener("mousemove", onMouseMove);
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
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default ThreeBackground;
