let canvas, engine, scene, camera, camera2, placarO, placarX, possoJogar, trocar, game, colorObserver, valorClicado;

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

//let blurPostProcess = null;

function createScene() {
   // CRIA A CENA
   scene = new BABYLON.Scene(engine);

   possoJogar = true;
   camera = new BABYLON.ArcRotateCamera('camera', 0, 1, 30, new BABYLON.Vector3(0, 0, 0), scene);
   camera.attachControl(canvas, true);
   scene.activeCamera = camera;

   camera2 = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(27.06257920217873, 47.66885787257952, -27.26192807413112), scene);
   camera2.rotation = new BABYLON.Vector3(1.0055503635002186, -0.863123026826512, 0);
   camera3 = new BABYLON.FreeCamera('camera3', new BABYLON.Vector3(25.06257920217873, 47.66885787257952, 27.26192807413112), scene);
   camera3.rotation = new BABYLON.Vector3(1.0055503635002186, -2.463123026826512, 0);


   // LUZ
   const pointLight = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 25, 0), new BABYLON.Vector3(0, -1, 0), Math.PI / 4, 2, scene);
   pointLight.intensity = 0.0;
   const spotLight2 = new BABYLON.SpotLight(
      "spotLight2",              // Nome da luz
      new BABYLON.Vector3(0, 6, 0), // Posição da luz
      new BABYLON.Vector3(0, -1, 0), // Direção da luz (vetor apontando para baixo)
      Math.PI,               // Ângulo de abertura do feixe de luz (em radianos)
      1,                          // A intensidade do cone de luz
      scene                       // A cena onde a luz será adicionada
   );

   spotLight2.intensity = 0.0;

   // Variável para armazenar o tempo
   let time1 = 0;

   engine.runRenderLoop(() => {
      // Atualiza o tempo a cada frame
      time1 += 0.06; // Velocidade da variação (ajuste conforme necessário)

      // Calcula cores baseadas em uma senoide
      const r = 0.5 * (Math.sin(time1) + 1) / 2; // Oscila entre 0 e 1
      const g = (Math.sin(time1 + Math.PI / 3) + 1) / 2; // Defasagem para outra cor
      const b = (Math.sin(time1 + 2 * Math.PI / 3) + 1) / 2; // Outra defasagem

      // Aplica as cores na luz no jogo
      pointLight.diffuse = new BABYLON.Color3(r + 0.6, g + 0.6, b + 0.6);
      pointLight.specular = new BABYLON.Color3(1 - r, 1 - g, 1 - b); // Oposto da difusa para um efeito interessante

      // Aplica as cores na luz no vencedor
      spotLight2.diffuse = new BABYLON.Color3(r + 0.6, r + 0.6, r + 0.6);
      spotLight2.specular = new BABYLON.Color3(1 - r, 1 - g, 1 - b); // Oposto da difusa para um efeito interessante


      // Renderiza a cena
      scene.render();
   });

   const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0.1, 2, 0), scene);
   light.intensity = 1.0;
   light.diffuse = new BABYLON.Color3(1, 1, 1);
   light.specular = new BABYLON.Color3(0.5, 0.5, 0.5);

   // TEXTURA DAS CAIXAS QUE FICAM SOBRE O CHÃO
   const boxMaterial = new BABYLON.StandardMaterial('boxMaterial', scene);
   let time = 0;

   engine.runRenderLoop(() => {
      // Atualiza o tempo a cada frame (ajuste a velocidade com o fator)
      time += 0.03;

      // Calcula os valores RGB baseados em uma senoide
      const r = (Math.sin(time) + 1) / 2; // Oscila entre 0 e 1
      const g = (Math.sin(time + Math.PI / 3) + 1) / 2; // Defasado para mudar suavemente
      const b = (Math.sin(time + 2 * Math.PI / 3) + 1) / 2; // Outro desfasamento para variedade

      // Aplica a nova cor ao material da caixa
      boxMaterial.diffuseColor = new BABYLON.Color3(r, g, b);

      // Renderiza a cena
      scene.render();
   });

   // Criação do avatar
   const avatar1 = createAvatar(scene, "X", { x: 0, y: 7, z: 15 });
   const avatar2 = createAvatar(scene, "O", { x: 0, y: 7, z: -15 });



   boxMaterial.wireframe = true;

   const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
   groundMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
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
   ground.position = new BABYLON.Vector3(0, -5.6, 0);
   ground.scaling.y = 1;
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

         valorClicado = event.meshUnderPointer.value;
         if (valorClicado === 'X') {
            animateArms(avatar1.leftArm, avatar1.rightArm);
         }
         else {
            animateArms(avatar2.leftArm, avatar2.rightArm);
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
      x1.scaling.x = 0.2;
      x1.rotation.y = 2.5;

      let x2 = BABYLON.Mesh.CreateBox('x', 3, scene);
      x2.scaling.x = 0.2;
      x2.rotation.y = -2.5;


      x2.parent = mesh;
      x2.position.y = 1.5;
      x1.parent = mesh;
      x2.material = getMaterialColor(trocar);

      return x1;
   }

   // Seleciona o valor em que será colocado no tabuleiro
   function getParent(mesh) {
      let jogador = trocar ? BABYLON.Mesh.CreateTorus('o', 3, 0.8, 50, scene) : getX(mesh);
      jogador.parent = mesh;
      jogador.value = trocar;
      trocar ? (jogador.position.y = 2) : (jogador.position.y = 1.4);
      jogador.material = getMaterialColor(trocar);
      trocar = !trocar;
   }

   function verifyWin() {
      // Verificação vertical
      for (let i = 0; i < 3; i++) {
         if (game[i].value && game[i + 3].value === game[i].value && game[i + 6].value === game[i].value) {
            setPlacar(game[i].value);
            highlightWinner([game[i], game[i + 3], game[i + 6]]);
            return;
         }
      }

      // Verificação horizontal
      for (let i = 0; i < 9; i += 3) {
         if (game[i].value && game[i + 1].value === game[i].value && game[i + 2].value === game[i].value) {
            setPlacar(game[i].value);
            highlightWinner([game[i], game[i + 1], game[i + 2]]);
            return;
         }
      }

      // Verificação das diagonais
      if (game[4].value) {
         if (game[0].value === game[4].value && game[8].value === game[4].value) {
            setPlacar(game[4].value);
            highlightWinner([game[0], game[4], game[8]]);
            return;
         }
         if (game[2].value === game[4].value && game[6].value === game[4].value) {
            setPlacar(game[4].value);
            highlightWinner([game[2], game[4], game[6]]);
            return;
         }
      }
      // Se não houver vitória, verifica empate
      verifyVelha();
   }

   function highlightWinner(winningPieces) {
      if (!winningPieces || winningPieces.length === 0) {
         console.error("Erro: Nenhuma peça vencedora encontrada.");
         return;
      }

      const winnerValue = winningPieces[0].value;
      let time = 0;

      // Criar materiais e aplicar animação de escala
      winningPieces.forEach(mesh => {
         if (mesh && mesh.getChildren) {
            const children = mesh.getChildren();

            children.forEach(child => {
               // Criar material para a animação
               const highlightMaterial = new BABYLON.StandardMaterial("highlightMaterial", scene);
               child.material = highlightMaterial;

               // Animação de escala
               const scaleAnimation = new BABYLON.Animation(
                  "scaleAnimation",
                  "scaling",
                  30,
                  BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                  BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
               );

               const scaleKeys = [
                  { frame: 0, value: child.scaling.clone() },
                  { frame: 15, value: child.scaling.multiply(new BABYLON.Vector3(1.5, 1.5, 1.5)) },
                  { frame: 30, value: child.scaling.clone() }
               ];

               scaleAnimation.setKeys(scaleKeys);
               child.animations = [scaleAnimation];
               scene.beginAnimation(child, 0, 30, true);

               // Se for um X, aplicar nas barras também
               if (child.getChildren) {
                  child.getChildren().forEach(grandChild => {
                     const grandChildMaterial = new BABYLON.StandardMaterial("highlightMaterial", scene);
                     grandChild.material = grandChildMaterial;

                     const grandChildScaleAnim = scaleAnimation.clone();
                     grandChild.animations = [grandChildScaleAnim];
                     scene.beginAnimation(grandChild, 0, 30, true);
                  });
               }
            });
         }
      });

      // Criar observer para atualização das cores
      colorObserver = scene.onBeforeRenderObservable.add(() => {
         time += 0.01; // Velocidade da variação das cores

         // Calcular componentes de cor usando senoides defasadas
         const r = 0.5 * (Math.sin(time) + 1) / 2;
         const g = 0.5 * (Math.sin(time + Math.PI / 3) + 1) / 2;
         const b = 0.5 * (Math.sin(time + 2 * Math.PI / 3) + 1) / 2;

         // Definir cores baseadas no vencedor
         const color = winnerValue === 'O' ?
            new BABYLON.Color3(r, g, b) :  // Mais vermelho para O
            new BABYLON.Color3(r, g, b);    // Mais amarelo para X

         // Aplicar cores a todas as peças
         winningPieces.forEach(mesh => {
            if (mesh && mesh.getChildren) {
               mesh.getChildren().forEach(child => {
                  if (child.material) {
                     child.material.diffuseColor = color;
                     child.material.emissiveColor = color.scale(0.5); // Adiciona brilho

                     // Aplicar às barras do X também
                     if (child.getChildren) {
                        child.getChildren().forEach(grandChild => {
                           if (grandChild.material) {
                              grandChild.material.diffuseColor = color;
                              grandChild.material.emissiveColor = color.scale(0.5);
                           }
                        });
                     }
                  }
               });
            }
         });
      });

      possoJogar = false;

      light.intensity = 0.0;
      pointLight.intensity = 1.0;
      spotLight2.intensity = 1.0;
      if (winningPieces[0].value === 'X') {
         scene.activeCamera = camera2;
         spotLight2.direction = new BABYLON.Vector3(0.5, -1, 1);
         spotLight2.position = new BABYLON.Vector3(1.5, 10, 10);
      }
      else if (winningPieces[0].value === 'O') {
         scene.activeCamera = camera3;
         spotLight2.direction = new BABYLON.Vector3(-0.5, -1, -1);
         spotLight2.position = new BABYLON.Vector3(1.5, 10, -10);
      }

      resetGame();

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
         pointLight.intensity = 1.0;
         light.intensity = 0.0;
         possoJogar = false;
         scene.activeCamera = camera2;
         resetGame();
      }
   }

   
   function resetGame() {
      setTimeout(() => {
         // Parar todas as animações antes do dispose
         scene.onBeforeRenderObservable.remove(colorObserver);
         scene.stopAllAnimations();
         scene.dispose();
         createScene();
         trocar = !trocar;
         possoJogar = true;
      }, 4000); 
   }

   return scene;
}