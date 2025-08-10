import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/index.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 0;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl'), antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color('#14001f'));
document.body.appendChild(renderer.domElement);

const tetraGroup = new THREE.Group();
scene.add(tetraGroup);

const glowMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

for (let i = 0; i < 50; i++) {
  const geometry = new THREE.TetrahedronGeometry(1.5);
  const mesh = new THREE.Mesh(geometry, glowMaterial.clone());
  mesh.position.set(
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 40
  );
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  mesh.scale.setScalar(Math.random() * 1.5 + 0.5);
  tetraGroup.add(mesh);
}

const animate = () => {
  requestAnimationFrame(animate);
  tetraGroup.rotation.y += 0.001;
  tetraGroup.children.forEach((tetra, idx) => {
    tetra.rotation.x += 0.002;
    tetra.rotation.y += 0.003;
  });
  renderer.render(scene, camera);
};
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let shapeState = 0; // 0 = tetrahedron, 1 = prism, 2 = arrow

const tetraGeometry = new THREE.TetrahedronGeometry(2);
const prismGeometry = new THREE.BoxGeometry(2, 0.5, 1);
const arrowGeometry = new THREE.TorusGeometry(2, 1, 1);
const dodeGeometry = new THREE.DodecahedronGeometry(2, 1);

document.getElementById("next-button").addEventListener("click", () => {
  tetraGroup.children.forEach((mesh, index) => {
    gsap.to(mesh.scale, {
      duration: 0.3,
      x: 0.01,
      y: 0.01,
      z: 0.01,
      ease: "power2.in",
      onComplete: () => {
        mesh.geometry.dispose();

        if (shapeState === 0) {
          mesh.geometry = tetraGeometry.clone();
        } else if (shapeState === 1) {
          mesh.geometry = dodeGeometry.clone();
        } else if (shapeState === 2){
          mesh.geometry = prismGeometry.clone();
        } else {
          mesh.geometry = arrowGeometry.clone();
        }

        gsap.to(mesh.scale, {
          duration: 0.3,
          x: 1,
          y: 1,
          z: 1,
          ease: "power2.out",
          delay: index * 0.01,
        });
      },
    });
  });

  shapeState = (shapeState + 1) % 4;
  console.log(shapeState);
});