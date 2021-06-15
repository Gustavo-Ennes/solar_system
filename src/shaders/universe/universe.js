export default{
  "id": 2806,
  "name": "Fork of Space Cube Wall",
  "fragment": "precision highp float;\nprecision highp int;\nuniform float time;\nuniform float starRadius;\nuniform vec3 starColor;\nuniform float starDensity;\nuniform float speed;\nuniform vec2 resolution;\nvarying vec2 vUv;\nfloat starrand(float seedx, float seedy, int seedp) \n                        {\n                            return 0.05 + 0.9 * fract(sin(float(seedp) * 437.234) * 374.2542 - cos(seedx * 432.252) * 23.643 + sin(seedy * 73.2454) * 372.23455);\n                        }\nvec4 Parallax_Starfield1456026810894_97_main(void) \n                        {\n                            vec4 Parallax_Starfield1456026810894_97_gl_FragColor = vec4(0.0);\n                            vec2 position = vUv.xy * resolution.xy;\n                            Parallax_Starfield1456026810894_97_gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n                            for (int p = 0;\n p < 20; p++) \n                            {\n                                float scale = (1.0 / starRadius) + float(p);\n                                vec2 vpos = position * scale;\n                                vpos.x += (time * speed) / scale;\n                                vpos.y += speed * time / scale;\n                                vec2 spos = vec2(starrand(floor(vpos.x), floor(vpos.y), p), starrand(10.5 + floor(vpos.x), 10.5 + floor(vpos.y), p));\n                                float px = scale / 80.0 / 3.0;\n                                float size = 1.0 / (scale * (500.0 / starDensity));\n                                float brite = 1.0;\n                                if (size < px) \n                                {\n                                    brite = size / px;\n                                    size = px;\n                                }\n                                 Parallax_Starfield1456026810894_97_gl_FragColor.rgb += starColor * min(1.0, max(0.0, starDensity - length(spos - fract(vpos)) / size)) * brite;\n                            }\n                            return Parallax_Starfield1456026810894_97_gl_FragColor *= 1.0;\n                        }\nvoid main() \n                        {\n                            gl_FragColor = (Parallax_Starfield1456026810894_97_main());                        }\n",
  "vertex": "precision highp float;\nprecision highp int;\nuniform float time;\nattribute vec2 uv2;\nvarying vec3 vPosition;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec2 vUv2;\nvec4 Parallax_Starfield1456026810894_97_main() \n                        {\n                            vec4 Parallax_Starfield1456026810894_97_gl_Position = vec4(0.0);\n                            vNormal = normal;\n                            vUv = uv;\n                            vUv2 = uv2;\n                            vPosition = position;\n                            Parallax_Starfield1456026810894_97_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                            return Parallax_Starfield1456026810894_97_gl_Position *= 1.0;\n                        }\nvoid main() \n                        {\n                            gl_Position = Parallax_Starfield1456026810894_97_main();                        }\n",
  "uniforms": {
    "cameraPosition": {
      "type": "v3",
      "glslType": "vec3"
    },
    "time": {
      "type": "f",
      "glslType": "float"
    },
    "starRadius": {
      "value": "0.2",
      "type": "f",
      "glslType": "float"
    },
    "starDensity": {
      "value": "3",
      "type": "f",
      "glslType": "float"
    },
    "starColor": {
      "value": {
        "r": 0.796078431372549,
        "g": 0.9254901960784314,
        "b": 0.9411764705882353
      },
      "type": "c",
      "glslType": "vec3"
    },
    "speed": {
      "value": "0.01",
      "type": "f",
      "glslType": "float"
    },
    "resolution": {
      "value": {
        "x": "10",
        "y": "10"
      },
      "type": "v2",
      "glslType": "vec2"
    }
  },
  "url": "http://shaderfrog.com/app/view/2806",
  "user": {
    "username": "maksim",
    "url": "http://shaderfrog.com/app/profile/andrewray"
  }
}