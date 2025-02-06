// blur.glsl
precision mediump float;

uniform sampler2D uTexture; // Textura da cena
uniform vec2 uResolution;   // Resolução da tela
uniform float uBlurAmount;  // Intensidade do blur

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec4 color = vec4(0.0);

    // Aplicar blur (kernel simples)
    for (int i = -2; i <= 2; i++) {
        for (int j = -2; j <= 2; j++) {
            color += texture2D(uTexture, uv + vec2(i, j) * uBlurAmount / uResolution);
        }
    }
    color /= 25.0; // Normalizar

    gl_FragColor = color;
}