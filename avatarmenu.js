function createAvatar(containerId, type) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(100, 1.0, 1.0, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(280, 280);
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Elemento ${containerId} não encontrado!`);
        return;
    }
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Criando a cabeça
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xffdd55 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2;
    scene.add(head);

    // Criando o X ou O (para girar)
    let rotatingSymbol;
    if (type === "X") {
        const xGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 32);
        const xMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        const line1 = new THREE.Mesh(xGeometry, xMaterial);
        line1.rotation.z = Math.PI / 4;
        line1.position.y = 2.0;
        line1.position.z = 0.9;

        const line2 = new THREE.Mesh(xGeometry, xMaterial);
        line2.rotation.z = -Math.PI / 4;
        line2.position.y = 2.0;
        line2.position.z = 0.9;

        rotatingSymbol = new THREE.Group();
        rotatingSymbol.add(line1);
        rotatingSymbol.add(line2);
    } else {
        const circleGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 32);
        const circleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        rotatingSymbol = new THREE.Mesh(circleGeometry, circleMaterial);
        rotatingSymbol.position.y = 2.0;
        rotatingSymbol.position.z = 0.9;
    }

    head.add(rotatingSymbol); // Adiciona o X ou O para girar sobre a cabeça

    // Criando o corpo
    const bodyGeometry = type === "X"
        ? new THREE.ConeGeometry(1, 3, 32)
        : new THREE.CylinderGeometry(0.8, 0.8, 2, 32);

    const bodyMaterial = new THREE.MeshPhongMaterial({ color: type === "X" ? 0x00ff00 : 0xff0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;
    scene.add(body);

    // Criando os braços
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

    camera.position.z = 6;

    function animate() {
        requestAnimationFrame(animate);
        rotatingSymbol.rotation.y += 0.05; // Faz o X ou O girar
        renderer.render(scene, camera);
    }
    animate();
}

// Criar os avatares dentro do menu
createAvatar("avatarX", "X");
createAvatar("avatarO", "O");


// Função para selecionar o avatar
document.querySelectorAll('.avatar-container').forEach(avatar => {
    avatar.addEventListener('click', () => {
        // Remover a seleção de todos os avatares
        document.querySelectorAll('.avatar-container').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Adicionar a seleção ao avatar clicado
        avatar.classList.add('selected');
        
        // Habilitar o botão de iniciar o jogo
        document.querySelector('.start-button').disabled = false;
        
        // Armazenar qual avatar foi selecionado
        const selectedPlayer = avatar.getAttribute('data-player');
        console.log(`Avatar selecionado: ${selectedPlayer}`);
    });
});

document.querySelector('.start-button').addEventListener('click', () => {
    const selectedAvatar = document.querySelector('.avatar-container.selected');
    if (selectedAvatar) {
        const player = selectedAvatar.getAttribute('data-player');
        console.log(`Iniciando o jogo com o avatar: ${player}`);
        
        // Ocultar o menu de seleção de avatar
        document.querySelector('.menu-container').style.display = 'none';
        
        // Exibir a área do jogo
        document.getElementById('gameArea').style.display = 'block';
        
        // Aqui você pode também inicializar o jogo de forma programática, como configurar o tabuleiro
        startGame(player);
    }
});

function startGame(player) {
    // Aqui você pode inicializar o estado do jogo, criar o tabuleiro, etc.
    console.log(`Jogo iniciado: ${player}`);
}

document.querySelector('.start-button').addEventListener('click', () => {
    const selectedAvatar = document.querySelector('.avatar-container.selected');
    if (selectedAvatar) {
        const player = selectedAvatar.getAttribute('data-player');
        console.log(`Iniciando o jogo com o avatar: ${player}`);
        
        // A lógica do jogo começa aqui
        initializeGame(player);
    }
});

function initializeGame(player) {
    // Inicializar o tabuleiro do jogo, variáveis de estado, etc.
    console.log(`Tabuleiro inicializado para o jogador ${player}`);
}
