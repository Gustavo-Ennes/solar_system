export default{
  "id": 2708,
  "name": "Fireball",
  "fragment": "#define iterations 17\n#define volsteps 3\n#define sparsity 0.5\n#define stepsize 0.2\n#define frequencyVariation 1.3\n#define PI 3.141592653589793238462643383279\n\n#extension GL_OES_standard_derivatives : enable\n\nprecision highp float;\nprecision highp int;\nuniform float time;\nuniform float scale;\nuniform sampler2D noiseImage;\nuniform vec2 Perlin_Clouds1542297016653_208_speed;\nuniform float cloudBrightness;\nuniform float cloudMorphSpeed;\nuniform float cloudMorphDirection;\nuniform float cloudCover;\nuniform vec3 Perlin_Clouds1542297016653_208_color;\nuniform sampler2D tExplosion;\nuniform float Fireball1542297114141_236_brightness;\nuniform float mirrorReflection;\nuniform samplerCube reflectionSampler;\nuniform vec3 Universe_Nursery1542297209706_275_color;\nuniform float twinkleSpeed;\nuniform float Universe_Nursery1542297209706_275_speed;\nuniform float Universe_Nursery1542297209706_275_brightness;\nuniform float distfading;\nvarying vec2 Oil_or_Fire1542296711168_155_vUv;\nvarying vec3 Oil_or_Fire1542296711168_155_vPosition;\nvarying vec3 Oil_or_Fire1542296711168_155_vNormal;\nfloat rand(vec2 n) \n                        {\n                            return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\n                        }\nfloat Oil_or_Fire1542296711168_155_noise(vec2 n) \n                        {\n                            const vec2 d = vec2(0.0, 1.0);\n                            vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));\n                            return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);\n                        }\nfloat fbm(vec2 n) \n                        {\n                            float total = 0.0, amplitude = 1.0;\n                            for (int i = 0;\n i < 7; i++) \n                            {\n                                total += Oil_or_Fire1542296711168_155_noise(n) * amplitude;\n                                n += n;\n                                amplitude *= 0.5;\n                            }\n                            return total;\n                        }\nvarying vec2 Perlin_Clouds1542297016653_208_vUv;\nvarying float Fireball1542297114141_236_noise;\nfloat random(vec3 scale, float seed) \n                        {\n                            return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n                        }\nvarying vec3 vReflect;\nvarying vec2 Universe_Nursery1542297209706_275_vUv;\nvarying vec3 Universe_Nursery1542297209706_275_vPosition;\nvarying vec3 Universe_Nursery1542297209706_275_vNormal;\nvec4 Oil_or_Fire1542296711168_155_main() \n                        {\n                            vec4 Oil_or_Fire1542296711168_155_gl_FragColor = vec4(0.0);\n                            const vec3 c1 = vec3(0.1, 0.0, 0.0);\n                            const vec3 c2 = vec3(0.7, 0.0, 0.0);\n                            const vec3 c3 = vec3(0.2, 0.0, 0.0);\n                            const vec3 c4 = vec3(1.0, 0.9, 0.0);\n                            const vec3 c5 = vec3(0.1);\n                            const vec3 c6 = vec3(0.9);\n                            vec2 p = Oil_or_Fire1542296711168_155_vUv.xy * 8.0;\n                            float q = fbm(p - time * 0.1);\n                            vec2 r = vec2(fbm(p + q + time * 0.7 - p.x - p.y), fbm(p + q - time * 0.4));\n                            vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);\n                            Oil_or_Fire1542296711168_155_gl_FragColor = vec4(c * cos(1.57 * Oil_or_Fire1542296711168_155_vUv.y), 1.0);\n                            return Oil_or_Fire1542296711168_155_gl_FragColor *= 1.0;\n                        }\nvec4 Perlin_Clouds1542297016653_208_main() \n                        {\n                            vec4 Perlin_Clouds1542297016653_208_gl_FragColor = vec4(0.0);\n                            vec4 colorOutput = vec4(0.0);\n                            vec2 elapsed = time * Perlin_Clouds1542297016653_208_speed;\n                            vec2 uv = (Perlin_Clouds1542297016653_208_vUv + elapsed) * scale;\n                            for (int i = 1;\n i <= 4; i++) \n                            {\n                                float f = float(i);\n                                float divis = pow(2.0, f);\n                                float uvPow = pow(2.0, f - 1.0);\n                                vec4 computed = texture2D(noiseImage, uvPow * (uv + vec2(0.1, 0.0) + (time * 0.001 * cloudMorphSpeed))) / divis;\n                                computed += texture2D(noiseImage, uvPow * (uv + vec2(0.1))) / divis;\n                                computed += texture2D(noiseImage, uvPow * (uv + vec2(0.0, 0.1) + (cloudMorphDirection * time * 0.001 * cloudMorphSpeed))) / divis;\n                                computed *= 0.25;\n                                colorOutput += computed;\n                            }\n                            colorOutput = max(colorOutput - (1.0 - cloudCover), 0.0);\n                            colorOutput = vec4(1.0 - pow((1.0 - cloudBrightness), colorOutput.r * 255.0));\n                            Perlin_Clouds1542297016653_208_gl_FragColor = vec4(Perlin_Clouds1542297016653_208_color * colorOutput.rgb, 1.0);\n                            return Perlin_Clouds1542297016653_208_gl_FragColor *= 1.0;\n                        }\nvec4 Fireball1542297114141_236_main() \n                        {\n                            vec4 Fireball1542297114141_236_gl_FragColor = vec4(0.0);\n                            float offset = .01 * random(vec3(12.9898, 78.233, 0151.7182), 0.0);\n                            float depth = 0.25;\n                            vec2 tPos = vec2(0, (Fireball1542297114141_236_brightness + depth) * Fireball1542297114141_236_noise + offset);\n                            vec4 color = texture2D(tExplosion, (Fireball1542297114141_236_brightness - depth) - tPos);\n                            Fireball1542297114141_236_gl_FragColor = vec4(color.rgb, 1.0);\n                            return Fireball1542297114141_236_gl_FragColor *= 1.0;\n                        }\nvec4 Reflection_Cube_Map1542297152442_251_main() \n                        {\n                            vec4 Reflection_Cube_Map1542297152442_251_gl_FragColor = vec4(0.0);\n                            vec4 cubeColor = textureCube(reflectionSampler, vec3(mirrorReflection * vReflect.x, vReflect.yz));\n                            cubeColor.w = 1.0;\n                            Reflection_Cube_Map1542297152442_251_gl_FragColor = cubeColor;\n                            return Reflection_Cube_Map1542297152442_251_gl_FragColor *= 0.7;\n                        }\nvec4 Universe_Nursery1542297209706_275_main(void) \n                        {\n                            vec4 Universe_Nursery1542297209706_275_gl_FragColor = vec4(0.0);\n                            vec2 uv = Universe_Nursery1542297209706_275_vUv.xy + 0.5;\n                            uv.x += time * Universe_Nursery1542297209706_275_speed * 0.1;\n                            vec3 dir = vec3(uv * 2.0, 1.0);\n                            float s = 0.1, fade = 0.01;\n                            vec3 starColor = vec3(0.0);\n                            for (int r = 0;\n r < volsteps; ++r) \n                            {\n                                vec3 p = (time * Universe_Nursery1542297209706_275_speed * twinkleSpeed) + dir * (s * 0.5);\n                                p = abs(vec3(frequencyVariation) - mod(p, vec3(frequencyVariation * 2.0)));\n                                float prevlen = 0.0, a = 0.0;\n                                for (int i = 0;\n i < iterations; ++i) \n                                {\n                                    p = abs(p);\n                                    p = p * (1.0 / dot(p, p)) + (-sparsity);\n                                    float len = length(p);\n                                    a += abs(len - prevlen);\n                                    prevlen = len;\n                                }\n                                a *= a * a;\n                                starColor += (vec3(s, s * s, s * s * s) * a * Universe_Nursery1542297209706_275_brightness + 1.0) * fade;\n                                fade *= distfading;\n                                s += stepsize;\n                            }\n                            starColor = min(starColor, vec3(1.2));\n                            float intensity = min(starColor.r + starColor.g + starColor.b, 0.7);\n                            vec2 sgn = vec2(Universe_Nursery1542297209706_275_vUv.xy) * 2.0 - 1.0;\n                            vec2 gradient = vec2(dFdx(intensity) * sgn.x, dFdy(intensity) * sgn.y);\n                            float cutoff = max(max(gradient.x, gradient.y) - 0.1, 0.0);\n                            starColor *= max(1.0 - cutoff * 6.0, 0.3);\n                            Universe_Nursery1542297209706_275_gl_FragColor = vec4(starColor * Universe_Nursery1542297209706_275_color, 1.0);\n                            return Universe_Nursery1542297209706_275_gl_FragColor *= 1.0;\n                        }\nvoid main() \n                        {\n                            gl_FragColor = (Oil_or_Fire1542296711168_155_main() + Perlin_Clouds1542297016653_208_main() + Fireball1542297114141_236_main() + Reflection_Cube_Map1542297152442_251_main() + Universe_Nursery1542297209706_275_main());                        }\n",
  "vertex": "precision highp float;\nprecision highp int;\nuniform float time;\nuniform float fireSpeed;\nuniform float pulseHeight;\nuniform float displacementHeight;\nuniform float turbulenceDetail;\nattribute vec2 uv2;\nvarying vec2 Oil_or_Fire1542296711168_155_vUv;\nvarying vec3 Oil_or_Fire1542296711168_155_vPosition;\nvarying vec3 Oil_or_Fire1542296711168_155_vNormal;\nvarying vec3 Perlin_Clouds1542297016653_208_vPosition;\nvarying vec3 Perlin_Clouds1542297016653_208_vNormal;\nvarying vec2 Perlin_Clouds1542297016653_208_vUv;\nvarying vec2 vUv2;\nvarying float Fireball1542297114141_236_noise;\nvec3 mod289(vec3 x) \n                        {\n                            return x - floor(x * (1.0 / 289.0)) * 289.0;\n                        }\nvec4 mod289(vec4 x) \n                        {\n                            return x - floor(x * (1.0 / 289.0)) * 289.0;\n                        }\nvec4 permute(vec4 x) \n                        {\n                            return mod289(((x * 34.0) + 1.0) * x);\n                        }\nvec4 taylorInvSqrt(vec4 r) \n                        {\n                            return 1.79284291400159 - 0.85373472095314 * r;\n                        }\nvec3 fade(vec3 t) \n                        {\n                            return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n                        }\nfloat cnoise(vec3 P) \n                        {\n                            vec3 Pi0 = floor(P);\n                            vec3 Pi1 = Pi0 + vec3(1.0);\n                            Pi0 = mod289(Pi0);\n                            Pi1 = mod289(Pi1);\n                            vec3 Pf0 = fract(P);\n                            vec3 Pf1 = Pf0 - vec3(1.0);\n                            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n                            vec4 iy = vec4(Pi0.yy, Pi1.yy);\n                            vec4 iz0 = Pi0.zzzz;\n                            vec4 iz1 = Pi1.zzzz;\n                            vec4 ixy = permute(permute(ix) + iy);\n                            vec4 ixy0 = permute(ixy + iz0);\n                            vec4 ixy1 = permute(ixy + iz1);\n                            vec4 gx0 = ixy0 * (1.0 / 7.0);\n                            vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n                            gx0 = fract(gx0);\n                            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n                            vec4 sz0 = step(gz0, vec4(0.0));\n                            gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n                            gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n                            vec4 gx1 = ixy1 * (1.0 / 7.0);\n                            vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n                            gx1 = fract(gx1);\n                            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n                            vec4 sz1 = step(gz1, vec4(0.0));\n                            gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n                            gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n                            vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\n                            vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\n                            vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\n                            vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\n                            vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\n                            vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\n                            vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\n                            vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\n                            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n                            g000 *= norm0.x;\n                            g010 *= norm0.y;\n                            g100 *= norm0.z;\n                            g110 *= norm0.w;\n                            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n                            g001 *= norm1.x;\n                            g011 *= norm1.y;\n                            g101 *= norm1.z;\n                            g111 *= norm1.w;\n                            float n000 = dot(g000, Pf0);\n                            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n                            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n                            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n                            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n                            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n                            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n                            float n111 = dot(g111, Pf1);\n                            vec3 fade_xyz = fade(Pf0);\n                            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n                            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n                            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n                            return 2.2 * n_xyz;\n                        }\nfloat pnoise(vec3 P, vec3 rep) \n                        {\n                            vec3 Pi0 = mod(floor(P), rep);\n                            vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);\n                            Pi0 = mod289(Pi0);\n                            Pi1 = mod289(Pi1);\n                            vec3 Pf0 = fract(P);\n                            vec3 Pf1 = Pf0 - vec3(1.0);\n                            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n                            vec4 iy = vec4(Pi0.yy, Pi1.yy);\n                            vec4 iz0 = Pi0.zzzz;\n                            vec4 iz1 = Pi1.zzzz;\n                            vec4 ixy = permute(permute(ix) + iy);\n                            vec4 ixy0 = permute(ixy + iz0);\n                            vec4 ixy1 = permute(ixy + iz1);\n                            vec4 gx0 = ixy0 * (1.0 / 7.0);\n                            vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n                            gx0 = fract(gx0);\n                            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n                            vec4 sz0 = step(gz0, vec4(0.0));\n                            gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n                            gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n                            vec4 gx1 = ixy1 * (1.0 / 7.0);\n                            vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n                            gx1 = fract(gx1);\n                            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n                            vec4 sz1 = step(gz1, vec4(0.0));\n                            gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n                            gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n                            vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\n                            vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\n                            vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\n                            vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\n                            vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\n                            vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\n                            vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\n                            vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\n                            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n                            g000 *= norm0.x;\n                            g010 *= norm0.y;\n                            g100 *= norm0.z;\n                            g110 *= norm0.w;\n                            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n                            g001 *= norm1.x;\n                            g011 *= norm1.y;\n                            g101 *= norm1.z;\n                            g111 *= norm1.w;\n                            float n000 = dot(g000, Pf0);\n                            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n                            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n                            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n                            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n                            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n                            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n                            float n111 = dot(g111, Pf1);\n                            vec3 fade_xyz = fade(Pf0);\n                            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n                            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n                            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n                            return 2.2 * n_xyz;\n                        }\nfloat turbulence(vec3 p) \n                        {\n                            float t = -0.5;\n                            for (float f = 1.0;\n f <= 10.0; f++) \n                            {\n                                float power = pow(2.0, f);\n                                t += abs(pnoise(vec3(power * p), vec3(10.0, 10.0, 10.0)) / power);\n                            }\n                            return t;\n                        }\nvarying vec3 vReflect;\nvarying vec2 Universe_Nursery1542297209706_275_vUv;\nvarying vec3 Universe_Nursery1542297209706_275_vPosition;\nvarying vec3 Universe_Nursery1542297209706_275_vNormal;\nvec4 Oil_or_Fire1542296711168_155_main() \n                        {\n                            vec4 Oil_or_Fire1542296711168_155_gl_Position = vec4(0.0);\n                            Oil_or_Fire1542296711168_155_vUv = uv;\n                            Oil_or_Fire1542296711168_155_vPosition = position;\n                            Oil_or_Fire1542296711168_155_vNormal = normal;\n                            Oil_or_Fire1542296711168_155_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                            return Oil_or_Fire1542296711168_155_gl_Position *= 1.0;\n                        }\nvec4 Perlin_Clouds1542297016653_208_main() \n                        {\n                            vec4 Perlin_Clouds1542297016653_208_gl_Position = vec4(0.0);\n                            Perlin_Clouds1542297016653_208_vNormal = normal;\n                            Perlin_Clouds1542297016653_208_vUv = uv;\n                            vUv2 = uv2;\n                            Perlin_Clouds1542297016653_208_vPosition = position;\n                            Perlin_Clouds1542297016653_208_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                            return Perlin_Clouds1542297016653_208_gl_Position *= 1.0;\n                        }\nvec4 Fireball1542297114141_236_main() \n                        {\n                            vec4 Fireball1542297114141_236_gl_Position = vec4(0.0);\n                            Fireball1542297114141_236_noise = -1.1 * turbulence(turbulenceDetail * normal + (time * fireSpeed));\n                            float b = pulseHeight * pnoise(0.05 * position + vec3(1.0 * time), vec3(100.0));\n                            float displacement = (0.0 - displacementHeight) * Fireball1542297114141_236_noise + b;\n                            vec3 newPosition = position + normal * displacement;\n                            Fireball1542297114141_236_gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);\n                            return Fireball1542297114141_236_gl_Position *= 1.0;\n                        }\nvec4 Reflection_Cube_Map1542297152442_251_main() \n                        {\n                            vec4 Reflection_Cube_Map1542297152442_251_gl_Position = vec4(0.0);\n                            vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;\n                            vec3 cameraToVertex = normalize(worldPosition - cameraPosition);\n                            vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);\n                            vReflect = reflect(cameraToVertex, worldNormal);\n                            Reflection_Cube_Map1542297152442_251_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                            return Reflection_Cube_Map1542297152442_251_gl_Position *= 0.7;\n                        }\nvec4 Universe_Nursery1542297209706_275_main() \n                        {\n                            vec4 Universe_Nursery1542297209706_275_gl_Position = vec4(0.0);\n                            Universe_Nursery1542297209706_275_vUv = uv;\n                            Universe_Nursery1542297209706_275_vPosition = position;\n                            Universe_Nursery1542297209706_275_vNormal = normal;\n                            Universe_Nursery1542297209706_275_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                            return Universe_Nursery1542297209706_275_gl_Position *= 1.0;\n                        }\nvoid main() \n                        {\n                            gl_Position = Oil_or_Fire1542296711168_155_main() + Perlin_Clouds1542297016653_208_main() + Fireball1542297114141_236_main() + Reflection_Cube_Map1542297152442_251_main() + Universe_Nursery1542297209706_275_main();                        }\n",
  "uniforms": {
    "time": {
      "type": "f",
      "glslType": "float"
    },
    "cameraPosition": {
      "type": "v3",
      "glslType": "vec3"
    },
    "noiseImage": {
      "value": null,
      "type": "t",
      "glslType": "sampler2D"
    },
    "scale": {
      "value": "0.01",
      "type": "f",
      "glslType": "float"
    },
    "cloudCover": {
      "value": "0.6790749",
      "type": "f",
      "glslType": "float"
    },
    "cloudBrightness": {
      "value": "0.0552574",
      "type": "f",
      "glslType": "float"
    },
    "cloudMorphSpeed": {
      "value": "0",
      "type": "f",
      "glslType": "float"
    },
    "cloudMorphDirection": {
      "value": "-1",
      "type": "f",
      "glslType": "float"
    },
    "Perlin_Clouds1542297016653_208_speed": {
      "value": {
        "x": -0.002307692307692309,
        "y": -0.000769230769230772
      },
      "type": "v2",
      "glslType": "vec2"
    },
    "Perlin_Clouds1542297016653_208_color": {
      "value": {
        "r": 1,
        "g": 1,
        "b": 1
      },
      "type": "c",
      "glslType": "vec3"
    },
    "tExplosion": {
      "value": null,
      "type": "t",
      "glslType": "sampler2D"
    },
    "fireSpeed": {
      "value": "0.1914",
      "type": "f",
      "glslType": "float"
    },
    "turbulenceDetail": {
      "value": "0.1",
      "type": "f",
      "glslType": "float"
    },
    "displacementHeight": {
      "value": "0.52587488",
      "type": "f",
      "glslType": "float"
    },
    "pulseHeight": {
      "value": "0.13246408",
      "type": "f",
      "glslType": "float"
    },
    "Fireball1542297114141_236_brightness": {
      "value": "0.8027744",
      "type": "f",
      "glslType": "float"
    },
    "mirrorReflection": {
      "value": "3",
      "type": "f",
      "glslType": "float"
    },
    "reflectionSampler": {
      "value": null,
      "type": "t",
      "glslType": "samplerCube"
    },
    "distfading": {
      "value": "0.7",
      "type": "f",
      "glslType": "float"
    },
    "twinkleSpeed": {
      "value": "200",
      "type": "f",
      "glslType": "float"
    },
    "Universe_Nursery1542297209706_275_color": {
      "value": {
        "r": 0.8941176470588236,
        "g": 0.2784313725490196,
        "b": 0.2784313725490196
      },
      "type": "c",
      "glslType": "vec3"
    },
    "Universe_Nursery1542297209706_275_speed": {
      "value": "0.0001",
      "type": "f",
      "glslType": "float"
    },
    "Universe_Nursery1542297209706_275_brightness": {
      "value": "0.0018",
      "type": "f",
      "glslType": "float"
    }
  },
  "url": "http://shaderfrog.com/app/view/2708",
  "user": {
    "username": "yeet123",
    "url": "http://shaderfrog.com/app/profile/andrewray"
  }
}