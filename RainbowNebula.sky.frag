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
// Rainbow Nebula By : Dxchx
#version 150

uniform vec2 u_Resolution;
uniform float u_Time;

out vec4 fragColor;

// --------------------------------------------------
// Orb
// --------------------------------------------------
float orb(vec3 p) {
    float t = u_Time;

    return length(p - vec3(
        sin(sin(t*0.2)+t*0.4) * 2.0,
        1.0 + sin(sin(t*0.5)+t*0.2) * 2.0,
        12.0 + t + cos(t*0.3)*8.0
    )) - 0.1;
}

// --------------------------------------------------
// Rainbow
// --------------------------------------------------
vec3 rainbow(float x)
{
    return 0.5 + 0.5*cos(x + vec3(0.0,2.094,4.188));
}

// --------------------------------------------------
// Main
// --------------------------------------------------
void main() {

    vec2 uv = gl_FragCoord.xy / u_Resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= u_Resolution.x / u_Resolution.y;

    float t = u_Time;

    vec3 col = vec3(0.0);

    // Drift
    p += vec2(cos(t*0.25)*0.25, sin(t*0.2)*0.2);

    float d = 0.0;
    float s = 0.0;
    float e = 0.0;

    for(int i=0; i<96; i++) {

        vec3 pos = vec3(p*d, d + t);

        // orb
        e = orb(pos);

        // swirl
        float angle = 0.1*t + pos.z/16.0;
        mat2 rot = mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
        pos.xy *= rot;

        // mirrored planes
        s = 4.0 - abs(pos.y);

        // turbulence
        float a = 0.42;
        for(int j=0; j<4; j++){
            pos += cos(0.4*t + pos.yzx) * 0.25;
            s -= abs(dot(sin(0.1*t + pos * a), vec3(0.22))) / a;
            a *= 2.0;
        }

        // prisma
        vec3 prism = rainbow(pos.z*0.6 + t*1.5);

        col += prism / (3.0 + abs(s)*2.0 + abs(e)*3.0);

        d += 0.04 + 0.2 * abs(s);
    }

    // tonemap
    col = tanh(col * 0.9);

    fragColor = vec4(col,1.0);
}
