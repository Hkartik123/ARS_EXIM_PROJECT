'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function addBeam(
  parent: THREE.Group,
  start: THREE.Vector3,
  end: THREE.Vector3,
  width: number,
  material: THREE.Material
) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const beam = new THREE.Mesh(
    new THREE.BoxGeometry(width, direction.length(), width),
    material
  );
  beam.position.copy(start).add(end).multiplyScalar(0.5);
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  parent.add(beam);
}

export function IndustrialScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
    camera.position.set(8.2, 5.8, 10.5);
    camera.lookAt(0, 1.55, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute(
      'aria-label',
      'Interactive 3D model of an industrial spherical tank, access scaffold and pipe rack. Drag or use the arrow keys to rotate.'
    );
    renderer.domElement.tabIndex = 0;
    renderer.domElement.style.touchAction = 'pan-y';
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xdce8ee, 0x172534, 2.4));
    const keyLight = new THREE.DirectionalLight(0xffe5b1, 3.4);
    keyLight.position.set(4, 9, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x8ec5d2, 2.2);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    const steel = new THREE.MeshStandardMaterial({ color: 0x93a6ae, metalness: 0.78, roughness: 0.3 });
    const darkSteel = new THREE.MeshStandardMaterial({ color: 0x354c59, metalness: 0.7, roughness: 0.38 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xd4ad5d, metalness: 0.62, roughness: 0.3 });
    const vesselMaterial = new THREE.MeshStandardMaterial({
      color: 0xc1d0d2,
      metalness: 0.66,
      roughness: 0.27,
      emissive: 0x18292d,
      emissiveIntensity: 0.18,
    });

    const rig = new THREE.Group();
    scene.add(rig);

    const rack = new THREE.Group();
    rack.position.x = -1.9;
    rig.add(rack);

    const postPositions = [-2.25, -0.75, 0.75, 2.25];
    const postDepths = [-0.85, 0.85];
    for (const x of postPositions) {
      for (const z of postDepths) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.13, 3.6, 0.13), darkSteel);
        post.position.set(x, 1.8, z);
        rack.add(post);
      }
    }

    for (const y of [0.18, 1.7, 3.35]) {
      const frontBeam = new THREE.Mesh(new THREE.BoxGeometry(4.65, 0.11, 0.11), steel);
      frontBeam.position.set(0, y, 0.85);
      rack.add(frontBeam);
      const backBeam = frontBeam.clone();
      backBeam.position.z = -0.85;
      rack.add(backBeam);
      const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 1.8), steel);
      for (const x of postPositions) {
        const beam = crossBeam.clone();
        beam.position.set(x, y, 0);
        rack.add(beam);
      }
    }

    for (const x of [-1.5, 0, 1.5]) {
      addBeam(rack, new THREE.Vector3(x, 0.25, 0.86), new THREE.Vector3(x + 0.72, 1.65, 0.86), 0.065, gold);
      addBeam(rack, new THREE.Vector3(x + 0.72, 0.25, -0.86), new THREE.Vector3(x, 1.65, -0.86), 0.065, gold);
    }

    for (let index = 0; index < 4; index += 1) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 4.45, 16), index === 1 ? gold : steel);
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(0, 0.62 + index * 0.76, index % 2 === 0 ? -0.35 : 0.35);
      rack.add(pipe);
    }

    const tankGroup = new THREE.Group();
    tankGroup.position.set(3.1, 0, 0.05);
    rig.add(tankGroup);

    const tank = new THREE.Mesh(new THREE.SphereGeometry(1.28, 40, 28), vesselMaterial);
    tank.position.y = 2.25;
    tankGroup.add(tank);

    for (const height of [1.95, 2.55]) {
      const seam = new THREE.Mesh(new THREE.TorusGeometry(1.265, 0.023, 8, 48), gold);
      seam.rotation.x = Math.PI / 2;
      seam.position.y = height;
      tankGroup.add(seam);
    }

    const legPositions = [
      [-0.72, -0.52],
      [0.72, -0.52],
      [-0.72, 0.52],
      [0.72, 0.52],
    ];
    for (const [x, z] of legPositions) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.16, 0.12), darkSteel);
      leg.position.set(x, 0.58, z);
      tankGroup.add(leg);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.36), gold);
      foot.position.set(x, 0.05, z);
      tankGroup.add(foot);
    }

    const ladder = new THREE.Group();
    ladder.position.set(1.5, 0, 1.03);
    rig.add(ladder);
    for (const x of [-0.24, 0.24]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.055, 3.45, 0.055), gold);
      rail.position.set(x, 1.73, 0);
      ladder.add(rail);
    }
    for (let rung = 0; rung < 14; rung += 1) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(0.49, 0.045, 0.07), steel);
      step.position.set(0, 0.25 + rung * 0.24, 0);
      ladder.add(step);
    }

    const ground = new THREE.GridHelper(15, 30, 0x8ca3aa, 0x526a73);
    ground.position.y = 0.015;
    const gridMaterials = Array.isArray(ground.material) ? ground.material : [ground.material];
    for (const material of gridMaterials) {
      material.transparent = true;
      material.opacity = 0.28;
    }
    scene.add(ground);

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.position.x = width < 520 ? 9.5 : 8.2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
    resizeObserver.observe(host);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frameId = 0;
    let dragging = false;
    let previousX = 0;
    let previousY = 0;
    let targetRotationY = -0.18;
    let targetRotationX = 0.04;
    const canvas = renderer.domElement;

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      targetRotationY += (event.clientX - previousX) * 0.008;
      targetRotationX = THREE.MathUtils.clamp(
        targetRotationX + (event.clientY - previousY) * 0.004,
        -0.18,
        0.22
      );
      previousX = event.clientX;
      previousY = event.clientY;
    };
    const stopDragging = () => {
      dragging = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const step = 0.12;
      if (event.key === 'ArrowLeft') targetRotationY -= step;
      else if (event.key === 'ArrowRight') targetRotationY += step;
      else if (event.key === 'ArrowUp') targetRotationX = Math.min(0.22, targetRotationX + step);
      else if (event.key === 'ArrowDown') targetRotationX = Math.max(-0.18, targetRotationX - step);
      else return;
      event.preventDefault();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', stopDragging);
    canvas.addEventListener('pointercancel', stopDragging);
    canvas.addEventListener('keydown', onKeyDown);

    const timer = new THREE.Timer();
    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      timer.update();
      const delta = timer.getDelta();
      const time = timer.getElapsed();
      rig.rotation.y = THREE.MathUtils.damp(rig.rotation.y, targetRotationY, 5, delta);
      rig.rotation.x = THREE.MathUtils.damp(rig.rotation.x, targetRotationX, 5, delta);
      if (!reduceMotion.matches) rig.position.y = Math.sin(time * 0.5) * 0.035;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', stopDragging);
      canvas.removeEventListener('pointercancel', stopDragging);
      canvas.removeEventListener('keydown', onKeyDown);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          for (const material of materials) material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="industrial-scene" />;
}