import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.108.0/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://unpkg.com/three@0.108.0/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "https://unpkg.com/three@0.108.0/examples/jsm/loaders/GLTFLoader.js";


let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let scene, camera, renderer;
let controls;

let mixers = [];
let action;

//샘플 3d 모델링 다운로드
//1. https://www.mixamo.com/
//2. https://free3d.com/ko/3d-models/fbx
//3. https://www.turbosquid.com/

const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#eee"); //배경 컬러
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.1, 2000);
    camera.position.set(50, 50, 100);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    document.body.appendChild(renderer.domElement);

    //카메라 컨트롤
    controls = new OrbitControls(camera, renderer.domElement);

    const axes = new THREE.AxesHelper(150);
    scene.add(axes);

    // const gridHelper = new THREE.GridHelper(240, 20);
    // scene.add(gridHelper);

    //바닥
    const geometry = new THREE.CylinderGeometry(400, 400, 5, 100);
    const material = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -2, 0);
    mesh.receiveShadow = true;
    scene.add(mesh);

    {
        //조명 넣기
        var light = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
        light.position.set(100, 100, 100);
        scene.add(light);
    }
    {
        //조명
        const color = 0xffffff;
        const intensity = 0.6;
        const light = new THREE.PointLight(color, intensity);
        light.castShadow = true;

        light.position.set(40, 120, 40);

        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.radius = 5;

        const sphereSize = 10;
        const pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
        scene.add(pointLightHelper);
        scene.add(light);
    }

    {
        //안개
        const near = 100;
        const far = 300;
        const color = "#eeeeee";
        scene.fog = new THREE.Fog(color, near, far);
    }

    glbLoadFunc("./ani_water/WATER.gltf");

    
    const fbxLoader = new FBXLoader();

    fbxLoader.load(
        "./model/Taunt.fbx",
        // "./model/standing.FBX",
        (object) => {
            console.log(object);

            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    // child.receiveShadow = true;
                }
            });

            //애니메이션
            object.mixer = new THREE.AnimationMixer(object);
            // console.log(object.mixer);

            mixers.push(object.mixer);
            // console.log(mixers.length);

            if (mixers.length > 0) {
                action = object.mixer.clipAction(object.animations[0]);
                // console.log(object.animations);
                // action.play();
            }

            object.scale.set(0.3, 0.3, 0.3);
            object.position.y = 0;
            // object.position.x = -25;
            // object.position.z = 55;
            scene.add(object);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
            console.log(error);
        }
    );

    
};

const glbLoadFunc = (modelName) => {
    const glbLoader = new GLTFLoader();
    glbLoader.load(
        modelName,
        (gltf) => {
            const object = gltf.scene;

            // 로드된 객체가 scene 속성을 가지고 있는지 확인합니다.
            if (!object || !object.isObject3D) {
                console.error("잘못된 로드된 객체입니다.");
                return;
            }

            console.log(object);

            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    // child.receiveShadow = true;
                }
            });

            // 애니메이션
            object.mixer = new THREE.AnimationMixer(object);
            mixers.push(object.mixer);

            // if (mixers.length > 0) {
            //     let action = object.mixer.clipAction(gltf.animations[1]);
            //     action.play();
            // }

            if (gltf.animations && gltf.animations.length > 0) {
                // 애니메이션 데이터가 있다면, 첫 번째 애니메이션을 재생하도록 합니다.
                const action = object.mixer.clipAction(gltf.animations[0]);
                action.play();
            } else {
                console.log("No animations found.");
            }

            // 크기 조절
            let scaleNum = 1;
            object.scale.set(scaleNum, scaleNum, scaleNum);

            model.add(object);
            scene.add(model);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% 로드됨");
        },
        (error) => {
            console.log(error);
        }
    );
};

const clock = new THREE.Clock();

const animate = () => {
    const delta = clock.getDelta();

    for (let i = 0; i < mixers.length; i++) {
        mixers[i].update(delta);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

const stageResize = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    //카메라 비율을 화면 비율에 맞춘다
};

init();
animate();
window.addEventListener("resize", stageResize);

//fbxLoadFunc("./model/car.FBX");
// fbxLoadFunc("./model/standing.FBX");
// fbxLoadFunc("./model/Building_1/building.fbx");





// const fbxLoadFunc = (modelName) => {
//     const fbxLoader = new FBXLoader();

//     fbxLoader.load(
//         modelName,
//         (object) => {
//             console.log(object);

//             object.traverse(function (child) {
//                 if (child.isMesh) {
//                     console.log(child);
//                     child.castShadow = true;
//                     // child.receiveShadow = true;
//                 }
//             });

//             //애니메이션
//             // if (object.animations != undefined) {
//             //     object.mixer = new THREE.AnimationMixer(object);
//             //     // console.log(object.mixer);

//             //     mixers.push(object.mixer);
//             //     // console.log(mixers.length);

//             //     if (mixers.length > 0) {
//             //         var action = object.mixer.clipAction(object.animations[0]);
//             //         //console.log(object.animations);
//             //         action.play();
//             //     }
//             // }

//             //크기 조절
//             let scaleNum = 0.4;
//             object.scale.set(scaleNum, scaleNum, scaleNum);

//             //위치 조정
//             object.translateX(-30);
//             object.translateY(-50);
//             // object.translateZ(40);
//             // object.position.set(0, 0, 0);
//             scene.add(object);
//         },
//         (xhr) => {
//             console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//         },
//         (error) => {
//             console.log(error);
//         }
//     );
// };
