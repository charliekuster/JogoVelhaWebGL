// fragment.glsl
precision mediump float;

varying vec3 vNormal; // Normal recebida do vertex shader

uniform vec3 uColor; // Cor da peça
uniform float uTime; // Tempo para animação

void main() {
    // Efeito de brilho baseado na normal e no tempo
    float glow = abs(sin(uTime)) * 0.5 + 0.5;
    vec3 glowColor = uColor * glow;

    gl_FragColor = vec4(glowColor, 1.0);
}