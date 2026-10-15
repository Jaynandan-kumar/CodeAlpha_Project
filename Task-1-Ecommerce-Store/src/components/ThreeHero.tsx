import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 8;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x6c5ce7, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const accentLight = new THREE.PointLight(0x00cec9, 0.6, 20);
    accentLight.position.set(-5, -3, 3);
    scene.add(accentLight);

    // Materials
    const materialPrimary = new THREE.MeshPhongMaterial({
      color: 0x6c5ce7,
      transparent: true,
      opacity: 0.7,
      shininess: 100,
    });

    const materialAccent = new THREE.MeshPhongMaterial({
      color: 0x00cec9,
      transparent: true,
      opacity: 0.6,
      shininess: 100,
    });

    const materialLight = new THREE.MeshPhongMaterial({
      color: 0xa29bfe,
      transparent: true,
      opacity: 0.5,
      shininess: 80,
    });

    // Geometries - subtle floating shapes
    const geometries = [
      { geo: new THREE.IcosahedronGeometry(0.8, 0), pos: [-3.5, 1.5, 0], mat: materialPrimary, speed: 0.003 },
      { geo: new THREE.OctahedronGeometry(0.6, 0), pos: [3.5, -1, -1], mat: materialAccent, speed: 0.004 },
      { geo: new THREE.TorusGeometry(0.5, 0.2, 16, 32), pos: [-2, -2, -2], mat: materialLight, speed: 0.002 },
      { geo: new THREE.DodecahedronGeometry(0.5, 0), pos: [2.5, 2, -1], mat: materialPrimary, speed: 0.003 },
      { geo: new THREE.TetrahedronGeometry(0.4, 0), pos: [0, -2.5, -1.5], mat: materialAccent, speed: 0.005 },
      { geo: new THREE.BoxGeometry(0.6, 0.6, 0.6), pos: [-4, 0, -2], mat: materialLight, speed: 0.002 },
    ];

    const meshes: THREE.Mesh[] = [];
    geometries.forEach(({ geo, pos, mat, speed }) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.userData = { 
        initialY: pos[1],
        speed,
        phase: Math.random() * Math.PI * 2,
      };
      scene.add(mesh);
      meshes.push(mesh);
    });
    meshesRef.current = meshes;

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      if (!prefersReducedMotion) {
        meshes.forEach((mesh) => {
          const { initialY, speed, phase } = mesh.userData;
          mesh.rotation.x += speed;
          mesh.rotation.y += speed * 0.7;
          // Gentle floating
          mesh.position.y = initialY + Math.sin(time + phase) * 0.3;
          // Subtle mouse follow
          mesh.position.x += (mouseRef.current.x * 0.3 - mesh.position.x) * 0.01;
        });

        // Subtle camera movement based on mouse
        camera.position.x += (mouseRef.current.x * 0.5 - camera.position.x) * 0.02;
        camera.position.y += (mouseRef.current.y * 0.3 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Intersection Observer - pause when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = 0;
          } else if (entry.isIntersecting && !frameRef.current) {
            animate();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      motionQuery.removeEventListener('change', handleMotionChange);

      // Dispose geometries and materials
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [prefersReducedMotion]);

  if (!webGLSupported || prefersReducedMotion) {
    // Fallback: CSS-only floating elements (already in App.tsx)
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="three-hero-canvas"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 1,
      }}
    />
  );
}
