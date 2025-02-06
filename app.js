let canvas, engine, scene, camera, camera2, placarO, placarX, possoJogar, trocar, game;

window.addEventListener('DOMContentLoaded', startGame);

function startGame() {
   // CANVAS ONDE É RENDERIZADO A CENA
   canvas = document.getElementById('renderCanvas');
   // MOTOR DO BABYLONJS
   engine = new BABYLON.Engine(canvas, true);
   // OBJETO DE CENA
   scene = createScene();
   scene.autoClear = false;
   scene.autoClearDepthAndStencil = false;

   placarO = document.getElementById('jogadorO');
   placarX = document.getElementById('jogadorX');

   engine.runRenderLoop(() => {
      scene.render();
      camera.beta >= 1.6224530684231742 ? (camera.beta = 1.6224530684231743) : '';
   });
}

function createScene() {
   // CRIA A CENA
   scene = new BABYLON.Scene(engine);
   possoJogar = true;
   camera = new BABYLON.ArcRotateCamera('camera', 0, 1, 30, new BABYLON.Vector3(0, 0, 0), scene);
   camera.attachControl(canvas, true);
   scene.activeCamera = camera;

   camera2 = new BABYLON.FreeCamera('camera2', new BABYLON.Vector3(29.06257920217873, 47.66885787257952, -29.26192807413112), scene);
   camera2.rotation = new BABYLON.Vector3(1.0055503635002186, -0.863123026826512, 0);

   // LUZ
   const pointLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(3, 5, 0), scene);
//   const pointLight2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(2, 5, 0), scene);
   pointLight.intensity = 1.0;
//   pointLight2.intensity = 0.7;
   // Variável para armazenar o tempo
   let time = 0;

   engine.runRenderLoop(() => {
      // Atualiza o tempo a cada frame
      time += 0.06; // Velocidade da variação (ajuste conforme necessário)

      // Calcula cores baseadas em uma senoide
      const r = (Math.sin(time) + 1) / 2; // Oscila entre 0 e 1
      const g = (Math.sin(time + Math.PI / 3) + 1) / 2; // Defasagem para outra cor
      const b = (Math.sin(time + 2 * Math.PI / 3) + 1) / 2; // Outra defasagem

      // Aplica as cores na luz
      pointLight.diffuse = new BABYLON.Color3(r, g, b);
      pointLight.specular = new BABYLON.Color3(1 - r, 1 - g, 1 - b); // Oposto da difusa para um efeito interessante

//      pointLight2.diffuse = new BABYLON.Color3(-r, -g, -b);
//      pointLight2.specular = new BABYLON.Color3(r, g, b); // Oposto da difusa para um efeito interessante

      // Renderiza a cena
      scene.render();
   });
   //const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0.1, 2, 0), scene);
   //light.intensity = 0.9;

   // TEXTURA DAS CAIXAS QUE FICAM SOBRE O CHÃO
   const boxMaterial = new BABYLON.StandardMaterial('boxMaterial', scene);
   boxMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
   boxMaterial.wireframe = true;

   const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
   groundMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
   groundMaterial.emissiveColor = new BABYLON.Vector3(0, 0, 0);

   // CEU MATERIAL
   const skyboxMaterial = new BABYLON.StandardMaterial('skybox', scene);
   skyboxMaterial.backFaceCulling = false;
   skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/img/skybox", scene);
   skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
   skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

   // CAIXA DO CEU
   const skybox = BABYLON.Mesh.CreateBox('skybox', 200, scene);
   skybox.material = skyboxMaterial;

   // CHAO
   const ground = BABYLON.Mesh.CreateBox('ground', 15, scene);
   ground.position = new BABYLON.Vector3(0, -13.1, 0);
   ground.scaling.y = 2;
   ground.material = groundMaterial;

   // ARRAY DO GAME
   game = [{}, {}, {}, {}, {}, {}, {}, {}, {}];

   trocar = false; // VARIÁVEL DE TROCA DE JOGADOR

   let X = -5; // DISTÂNCIA ENTRE AS CAIXAS EM X
   let Z = -5; // DISTÂNCIA ENTRE AS CAIXAS EM Z

   // CRIA E ORGANIZA AS CAIXAS EM CIMA DA GROUND
   for (let i = 0; i < game.length; i++) {
      game[i] = BABYLON.Mesh.CreateBox(`box${i}`, 4, scene);
      if (i < 3) {
         game[i].position.z = Z;
         game[i].position.x += i * X + 5;
      } else if (i >= 3 && i < 6) {
         game[i].position.z = Z + 5;
         game[i].position.x += (i % 3) * X + 5;
      } else {
         game[i].position.z = Z + 10;
         game[i].position.x += (i % 3) * X + 5;
      }
      game[i].material = boxMaterial;
      game[i].freezeWorldMatrix();
      game[i].scaling.y = 0.5;
      game[i].value = null;
      game[i].actionManager = new BABYLON.ActionManager(scene);
      game[i].actionManager.registerAction(clickEvent());
   }

   function clickEvent() {
      return new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (event) => {
         if (possoJogar && event.meshUnderPointer.value === null) {
            event.meshUnderPointer.value = trocar ? 'O' : 'X';
            getParent(event.meshUnderPointer);
            verifyWin();
         }
      });
   }

   function getMaterialColor(bol) {
      const randomMaterial = new BABYLON.StandardMaterial('materialRandom', scene);
      randomMaterial.diffuseColor = bol ? new BABYLON.Color3(1, 0, 0) : new BABYLON.Color3(0, 1, 0);
      randomMaterial.freeze();
      return randomMaterial;
   }

   function getX(mesh) {
      let x1 = BABYLON.Mesh.CreateBox('x', 3, scene);
      x1.scaling.x = 0.1;
      x1.rotation.y = 2.5;

      let x2 = BABYLON.Mesh.CreateBox('x', 3, scene);
      x2.scaling.x = 0.1;
      x2.rotation.y = -2.5;

      x2.parent = mesh;
      x2.position.y = 1.5;
      x1.parent = mesh;
      x2.material = getMaterialColor(trocar);

      return x1;
   }

   function getParent(mesh) {
      let jogador = trocar ? BABYLON.Mesh.CreateTorus('o', 3, 0.8, 50, scene) : getX(mesh);
      jogador.parent = mesh;
      jogador.value = trocar;
      trocar ? (jogador.position.y = 2) : (jogador.position.y = 1.4);
      jogador.material = getMaterialColor(trocar);
      trocar = !trocar;
   }

   function verifyWin() {
      for (let i = 0; i < game.length; i++) {
         if (game[i].value && game[i + 3] && game[i].value === game[i + 3].value && game[i + 6] && game[i + 6].value === game[i + 3].value) {
            setPlacar(game[i].value);
            possoJogar = false;
            resetGame();
            scene.activeCamera = camera2;
            return;
         } else if ((i === 0 || i === 3 || i === 6) && game[i + 1].value && game[i].value === game[i + 1].value && game[i + 2] && game[i + 2].value === game[i + 1].value) {
            setPlacar(game[i].value);
            resetGame();
            scene.activeCamera = camera2;
            possoJogar = false;
            return;
         } else if (game[4].value && ((game[0].value === game[4].value && game[4].value === game[8].value) || (game[2].value === game[4].value && game[4].value === game[6].value))) {
            setPlacar(game[4].value);
            possoJogar = false;
            scene.activeCamera = camera2;
            resetGame();
            return;
         } else {
            verifyVelha();
         }
      }
   }

   function setPlacar(value) {
      let ground = scene.getMeshByName('ground');
      groundMaterial.emissiveColor = new BABYLON.Vector3(0, 0, 0);

      if (value === 'X') {
         let videoTextureX = new BABYLON.VideoTexture("video", "assets/img/x.mp4", scene, true);
         let value = parseInt(placarX.innerHTML);
         let placar = value ? value + 1 : 1;
         placarX.innerHTML = placar;
         ground.material.emissiveTexture = videoTextureX;
      } else {
         let videoTextureO = new BABYLON.VideoTexture("video", "assets/img/o.mp4", scene, true);
         let value = parseInt(placarO.innerHTML);
         let placar = value ? value + 1 : 1;
         placarO.innerHTML = placar;
         ground.material.emissiveTexture = videoTextureO;
      }
   }

   function verifyVelha() {
      let testeVelha = game.filter((item) => item.value !== 'X' && item.value !== 'O');
      if (testeVelha.length === 0) {
         let videoTextureVelha = new BABYLON.VideoTexture("video", "assets/img/velha.mp4", scene, true);
         groundMaterial.emissiveColor = new BABYLON.Vector3(0, 0, 0);
         let ground = scene.getMeshByName('ground');
         ground.material.emissiveTexture = videoTextureVelha;
         possoJogar = false;
         scene.activeCamera = camera2;
         resetGame();
      }
   }

   function resetGame() {
      setTimeout(() => {
         scene.dispose();
         createScene();
         trocar = !trocar;
         possoJogar = true;
      }, 4000);
   }

   return scene;
}