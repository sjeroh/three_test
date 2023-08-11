import * as THREE from "https://unpkg.com/three@0.124.0/build/three.module.js";
import { FBXLoader } from "https://unpkg.com/three@0.124.0/examples/jsm/loaders/FBXLoader.js";
import {GLTFLoader} from "https://unpkg.com/three@0.124.0/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader} from "https://unpkg.com/three@0.124.0/examples/jsm/loaders/RGBELoader.js";

let WIDTH = 1000;
let HEIGHT = 1000;

let scene, camera, renderer;

let model = new THREE.Object3D();
let modelBody = new THREE.Object3D();
gsap.registerPlugin(ScrollTrigger);


const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, WIDTH / HEIGHT, 1, 500);
    camera.position.set(0, 10, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    //alpha : true 배경 투명으로
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio( window.devicePixelRatio );

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 1;
				renderer.useLegacyLights = false;


    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    document.querySelector("#canvasWrap").appendChild(renderer.domElement);

    const loader = new RGBELoader();
    loader.setDataType(THREE.UnsignedByteType); // 데이터 타입 설정
    
    // HDRI 이미지를 로드합니다.
    loader.load('hdr/royal_esplanade_1k.hdr', (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;
      texture.mapping = THREE.EquirectangularReflectionMapping;
    //   scene.backgroundBlurriness = 0.35;
    
      // 추가적인 렌더링 로직을 수행합니다.
    });


    {
        //조명 넣기
        var light = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
        light.position.set(100, 100, 100);
        scene.add(light);
    }
    {
        //조명
        const color = 0xffffff;
        const intensity = 2;
        const light = new THREE.PointLight(color, intensity);
        light.position.set(140, 160, 150);
        scene.add(light);
    }

    // fbxLoadFunc("./model/can.FBX");
    glbLoadFunc("./my3d/3d_glass.gltf");
};

const glbLoadFunc = (modelName) => {
    const glbLoader = new GLTFLoader();
    glbLoader.load(
        modelName,
        (gltf) => {
            const object = gltf.scene;


            object.traverse((child) => {
                if (child.isMesh && child.material) {
                  // 투과 속성을 적용할 재질에 대해 KHR_materials_transmission 확장을 설정
                  if (child.material.extensions && child.material.extensions.KHR_materials_transmission) {
                    // 투과 속성 값을 원하는 값으로 설정 (0: 완전 투명, 1: 완전 불투명)
                    child.material.extensions.KHR_materials_transmission.transmissionFactor = 0.5;
                  }
                }
              console.log(child.material);

              });

              console.log(object);

            //크기 조절
            let scaleNum = 0.6;
            // object.scale.set(scaleNum, scaleNum, scaleNum);
            model.scale.set(scaleNum, scaleNum, scaleNum);
            // console.log(object.scale);

            model.add(object.children[0]);
            model.rotation.set(0.4, 9.3, 0);

            model.position.set(0, -1, 0);
            modelBody.position.set(0, 10, 0);
            modelBody.add(model);
            scene.add(modelBody);

            // const modelBody2 = modelBody.clone();
            // scene.add(modelBody2);
            // modelBody2.position.set(0, 50, -40);

            // const modelBody3 = modelBody.clone();
            // scene.add(modelBody3);
            // modelBody3.position.set(20, -20, -20);

            // const modelBody4 = modelBody.clone();
            // scene.add(modelBody4);
            // modelBody4.position.set(-20, -20, 20);

            // const modelBody5 = modelBody.clone();
            // scene.add(modelBody5);
            // modelBody5.position.set(-20, -20, 20);

            // const modelBody6 = modelBody.clone();
            // scene.add(modelBody6);
            // modelBody6.position.set(-20, -20, 20);

            gsap.from("h1", {
                duration: 0.8,
                delay: 0.35,
                z: 500,
                alpha: 0,
                ease: "Power2.easeInOut",
            });
            gsap.from(model.position, {
                duration: 1.8,
                delay: 0.5,
                x: 0,
                // y: -50,
                z: -100,
                ease: "Power2.easeInOut",
            });

            gsap.to(model.position, {
                scrollTrigger: {
                  trigger: ".box2",
                  markers: true,
                  start: "top center",
                      scrub: true,
                },
                x: 10, duration: 4,});
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
            console.log(error);
        }
    );
};

let moveNum = 0;
let scrollTop = 0;

const animate = () => {
    moveNum += (scrollTop / 500 - moveNum) * 0.1;
    // console.log(moveNum);

    model.rotation.y += 0.01;
    modelBody.rotation.y = moveNum;
    modelBody.rotation.z = moveNum / 12;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

init();
animate();

const scrollFunc = () => {
    scrollTop = window.scrollY; //현재 스크롤 위치
    // console.log(scrollTop);
};

window.addEventListener("scroll", scrollFunc);
