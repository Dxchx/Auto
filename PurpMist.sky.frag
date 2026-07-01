//                █████████████                      
//            ██████████████████████   
//         ███████████████████████████              
//        ████████████████████████████████           
//       ███████████████████████████████████         
//      ██████████       ██    ██████████████        
//     ████████         ███        ████████████      
//     ███████         █████          ██████████     
//     ██████          ████████         █████████    
//     ██████           █████████         ███████    
//      █████            █████████         ███████   
//       ██████           ████████          ██████   
//                        ███████           ██████   
//                   ██████████              █████   
//                                           █████   
//             ███████                       ████    
//          █████████████                    ███     
//        ██████████████████                ███      
//       █████████████████████             ███       
//      ██         ██████████████        ███         
//                    ███████████████████            
//                        █████████   
//               
// PurpMist Made By : Dxchx
#version 150

uniform vec2 u_Resolution;
uniform float u_Time;

out vec4 fragColor;

mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_Resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= u_Resolution.x / u_Resolution.y;

    vec3 col = vec3(0.0);
    float t = u_Time * 0.5;

    vec3 v = normalize(vec3(p, 1.0));
    vec3 w, pos;

    float z = 0.0;
    int steps = 100;

    for (int i = 0; i < steps; i++) {
        pos = z * v;

        pos.xy *= rot(sin(z / 6.0));
        pos.yz *= rot(z / 16.0 * cos(t / 6.0));

        pos.z += t * 3.0;
        pos = abs(pos);

        w = pos;
        pos += cos(pos.yzx * 8.0) / 8.0;

        for (int j = 1; j <= 6; j++) {
            float fj = float(j);
            pos += sin(pos.zxy * fj + t * 0.1) / fj;
        }

        float d = abs(2.0 - max(pos.x, pos.y)) / 8.0 + 0.003;
        z += d;

        col += vec3(
            dot(w - pos, w - pos)/4.0 + 0.3*(exp(z*0.04)-1.0),
            pos.x * pos.y / 1000.0,
            0.5 * exp(z*0.04) - 0.5
        );
    }

    // tonemap
    col = tanh(col / 90.0);

    // colmap
    float brightness = (col.r + col.g + col.b) / 3.0;
    brightness = pow(brightness, 1.5);

    // base purp
    vec3 darkPurple = vec3(0.15, 0.01, 0.3);
    vec3 lightPurple = vec3(0.604, 0.3686, 0.8471);
    vec3 purple = mix(darkPurple, lightPurple, brightness);

    // glow
    purple += brightness * 0.08 * vec3(1.0, 0.8, 1.0);

    // vari
    float edgeFactor = smoothstep(0.0, 1.0, length(uv - 0.5) * 2.0);
    purple += edgeFactor * vec3(0.05, 0.1, 0.12);

    purple.b += pow(brightness, 0.8) * 0.05;

    purple = clamp(purple, 0.0, 1.0);

    fragColor = vec4(purple, 1.0);
}
