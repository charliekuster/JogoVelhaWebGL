function criarCenaCone() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(400, 400);

  // Adicionando o canvas no div correto
  document.getElementById("cone").appendChild(renderer.domElement);
  scene.background = new THREE.Color(0xf5deb3); // Cor creme

  // Luzes
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5).normalize();
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  // Criando a cabeça (esfera)
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0xffdd55 })
  );
  head.position.y = 2;
  scene.add(head);

  // Criando o corpo (cone)
  const body = new THREE.Mesh(
    new THREE.ConeGeometry(1, 3, 32),
    new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  );
  body.position.y = 0;
  scene.add(body);

  // Criando os braços
  const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
  const armMaterial = new THREE.MeshPhongMaterial({ color: 0xffdd55 });

  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(-1.2, 0.5, 0);
  leftArm.rotation.z = Math.PI / 4;
  scene.add(leftArm);

  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set(1.2, 0.5, 0);
  rightArm.rotation.z = -Math.PI / 4;
  scene.add(rightArm);

  // Configuração da câmera
  camera.position.z = 5;

  // Animação
  function animate() {
    requestAnimationFrame(animate);
    head.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}

criarCenaCone();
