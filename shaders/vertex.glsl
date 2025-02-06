// vertex.glsl
attribute vec3 aPosition; // Posição do vértice
attribute vec3 aNormal;   // Normal do vértice

uniform mat4 uModelViewMatrix; // Matriz de modelo e visão
uniform mat4 uProjectionMatrix; // Matriz de projeção

varying vec3 vNormal; // Passa a normal para o fragment shader

void main() {
    vNormal = aNormal;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}