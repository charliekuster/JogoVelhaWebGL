function createAvatar(scene, type = "X", position = { x: 0, y: 0, z: 0 }) {
    // Criar a cabeça
    const head = BABYLON.MeshBuilder.CreateSphere("head", { diameter: 2 }, scene);
    head.position = new BABYLON.Vector3(position.x, position.y, position.z);
    head.material = new BABYLON.StandardMaterial("headMaterial", scene);
    head.material.diffuseColor = new BABYLON.Color3.FromHexString("#ffdd55");

    // Criar o corpo
    let body;
    if (type === "X") {
        // Criar uma pirâmide (cone)
        body = BABYLON.MeshBuilder.CreateCylinder("body", { diameterTop: 0, diameterBottom: 1, height: 3, tessellation: 4 }, scene);
        body.material = new BABYLON.StandardMaterial("bodyMaterial", scene);
        body.material.diffuseColor = BABYLON.Color3.Green();
    } else {
        body = BABYLON.MeshBuilder.CreateCylinder("body", { diameter: 0.8, height: 2 }, scene);
        body.material = new BABYLON.StandardMaterial("bodyMaterial", scene);
        body.material.diffuseColor = BABYLON.Color3.Red();
    }
    body.position = new BABYLON.Vector3(position.x, position.y - 2, position.z);

    // Criar os braços
    const arm = BABYLON.MeshBuilder.CreateCylinder("arm", { diameter: 0.1, height: 2 }, scene);
    arm.material = new BABYLON.StandardMaterial("armMaterial", scene);
    arm.material.diffuseColor = new BABYLON.Color3.FromHexString("#ffdd55");

    const leftArm = arm.clone("leftArm");
    leftArm.position = new BABYLON.Vector3(position.x - 0.8, position.y - 1.5, position.z);
    leftArm.rotation.z = Math.PI / 4;

    const rightArm = arm.clone("rightArm");
    rightArm.position = new BABYLON.Vector3(position.x + 0.8, position.y - 1.5, position.z);
    rightArm.rotation.z = -Math.PI / 4;

    // Debug: Log para verificar a criação
    console.log("Avatar do tipo", type, "criado na posição:", position);

    // Retornar o avatar criado (opcional)
    return { head, body, leftArm, rightArm };
}

// Função para criar uma animação de movimento dos braços
function createArmAnimation(arm, rotationZ) {
    const animation = new BABYLON.Animation(
        "armAnimation", // Nome da animação
        "rotation.z",   // Propriedade a ser animada (rotação no eixo Z)
        30,             // Número de frames por segundo
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, // Tipo de animação
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE // Modo de loop
    );

    // Definir os keyframes da animação
    const keyFrames = [
        { frame: 0, value: arm.rotation.z }, // Frame inicial
        { frame: 15, value: rotationZ },
        { frame: 30, value: arm.rotation.z }   // Frame final
    ];

    // Adicionar os keyframes à animação
    animation.setKeys(keyFrames);

    return animation;
}

// Função para animar os braços
function animateArms(leftArm, rightArm) {
    // Criar animações para os braços
    const leftArmAnimation = createArmAnimation(leftArm, Math.PI / 2); // Rotação para cima
    const rightArmAnimation = createArmAnimation(rightArm, -Math.PI / 2); // Rotação para cima

    // Iniciar as animações
    leftArm.animations = [leftArmAnimation];
    rightArm.animations = [rightArmAnimation];

    // Iniciar as animações na cena

    scene.beginAnimation(leftArm, 0, 30, false);
    scene.beginAnimation(rightArm, 0, 30, false);
}

