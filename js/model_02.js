import * as THREE from "https://unpkg.com/three@0.124.0/build/three.module.js";
import {
    OrbitControls
} from "https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js";
// import {
//     FBXLoader
// } from "https://unpkg.com/three@0.141.0/examples/jsm/loaders/FBXLoader.js";
import {
    GLTFLoader
} from "https://unpkg.com/three@0.124.0/examples/jsm/loaders/GLTFLoader.js";

import {
    Water
} from 'https://unpkg.com/three@0.124.0/examples/jsm/objects/Water.js';
import {
    Sky
} from 'https://unpkg.com/three@0.124.0/examples/jsm/objects/Sky.js';



let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let scene, camera, renderer, sun, water;
let controls;

let model = new THREE.Object3D();
let mixers = [];

//샘플 3d 모델링 다운로드
//1. https://www.mixamo.com/
//2. https://free3d.com/ko/3d-models/fbx
//3. https://www.turbosquid.com/

const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#eee"); //배경 컬러
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 2000);
    camera.position.set(0, 40, 100);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.LinearEncoding;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.useLegacyLights = false;
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.4;

    // document.body.appendChild(renderer.domElement);
    document.querySelector("#canvasWrap").appendChild(renderer.domElement);
    //cavasWrap 에 render 넣는다

    // 카메라 컨트롤
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 120;
    controls.minDistance = 10;
    controls.maxPolarAngle = 1.4;
    controls.enablePan = false;
    // const axes = new THREE.AxesHelper(150);
    // scene.add(axes);

    // const gridHelper = new THREE.GridHelper(240, 20);
    // scene.add(gridHelper);

    //바닥
    const geometry = new THREE.CylinderGeometry(400, 400, 5, 100);
    const material = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
    });
    const boxMesh = new THREE.Mesh(geometry, material);
    console.log(boxMesh)
    boxMesh.position.set(0, -5, 0);
    boxMesh.receiveShadow = true;
    scene.add(boxMesh); {
        //조명 넣기
        var light = new THREE.HemisphereLight(0xffffff, 0x080820, 1);

        light.position.set(100, 100, 100);
        scene.add(light);

    } {
        //조명
        const color = 0xffffff;
        const intensity = 5;
        const light = new THREE.PointLight(color, intensity);
        light.castShadow = true;

        light.position.set(40, 120, 40);

        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.radius = 5;
        // light.shadow.camera.near = 0.1; // default
        // light.shadow.camera.far = 2500; // default

        scene.add(light);
    }

    // {
    //     //안개
    //     // const near = 100;
    //     // const far = 200;
    //     // const color = "#eeeeee";
    //     // scene.fog = new THREE.Fog(color, near, far);
    // }
    // fbxLoadFunc("./model/DismissingGesture.FBX");
    // fbxLoadFunc("./my3d/dron.fbx");
    // glbLoadFunc("./ani_water/WATER2.gltf");
    glbLoadFunc("./my3d/dron_n.gltf");
    glbLoadFunc2("./my3d/nwst.gltf");

    sun = new THREE.Vector3();

    // Water

    const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load( 'w_texture/Water_1_M_Normal.jpg', function ( texture ) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            } ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );

    water.rotation.x = - Math.PI / 2;

    scene.add( water );

    // Skybox

    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    let renderTarget;

    function updateSun() {

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

        if ( renderTarget !== undefined ) renderTarget.dispose();

        renderTarget = pmremGenerator.fromScene( sky );

        scene.environment = renderTarget.texture;

    }

    updateSun();

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    
    function onDocumentMouseDown(event) {
        // 마우스 포인터의 좌표를 가져옵니다.
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 레이캐스터를 생성합니다.
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // 레이캐스팅을 수행하여 클릭한 객체를 가져옵니다.
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            onClickObject(clickedObject); // 클릭한 객체에 대한 애니메이션 함수를 호출합니다.
            console.log('click')
        }
    }
    
    



    // 카메라 이동 애니메이션을 정의하는 함수
    function onClickObject(object) {
        // 현재 카메라의 위치와 타겟 위치를 저장합니다.
        const currentCameraPosition = camera.position.clone();
        const currentCameraTarget = controls.target.clone();

        // 클릭한 객체의 위치를 저장합니다.
        const targetObjectPosition = object.position.clone();

        // TweenMax를 사용하여 카메라의 위치와 타겟을 부드러운 애니메이션으로 이동합니다.
        const duration = 1; // 애니메이션 지속 시간 (초)
        TweenMax.to(camera.position, duration, {
            x: targetObjectPosition.x - 40, // 예시로 클릭한 객체의 위치보다 약간 더 떨어진 곳을 바라보도록 설정합니다.
            y: targetObjectPosition.y + 15,
            z: targetObjectPosition.z + 50,
            onUpdate: function () {
                // 애니메이션 중간에 실행되는 함수로, 카메라의 위치를 업데이트합니다.
                camera.lookAt(targetObjectPosition);
                controls.target.copy(targetObjectPosition);
            },
            onComplete: function () {
                // 애니메이션이 완료된 후에 실행되는 함수로, 추가 동작을 할 수 있습니다.
                let show = document.querySelector('.backg')
                show.classList.add('show')
                let clbtn = document.querySelector('.close')
                clbtn.classList.add('show')

            },
            ease: Power2.easeInOut // 애니메이션의 이징을 설정합니다.
        });
    }

    // close

    let closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', resetCamera);
    function resetCamera(){
        const duration = 1;
        TweenMax.to(camera.position, duration, {
            x: 0,
            y: 40,
            z: 100,
            onUpdate: function () {
                // 애니메이션 중간에 실행되는 함수로, 카메라의 위치를 업데이트합니다.
                camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
            },
            onComplete: function () {
                // 애니메이션이 완료된 후에 실행되는 함수로, 추가 동작을 할 수 있습니다.
                let bg = document.querySelectorAll('.tab')
                bg.forEach((e)=>{
                    e.classList.remove('show')
                })

                closeBtn.classList.remove('show')
            },
            ease: Power2.easeInOut // 애니메이션의 이징을 설정합니다.
        });
    }



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
            let scaleNum = 5;
            object.scale.set(scaleNum, scaleNum, scaleNum);

            model.add(object);
            scene.add(model);
            object.traverse(function (child) {
                child.castShadow = true;
            });
            object.receiveShadow = true;

        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% 로드됨");
        },
        (error) => {
            console.log(error);
        }
    );
};
const glbLoadFunc2 = (modelName) => {
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
            let scaleNum = 3;
            object.scale.set(scaleNum, scaleNum, scaleNum);

            model.add(object);
            scene.add(model);

            object.position.set(-20, 0, 10);
            object.traverse(function (child) {
                child.castShadow = true;
                child.receiveShadow = true;
            });

  
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
    const time = performance.now() * 0.001;
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
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


