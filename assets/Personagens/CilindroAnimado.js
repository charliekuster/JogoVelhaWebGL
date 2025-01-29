// Configuração da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(0xf5deb3); // Cor creme

//Adicionando luz direcional
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

//Adicionando luz ambiente
//const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Cor branca e intensidade 1
//scene.add(ambientLight);

//Luz mista
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Iluminação geral fraca
scene.add(ambientLight);

//const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//directionalLight.position.set(5, 5, 5);
//scene.add(directionalLight);

// Criando a cabeça (esfera com sorriso)
const headGeometry = new THREE.SphereGeometry(1, 32, 32);
const headMaterial = new THREE.MeshPhongMaterial({ color: 0xffdd55 });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.y = 2;
scene.add(head);

// Desenhar o ciculo a cima da cabeça (usando um arco)
const circleGeometry = new THREE.TorusGeometry(0.6, 0.1, 16, 32); // (raio, espessura, segmentos radiais, segmentos tubulares)
const circleMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
}); // vermelho
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.position.y = 1.8;
circle.position.z = 0.7;
head.add(circle);

// Criando o corpo (cilindro)
const bodyGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = 0;
scene.add(body);

// Criando os braços (cilindros)
const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
const armMaterial = new THREE.MeshPhongMaterial({ color: 0xffdd55 });

const leftArm = new THREE.Mesh(armGeometry, armMaterial);
leftArm.position.x = -1.2;
leftArm.position.y = 0.5;
leftArm.rotation.z = Math.PI / 4;
scene.add(leftArm);

const rightArm = new THREE.Mesh(armGeometry, armMaterial);
rightArm.position.x = 1.2;
rightArm.position.y = 0.5;
rightArm.rotation.z = -Math.PI / 4;
scene.add(rightArm);

// Posicionando a câmera
camera.position.z = 10;

// Animação
function animate() {
  requestAnimationFrame(animate);

  // Rotação da cabeça
  head.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();

// Ajustar o tamanho da janela
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
